/* ── JS: MAIN.JS ─────────────────────────────────────────── */
(function () {
  'use strict';

  // ── HEADER: HIDE ON SCROLL DOWN / SHOW ON SCROLL UP ─────
  const header = document.getElementById('site-header');
  const promoBar = document.getElementById('promo-bar');
  let lastScrollY = 0;
  const SCROLL_THRESHOLD = 60;
  const HIDE_AFTER = 10; // px scrolled down before hiding

  function handleHeaderScroll() {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;

    // Toggle scrolled style (background/blur)
    if (currentScrollY > SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Hide when scrolling down (past threshold), show when scrolling up
    if (currentScrollY > SCROLL_THRESHOLD + HIDE_AFTER && scrollingDown) {
      header.classList.add('header-hidden');
    } else if (!scrollingDown) {
      header.classList.remove('header-hidden');
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  // ── HERO CAROUSEL ───────────────────────────────────────
  const heroImages = document.querySelectorAll('.hero-img');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(index) {
    heroImages[currentSlide].classList.add('hidden');
    dots[currentSlide].classList.remove('active');
    currentSlide = (index + heroImages.length) % heroImages.length;
    heroImages[currentSlide].classList.remove('hidden');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function startCarousel() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function resetCarousel() {
    clearInterval(slideInterval);
    startCarousel();
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetCarousel();
    });
  });

  startCarousel();

  // ── TESTIMONIALS NAV ────────────────────────────────────
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testemPrev = document.getElementById('testem-prev');
  const testemNext = document.getElementById('testem-next');
  let currentTestim = 0;

  function showTestimonial(index) {
    testimonialCards.forEach((card, i) => {
      card.style.display = i === index ? 'flex' : 'none';
      card.style.flexDirection = 'column';
      card.style.gap = '16px';
    });
  }

  function isMobileTestim() {
    return window.innerWidth < 1024;
  }

  function applyTestimonialLayout() {
    if (isMobileTestim()) {
      showTestimonial(currentTestim);
      testemPrev.style.display = 'flex';
      testemNext.style.display = 'flex';
    } else {
      testimonialCards.forEach(card => {
        card.style.display = 'flex';
      });
      testemPrev.style.display = 'flex';
      testemNext.style.display = 'flex';
    }
  }

  testemPrev.addEventListener('click', () => {
    currentTestim = (currentTestim - 1 + testimonialCards.length) % testimonialCards.length;
    if (isMobileTestim()) showTestimonial(currentTestim);
  });

  testemNext.addEventListener('click', () => {
    currentTestim = (currentTestim + 1) % testimonialCards.length;
    if (isMobileTestim()) showTestimonial(currentTestim);
  });

  applyTestimonialLayout();
  window.addEventListener('resize', applyTestimonialLayout);

  // ── SCROLL REVEAL ───────────────────────────────────────
  const revealElements = document.querySelectorAll('[data-reveal], .treatment-card, .value-item');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger delay for siblings
          const siblings = Array.from(entry.target.parentElement?.children || []);
          const idx = siblings.indexOf(entry.target);
          const delay = idx * 80;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ── PARALLAX HERO ────────────────────────────────────────
  const heroImg = document.querySelector('.hero-img:not(.hidden)');

  function onHeroParallax() {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      const activeHeroImg = document.querySelector('.hero-img:not(.hidden)');
      if (activeHeroImg) {
        activeHeroImg.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    }
  }

  window.addEventListener('scroll', onHeroParallax, { passive: true });

  // ── FOOTER FORM ──────────────────────────────────────────
  const footerForm = document.getElementById('footer-form');
  const emailInput = document.getElementById('email-input');
  const subscribeBtn = footerForm?.querySelector('.btn-subscribe');

  if (footerForm) {
    footerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (!email || !email.includes('@')) return;

      subscribeBtn.textContent = 'INSCRITO! ✓';
      subscribeBtn.style.color = '#3a9a6e';
      emailInput.value = '';
      emailInput.disabled = true;
      subscribeBtn.disabled = true;

      setTimeout(() => {
        subscribeBtn.textContent = 'INSCREVER-SE';
        subscribeBtn.style.color = '';
        emailInput.disabled = false;
        subscribeBtn.disabled = false;
      }, 3000);
    });
  }

  // ── SMOOTH SCROLL FOR NAV LINKS ──────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerH = 40 + 72; // promo + header
        const targetTop = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });

  // ── FLOAT BUTTON HIDE ON FOOTER ──────────────────────────
  const floatBtn = document.getElementById('float-btn');
  const footerEl = document.getElementById('footer');

  if (floatBtn && footerEl) {
    const floatObserver = new IntersectionObserver(
      ([entry]) => {
        floatBtn.style.opacity = entry.isIntersecting ? '0' : '1';
        floatBtn.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
      },
      { threshold: 0.1 }
    );
    floatObserver.observe(footerEl);
  }
})();
