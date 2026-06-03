import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";

const outputDirectory = new URL("../public/company-logos/", import.meta.url);
const manifestUrl = new URL("logo-manifest.json", outputDirectory);
const requestTimeoutMs = 8_000;
const concurrency = 4;

const companies = [
  { slug: "unitree", name: "Unitree Robotics", websiteUrl: "https://www.unitree.com/" },
  { slug: "agibot", name: "AgiBot", websiteUrl: "https://www.agibot.com/" },
  { slug: "ubtech", name: "UBTECH", websiteUrl: "https://www.ubtrobot.com/" },
  { slug: "fourier", name: "Fourier Intelligence", websiteUrl: "https://www.fftai.com/" },
  { slug: "galbot", name: "Galbot", websiteUrl: "https://www.galbot.com/" },
  { slug: "engineai", name: "EngineAI", websiteUrl: "https://www.engineai.com.cn/" },
  { slug: "limx", name: "LimX Dynamics", websiteUrl: "https://www.limxdynamics.com/" },
  { slug: "leju", name: "Leju Robotics", websiteUrl: "https://www.lejurobot.com/" },
  { slug: "robot-era", name: "Robot Era", websiteUrl: "https://www.robotera.com/" },
  { slug: "deeprobotics", name: "Deep Robotics", websiteUrl: "https://www.deeprobotics.cn/" },
  { slug: "tesla", name: "Tesla Optimus", websiteUrl: "https://www.tesla.com/AI" },
  { slug: "figure", name: "Figure AI", websiteUrl: "https://www.figure.ai/" },
  { slug: "agility", name: "Agility Robotics", websiteUrl: "https://agilityrobotics.com/" },
  { slug: "boston-dynamics", name: "Boston Dynamics", websiteUrl: "https://bostondynamics.com/" },
  { slug: "1x", name: "1X Technologies", websiteUrl: "https://www.1x.tech/" },
];

const specialCases = {
  tesla: {
    urls: [
      "https://www.tesla.com/AI",
      "https://www.tesla.com/",
    ],
    searchHints: ["tesla", "logo", "brand", "icon", "apple-touch-icon", "manifest"],
    faviconUrls: [
      "https://www.tesla.com/favicon.ico",
      "https://www.tesla.com/favicon.png",
      "https://www.tesla.com/favicon-32x32.png",
      "https://www.tesla.com/favicon-16x16.png",
      "https://www.tesla.com/apple-touch-icon.png",
      "https://www.tesla.com/themes/custom/tesla_frontend/assets/favicons/favicon.ico",
      "https://www.tesla.com/themes/custom/tesla_frontend/assets/favicons/favicon-32x32.png",
      "https://www.tesla.com/themes/custom/tesla_frontend/assets/favicons/favicon-16x16.png",
      "https://www.tesla.com/themes/custom/tesla_frontend/assets/favicons/apple-touch-icon.png",
      "https://digitalassets.tesla.com/favicon.ico",
    ],
    manifestUrls: [
      "https://www.tesla.com/site.webmanifest",
      "https://www.tesla.com/manifest.json",
    ],
  },
  ubtech: {
    urls: [
      "https://www.ubtrobot.com/",
      "https://www.ubtrobot.com/en/",
      "https://www.ubtrobot.com/cn/",
    ],
    searchHints: ["ubtech", "ubtrobot", "logo", "brand", "icon", "apple-touch-icon", "manifest"],
  },
};

const requestHeaders = {
  accept: "text/html,application/xhtml+xml,application/json,image/avif,image/webp,image/png,image/svg+xml,image/*,*/*;q=0.8",
  "user-agent": "Mozilla/5.0 (compatible; VincentAIFrontierLogoFetcher/1.0)",
};

function describeError(error) {
  return error instanceof Error ? error.message : String(error);
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    return await fetch(url, {
      redirect: "follow",
      ...options,
      headers: {
        ...requestHeaders,
        ...options.headers,
      },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

function parseAttributes(tag) {
  const attributes = {};
  const attributePattern = /([^\s=]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;

  for (const match of tag.matchAll(attributePattern)) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? "";
  }

  return attributes;
}

function largestDeclaredSize(sizes = "") {
  let largest = 0;

  for (const match of sizes.matchAll(/(\d+)x(\d+)/gi)) {
    largest = Math.max(largest, Number(match[1]) * Number(match[2]));
  }

  return largest;
}

function formatScore(url, type = "") {
  const extension = new URL(url).pathname.toLowerCase();
  const normalizedType = type.toLowerCase();

  if (extension.endsWith(".svg") || normalizedType.includes("svg")) return 500;
  if (extension.endsWith(".png") || normalizedType.includes("png")) return 460;
  if (extension.endsWith(".webp") || normalizedType.includes("webp")) return 440;
  if (extension.endsWith(".ico") || normalizedType.includes("icon")) return 120;
  return 200;
}

function keywordScore(text, searchHints = []) {
  const normalizedText = text.toLowerCase();
  return searchHints.reduce((score, hint) => score + (normalizedText.includes(hint.toLowerCase()) ? 240 : 0), 0);
}

function iconScore({ url, sizes, source, type, searchHints, hintText }) {
  const sizeBonus = Math.min(largestDeclaredSize(sizes) / 100, 3_000);
  const sourceBonus = source === "apple-touch-icon" ? 150 : source === "manifest" ? 100 : source === "html" ? 80 : source === "official-page-image" ? 60 : 0;
  return formatScore(url, type) + sizeBonus + sourceBonus + keywordScore(`${url} ${hintText}`, searchHints);
}

function createCandidate(
  {
    href,
    sizes = "",
    source,
    type = "",
    referrer = "",
    sourceType = "official website",
    sourcePageUrl = "",
    license = "",
    assetNotes = "",
    searchHints = [],
    hintText = "",
  },
  baseUrl,
) {
  try {
    const url = new URL(href.replaceAll("&amp;", "&"), baseUrl).href;
    return {
      url,
      sizes,
      source,
      type,
      referrer,
      sourceType,
      sourcePageUrl,
      license,
      assetNotes,
      score: iconScore({ url, sizes, source, type, searchHints, hintText }),
    };
  } catch {
    return null;
  }
}

function parseSrcset(srcset = "") {
  return srcset
    .split(",")
    .map((entry) => entry.trim().split(/\s+/)[0])
    .filter(Boolean);
}

function parseHtmlLinks(html, baseUrl, { includeImages = false, searchHints = [] } = {}) {
  const iconCandidates = [];
  const manifestUrls = [];

  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const attributes = parseAttributes(match[0]);
    if (!attributes.href || !attributes.rel) continue;

    const rel = attributes.rel.toLowerCase();
    if (rel.includes("manifest")) {
      try {
        manifestUrls.push(new URL(attributes.href, baseUrl).href);
      } catch {
        // Ignore malformed manifest URLs and continue checking official links.
      }
    }

    if (rel.includes("icon")) {
      const source = rel.includes("apple-touch-icon") ? "apple-touch-icon" : rel.includes("mask-icon") ? "mask-icon" : "html";
      const candidate = createCandidate(
        {
          href: attributes.href,
          sizes: attributes.sizes,
          source,
          type: attributes.type,
          referrer: baseUrl,
          sourcePageUrl: baseUrl,
          searchHints,
          hintText: `${rel} ${attributes.href}`,
        },
        baseUrl,
      );
      if (candidate) iconCandidates.push(candidate);
    }
  }

  if (includeImages) {
    for (const match of html.matchAll(/<(?:img|source)\b[^>]*>/gi)) {
      const attributes = parseAttributes(match[0]);
      const imageUrls = [attributes.src, ...parseSrcset(attributes.srcset)].filter(Boolean);

      for (const imageUrl of imageUrls) {
        const hintText = `${imageUrl} ${attributes.alt ?? ""} ${attributes.class ?? ""}`;
        if (!searchHints.some((hint) => hintText.toLowerCase().includes(hint.toLowerCase()))) continue;

        const candidate = createCandidate(
          {
            href: imageUrl,
            source: "official-page-image",
            referrer: baseUrl,
            sourcePageUrl: baseUrl,
            searchHints,
            hintText,
          },
          baseUrl,
        );
        if (candidate) iconCandidates.push(candidate);
      }
    }
  }

  return { iconCandidates, manifestUrls };
}

async function parseManifestIcons(manifestUrl, pageUrl, searchHints = []) {
  try {
    const response = await fetchWithTimeout(manifestUrl, {
      headers: { accept: "application/manifest+json,application/json,*/*;q=0.8" },
    });
    if (!response.ok) return [];

    const manifest = JSON.parse(await response.text());
    if (!Array.isArray(manifest.icons)) return [];

    return manifest.icons
      .map((icon) =>
        icon?.src
          ? createCandidate(
              {
                href: icon.src,
                sizes: icon.sizes,
                source: "manifest",
                type: icon.type,
                referrer: pageUrl,
                sourcePageUrl: pageUrl,
                searchHints,
                hintText: `${icon.src} ${icon.purpose ?? ""}`,
              },
              manifestUrl || pageUrl,
            )
          : null,
      )
      .filter(Boolean);
  } catch {
    return [];
  }
}

async function collectOfficialPageCandidates(pageUrl, notes, options = {}) {
  const candidates = [
    createCandidate(
      {
        href: "/favicon.ico",
        source: "default",
        referrer: pageUrl,
        sourcePageUrl: pageUrl,
        searchHints: options.searchHints,
      },
      pageUrl,
    ),
  ].filter(Boolean);

  try {
    const response = await fetchWithTimeout(pageUrl);
    if (!response.ok) {
      notes.push(`${pageUrl} returned ${response.status}`);
      return candidates;
    }

    const resolvedPageUrl = response.url || pageUrl;
    const html = await response.text();
    const { iconCandidates, manifestUrls } = parseHtmlLinks(html, resolvedPageUrl, options);
    candidates.push(...iconCandidates);

    for (const manifestUrl of manifestUrls) {
      candidates.push(...(await parseManifestIcons(manifestUrl, resolvedPageUrl, options.searchHints)));
    }
  } catch (error) {
    notes.push(`${pageUrl} request failed: ${describeError(error)}`);
  }

  return candidates;
}

function uniqueCandidates(candidates) {
  const bestByUrl = new Map();

  for (const candidate of candidates) {
    const current = bestByUrl.get(candidate.url);
    if (!current || current.score < candidate.score) bestByUrl.set(candidate.url, candidate);
  }

  return [...bestByUrl.values()].sort((left, right) => right.score - left.score);
}

function extensionFromContentType(contentType, sourceUrl) {
  const normalizedType = contentType.toLowerCase().split(";")[0].trim();
  if (!normalizedType.startsWith("image/")) return null;
  if (normalizedType === "image/svg+xml") return ".svg";
  if (normalizedType === "image/png") return ".png";
  if (normalizedType === "image/webp") return ".webp";
  if (normalizedType === "image/jpeg") return ".jpg";
  if (normalizedType === "image/gif") return ".gif";
  if (normalizedType.includes("icon")) return ".ico";

  const pathname = new URL(sourceUrl).pathname.toLowerCase();
  for (const extension of [".svg", ".png", ".webp", ".jpg", ".jpeg", ".gif", ".ico"]) {
    if (pathname.endsWith(extension)) return extension === ".jpeg" ? ".jpg" : extension;
  }

  return null;
}

function extensionFromImageSignature(buffer) {
  const header = buffer.subarray(0, 1_024);
  const textHeader = header.toString("utf8").trimStart().toLowerCase();

  if (header.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return ".png";
  if (header.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return ".jpg";
  if (header.subarray(0, 4).toString("ascii") === "GIF8") return ".gif";
  if (header.subarray(0, 4).toString("ascii") === "RIFF" && header.subarray(8, 12).toString("ascii") === "WEBP") return ".webp";
  if (header.subarray(0, 4).equals(Buffer.from([0x00, 0x00, 0x01, 0x00]))) return ".ico";
  if (textHeader.includes("<svg")) return ".svg";
  return null;
}

async function removeOtherLogoVariants(slug, keepFilename) {
  const files = await readdir(outputDirectory);
  await Promise.all(
    files
      .filter((file) => file.startsWith(`${slug}.`) && file !== keepFilename)
      .map((file) => unlink(new URL(file, outputDirectory))),
  );
}

async function downloadFirstCandidate(company, candidates, notes) {
  for (const candidate of uniqueCandidates(candidates)) {
    try {
      const response = await fetchWithTimeout(candidate.url, {
        headers: {
          accept: "image/avif,image/webp,image/png,image/svg+xml,image/*,*/*;q=0.8",
          ...(candidate.referrer ? { referer: candidate.referrer } : {}),
        },
      });
      if (!response.ok) {
        notes.push(`${candidate.url} returned ${response.status}`);
        continue;
      }

      const contentType = response.headers.get("content-type") ?? "";
      const contentTypeExtension = extensionFromContentType(contentType, response.url || candidate.url);
      if (!contentTypeExtension) {
        notes.push(`${candidate.url} returned non-image content-type ${contentType || "(missing)"}`);
        continue;
      }

      const image = Buffer.from(await response.arrayBuffer());
      const extension = extensionFromImageSignature(image);
      if (!extension) {
        notes.push(`${candidate.source} icon returned an invalid image body`);
        continue;
      }

      const filename = `${company.slug}${extension}`;
      await writeFile(new URL(filename, outputDirectory), image);
      await removeOtherLogoVariants(company.slug, filename);

      return {
        ...company,
        status: "downloaded",
        logoPath: `/company-logos/${filename}`,
        sourceUrl: response.url || candidate.url,
        sourceType: candidate.sourceType,
        sourcePageUrl: candidate.sourcePageUrl || undefined,
        license: candidate.license || undefined,
        assetNotes: candidate.assetNotes || undefined,
        contentType,
        notes: notes.length ? notes : undefined,
      };
    } catch (error) {
      notes.push(`${candidate.source} icon failed: ${describeError(error)}`);
    }
  }

  return null;
}

async function fetchCompanyLogo(company) {
  const notes = [];
  const genericCandidates = await collectOfficialPageCandidates(company.websiteUrl, notes);
  const genericResult = await downloadFirstCandidate(company, genericCandidates, notes);
  if (genericResult) return genericResult;

  const specialCase = specialCases[company.slug];
  if (specialCase) {
    const officialCandidates = [];
    for (const pageUrl of specialCase.urls) {
      officialCandidates.push(
        ...(await collectOfficialPageCandidates(pageUrl, notes, {
          includeImages: true,
          searchHints: specialCase.searchHints,
        })),
      );
    }

    const specialResult = await downloadFirstCandidate(company, officialCandidates, notes);
    if (specialResult) return specialResult;

    const faviconCandidates = (specialCase.faviconUrls ?? [])
      .map((href) =>
        createCandidate(
          {
            href,
            source: "special-favicon",
            referrer: company.websiteUrl,
            sourcePageUrl: company.websiteUrl,
            searchHints: specialCase.searchHints,
            hintText: href,
          },
          company.websiteUrl,
        ),
      )
      .filter(Boolean);

    for (const manifestUrl of specialCase.manifestUrls ?? []) {
      faviconCandidates.push(...(await parseManifestIcons(manifestUrl, company.websiteUrl, specialCase.searchHints)));
    }

    const faviconResult = await downloadFirstCandidate(company, faviconCandidates, notes);
    if (faviconResult) return faviconResult;

    const licensedFallbackCandidates = (specialCase.licensedFallbackCandidates ?? [])
      .map((candidate) => createCandidate(candidate, company.websiteUrl))
      .filter(Boolean);
    const licensedFallbackResult = await downloadFirstCandidate(company, licensedFallbackCandidates, notes);
    if (licensedFallbackResult) return licensedFallbackResult;
  }

  return {
    ...company,
    status: "fallback",
    logoPath: "",
    notes,
  };
}

async function mapWithConcurrency(items, limit, task) {
  const results = Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await task(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

await mkdir(outputDirectory, { recursive: true });
console.log(`Fetching official website icons for ${companies.length} companies...`);

const results = await mapWithConcurrency(companies, concurrency, fetchCompanyLogo);
const downloaded = results.filter((result) => result.status === "downloaded");
const fallback = results.filter((result) => result.status === "fallback");

for (const result of downloaded) {
  console.log(`✓ ${result.name}: ${result.logoPath}`);
}

for (const result of fallback) {
  const reason = result.notes.at(-1) ?? "no usable image icon found";
  console.warn(`! ${result.name}: fallback badge retained (${reason})`);
}

await writeFile(
  manifestUrl,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      sourcePolicy: "Official website icon links, linked web manifests, official-page brand images, official-site favicon fallback, and configured special-case favicon paths. Explicitly licensed third-party candidates are supported only when configured.",
      downloaded: downloaded.length,
      fallback: fallback.length,
      companies: results,
    },
    null,
    2,
  )}\n`,
);

console.log(`Manifest written to public/company-logos/logo-manifest.json`);
console.log(`Downloaded: ${downloaded.length}; fallback badges retained: ${fallback.length}`);

for (const slug of ["tesla", "ubtech"]) {
  const result = results.find((company) => company.slug === slug);
  console.log(`${result.name} logo: ${result.status === "downloaded" ? `success (${result.logoPath})` : "fallback badge"}`);
}
