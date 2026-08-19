/* ===================== IDIOMA (banderitas ES/EN vía cookie googtrans) =====================
   Método estándar para controlar el Google Website Translator sin su UI
   propia: el widget lee esta cookie al cargar la página y traduce solo.
   Es el mismo mecanismo que usan plugins como GTranslate por debajo. */
(function () {
  const flags = document.querySelectorAll('.lang-flag');
  if (!flags.length) return;

  function currentLang() {
    const m = document.cookie.match(/googtrans=\/es\/(\w+)/);
    return m ? m[1] : 'es';
  }

  function setLanguage(lang) {
    const domain = location.hostname;
    document.cookie = 'googtrans=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
    if (domain) document.cookie = 'googtrans=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=' + domain + ';';
    if (lang !== 'es') {
      document.cookie = 'googtrans=/es/' + lang + ';path=/;';
      if (domain) document.cookie = 'googtrans=/es/' + lang + ';path=/;domain=' + domain + ';';
    }
    location.reload();
  }

  flags.forEach(btn => btn.addEventListener('click', () => {
    if (btn.dataset.lang !== currentLang()) setLanguage(btn.dataset.lang);
  }));

  const active = currentLang();
  flags.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === active));
})();

/* ===================== MOBILE NAV ===================== */
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
if (navToggle) {
  navToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
  mainNav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mainNav.classList.remove('open'))
  );
}

/* ===================== VIDEO INLINE (reproducir MP4 en la página) ===================== */
const videoPlayBtn = document.getElementById('videoPlayBtn');
const videoFrame = document.getElementById('videoFrame');
if (videoPlayBtn && videoFrame) {
  videoPlayBtn.addEventListener('click', () => {
    const video = document.createElement('video');
    video.className = 'video-el';
    video.src = 'assets/video/shutpoint-comercial.mp4';
    video.setAttribute('controls', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('playsinline', '');
    video.poster = 'assets/video/miniatura-yt.jpg';
    videoFrame.replaceChildren(video);
    video.play().catch(() => {});
  });
}

/* ===================== PRICE AUTO-FIT (card + numbers never change size; safety net only) ===================== */
function fitPrice(block) {
  if (!block) return;
  const row = block.querySelector('.plan-price');
  if (!row) return;
  row.style.transform = 'none';
  const natural = row.scrollWidth;
  const available = row.clientWidth;
  row.style.transform = natural > available + 1
    ? `scale(${Math.max(0.45, available / natural)})`
    : '';
}

/* ===================== ENTERPRISE DYNAMIC PRICE ===================== */
const enterpriseUsers = document.getElementById('enterpriseUsers');
const enterpriseAmount = document.getElementById('enterpriseAmount');
let enterprisePeriod = 'mes';

function money(n) { return '$' + n.toLocaleString('en-US'); }

function updateEnterprise() {
  if (!enterpriseUsers || !enterpriseAmount) return;
  const users = Math.max(0, parseInt(enterpriseUsers.value || '0', 10) || 0);
  const rate = enterprisePeriod === 'anual'
    ? parseInt(enterpriseUsers.dataset.perAnual, 10)
    : parseInt(enterpriseUsers.dataset.perMes, 10);
  enterpriseAmount.textContent = money(users * rate);
  fitPrice(enterpriseAmount.closest('.plan-price-block'));
}
if (enterpriseUsers) {
  enterpriseUsers.addEventListener('input', updateEnterprise);
  updateEnterprise();
}

/* ===================== PRICING TOGGLE ===================== */
document.querySelectorAll('.toggle').forEach(toggle => {
  const buttons = toggle.querySelectorAll('button');
  const block = toggle.closest('.plan-price-block');
  const amount = block.querySelector('.amount');
  const per = block.querySelector('.per');
  const isEnterprise = amount && amount.id === 'enterpriseAmount';

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const period = btn.dataset.period; // mes | anual

      if (per) per.textContent = period === 'anual' ? per.dataset.anual : per.dataset.mes;

      if (isEnterprise) {
        enterprisePeriod = period;
        updateEnterprise();
      } else if (amount) {
        amount.textContent = period === 'anual' ? amount.dataset.anual : amount.dataset.mes;
        fitPrice(block);
      }
    });
  });
});

/* Fit all price cards once on load (safety for narrow viewports) */
document.querySelectorAll('.plan-price-block').forEach(fitPrice);
window.addEventListener('resize', () => {
  document.querySelectorAll('.plan-price-block').forEach(fitPrice);
});

/* ===================== COMPARAR SERVICIOS INCLUIDOS (todos los planes a la vez) ===================== */
const compareToggles = document.querySelectorAll('[data-compare-toggle]');
const comparePanels = [...compareToggles]
  .map(btn => document.getElementById(btn.getAttribute('aria-controls')))
  .filter(Boolean);

/* Cada plan puede tener textos de distinta longitud para el mismo servicio
   (p.ej. "Creación de campañas (1 / mes)"), lo que envuelve a 2 líneas en
   un plan y no en otro y desalinea todo lo que sigue. Igualamos la altura
   de cada fila (misma categoría, mismo índice) entre las 4 columnas. */
function alignCompareRows() {
  if (comparePanels.length < 2) return;
  const catCount = comparePanels[0].querySelectorAll('.compare-cat').length;
  const rows = [];
  for (let c = 0; c < catCount; c++) {
    const cats = comparePanels.map(p => p.querySelectorAll('.compare-cat')[c]);
    const itemCount = cats[0] ? cats[0].querySelectorAll('li').length : 0;
    for (let i = 0; i < itemCount; i++) {
      const lis = cats.map(cat => cat.querySelectorAll('li')[i]).filter(Boolean);
      lis.forEach(li => { li.style.minHeight = ''; });
      rows.push(lis);
    }
  }
  rows.forEach(lis => {
    const maxH = Math.max(...lis.map(li => li.getBoundingClientRect().height));
    lis.forEach(li => { li.style.minHeight = maxH + 'px'; });
  });
}
let compareOpen = false;
function realignCompareRows() {
  alignCompareRows();
  if (compareOpen) comparePanels.forEach(panel => { panel.style.maxHeight = panel.scrollHeight + 'px'; });
}
alignCompareRows();
/* Re-medir cuando la fuente Poppins termine de cargar: si se mide antes,
   el ancho del texto usa la fuente de reserva y los saltos de línea (y por
   lo tanto las alturas) quedan mal calculados de forma permanente. */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(realignCompareRows);
}
window.addEventListener('load', realignCompareRows);

if (compareToggles.length && comparePanels.length) {
  const setCompare = open => {
    compareOpen = open;
    compareToggles.forEach(btn => btn.setAttribute('aria-expanded', open ? 'true' : 'false'));
    comparePanels.forEach(panel => {
      panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
    });
  };
  compareToggles.forEach(btn => btn.addEventListener('click', () => setCompare(!compareOpen)));
  let alignResizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(alignResizeTimer);
    alignResizeTimer = setTimeout(realignCompareRows, 150);
  });
}

/* ===================== TOOL TOOLTIP (tap on touch) ===================== */
document.querySelectorAll('.tool').forEach(tool => {
  tool.addEventListener('click', e => {
    e.preventDefault();
    const wasOpen = tool.classList.contains('show');
    document.querySelectorAll('.tool.show').forEach(t => t.classList.remove('show'));
    if (!wasOpen) tool.classList.add('show');
  });
});
document.addEventListener('click', e => {
  if (!e.target.closest('.tool')) {
    document.querySelectorAll('.tool.show').forEach(t => t.classList.remove('show'));
  }
});

/* ===================== BRANDS CAROUSEL ===================== */
const brandsTrack = document.getElementById('brandsTrack');
const brandsPrev = document.getElementById('brandsPrev');
const brandsNext = document.getElementById('brandsNext');
if (brandsTrack) {
  const step = 340;
  brandsPrev.addEventListener('click', () => brandsTrack.scrollBy({ left: -step, behavior: 'smooth' }));
  brandsNext.addEventListener('click', () => brandsTrack.scrollBy({ left: step, behavior: 'smooth' }));
}

/* ===================== TESTIMONIALS CAROUSEL ===================== */
const testiTrack = document.getElementById('testiTrack');
const testiDots = document.getElementById('testiDots');
const testiPrev = document.getElementById('testiPrev');
const testiNext = document.getElementById('testiNext');
if (testiTrack) {
  const slides = testiTrack.children.length;
  let index = 0;

  for (let i = 0; i < slides; i++) {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    testiDots.appendChild(dot);
  }

  function goTo(i) {
    index = (i + slides) % slides;
    testiTrack.style.transform = `translateX(-${index * 100}%)`;
    testiDots.querySelectorAll('button').forEach((d, di) =>
      d.classList.toggle('active', di === index)
    );
  }

  testiPrev.addEventListener('click', () => goTo(index - 1));
  testiNext.addEventListener('click', () => goTo(index + 1));

  let auto = setInterval(() => goTo(index + 1), 6000);
  const restartAuto = () => {
    clearInterval(auto);
    auto = setInterval(() => goTo(index + 1), 6000);
  };
  [testiPrev, testiNext, testiDots].forEach(el => el.addEventListener('click', restartAuto));

  const testiViewport = document.querySelector('.testi-viewport');
  if (testiViewport) {
    testiViewport.addEventListener('mouseenter', () => clearInterval(auto));
    testiViewport.addEventListener('mouseleave', restartAuto);
  }
}

/* ===================== reCAPTCHA MOCK ===================== */
const rcBox = document.getElementById('rcBox');
if (rcBox) {
  rcBox.addEventListener('click', () => rcBox.classList.toggle('checked'));
}

/* ===================== CONTACT FORM ===================== */
const form = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    formMsg.hidden = false;
    formMsg.textContent = '¡Gracias! Nos pondremos en contacto contigo muy pronto.';
    form.reset();
    if (rcBox) rcBox.classList.remove('checked');
  });
}
