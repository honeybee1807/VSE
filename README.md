# Visa Ease Solutions: static website

Plain HTML, CSS and vanilla JavaScript. No build step and no frameworks. Open `index.html` in a browser, or upload the whole folder to any static host (cPanel, Netlify, Cloudflare Pages, GitHub Pages).

## Files

| File | Purpose |
|---|---|
| `index.html`, `services.html`, `schengen-visas.html`, `how-it-works.html`, `contact.html`, `privacy-policy.html`, `404.html` | Pages |
| `style.css` | All styles. Colours are CSS variables in `:root` |
| `script.js` | Menu, sticky nav, accordions, checklist tabs, cookie notice, scroll reveal, enquiry form and EmailJS |
| `assets/fonts/` | Self-hosted Playfair Display, Allura and Plus Jakarta Sans (SIL Open Font License, licences included) |
| `assets/icons.svg` | Reference copy of the SVG sprite. Each page inlines the same sprite so icons also work when opened straight from a folder |
| `assets/og-image.jpg` | Social sharing image, 1200 × 630 |
| `assets/images/` | Empty. Put licensed photos here |
| `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `android-chrome-*.png`, `site.webmanifest` | Icons |
| `sitemap.xml`, `robots.txt` | Search engines |

## Before you launch: fill in every placeholder

Search the whole folder for `[` to find them all.

### Site-wide
- `[DOMAIN]`: the live domain, for example `www.visaease.co.za` (no `https://`). It's used in canonical links, Open Graph tags, JSON-LD, `sitemap.xml` and `robots.txt`. Find and replace it across every file.
- `[Trading hours]`: footer and Contact page
- `[Service area]`: footer and Contact page
- Email `quraishakhan229@gmail.com`: replace it with the domain email when ready. It appears in every page (utility bar, menu, footer) and on the Contact and Home pages.

### Home page (`index.html`)
- JSON-LD business details: `[Street address]`, `[City or town]`, `[Province]`, `[Postal code]`, `[Service area]`, `[Trading hours, e.g. Mo-Fr 08:00-17:00]`, `[Instagram URL]`, `[Facebook URL]`. If there is no public street address, delete the `streetAddress` and `postalCode` lines.
- Testimonials: `[Client first name]`, `[Destination]`, `[Month Year]` and the three "Sample review" quotes. Use only real feedback with written permission, then delete the "Sample content" label.

### How It Works and FAQ (`how-it-works.html`)
- `[response time]`
- `[6 to 8 weeks]`: recommended lead time
- `[Confirm whether any submission support is offered.]`
- `[Confirm pricing approach.]`
- These FAQ answers are also copied into the FAQ JSON-LD in the page head. Update both places.

### Contact (`contact.html`)
- `[response time]`: appears twice, in the form intro and the success message
- `[Trading hours]`, `[Public holiday hours]`
- `[Service area]`, `[Remote or in person consultations]`
- `[Instagram]` / `[Instagram URL]`, `[Facebook]` / `[Facebook URL]`: remove these buttons if the business has no social accounts
- EmailJS keys: see below

### Privacy Policy (`privacy-policy.html`)
Have the client review the full wording before it goes live.
- `[Registered business name]`, `[Business address]`
- `[Describe secure document sharing method, storage and access controls.]`
- `[Retention period]`
- `[Information Regulator contact details]`
- `[Information Officer name]`, `[email address]`
- `[Date]`: last updated date

### Photos
Every grey "Licensed photo" block is a `<div class="ph" role="img" aria-label="…">`. Directly above each one is a commented `<img>` tag with the suggested file name and alt text. To swap a photo in:
1. Add the licensed photo to `assets/images/` (about 800 × 600, compressed, `.jpg` or `.webp`).
2. Uncomment the `<img class="photo" … loading="lazy">` line and delete the placeholder `<div>`.

The suggested files are `eiffel-tower.jpg`, `colosseum.jpg`, `venice-canal.jpg`, `dutch-windmills.jpg`, `france.jpg`, `italy.jpg`, `spain.jpg`, `germany.jpg`, `netherlands.jpg`, `belgium.jpg` and `sweden.jpg`.

### Still to confirm with the client
- Exact brand hex values and the logo vector files. The logo is redrawn as an SVG approximation in the sprite (`#logo-dark`, `#logo-light`).
- Check the Schengen facts on the Schengen page and in the FAQ against current embassy guidance: 90 days in any 180, apply up to six months ahead and at least 15 days before, about 15 days processing, and the typical document list.

## EmailJS setup (contact form)

1. Create a free account at emailjs.com and add an email service (Gmail or the domain mailbox).
2. Create a template that uses these variables: `{{full_name}}`, `{{whatsapp}}`, `{{email}}`, `{{destination}}`, `{{purpose}}`, `{{travel_dates}}`, `{{applicants}}`, `{{message}}`, `{{consent}}`, `{{page}}`. Set "Reply To" to `{{email}}`.
3. In `script.js`, replace the three placeholders at the top:
   ```js
   const EMAILJS_CONFIG = { SERVICE_ID: 'SERVICE_ID', TEMPLATE_ID: 'TEMPLATE_ID', PUBLIC_KEY: 'PUBLIC_KEY' };
   ```
4. In the EmailJS dashboard, restrict the public key to your domain (Account > Security).

Until the keys are filled in, the form shows the success state without sending anything (`DEMO_WHEN_UNCONFIGURED = true`) so you can test the design. Set it to `false` before launch if you would rather see an error.

How the form works:
- Validates full name, a South African number (`082 123 4567`, `+27 82 123 4567` and `27821234567` all pass) and email.
- The consent checkbox is required.
- A hidden honeypot field (`company_website`) quietly drops bot submissions.
- The form asks for no passport or ID numbers, and the honeypot value is never sent.

## Notes
- **Breakpoints:** mobile first at 480px and 768px. A third breakpoint at 1024px switches on the full desktop navigation and the 3 and 4 column grids, because the five nav links and the WhatsApp button do not fit at 768px.
- **Fonts** are self-hosted instead of loaded from Google Fonts. This avoids a third-party request (helpful for POPIA) and makes the site work offline.
- **Motion:** the hero globe animates from 480px up. Scroll reveal uses IntersectionObserver. All motion is switched off for visitors who prefer reduced motion.
- **404 page:** configure your host to serve `404.html` for missing pages. Links on it are relative, so it works best for missing pages at the top level of the site.
- **JSON-LD:** the only `<script>` blocks inside pages are structured data (`application/ld+json`). They are not executable code.
