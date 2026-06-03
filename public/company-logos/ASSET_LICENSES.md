# Company Logo Asset Notes

Company logos and icons are used only for identification and display. Trademarks remain the property of their respective owners. Confirm formal usage permission before a public launch, or keep the abbreviation badge fallback.

## Tesla Official Favicon Attempts

Tesla uses official-site favicon candidates only. The main `www.tesla.com` favicon redirects to a theme asset that currently returns HTTP 403 to automated requests, so the fetcher continues to Tesla's official digital-assets subdomain.

```json
{
  "company": "Tesla",
  "filePath": "/company-logos/tesla.ico",
  "sourceUrl": "https://digitalassets.tesla.com/favicon.ico",
  "sourcePageUrl": "https://www.tesla.com/AI",
  "sourceType": "official website",
  "license": "Tesla-owned official website asset",
  "notes": "Official Tesla browser-tab favicon. The UI still falls back to the TS badge if the local asset cannot load."
}
```

## UBTECH Official Website Asset

```json
{
  "company": "UBTECH",
  "filePath": "/company-logos/ubtech.png",
  "sourceUrl": "https://dwebsite.ubtrobot.com/zhandian.ico",
  "sourcePageUrl": "https://www.ubtrobot.com/cn/",
  "sourceType": "official website",
  "license": "Company-owned official website asset",
  "notes": "The official favicon response contains a high-resolution PNG body, so the fetcher saves it with a .png extension. The official header SVG at https://dwebsite.ubtrobot.com/en/uploadfiles/logo.svg is also attempted if the favicon path is not usable. Replace with an authorized brand asset if required before production."
}
```
