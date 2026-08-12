(() => {
  'use strict';

  const body = document.body;
  const hero = document.querySelector('[data-hero]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const is07 = body.classList.contains('variant--sample07');
  const is12 = body.classList.contains('variant--sample12');
  const is33 = body.classList.contains('variant--sample33');

  const addSlits = (count) => {
    if (!hero || reduced) return;
    const layer = document.createElement('div');
    layer.className = 'variant-slit-layer';
    layer.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < count; i += 1) {
      const slit = document.createElement('span');
      slit.style.setProperty('--i', String(i));
      layer.appendChild(slit);
    }
    hero.appendChild(layer);
  };

  const addGrid = () => {
    if (!hero) return;
    const grid = document.createElement('div');
    grid.className = 'variant-grid-layer';
    grid.setAttribute('aria-hidden', 'true');
    hero.appendChild(grid);
  };

  const addLights = () => {
    if (!hero || reduced) return;
    const layer = document.createElement('div');
    layer.className = 'variant-light-layer';
    layer.setAttribute('aria-hidden', 'true');
    const colors = ['#E8C376', '#69C6C2', '#E8E3D2', '#C98A6A'];
    let seed = 3319;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < 42; i += 1) {
      const light = document.createElement('span');
      const size = 4 + random() * 9;
      light.style.left = `${random() * 100}%`;
      light.style.top = `${28 + random() * 68}%`;
      light.style.width = `${size}px`;
      light.style.height = `${size}px`;
      light.style.opacity = String(.35 + random() * .5);
      light.style.setProperty('--c', colors[i % colors.length]);
      light.style.setProperty('--d', `${random() * 2.6}s`);
      layer.appendChild(light);
    }
    hero.appendChild(layer);
  };

  const addMarquee = (text) => {
    if (!hero) return;
    const band = document.createElement('div');
    band.className = 'variant-marquee';
    band.setAttribute('aria-hidden', 'true');
    const track = document.createElement('div');
    track.className = 'variant-marquee__track';
    for (let repeat = 0; repeat < 2; repeat += 1) {
      for (let i = 0; i < 6; i += 1) {
        const span = document.createElement('span');
        span.textContent = text;
        track.appendChild(span);
      }
    }
    band.appendChild(track);
    hero.insertAdjacentElement('afterend', band);
  };

  if (is07) {
    addSlits(11);
    addMarquee('KNOW BEFORE YOU SELL');
  } else if (is12) {
    addGrid();
    addSlits(7);
    addMarquee('SITUATION / VALUE / OPTIONS / RISK');
  } else if (is33) {
    addGrid();
    addLights();
    addMarquee('REAL ESTATE CONSULTING / TOKYO');
  }

  // Fast-scroll fallback: reveal elements that crossed the viewport between frames.
  let revealTicking = false;
  const recoverReveals = () => {
    revealTicking = false;
    document.querySelectorAll('.reveal:not(.is-in)').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.25 && rect.bottom > -window.innerHeight * .25) {
        el.classList.add('is-in');
      }
    });
  };
  window.addEventListener('scroll', () => {
    if (revealTicking) return;
    revealTicking = true;
    window.requestAnimationFrame(recoverReveals);
  }, { passive: true });
  window.addEventListener('load', recoverReveals, { once: true });

  window.addEventListener('load', () => {
    const wipeTargets = document.querySelectorAll(
      is12
        ? '.knowledge-visual,.reason-image,.service-feature__image,.message-photo'
        : is07
          ? '.message-photo'
          : '.variant-no-wipe'
    );

    if (reduced || !window.gsap || !window.ScrollTrigger) {
      wipeTargets.forEach((el) => { el.style.clipPath = 'none'; });
      return;
    }

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const revealEach = (selector, values, delayStep = .08) => {
      gsap.utils.toArray(selector).forEach((el, index) => {
        gsap.from(el, {
          ...values,
          delay: index * delayStep,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        });
      });
    };

    const wipeEach = (selector, direction = 'right') => {
      gsap.utils.toArray(selector).forEach((el) => {
        const from = direction === 'left' ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)';
        gsap.fromTo(el, { clipPath: from }, {
          clipPath: 'inset(0 0% 0 0%)',
          duration: 1.15,
          ease: 'power4.inOut',
          scrollTrigger: { trigger: el, start: 'top 84%', once: true }
        });
      });
    };

    if (is07) {
      revealEach('.knowledge-list li', { y: 22, scale: .96, opacity: 0, duration: .72, ease: 'back.out(1.5)' }, .07);
      revealEach('.reason-row', { x: 30, opacity: 0, duration: .92, ease: 'power3.out' }, .06);
      revealEach('.listing-card', { y: 42, opacity: 0, duration: .85, ease: 'power2.out' }, .08);
      revealEach('.fee-row', { x: -24, opacity: 0, duration: .78, ease: 'power3.out' }, .07);
      revealEach('.flow-step', { y: 30, opacity: 0, duration: 1.05, ease: 'expo.out' }, .1);
      wipeEach('.message-photo');
      gsap.to('.final-cta__bg img', { scale: 1.09, ease: 'none', scrollTrigger: { trigger: '.final-cta', start: 'top bottom', end: 'bottom top', scrub: true } });
    }

    if (is12) {
      revealEach('.knowledge-list li', { x: -24, opacity: 0, duration: .82, ease: 'power3.out' }, .08);
      revealEach('.reason-row', { y: 24, opacity: 0, duration: .88, ease: 'power2.out' }, .07);
      revealEach('.service-index a', { x: 24, opacity: 0, duration: .75, ease: 'power3.out' }, .06);
      revealEach('.listing-card', { y: 34, opacity: 0, duration: .9, ease: 'power2.out' }, .09);
      revealEach('.proof-gallery figure', { y: 28, opacity: 0, duration: .9, ease: 'power4.out' }, .1);
      revealEach('.fee-row', { x: -22, opacity: 0, duration: .78, ease: 'power3.out' }, .06);
      revealEach('.flow-step', { y: 28, opacity: 0, duration: 1.08, ease: 'expo.out' }, .1);
      wipeEach('.knowledge-visual,.reason-image,.service-feature__image');
      wipeEach('.message-photo', 'left');
      gsap.to('.final-cta__bg img', { scale: 1.1, ease: 'none', scrollTrigger: { trigger: '.final-cta', start: 'top bottom', end: 'bottom top', scrub: true } });
    }

    if (is33) {
      revealEach('.knowledge-list li', { x: 28, opacity: 0, duration: .86, ease: 'power3.out' }, .07);
      revealEach('.reason-row', { x: 34, opacity: 0, duration: .85, ease: 'power3.out' }, .08);
      revealEach('.service-index a', { y: 22, opacity: 0, duration: .75, ease: 'power2.out' }, .07);
      revealEach('.listing-card', { y: 44, opacity: 0, rotation: -1.5, duration: 1, ease: 'power3.out' }, .09);
      revealEach('.proof-gallery figure', { scale: .92, opacity: 0, duration: .95, ease: 'power3.out' }, .1);
      revealEach('.fee-row', { x: -26, opacity: 0, duration: .82, ease: 'power3.out' }, .06);
      revealEach('.flow-step', { y: 34, opacity: 0, duration: 1.12, ease: 'expo.out' }, .1);
      gsap.from('.message-copy', { y: 42, rotation: -2.8, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.message-copy', start: 'top 84%', once: true } });
      gsap.to('.variant-light-layer', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.final-cta__bg img', { scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.final-cta', start: 'top bottom', end: 'bottom top', scrub: true } });
    }

    const animated = document.querySelectorAll('.knowledge-list li,.reason-row,.listing-card,.fee-row,.flow-step,.proof-gallery figure');
    if ('IntersectionObserver' in window) {
      const safety = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          window.setTimeout(() => {
            const opacity = Number.parseFloat(getComputedStyle(entry.target).opacity);
            if (opacity < .9 && !gsap.isTweening(entry.target)) {
              gsap.set(entry.target, { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, clearProps: 'transform' });
            }
          }, 1500);
          safety.unobserve(entry.target);
        });
      }, { threshold: .35 });
      animated.forEach((el) => safety.observe(el));
    }

    window.setTimeout(() => ScrollTrigger.refresh(), 250);
  }, { once: true });
})();
