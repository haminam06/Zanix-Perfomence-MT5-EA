/* =========================================================
   Triple Biotix — Landing Page Script
   ---------------------------------------------------------
   EDIT DI SINI: nombor WhatsApp, harga & pakej promosi
   ========================================================= */
const CONFIG = {
  // Format antarabangsa tanpa "+" atau "-" (contoh: 60123456789)
  whatsapp: '60123456789',

  // Tempoh countdown promosi (saat). 1 jam 32 minit 10 saat = 5530
  promoSeconds: 1 * 3600 + 32 * 60 + 10,

  // Pakej harga promosi
  packages: [
    {
      name: '1 Kotak',
      sub: '10 sachet · Cubaan 10 hari',
      oldPrice: 119,
      price: 89,
      img: 'assets/img/product-box-float.webp',
      perks: ['10 sachet × 20g', '30 Billion CFU setiap sachet', 'Layak Lucky Draw'],
    },
    {
      name: '3 Kotak',
      sub: '30 sachet · Amalan 1 bulan',
      oldPrice: 357,
      price: 239,
      img: 'assets/img/product-box-sachet.webp',
      perks: ['30 sachet × 20g', 'Amalan konsisten 1 bulan', 'Penghantaran PERCUMA', 'Layak Lucky Draw ×3 entri'],
      best: true,
      badge: '🔥 Paling Laris',
    },
    {
      name: '6 Kotak',
      sub: '60 sachet · Pakej keluarga',
      oldPrice: 714,
      price: 449,
      img: 'assets/img/product-box-float.webp',
      perks: ['60 sachet × 20g', 'Jimat paling banyak', 'Penghantaran PERCUMA', 'Layak Lucky Draw ×6 entri'],
    },
  ],
};

(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  const waLink = (msg) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

  /* ---------- Preloader ---------- */
  document.body.classList.add('loading');
  const finishLoad = () => {
    $('#preloader')?.classList.add('done');
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
  };
  window.addEventListener('load', () => setTimeout(finishLoad, 500));
  setTimeout(finishLoad, 3500); // fallback

  /* ---------- Year ---------- */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Pricing render ---------- */
  const fmt = (n) => n.toLocaleString('ms-MY');
  const pricing = $('#pricing');
  if (pricing) {
    pricing.innerHTML = CONFIG.packages.map((p, i) => {
      const save = p.oldPrice - p.price;
      const msg = `Hi, saya nak order Triple Biotix pakej ${p.name} (RM${fmt(p.price)}).`;
      return `
        <article class="price-card reveal ${p.best ? 'price-card--best' : ''}" style="--d:${i * 0.12}s">
          ${p.badge ? `<div class="price-card__badge">${p.badge}</div>` : ''}
          <h3>${p.name}</h3>
          <div class="price-card__sub">${p.sub}</div>
          <img class="price-card__img" src="${p.img}" alt="Triple Biotix ${p.name}" loading="lazy">
          <div class="price-card__old">RM${fmt(p.oldPrice)}</div>
          <div class="price-card__now"><small>RM</small>${fmt(p.price)}</div>
          <div class="price-card__save">Jimat RM${fmt(save)}</div>
          <ul>${p.perks.map((x) => `<li>${x}</li>`).join('')}</ul>
          <a class="btn ${p.best ? 'btn--glow' : 'btn--dark'} btn--lg magnetic" href="${waLink(msg)}" target="_blank" rel="noopener">Beli Sekarang <span class="arrow">→</span></a>
        </article>`;
    }).join('');
  }

  /* ---------- WhatsApp links ---------- */
  $$('.js-wa').forEach((a) => {
    a.href = waLink(a.dataset.msg || 'Hi, saya berminat dengan Triple Biotix.');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- Reveal on scroll ---------- */
  $$('.reveal[data-delay]').forEach((el) => el.style.setProperty('--d', el.dataset.delay + 's'));
  // auto-stagger siblings in grids
  ['.problem__grid', '.benefits', '.who__list', '.masonry', '.acc', '.trust', '.howto__steps', '.triple'].forEach((sel) => {
    $$(sel).forEach((grid) => $$(':scope > .reveal, :scope > li.reveal', grid).forEach((el, i) => {
      if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', (i % 6) * 0.08 + 's');
    }));
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        // clear the delay after reveal so hover transitions stay snappy
        setTimeout(() => e.target.style.setProperty('--d', '0s'), 1400);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el) => io.observe(el));

  /* ---------- Count-up ---------- */
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const to = parseFloat(el.dataset.to);
      const dec = parseInt(el.dataset.decimals || '0', 10);
      const sep = el.dataset.sep;
      const dur = 1800;
      const start = performance.now();
      const render = (v) => {
        const s = v.toFixed(dec);
        el.textContent = sep ? Number(s).toLocaleString('en-US') : s;
      };
      if (reduceMotion) { render(to); countIO.unobserve(el); return; }
      const step = (t) => {
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        render(to * eased);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('.count').forEach((el) => countIO.observe(el));

  /* ---------- Nav + progress + sticky CTA ---------- */
  const nav = $('#nav');
  const progress = $('#progress');
  const sticky = $('#stickyCta');
  const promo = $('#promosi');
  let lastY = 0;
  const onScroll = () => {
    const yPos = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? yPos / max : 0})`;
    nav.classList.toggle('scrolled', yPos > 40);
    nav.classList.toggle('hide', yPos > lastY && yPos > 500);
    lastY = yPos;
    if (sticky && promo) {
      const r = promo.getBoundingClientRect();
      const inPromo = r.top < innerHeight && r.bottom > 0;
      sticky.classList.toggle('show', yPos > innerHeight * 0.8 && !inPromo);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Countdown (per visitor, auto-repeat) ---------- */
  const KEY = 'tb_promo_end';
  const store = {
    get() { try { return parseInt(localStorage.getItem(KEY), 10); } catch { return NaN; } },
    set(v) { try { localStorage.setItem(KEY, String(v)); } catch { /* ignore */ } },
  };
  let end = store.get();
  const now0 = Date.now();
  if (!end || isNaN(end) || end <= now0) {
    end = now0 + CONFIG.promoSeconds * 1000;
    store.set(end);
  }
  const cdEls = { h: $('[data-cd="h"]'), m: $('[data-cd="m"]'), s: $('[data-cd="s"]') };
  const mini = $('[data-cd-mini]');
  const pad = (n) => String(n).padStart(2, '0');
  const setDigit = (el, val) => {
    if (!el || el.textContent === val) return;
    el.textContent = val;
    if (!reduceMotion) { el.classList.remove('tick-anim'); void el.offsetWidth; el.classList.add('tick-anim'); }
  };
  const tick = () => {
    let left = Math.round((end - Date.now()) / 1000);
    if (left <= 0) { // tamat → ulang semula
      end = Date.now() + CONFIG.promoSeconds * 1000;
      store.set(end);
      left = CONFIG.promoSeconds;
    }
    const h = Math.floor(left / 3600), m = Math.floor((left % 3600) / 60), s = left % 60;
    setDigit(cdEls.h, pad(h)); setDigit(cdEls.m, pad(m)); setDigit(cdEls.s, pad(s));
    if (mini) mini.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
  };
  tick();
  setInterval(tick, 1000);

  /* ---------- Pilihan: cycle highlight Doktor → Selebriti → Ustaz → Veteran ---------- */
  const roles = $$('.role');
  if (roles.length) {
    let ri = 0;
    roles[0].classList.add('on');
    if (!reduceMotion) setInterval(() => {
      roles[ri].classList.remove('on');
      ri = (ri + 1) % roles.length;
      roles[ri].classList.add('on');
    }, 1600);
  }

  /* ---------- Lightbox ---------- */
  const lb = $('#lightbox');
  const lbImg = $('img', lb);
  const closeLb = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); };
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-lightbox]');
    if (!t) return;
    // only open if the real image exists inside
    const img = $('img', t);
    if (!img || !img.complete || !img.naturalWidth) return;
    lbImg.src = t.dataset.lightbox;
    lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
  });
  lb.addEventListener('click', (e) => { if (e.target !== lbImg) closeLb(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });

  /* ---------- Confetti (lucky draw) ---------- */
  const conf = $('#confetti');
  if (conf && !reduceMotion) {
    const colors = ['#ffc444', '#ff9f1c', '#3fd8c7', '#9a6bff', '#ff5d7a', '#4b8bff'];
    for (let i = 0; i < 40; i++) {
      const c = document.createElement('i');
      c.style.left = Math.random() * 100 + '%';
      c.style.background = colors[i % colors.length];
      c.style.animationDuration = 6 + Math.random() * 8 + 's';
      c.style.animationDelay = -Math.random() * 14 + 's';
      c.style.transform = `rotate(${Math.random() * 360}deg)`;
      c.style.width = 6 + Math.random() * 6 + 'px';
      conf.appendChild(c);
    }
  }

  if (reduceMotion) return;

  /* ---------- Hero particles ---------- */
  const cv = $('#particles');
  if (cv) {
    const ctx = cv.getContext('2d');
    let w, h, dots;
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = cv.offsetWidth; h = cv.offsetHeight;
      cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(70, Math.floor((w * h) / 18000));
      dots = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.6,
      }));
    };
    resize();
    window.addEventListener('resize', resize);
    let running = true;
    new IntersectionObserver(([e]) => { running = e.isIntersecting; if (running) requestAnimationFrame(draw); }).observe(cv);
    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(160,200,255,.6)'; ctx.fill();
        for (let j = i + 1; j < dots.length; j++) {
          const o = dots[j], dx = d.x - o.x, dy = d.y - o.y, dist = dx * dx + dy * dy;
          if (dist < 12000) {
            ctx.strokeStyle = `rgba(120,170,255,${0.14 * (1 - dist / 12000)})`;
            ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(o.x, o.y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
  }

  if (isTouch) return;

  /* ---------- Magnetic buttons ---------- */
  document.addEventListener('mousemove', (e) => {
    const b = e.target.closest('.magnetic');
    $$('.magnetic').forEach((m) => { if (m !== b) { m.style.setProperty('--bx', '0px'); m.style.setProperty('--by', '0px'); } });
    if (!b) return;
    const r = b.getBoundingClientRect();
    b.style.setProperty('--bx', (e.clientX - r.left - r.width / 2) * 0.25 + 'px');
    b.style.setProperty('--by', (e.clientY - r.top - r.height / 2) * 0.35 + 'px');
  });

  /* ---------- 3D tilt + spotlight cards ---------- */
  $$('.tilt').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      if (!card.classList.contains('in')) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', px * 100 + '%');
      card.style.setProperty('--my', py * 100 + '%');
      card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 8}deg) rotateY(${(px - 0.5) * 10}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ---------- Parallax: hero orb & product ---------- */
  const orb = $('#gutOrb');
  const stage = $('#productStage');
  window.addEventListener('mousemove', (e) => {
    const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
    if (orb) orb.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
    if (stage && stage.classList.contains('in')) {
      stage.style.transition = 'transform .4s cubic-bezier(.22,1,.36,1)';
      stage.style.transform = `perspective(1000px) rotateY(${x * 14}deg) rotateX(${y * -8}deg)`;
    }
  }, { passive: true });
})();
