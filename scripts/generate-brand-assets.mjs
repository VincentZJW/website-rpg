import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";

const OUT = {
  favicon: "app/favicon.ico",
  icon: "app/icon.png",
  apple: "app/apple-icon.png",
  og: "public/og-image.png",
};

function clamp(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function rgba(hex, alpha = 255) {
  const normalized = hex.replace("#", "");
  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
    alpha,
  ];
}

function mix(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
    a[3] + (b[3] - a[3]) * t,
  ];
}

function createCanvas(width, height) {
  return { width, height, pixels: new Uint8Array(width * height * 4) };
}

function setPixel(canvas, x, y, color) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  if (ix < 0 || iy < 0 || ix >= canvas.width || iy >= canvas.height) return;
  const offset = (iy * canvas.width + ix) * 4;
  const alpha = color[3] / 255;
  const inverse = 1 - alpha;
  canvas.pixels[offset] = clamp(color[0] * alpha + canvas.pixels[offset] * inverse);
  canvas.pixels[offset + 1] = clamp(color[1] * alpha + canvas.pixels[offset + 1] * inverse);
  canvas.pixels[offset + 2] = clamp(color[2] * alpha + canvas.pixels[offset + 2] * inverse);
  canvas.pixels[offset + 3] = clamp(color[3] + canvas.pixels[offset + 3] * inverse);
}

function fillGradient(canvas, top = rgba("#05142f"), bottom = rgba("#070a1e")) {
  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const t = y / Math.max(1, canvas.height - 1);
      const cx = x / canvas.width - 0.5;
      const cy = y / canvas.height - 0.4;
      const glow = Math.max(0, 1 - Math.sqrt(cx * cx + cy * cy) * 1.9);
      const base = mix(top, bottom, t);
      const color = mix(base, rgba("#4de8ff"), glow * 0.2);
      const offset = (y * canvas.width + x) * 4;
      canvas.pixels[offset] = clamp(color[0]);
      canvas.pixels[offset + 1] = clamp(color[1]);
      canvas.pixels[offset + 2] = clamp(color[2]);
      canvas.pixels[offset + 3] = 255;
    }
  }
}

function radialGlow(canvas, cx, cy, radius, color) {
  const minX = Math.max(0, Math.floor(cx - radius));
  const maxX = Math.min(canvas.width - 1, Math.ceil(cx + radius));
  const minY = Math.max(0, Math.floor(cy - radius));
  const maxY = Math.min(canvas.height - 1, Math.ceil(cy + radius));
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const dx = (x - cx) / radius;
      const dy = (y - cy) / radius;
      const falloff = Math.max(0, 1 - dx * dx - dy * dy);
      if (falloff <= 0) continue;
      setPixel(canvas, x, y, [color[0], color[1], color[2], color[3] * falloff]);
    }
  }
}

function pointInPolygon(x, y, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const xi = points[i][0];
    const yi = points[i][1];
    const xj = points[j][0];
    const yj = points[j][1];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function polygon(canvas, points, color) {
  const minX = Math.max(0, Math.floor(Math.min(...points.map(([x]) => x))));
  const maxX = Math.min(canvas.width - 1, Math.ceil(Math.max(...points.map(([x]) => x))));
  const minY = Math.max(0, Math.floor(Math.min(...points.map(([, y]) => y))));
  const maxY = Math.min(canvas.height - 1, Math.ceil(Math.max(...points.map(([, y]) => y))));
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      if (pointInPolygon(x + 0.5, y + 0.5, points)) setPixel(canvas, x, y, color);
    }
  }
}

function line(canvas, x1, y1, x2, y2, width, color) {
  const minX = Math.max(0, Math.floor(Math.min(x1, x2) - width));
  const maxX = Math.min(canvas.width - 1, Math.ceil(Math.max(x1, x2) + width));
  const minY = Math.max(0, Math.floor(Math.min(y1, y2) - width));
  const maxY = Math.min(canvas.height - 1, Math.ceil(Math.max(y1, y2) + width));
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSq = dx * dx + dy * dy || 1;
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lengthSq));
      const px = x1 + t * dx;
      const py = y1 + t * dy;
      const distance = Math.hypot(x - px, y - py);
      if (distance <= width / 2) setPixel(canvas, x, y, color);
    }
  }
}

function rect(canvas, x, y, width, height, color) {
  for (let yy = Math.floor(y); yy < y + height; yy += 1) {
    for (let xx = Math.floor(x); xx < x + width; xx += 1) setPixel(canvas, xx, yy, color);
  }
}

function downsample(canvas, factor) {
  const width = Math.floor(canvas.width / factor);
  const height = Math.floor(canvas.height / factor);
  const output = createCanvas(width, height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const totals = [0, 0, 0, 0];
      for (let yy = 0; yy < factor; yy += 1) {
        for (let xx = 0; xx < factor; xx += 1) {
          const offset = ((y * factor + yy) * canvas.width + x * factor + xx) * 4;
          totals[0] += canvas.pixels[offset];
          totals[1] += canvas.pixels[offset + 1];
          totals[2] += canvas.pixels[offset + 2];
          totals[3] += canvas.pixels[offset + 3];
        }
      }
      const out = (y * width + x) * 4;
      const area = factor * factor;
      output.pixels[out] = clamp(totals[0] / area);
      output.pixels[out + 1] = clamp(totals[1] / area);
      output.pixels[out + 2] = clamp(totals[2] / area);
      output.pixels[out + 3] = clamp(totals[3] / area);
    }
  }
  return output;
}

function renderObelisk(canvas, cx, cy, size) {
  radialGlow(canvas, cx, cy + size * 0.03, size * 0.76, rgba("#4de8ff", 90));
  radialGlow(canvas, cx, cy - size * 0.08, size * 0.5, rgba("#a277ff", 84));

  line(canvas, cx - size * 0.34, cy + size * 0.38, cx, cy + size * 0.82, size * 0.07, rgba("#4de8ff", 160));
  line(canvas, cx + size * 0.34, cy + size * 0.38, cx, cy + size * 0.82, size * 0.07, rgba("#a277ff", 140));

  polygon(canvas, [
    [cx, cy - size * 0.52],
    [cx - size * 0.27, cy - size * 0.1],
    [cx, cy + size * 0.62],
    [cx + size * 0.27, cy - size * 0.1],
  ], rgba("#77f5ff", 230));
  polygon(canvas, [
    [cx, cy - size * 0.52],
    [cx - size * 0.27, cy - size * 0.1],
    [cx, cy + size * 0.62],
  ], rgba("#dffeff", 172));
  polygon(canvas, [
    [cx, cy - size * 0.52],
    [cx + size * 0.27, cy - size * 0.1],
    [cx, cy + size * 0.62],
  ], rgba("#5799ff", 186));
  polygon(canvas, [
    [cx, cy + size * 0.62],
    [cx - size * 0.19, cy + size * 0.16],
    [cx + size * 0.19, cy + size * 0.16],
  ], rgba("#a277ff", 132));
  line(canvas, cx, cy - size * 0.48, cx, cy + size * 0.56, size * 0.018, rgba("#ffffff", 140));
  line(canvas, cx - size * 0.48, cy + size * 0.72, cx + size * 0.48, cy + size * 0.72, size * 0.05, rgba("#4de8ff", 130));
}

function renderIcon(size) {
  const factor = size <= 64 ? 4 : 2;
  const canvas = createCanvas(size * factor, size * factor);
  fillGradient(canvas, rgba("#05132e"), rgba("#07071b"));
  const w = canvas.width;
  const h = canvas.height;
  radialGlow(canvas, w * 0.5, h * 0.44, w * 0.55, rgba("#4de8ff", 96));
  radialGlow(canvas, w * 0.7, h * 0.18, w * 0.42, rgba("#a277ff", 80));
  renderObelisk(canvas, w * 0.5, h * 0.42, w * 0.92);
  polygon(canvas, [
    [w * 0.13, h * 0.86],
    [w * 0.28, h * 0.86],
    [w * 0.5, h * 0.57],
    [w * 0.72, h * 0.86],
    [w * 0.87, h * 0.86],
    [w * 0.5, h * 0.31],
  ], rgba("#f2fdff", 72));
  line(canvas, w * 0.17, h * 0.85, w * 0.5, h * 0.42, w * 0.045, rgba("#dffeff", 176));
  line(canvas, w * 0.83, h * 0.85, w * 0.5, h * 0.42, w * 0.045, rgba("#d9c8ff", 156));
  return downsample(canvas, factor);
}

const FONT = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01111", "10000", "10000", "10011", "10001", "10001", "01111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  J: ["00111", "00010", "00010", "00010", "10010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "10101", "01010"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["10010", "10010", "10010", "11111", "00010", "00010", "00010"],
  "5": ["11111", "10000", "10000", "11110", "00001", "00001", "11110"],
  "6": ["01110", "10000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00001", "01110"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
  "'": ["00100", "00100", "01000", "00000", "00000", "00000", "00000"],
  "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
  "/": ["00001", "00010", "00010", "00100", "01000", "01000", "10000"],
  ".": ["00000", "00000", "00000", "00000", "00000", "01100", "01100"],
};

function textWidth(text, scale, tracking = 1) {
  return text.length * (5 * scale + tracking * scale);
}

function drawText(canvas, text, x, y, scale, color, tracking = 1) {
  let cursor = x;
  for (const char of text.toUpperCase()) {
    const glyph = FONT[char] ?? FONT[" "];
    glyph.forEach((row, rowIndex) => {
      [...row].forEach((pixel, colIndex) => {
        if (pixel === "1") rect(canvas, cursor + colIndex * scale, y + rowIndex * scale, scale, scale, color);
      });
    });
    cursor += 5 * scale + tracking * scale;
  }
}

function centeredText(canvas, text, x, y, maxWidth, scale, color) {
  const width = textWidth(text, scale);
  drawText(canvas, text, x + (maxWidth - width) / 2, y, scale, color);
}

function renderOgImage() {
  const canvas = createCanvas(1200, 630);
  fillGradient(canvas, rgba("#06142f"), rgba("#070719"));
  radialGlow(canvas, 286, 242, 280, rgba("#4de8ff", 110));
  radialGlow(canvas, 420, 120, 260, rgba("#a277ff", 88));
  radialGlow(canvas, 930, 510, 360, rgba("#4de8ff", 52));

  polygon(canvas, [[0, 456], [205, 410], [452, 454], [1200, 386], [1200, 630], [0, 630]], rgba("#081d3a", 214));
  polygon(canvas, [[0, 508], [320, 462], [700, 520], [1200, 486], [1200, 630], [0, 630]], rgba("#0b102c", 222));
  line(canvas, 64, 482, 1110, 438, 2, rgba("#4de8ff", 58));
  line(canvas, 125, 526, 1045, 496, 2, rgba("#a277ff", 48));

  renderObelisk(canvas, 286, 275, 270);
  line(canvas, 94, 522, 286, 322, 16, rgba("#dffeff", 94));
  line(canvas, 474, 522, 286, 322, 16, rgba("#d9c8ff", 86));

  const textX = 470;
  rect(canvas, textX, 158, 590, 2, rgba("#4de8ff", 86));
  drawText(canvas, "VINCENT'S AI FRONTIER", textX, 190, 5, rgba("#f2fdff", 244));
  drawText(canvas, "INTERACTIVE RPG-STYLE PERSONAL WEBSITE", textX + 3, 288, 3, rgba("#9df8ff", 224));
  drawText(canvas, "EMBODIED AI / ROBOTICS / TALENT CONSULTING", textX + 3, 350, 2, rgba("#d9c8ff", 226));

  const chips = ["EMBODIED AI", "ROBOTICS", "TALENT CONSULTING"];
  let chipX = textX + 3;
  chips.forEach((chip) => {
    const width = textWidth(chip, 2) + 34;
    rect(canvas, chipX, 442, width, 42, rgba("#4de8ff", 24));
    line(canvas, chipX, 442, chipX + width, 442, 2, rgba("#4de8ff", 88));
    line(canvas, chipX, 484, chipX + width, 484, 2, rgba("#a277ff", 62));
    centeredText(canvas, chip, chipX + 17, 456, width - 34, 2, rgba("#f2fdff", 212));
    chipX += width + 14;
  });

  drawText(canvas, "LOW-POLY AI FRONTIER", textX + 4, 532, 2, rgba("#7ef5ff", 164));
  return canvas;
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data = Buffer.alloc(0)) {
  const name = Buffer.from(type);
  const chunk = Buffer.alloc(12 + data.length);
  chunk.writeUInt32BE(data.length, 0);
  name.copy(chunk, 4);
  data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(Buffer.concat([name, data])), 8 + data.length);
  return chunk;
}

function encodePng(canvas) {
  const raw = Buffer.alloc((canvas.width * 4 + 1) * canvas.height);
  for (let y = 0; y < canvas.height; y += 1) {
    const rowStart = y * (canvas.width * 4 + 1);
    raw[rowStart] = 0;
    Buffer.from(canvas.pixels.buffer, canvas.pixels.byteOffset + y * canvas.width * 4, canvas.width * 4).copy(raw, rowStart + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(canvas.width, 0);
  ihdr.writeUInt32BE(canvas.height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    pngChunk("IEND"),
  ]);
}

function encodeIco(canvas) {
  const width = canvas.width;
  const height = canvas.height;
  const maskStride = Math.ceil(width / 32) * 4;
  const dib = Buffer.alloc(40 + width * height * 4 + maskStride * height);
  dib.writeUInt32LE(40, 0);
  dib.writeInt32LE(width, 4);
  dib.writeInt32LE(height * 2, 8);
  dib.writeUInt16LE(1, 12);
  dib.writeUInt16LE(32, 14);
  dib.writeUInt32LE(0, 16);
  dib.writeUInt32LE(width * height * 4, 20);
  dib.writeInt32LE(0, 24);
  dib.writeInt32LE(0, 28);
  dib.writeUInt32LE(0, 32);
  dib.writeUInt32LE(0, 36);
  let offset = 40;
  for (let y = height - 1; y >= 0; y -= 1) {
    for (let x = 0; x < width; x += 1) {
      const src = (y * width + x) * 4;
      dib[offset] = canvas.pixels[src + 2];
      dib[offset + 1] = canvas.pixels[src + 1];
      dib[offset + 2] = canvas.pixels[src];
      dib[offset + 3] = canvas.pixels[src + 3];
      offset += 4;
    }
  }
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header[6] = width === 256 ? 0 : width;
  header[7] = height === 256 ? 0 : height;
  header[8] = 0;
  header[9] = 0;
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(dib.length, 14);
  header.writeUInt32LE(header.length, 18);
  return Buffer.concat([header, dib]);
}

async function writeAsset(file, data) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, data);
  console.log(`wrote ${file}`);
}

const icon512 = renderIcon(512);
const apple180 = renderIcon(180);
const favicon32 = renderIcon(32);
await writeAsset(OUT.icon, encodePng(icon512));
await writeAsset(OUT.apple, encodePng(apple180));
await writeAsset(OUT.favicon, encodeIco(favicon32));
await writeAsset(OUT.og, encodePng(renderOgImage()));
