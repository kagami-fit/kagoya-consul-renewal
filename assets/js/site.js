(() => {
  const body = document.body;
  const toggle = document.querySelector('[data-menu-toggle]');
  const shade = document.querySelector('[data-menu-shade]');
  const drawer = document.querySelector('[data-menu-drawer]');

  const closeMenu = () => {
    body.classList.remove('menu-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    if (drawer) drawer.setAttribute('aria-hidden', 'true');
  };

  const openMenu = () => {
    body.classList.add('menu-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    if (drawer) drawer.setAttribute('aria-hidden', 'false');
  };

  if (toggle) {
    toggle.addEventListener('click', () => body.classList.contains('menu-open') ? closeMenu() : openMenu());
  }
  if (shade) shade.addEventListener('click', closeMenu);
  document.querySelectorAll('[data-menu-drawer] a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

  const reveal = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    reveal.forEach((el) => observer.observe(el));
  } else {
    reveal.forEach((el) => el.classList.add('is-in'));
  }

  const hero = document.querySelector('[data-dolly-hero]');
  if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const copy = hero.querySelector('[data-dolly-copy]');
    hero.addEventListener('pointermove', (event) => {
      const x = (event.clientX / window.innerWidth - .5) * -20;
      const y = (event.clientY / window.innerHeight - .5) * -12;
      if (copy) copy.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    hero.addEventListener('pointerleave', () => { if (copy) copy.style.transform = ''; });
  }

  const form = document.querySelector('[data-static-form]');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const note = form.querySelector('[data-form-note]');
      if (note) note.textContent = '静的プレビューのため送信は行われません。公開時に外部フォームまたはWordPressフォームへ接続してください。';
    });
  }
})();
