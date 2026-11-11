# Visa Ease Solutions

Website for Visa Ease Solutions, a visa and travel assistance service specialising in Schengen visas for South African travellers.

Developed by Olideen Technologies.

Plain HTML, CSS and JavaScript with no build step. Upload the folder as it is to any static host.

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `services.html` | Services |
| `schengen-visas.html` | Schengen visas, including the interactive document checklist |
| `how-it-works.html` | How it works and FAQ |
| `contact.html` | Contact details and enquiry form |
| `privacy-policy.html` | Privacy policy (POPIA) |
| `404.html` | Page not found |

Supporting files:

| File | Purpose |
|---|---|
| `style.css` | All styles. Colours and type sizes are variables in `:root` |
| `script.js` | Menu, sticky navigation, accordions, checklist tabs, cookie notice, scroll reveal and the enquiry form |
| `favicon.ico`, `favicon-*.png`, `apple-touch-icon.png`, `android-chrome-*.png`, `site.webmanifest` | Browser and home screen icons |
| `sitemap.xml`, `robots.txt` | Search engines |

## Deployment

### Netlify
1. Log in to Netlify and choose **Add new site**.
2. Either drag the project folder onto the deploy area, or choose **Import an existing project** and connect the GitHub repository.
3. If you connect the repository, leave **Build command** empty and set **Publish directory** to the repository root.
4. Add the custom domain under **Domain management**. HTTPS is issued automatically.

Netlify serves `404.html` for missing pages automatically.

### GitHub Pages
1. Push the project to a GitHub repository.
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and the `/ (root)` folder, then save.
4. Add the custom domain on the same screen and tick **Enforce HTTPS** once the certificate is ready.

GitHub Pages also serves `404.html` for missing pages automatically.

## EmailJS (enquiry form)

1. Create an account at emailjs.com and add an email service connected to the client's mailbox.
2. Create a template that uses these variables: `{{full_name}}`, `{{whatsapp}}`, `{{email}}`, `{{destination}}`, `{{purpose}}`, `{{travel_dates}}`, `{{applicants}}`, `{{message}}`, `{{consent}}` and `{{page}}`. Set **Reply To** to `{{email}}`.
3. At the top of `script.js`, replace the three values:
   ```js
   const EMAILJS_CONFIG = {
     SERVICE_ID: 'SERVICE_ID',
     TEMPLATE_ID: 'TEMPLATE_ID',
     PUBLIC_KEY: 'PUBLIC_KEY'
   };
   ```
4. In the EmailJS dashboard, restrict the public key to the live domain (**Account > Security**).
5. Set `DEMO_WHEN_UNCONFIGURED` in `script.js` to `false` before launch. While it is `true` and the keys are unchanged, the form shows its success message without sending anything.

How the form behaves:
- It validates full name, a South African mobile number (`082 123 4567`, `+27 82 123 4567` and `27821234567` are all accepted) and email.
- The consent checkbox is required.
- A hidden honeypot field (`company_website`) silently drops bot submissions and is never sent.
- It does not ask for passport or ID numbers.

## Asset checklist

- [ ] **Fonts:** create `assets/fonts/` and add these self-hosted files (all SIL Open Font License):
  `playfair-display-600.woff2`, `playfair-display-700.woff2`, `allura-400.woff2`, `plus-jakarta-sans-400.woff2`, `plus-jakarta-sans-500.woff2`, `plus-jakarta-sans-600.woff2`, `plus-jakarta-sans-700.woff2`. Until they are added, the site falls back to system fonts.
- [ ] **Social sharing image:** `assets/og-image.jpg`, 1200 × 630.
- [x] **Photos:** all 11 licensed photos are in `assets/images/` (800 × 600 `.jpg`). Keep the licence records for each one. To replace a photo, overwrite the file with the same name and size:
  - Home: `eiffel-tower.jpg`, `colosseum.jpg`, `venice-canal.jpg`, `dutch-windmills.jpg`
  - Schengen visas: `france.jpg`, `italy.jpg`, `spain.jpg`, `germany.jpg`, `netherlands.jpg`, `belgium.jpg`, `sweden.jpg`
- [ ] **Logo:** the logo is drawn as inline SVG (`#logo-dark`, `#logo-light`). Replace it with the client's original vector artwork when supplied.

## Placeholder checklist

Search the folder for `[` to find every placeholder.

### Site wide
- [ ] `[DOMAIN]`: the live domain without `https://`, for example `www.visaease.co.za`. Used in canonical links, Open Graph tags, JSON-LD, `sitemap.xml` and `robots.txt`.
- [x] Trading hours and service area: filled in (Mon to Fri, 8am to 5pm; all provinces in South Africa).
- [ ] Contact email: replace the Gmail address with the domain email when it is ready. It appears in the utility bar, menu and footer on every page, and on the Home and Contact pages.

### Home (`index.html`)
- [x] JSON-LD business details: legal name, hours and service area filled in. No public address, by the client's choice.
- [ ] JSON-LD `[Instagram URL]`, `[Facebook URL]`.
- [ ] Testimonials: `[Client first name]`, `[Destination]`, `[Month Year]` and the three sample reviews. Use only real feedback published with written permission, then remove the "Sample content" label.

### How it works and FAQ (`how-it-works.html`)
- [x] Response time: within 24 hours, excluding weekends and public holidays.
- [ ] `[Confirm whether any submission support is offered.]`
- [ ] `[Confirm pricing approach.]`
- [ ] Confirm the recommended lead time of 6 to 8 weeks.
- [ ] FAQ answers also appear in the FAQ JSON-LD in the page head. Update both places.

### Contact (`contact.html`)
- [x] Response time: within 24 hours, excluding weekends and public holidays.
- [x] Trading hours, after hours WhatsApp support, service area and video call consultations: filled in.
- [ ] `[Instagram]`, `[Instagram URL]`, `[Facebook]`, `[Facebook URL]`: remove these buttons if the business has no social accounts.

### Privacy policy (`privacy-policy.html`)
The client must review and approve the full wording before launch.
- [x] Registered business name filled in. No business address is published.
- [ ] `[Describe secure document sharing method, storage and access controls.]`
- [ ] `[Retention period]`
- [ ] `[Information Regulator contact details]`
- [ ] `[Information Officer name]`, `[email address]`
- [ ] `[Date]`: last updated date.

### Content to confirm with the client
- [ ] Exact brand colours.
- [ ] Schengen facts on the Schengen page and in the FAQ, checked against current embassy guidance: 90 days in any 180, applying up to six months ahead and at least 15 days before travel, processing of about 15 days, and the document checklists.

## Notes

- **Breakpoints:** mobile first at 480px, 768px and 1024px. The full desktop navigation and the three and four column grids start at 1024px.
- **Fonts** are self-hosted, so no third-party font request is made (helpful for POPIA).
- **Motion:** all animation is switched off for visitors who prefer reduced motion.
- **404 page:** links on it are relative, so it works best for missing pages at the top level of the site.
- **Structured data:** the only inline `<script>` blocks are JSON-LD (`application/ld+json`).
