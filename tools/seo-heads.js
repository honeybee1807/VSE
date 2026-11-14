/* ==========================================================================
   Visa Ease Solutions | Developed by Olideen Technologies
   tools/seo-heads.js: writes the SEO part of every page's <head> from one
   source: title, description, canonical, Open Graph, Twitter, favicons and
   the ProfessionalService JSON-LD (identical on every page).

   Run from the site folder:  node tools/seo-heads.js
   Then check:                node tools/seo-check.js
   Not loaded by the website. Edit the values below, then run it again.
   ========================================================================== */
const fs = require('fs');
const path = require('path');

const SITE = 'https://www.visaeasesolutions.co.za';
const EMAIL = 'info@visaeasesolutions.co.za'; // business email (Cloudflare Email Routing)
const SHARE_IMAGE = `${SITE}/assets/og-image.jpg`;
const SHARE_IMAGE_ALT = 'Visa Ease Solutions: Visa and Travel Assistance, specialising in Schengen visas';

const PAGES = {
  'index.html': {
    path: '/',
    title: 'Visa Ease Solutions | Schengen Visa and Travel Assistance',
    description: 'Visa and travel assistance for South Africans, specialising in Schengen visas. We help you prepare and organise your documents correctly before you apply.'
  },
  'services.html': {
    title: 'Visa Services | Visa Ease Solutions',
    description: 'Visa application preparation, document checklists, appointment bookings, itineraries and invitation letters. Personal support from Visa Ease Solutions.'
  },
  'schengen-visas.html': {
    title: 'Schengen Visa Help for South Africans | Visa Ease Solutions',
    description: 'Schengen visa help for South African passport holders. Personalised document checklists, VFS appointment bookings and a careful review before you apply.'
  },
  'how-it-works.html': {
    title: 'Our Process and FAQ | Visa Ease Solutions',
    description: 'See how Visa Ease Solutions works, from your first message to appointment day, with clear answers about documents, timing, appointments, privacy and fees.'
  },
  'apply.html': {
    title: 'Apply Now | Visa Ease Solutions',
    description: 'Apply for visa assistance with Visa Ease Solutions. Share your destination, visa type and travel dates, and we will confirm your checklist and next steps.'
  },
  'contact.html': {
    title: 'Contact Us | Visa Ease Solutions',
    description: 'Contact Visa Ease Solutions on WhatsApp 068 249 7759 or send an enquiry. Friendly guidance and a clear quote for your visa and travel support needs.'
  },
  'privacy-policy.html': {
    title: 'Privacy Policy | Visa Ease Solutions',
    description: 'How Visa Ease Solutions collects, uses and protects your personal information in line with the Protection of Personal Information Act (POPIA).'
  },
  '404.html': {
    title: 'Page Not Found | Visa Ease Solutions',
    description: 'The page you are looking for may have moved or no longer exists. Return to the Visa Ease Solutions home page to continue.',
    noindex: true
  }
};

/* One business schema, identical on every page. Plain UTF-8 text only:
   no HTML entities. Every URL absolute. */
const BUSINESS = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE}/#business`,
  name: 'Visa Ease Solutions',
  legalName: 'Visa Ease Solutions (Pty) Ltd',
  slogan: 'Document. Prepare. Travel.',
  description: 'Visa and travel assistance for South African travellers, specialising in Schengen visas, with online support for clients in any province, city or town.',
  url: `${SITE}/`,
  logo: `${SITE}/android-chrome-512x512.png`,
  image: SHARE_IMAGE,
  telephone: '+27682497759',
  email: EMAIL,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'ZA'
  },
  areaServed: { '@type': 'Country', name: 'South Africa' },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '17:00'
    }
  ],
  sameAs: ['https://www.facebook.com/visaeasesolutions', 'https://www.instagram.com/visaeasesolutions', 'https://www.tiktok.com/@visaeasesolutions'],
  knowsAbout: [
    'Schengen visa',
    'Visa application preparation',
    'Travel itinerary planning',
    'Invitation letters',
    'Canada visa applications',
    'Turkey visa applications',
    'Saudi Arabia visa applications',
    'USA visa applications',
    'Nigeria visa applications',
    'Ghana visa applications',
    "Côte d'Ivoire visa applications",
    'Ireland visa applications',
    'China visa applications'
  ]
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const canonical = (file) => SITE + (PAGES[file].path || '/' + file);

function seoBlock(file) {
  const p = PAGES[file];
  const url = canonical(file);
  const t = esc(p.title);
  const d = esc(p.description);
  return [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}">`,
    ...(p.noindex ? ['<meta name="robots" content="noindex">'] : []),
    `<link rel="canonical" href="${url}">`,
    '<meta name="theme-color" content="#FBEFEA">',
    '<meta property="og:type" content="website">',
    '<meta property="og:locale" content="en_ZA">',
    '<meta property="og:site_name" content="Visa Ease Solutions">',
    `<meta property="og:title" content="${t}">`,
    `<meta property="og:description" content="${d}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${SHARE_IMAGE}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    `<meta property="og:image:alt" content="${esc(SHARE_IMAGE_ALT)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${t}">`,
    `<meta name="twitter:description" content="${d}">`,
    `<meta name="twitter:image" content="${SHARE_IMAGE}">`,
    `<meta name="twitter:image:alt" content="${esc(SHARE_IMAGE_ALT)}">`,
    '<link rel="icon" type="image/x-icon" href="favicon.ico">',
    '<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">',
    '<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">',
    '<link rel="icon" type="image/png" sizes="192x192" href="android-chrome-192x192.png">',
    '<link rel="icon" type="image/png" sizes="512x512" href="android-chrome-512x512.png">',
    '<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">',
    '<link rel="manifest" href="site.webmanifest">'
  ].join('\n');
}

const businessScript = `<script type="application/ld+json">\n${JSON.stringify(BUSINESS, null, 2)}\n</script>`;
const BUSINESS_RE = /<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "ProfessionalService"[\s\S]*?<\/script>\n?/;

const root = path.resolve(__dirname, '..');
for (const file of Object.keys(PAGES)) {
  const f = path.join(root, file);
  if (!fs.existsSync(f)) { console.log('skip (missing)', file); continue; }
  let html = fs.readFileSync(f, 'utf8');
  const headEnd = html.indexOf('</head>');
  let head = html.slice(0, headEnd);
  const rest = html.slice(headEnd);

  // 1. Title through manifest link: replace with the generated block
  const start = head.indexOf('<title>');
  const manifest = head.match(/<link rel="manifest" href="site\.webmanifest">\n/);
  if (start < 0 || !manifest) throw new Error(`${file}: head markers not found`);
  const end = manifest.index + manifest[0].length;
  head = head.slice(0, start) + seoBlock(file) + '\n' + head.slice(end);

  // 2. Business JSON-LD: one copy, straight after the stylesheet
  head = head.replace(BUSINESS_RE, '');
  const css = '<link rel="stylesheet" href="style.css">\n';
  if (!head.includes(css)) throw new Error(`${file}: stylesheet link not found`);
  head = head.replace(css, css + businessScript + '\n');

  fs.writeFileSync(f, head + rest);
  console.log('updated', file);
}

// Sitemap: every indexable page, <loc> equal to its canonical
const today = new Date().toISOString().slice(0, 10);
const meta = {
  'index.html': ['monthly', '1.0'], 'services.html': ['monthly', '0.9'], 'schengen-visas.html': ['monthly', '0.9'],
  'apply.html': ['monthly', '0.9'], 'how-it-works.html': ['monthly', '0.8'], 'contact.html': ['yearly', '0.8'], 'privacy-policy.html': ['yearly', '0.3']
};
const urls = Object.keys(meta).filter((file) => fs.existsSync(path.join(root, file))).map((file) =>
  `  <url>\n    <loc>${canonical(file)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${meta[file][0]}</changefreq>\n    <priority>${meta[file][1]}</priority>\n  </url>`);
fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(root, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log('updated sitemap.xml and robots.txt');

