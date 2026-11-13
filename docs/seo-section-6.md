# Section 6: On-Page SEO (HTML files)

**Client:** Visa Ease Solutions
**Live domain:** `https://www.visaeasesolutions.co.za` (the `CNAME` file holds `www.visaeasesolutions.co.za`. The bare domain redirects to `www`.)
**Applied:** 12 November 2026

Every page's SEO head is generated from one source, `tools/seo-heads.js`, which also writes `sitemap.xml` and `robots.txt`. Run `node tools/seo-check.js` to get a pass or fail report. Change values in the generator and run it again. Do not edit the tags by hand.

## 6.1 Title tags and meta descriptions

| Page | Title tag | Meta description |
|---|---|---|
| `index.html` | Visa Ease Solutions \| Schengen Visa and Travel Assistance | Visa and travel assistance for South Africans, specialising in Schengen visas. We help you prepare and organise your documents correctly before you apply. (154) |
| `services.html` | Visa Services \| Visa Ease Solutions | Visa application preparation, document checklists, appointment bookings, itineraries and invitation letters. Personal support from Visa Ease Solutions. (151) |
| `schengen-visas.html` | Schengen Visa Help for South Africans \| Visa Ease Solutions | Schengen visa help for South African passport holders. Personalised document checklists, VFS appointment bookings and a careful review before you apply. (152) |
| `how-it-works.html` | Our Process and FAQ \| Visa Ease Solutions | See how Visa Ease Solutions works, from your first message to appointment day, with clear answers about documents, timing, appointments, privacy and fees. (154) |
| `apply.html` | Apply Now \| Visa Ease Solutions | Apply for visa assistance with Visa Ease Solutions. Share your destination, visa type and travel dates, and we will confirm your checklist and next steps. (154) |
| `contact.html` | Contact Us \| Visa Ease Solutions | Contact Visa Ease Solutions on WhatsApp 068 249 7759 or send an enquiry. Friendly guidance and a clear quote for your visa and travel support needs. (148) |
| `privacy-policy.html` | Privacy Policy \| Visa Ease Solutions | How Visa Ease Solutions collects, uses and protects your personal information in line with the Protection of Personal Information Act (POPIA). (142) |
| `404.html` | Page Not Found \| Visa Ease Solutions | The page you are looking for may have moved or no longer exists. Return to the Visa Ease Solutions home page to continue. (Exempt from the length rule, `noindex`.) |

The numbers in brackets are character counts. The target is 140 to 155. The Open Graph and Twitter titles and descriptions use the same text as each page.

## 6.2 Tags added to every page

Every page's `<head>` has these, in this order:

1. `<title>` and `<meta name="description">` (plus `<meta name="robots" content="noindex">` on `404.html` only)
2. `<link rel="canonical">`: absolute, `https://www.`, pointing to the page itself. The home page uses `https://www.visaeasesolutions.co.za/`.
3. `theme-color` `#FBEFEA`
4. Open Graph: `og:type`, `og:locale` (`en_ZA`), `og:site_name`, `og:title`, `og:description`, `og:url` (same as the canonical), `og:image`, `og:image:width` (1200), `og:image:height` (630), `og:image:alt`
5. Twitter Card: `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`
6. Favicons: `favicon.ico`, `favicon-32x32.png`, `favicon-16x16.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`, `apple-touch-icon.png` and `site.webmanifest`
7. `ProfessionalService` JSON-LD, identical on every page, including `404.html`
8. `FAQPage` JSON-LD on `how-it-works.html` only, as a separate block. Every question and answer matches the visible FAQ word for word.

**What was already in place:** titles, descriptions, canonicals, the full Open Graph set, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, the favicon and manifest links, `noindex` on the 404 page, and the `FAQPage` schema.

**What this pass added:** `twitter:image:alt` and the `apple-touch-icon` link on every page, and the business schema on the seven pages that did not have it. It also switched every URL from the bare domain to `https://www.`, set the new titles and descriptions, and added `@id` and `openingHoursSpecification` to the schema.

## 6.3 JSON-LD (identical on every page)

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://www.visaeasesolutions.co.za/#business",
  "name": "Visa Ease Solutions",
  "legalName": "Visa Ease Solutions (Pty) Ltd",
  "slogan": "Document. Prepare. Travel.",
  "description": "Visa and travel assistance for South African travellers, specialising in Schengen visas.",
  "url": "https://www.visaeasesolutions.co.za/",
  "logo": "https://www.visaeasesolutions.co.za/android-chrome-512x512.png",
  "image": "https://www.visaeasesolutions.co.za/assets/og-image.jpg",
  "telephone": "+27682497759",
  "email": "quraishakhan229@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "[City or town]",
    "addressRegion": "[Province]",
    "addressCountry": "ZA"
  },
  "areaServed": {
    "@type": "Country",
    "name": "South Africa"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "08:00",
      "closes": "17:00"
    }
  ],
  "sameAs": [
    "https://www.facebook.com/visaeasesolutions",
    "https://www.instagram.com/visaeasesolutions",
    "https://www.tiktok.com/@visaeasesolutions"
  ],
  "knowsAbout": [
    "Schengen visa",
    "Visa application preparation",
    "Travel itinerary planning",
    "Invitation letters",
    "Canada visa applications",
    "Turkey visa applications",
    "Saudi Arabia visa applications",
    "USA visa applications",
    "Nigeria visa applications",
    "Ghana visa applications",
    "Côte d'Ivoire visa applications",
    "Ireland visa applications",
    "China visa applications"
  ]
}
```

Notes:
- **No street address or postal code.** The business works from a home office and has chosen not to publish an address. `addressLocality` and `addressRegion` are placeholders until the client confirms a town and province she is happy to show. If she prefers none, delete both lines.
- **Opening hours** are the client's confirmed trading hours, Monday to Friday, 8am to 5pm.
- **Email:** swap it for `info@visaeasesolutions.co.za` once Cloudflare Email Routing is set up. Change the `EMAIL` constant in `tools/seo-heads.js` and run it again. The visible email in the page content is updated separately.
- **`legalName`** is kept from the existing schema (confirmed by the client).
- **Rank Pharmacy rules followed:** no HTML entities inside JSON-LD, every URL absolute, no trailing commas, and every block parsed as JSON by `tools/seo-check.js`.

## Sitemap and robots

- `sitemap.xml` lists the 7 indexable pages. Each `<loc>` matches that page's canonical exactly, and `404.html` is left out. `lastmod` is the date the generator last ran.
- `robots.txt` has `Allow: /` and `Sitemap: https://www.visaeasesolutions.co.za/sitemap.xml`.

## Check report

`node tools/seo-check.js` ran **159 checks: 159 passed, 0 failed**. Everything below `</head>` is byte-for-byte unchanged, and the pages render with no console errors.

## Before launch

- [x] `assets/og-image.jpg` (1200 × 630, 84 KB) added: the logo and name, "Visa and Travel Assistance for South Africans", "Specialising in Schengen visas", and a navy band with the slogan, domain and WhatsApp number, over the hero wing photo.
- [ ] `[City or town]` and `[Province]` in the schema, or remove them.
- [x] `sameAs`: the Facebook, Instagram and TikTok page addresses (added 13 November 2026).
- [ ] Three FAQ answers still contain placeholders, in both the visible FAQ and the `FAQPage` schema: "How early should I start?" (`[6 to 8 weeks]`), "Do you submit my application on my behalf?" (`[Confirm whether any submission support is offered.]`) and "How much do your services cost?" (`[Confirm pricing approach.]`). Update both places, then run the check again.
- [ ] Google Search Console and sitemap submission: see Section 8.
