/* ===================== MOBILE NAV ===================== */
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
if (navToggle) {
  navToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
  mainNav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mainNav.classList.remove('open'))
  );
}

/* ===================== PRICING TOGGLE ===================== */
document.querySelectorAll('.toggle').forEach(toggle => {
  const buttons = toggle.querySelectorAll('button');
  const amount = toggle.closest('.plan-price-block').querySelector('.amount');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const period = btn.dataset.period; // mes | anual
      amount.textContent = period === 'anual'
        ? amount.dataset.anual
        : amount.dataset.mes;
    });
  });
});

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

/* ===================== VER MÁS ===================== */
const verMas = document.getElementById('verMas');
if (verMas) {
  verMas.addEventListener('click', () => {
    document.getElementById('planes').scrollIntoView({ behavior: 'smooth' });
  });
}

/* ===================== BRANDS CAROUSEL ===================== */
const brandsTrack = document.getElementById('brandsTrack');
const brandsPrev = document.getElementById('brandsPrev');
const brandsNext = document.getElementById('brandsNext');
if (brandsTrack) {
  const step = 320;
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
  [testiPrev, testiNext, testiDots].forEach(el =>
    el.addEventListener('click', () => {
      clearInterval(auto);
      auto = setInterval(() => goTo(index + 1), 6000);
    })
  );
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
