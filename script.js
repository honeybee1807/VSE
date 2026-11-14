/* ==========================================================================
   Visa Ease Solutions | Developed by Olideen Technologies
   script.js: menu, sticky nav, accordions, checklist tabs, cookie notice,
   scroll reveal and the enquiry and apply forms (EmailJS).
   ========================================================================== */

/* ---------- EmailJS configuration: replace the four placeholders ---------- */
const EMAILJS_CONFIG = {
  SERVICE_ID: 'SERVICE_ID',               // e.g. 'service_abc123'
  TEMPLATE_ID: 'template_o0kn7b6',        // enquiry form (contact.html): "Contact Us" template
  APPLY_TEMPLATE_ID: 'APPLY_TEMPLATE_ID', // apply form (apply.html)
  PUBLIC_KEY: '_4EX1dlWEPT_FLu2u'         // EmailJS > Account > General > Public key
};
/* While the placeholders above are unchanged, the forms show their success state
   without sending, so the design can be tested locally. Set to false to show
   an error instead. */
const DEMO_WHEN_UNCONFIGURED = true;

(function () {
  'use strict';

  const root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const storage = {
    get(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { window.localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ } }
  };

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  /* ---------- Sticky nav: tighten and add shadow after scrolling ---------- */
  const nav = $('#nav');
  if (nav) {
    let ticking = false;
    const update = () => { nav.classList.toggle('scrolled', window.scrollY > 24); ticking = false; };
    window.addEventListener('scroll', () => {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- Mobile menu ---------- */
  const panel = $('#mpanel');
  const openBtn = $('[data-menu-open]');
  const closeBtn = $('[data-menu-close]');
  if (panel && openBtn && closeBtn) {
    const focusables = () => $$('a[href], button:not([disabled])', panel);
    const openMenu = () => {
      panel.hidden = false;
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
      closeBtn.focus();
    };
    const closeMenu = (returnFocus = true) => {
      panel.hidden = true;
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      if (returnFocus) openBtn.focus();
    };
    openBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', () => closeMenu());
    $$('a', panel).forEach((a) => a.addEventListener('click', () => closeMenu(false)));
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeMenu(); return; }
      if (e.key !== 'Tab') return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    window.addEventListener('resize', () => { if (!panel.hidden && window.innerWidth >= 1024) closeMenu(false); });
  }

  /* ---------- Accordions ---------- */
  $$('.acc-btn').forEach((btn) => {
    const body = document.getElementById(btn.getAttribute('aria-controls'));
    const item = btn.closest('.acc');
    if (!body || !item) return;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      body.hidden = !open;
      item.classList.toggle('open', open);
    });
  });

  /* ---------- Schengen checklist tabs ---------- */
  $$('[data-checklist]').forEach((list) => {
    const buttons = $$('[data-purpose]', list);
    const groups = $$('[data-group]', list);
    const select = (purpose) => {
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.purpose === purpose)));
      groups.forEach((g) => { g.hidden = g.dataset.group !== purpose; });
    };
    buttons.forEach((b) => b.addEventListener('click', () => select(b.dataset.purpose)));
  });

  /* ---------- Cookie notice ---------- */
  const cookie = $('#cookie');
  if (cookie) {
    const KEY = 've-cookie-consent';
    if (!storage.get(KEY)) cookie.hidden = false;
    $$('[data-cookie]', cookie).forEach((btn) => btn.addEventListener('click', () => {
      storage.set(KEY, btn.dataset.cookie); // 'all' or 'essential'
      cookie.hidden = true;
      /* Load optional analytics here only when the value is 'all'. */
    }));
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = $$('.reveal');
  if (reveals.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('in'));
    } else {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { entry.target.classList.add('in'); obs.unobserve(entry.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
      reveals.forEach((el) => io.observe(el));
    }
  }

  /* ---------- Forms: enquiry (contact.html) and apply (apply.html) ----------
     Every <form data-form> shares the same validation, alerts, success state
     and EmailJS sending. data-template names the EMAILJS_CONFIG key to use. */
  const DEFAULT_ALERT = 'Please check the highlighted fields and try again.';
  const normalisePhone = (v) => v.replace(/[\s\-().]/g, '');
  const isName = (min) => (v) => v.trim().length >= min && /[A-Za-zÀ-ÿ]/.test(v);
  const rules = {
    full_name: isName(2),
    first_name: isName(1),
    last_name: isName(1),
    town: isName(2),
    whatsapp: (v) => { const n = normalisePhone(v); return /^(?:\+27|0027|27|0)[1-9]\d{8}$/.test(n) || /^\+(?!27)[1-9]\d{7,14}$/.test(n); },
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
  };
  const PLACEHOLDER = /^(SERVICE_ID|TEMPLATE_ID|APPLY_TEMPLATE_ID|PUBLIC_KEY)$/;

  /* Preselect a <select data-param="visa"> or data-param="country" option from
     the URL, for example apply.html?visa=tourist or apply.html?country=canada */
  const params = new URLSearchParams(window.location.search);
  $$('select[data-param]').forEach((select) => {
    const slug = (params.get(select.dataset.param) || '').toLowerCase();
    const match = slug && Array.from(select.options).find((o) => o.dataset.slug === slug);
    if (match) match.selected = true;
  });

  const initForm = (form) => {
    const fieldsWrap = $('[data-form-fields]', form);
    const done = $('[data-form-done]', form);
    const alertBox = $('[data-form-alert]', form);
    const alertText = $('[data-alert-text]', form);
    const submitBtn = $('[data-submit]', form);
    const submitLabel = $('[data-submit-label]', form);
    const submitText = form.dataset.submitText || submitLabel.textContent;
    const noun = form.dataset.noun || 'message';
    const templateKey = form.dataset.template || 'TEMPLATE_ID';
    const failMsg = `Sorry, we could not send your ${noun}. Please try again or contact us on WhatsApp on 068 249 7759.`;
    const ruleNames = Object.keys(rules).filter((name) => form.elements[name]);
    const consent = form.elements.consent;

    const setFieldState = (input, ok) => {
      const err = document.getElementById(input.id + '-e');
      input.classList.toggle('is-error', !ok);
      input.classList.toggle('is-valid', ok);
      input.setAttribute('aria-invalid', String(!ok));
      if (err) err.hidden = ok;
    };
    const validateField = (input) => {
      const ok = rules[input.name](input.value);
      setFieldState(input, ok);
      return ok;
    };
    const validateConsent = () => {
      const err = document.getElementById(consent.id + '-e');
      if (err) err.hidden = consent.checked;
      consent.setAttribute('aria-invalid', String(!consent.checked));
      return consent.checked;
    };

    ruleNames.forEach((name) => {
      const input = form.elements[name];
      input.addEventListener('blur', () => { if (input.value.trim()) validateField(input); });
      input.addEventListener('input', () => { if (input.classList.contains('is-error')) validateField(input); });
    });
    consent.addEventListener('change', validateConsent);

    const showAlert = (msg) => {
      alertText.textContent = msg || DEFAULT_ALERT;
      alertBox.hidden = false;
      alertBox.focus();
    };
    const setLoading = (on) => {
      submitBtn.disabled = on;
      submitBtn.classList.toggle('is-loading', on);
      submitLabel.textContent = on ? 'Sending…' : submitText;
    };
    const showSuccess = () => {
      fieldsWrap.hidden = true;
      done.hidden = false;
      done.focus();
    };
    const isConfigured = () => ![EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG[templateKey], EMAILJS_CONFIG.PUBLIC_KEY]
      .some((v) => !v || PLACEHOLDER.test(v));

    const collect = () => {
      const data = new FormData(form);
      data.delete('company_website'); // honeypot never leaves the browser
      const out = {};
      data.forEach((value, key) => { out[key] = String(value).trim(); });
      out.whatsapp = normalisePhone(out.whatsapp || '');
      out.consent = consent.checked ? 'yes' : 'no';
      out.form_type = out.form_type || 'enquiry';
      out.page = window.location.href;
      return out;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      alertBox.hidden = true;

      const valid = ruleNames.map((n) => validateField(form.elements[n])).every(Boolean);
      const agreed = validateConsent();
      if (!valid || !agreed) {
        showAlert(DEFAULT_ALERT);
        const firstBad = $('.is-error', form) || (!agreed ? consent : null);
        if (firstBad) firstBad.focus({ preventScroll: false });
        return;
      }

      /* Honeypot: bots fill hidden fields. Pretend success, send nothing. */
      if (form.elements.company_website.value) { showSuccess(); return; }

      if (!isConfigured()) {
        console.warn(`[Visa Ease] EmailJS is not configured. Replace SERVICE_ID, ${templateKey} and PUBLIC_KEY in script.js.`);
        if (DEMO_WHEN_UNCONFIGURED) { showSuccess(); return; }
        showAlert('Sorry, the form is not available right now. Please contact us on WhatsApp on 068 249 7759.');
        return;
      }

      if (!window.emailjs) { showAlert(failMsg); return; }

      setLoading(true);
      try {
        await window.emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG[templateKey], collect(), { publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
        showSuccess();
      } catch (err) {
        console.error('[Visa Ease] EmailJS error', err);
        showAlert(failMsg);
      } finally {
        setLoading(false);
      }
    });

    $('[data-form-reset]', form).addEventListener('click', () => {
      form.reset();
      $$('.input', form).forEach((i) => { i.classList.remove('is-error', 'is-valid'); i.removeAttribute('aria-invalid'); });
      $$('.err', form).forEach((el) => { el.hidden = true; });
      done.hidden = true;
      fieldsWrap.hidden = false;
      $('.input', form).focus();
    });
  };

  $$('form[data-form]').forEach(initForm);
})();
