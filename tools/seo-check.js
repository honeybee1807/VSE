/* ==========================================================================
   Visa Ease Solutions | Developed by Olideen Technologies
   tools/seo-check.js: pass or fail report for on-page SEO (deployment guide,
   Section 6). Run from the site folder: node tools/seo-check.js
   Exits with code 1 if any check fails. Not loaded by the website.
   ========================================================================== */
const fs = require('fs');
const path = require('path');

const SITE = 'https://www.visaeasesolutions.co.za';
const root = path.resolve(__dirname, '..');
const pages = fs.readdirSync(root).filter((f) => f.endsWith('.html')).sort();
const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok, detail });

const head = (html) => html.slice(0, html.indexOf('</head>'));
const attr = (h, sel, key) => {
  const m = h.match(new RegExp(`<meta ${sel}="${key.replace(/[.:]/g, '\\$&')}" content="([^"]*)"`));
  return m ? m[1] : null;
};
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const ldBlocks = (h) => [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
const canonicalFor = (file) => (file === 'index.html' ? `${SITE}/` : `${SITE}/${file}`);
const urlsIn = (obj, out = []) => {
  if (typeof obj === 'string') { if (/^(https?:|\/|\.\.?\/)/.test(obj) || /\.(png|jpe?g|webp|html)$/.test(obj)) out.push(obj); }
  else if (Array.isArray(obj)) obj.forEach((v) => urlsIn(v, out));
  else if (obj && typeof obj === 'object') Object.entries(obj).forEach(([k, v]) => { if (k !== '@context') urlsIn(v, out); });
  return out;
};

const titles = {}, descs = {}, canonicals = {};
for (const file of pages) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const h = head(html);
  const tag = `${file}:`;

  // Title and description
  const title = (h.match(/<title>([^<]*)<\/title>/) || [])[1];
  check(`${tag} title present`, !!title, title || '');
  titles[file] = title;
  const desc = attr(h, 'name', 'description');
  descs[file] = desc;
  const len = desc ? decode(desc).length : 0;
  if (file === '404.html') check(`${tag} meta description present (length exempt)`, !!desc, `${len} chars`);
  else check(`${tag} meta description 140 to 155 characters`, len >= 140 && len <= 155, `${len} chars`);

  // Canonical
  const canon = (h.match(/<link rel="canonical" href="([^"]*)">/) || [])[1];
  canonicals[file] = canon;
  check(`${tag} canonical absolute https://www. and self`, canon === canonicalFor(file), canon || 'missing');

  // Open Graph
  const og = ['og:type', 'og:locale', 'og:site_name', 'og:title', 'og:description', 'og:url', 'og:image', 'og:image:width', 'og:image:height', 'og:image:alt'];
  const ogMissing = og.filter((k) => attr(h, 'property', k) === null);
  check(`${tag} Open Graph tags complete`, !ogMissing.length, ogMissing.length ? 'missing ' + ogMissing.join(', ') : '');
  check(`${tag} og:url equals canonical`, attr(h, 'property', 'og:url') === canon);
  check(`${tag} og:image absolute`, /^https:\/\/www\./.test(attr(h, 'property', 'og:image') || ''));
  check(`${tag} og:title and og:description match title and description`, attr(h, 'property', 'og:title') === title && attr(h, 'property', 'og:description') === desc);

  // Twitter
  const tw = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt'];
  const twMissing = tw.filter((k) => attr(h, 'name', k) === null);
  check(`${tag} Twitter Card tags complete`, !twMissing.length, twMissing.length ? 'missing ' + twMissing.join(', ') : '');
  check(`${tag} twitter:image absolute`, /^https:\/\/www\./.test(attr(h, 'name', 'twitter:image') || ''));

  // Favicons and manifest, and that each file exists
  const needed = { 'favicon.ico': /rel="icon"[^>]*href="favicon\.ico"/, 'favicon-32x32.png': /href="favicon-32x32\.png"/, 'favicon-16x16.png': /href="favicon-16x16\.png"/, 'apple-touch-icon.png': /rel="apple-touch-icon"[^>]*href="apple-touch-icon\.png"/, 'site.webmanifest': /rel="manifest" href="site\.webmanifest"/ };
  const favMissing = Object.entries(needed).filter(([, re]) => !re.test(h)).map(([k]) => k);
  const hrefs = [...h.matchAll(/<link rel="(?:icon|apple-touch-icon|manifest)"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  const filesMissing = hrefs.filter((x) => !fs.existsSync(path.join(root, x)));
  check(`${tag} favicon and manifest tags present, files exist`, !favMissing.length && !filesMissing.length, [favMissing.length && 'missing tags ' + favMissing.join(', '), filesMissing.length && 'missing files ' + filesMissing.join(', ')].filter(Boolean).join('; '));

  // JSON-LD
  const blocks = ldBlocks(h);
  let business = 0;
  blocks.forEach((raw, i) => {
    let data;
    try { data = JSON.parse(raw); } catch (e) { check(`${tag} JSON-LD block ${i + 1} parses`, false, e.message); return; }
    check(`${tag} JSON-LD block ${i + 1} (${data['@type']}) parses as valid JSON`, true);
    const entities = raw.match(/&(?:[a-z]+|#\d+|#x[0-9a-f]+);/gi);
    check(`${tag} JSON-LD block ${i + 1} has no HTML entities`, !entities, entities ? entities.join(' ') : '');
    const urls = urlsIn(data).filter((u) => !/^\[.*\]$/.test(u));
    const relative = urls.filter((u) => !/^https:\/\//.test(u));
    check(`${tag} JSON-LD block ${i + 1} URLs absolute`, !relative.length, relative.join(' '));
    if (data['@type'] === 'ProfessionalService') business++;
  });
  check(`${tag} exactly one ProfessionalService JSON-LD block`, business === 1, `${business} found`);

  // noindex only on 404
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(h);
  check(`${tag} noindex ${file === '404.html' ? 'present' : 'absent'}`, noindex === (file === '404.html'));

  // Domain placeholder
  check(`${tag} no leftover [DOMAIN]`, !html.includes('[DOMAIN]'));
}

// Identical business schema on every page
const schemas = pages.map((f) => ldBlocks(head(fs.readFileSync(path.join(root, f), 'utf8'))).find((b) => b.includes('"ProfessionalService"')));
check('site: ProfessionalService JSON-LD identical on every page', schemas.every((s) => s === schemas[0]));

// Uniqueness
const dupes = (map) => Object.values(map).filter((v, i, a) => v && a.indexOf(v) !== i);
check('site: titles unique', !dupes(titles).length, dupes(titles).join(' | '));
check('site: meta descriptions unique', !dupes(descs).length, dupes(descs).join(' | '));

// FAQPage matches the visible FAQ
const faqFile = 'how-it-works.html';
const faqHtml = fs.readFileSync(path.join(root, faqFile), 'utf8');
const faqLd = ldBlocks(head(faqHtml)).map((b) => JSON.parse(b)).find((d) => d['@type'] === 'FAQPage');
const faqSection = faqHtml.slice(faqHtml.indexOf('aria-labelledby="faq-h"'), faqHtml.indexOf('</section>', faqHtml.indexOf('aria-labelledby="faq-h"')));
const visible = [...faqSection.matchAll(/<span class="t">([\s\S]*?)<\/span>[\s\S]*?<div class="acc-body"[^>]*>([\s\S]*?)<\/div>/g)]
  .map((m) => ({ q: decode(m[1].trim()), a: decode(m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()) }));
const ldQA = faqLd ? faqLd.mainEntity.map((e) => ({ q: e.name, a: e.acceptedAnswer.text })) : [];
check(`${faqFile}: FAQPage JSON-LD present`, !!faqLd);
check(`${faqFile}: FAQPage has the same number of questions as the page`, ldQA.length === visible.length, `${ldQA.length} in JSON-LD, ${visible.length} on the page`);
ldQA.forEach((qa, i) => {
  const v = visible[i] || {};
  check(`${faqFile}: FAQ ${i + 1} question matches`, qa.q === v.q, qa.q);
  check(`${faqFile}: FAQ ${i + 1} answer matches`, qa.a === v.a, qa.a === v.a ? '' : `JSON-LD: ${qa.a} | page: ${v.a}`);
});
const flagged = ldQA.filter((qa) => /\[[^\]]+\]/.test(qa.a)).map((qa) => `"${qa.q}" contains ${qa.a.match(/\[[^\]]+\]/g).join(', ')}`);

// Sitemap and robots
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).sort();
const expected = pages.filter((f) => f !== '404.html').map(canonicalFor).sort();
check('sitemap.xml: <loc> values exactly match the canonicals (404 left out)', JSON.stringify(locs) === JSON.stringify(expected), locs.join(' '));
const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
check('robots.txt: Allow: / and Sitemap line', /^Allow: \/$/m.test(robots) && robots.includes(`Sitemap: ${SITE}/sitemap.xml`));
check('robots.txt and sitemap.xml: no [DOMAIN]', !sitemap.includes('[DOMAIN]') && !robots.includes('[DOMAIN]'));

// Report
const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  (${r.detail})` : ''}`);
console.log(`\n${results.length - failed.length} passed, ${failed.length} failed`);
if (flagged.length) { console.log('\nFAQ answers with placeholders to finalise before launch:'); flagged.forEach((f) => console.log('  - ' + f)); }
process.exit(failed.length ? 1 : 0);
