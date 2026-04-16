/* ============================================================
   script.js — Akarsh Raj Portfolio
   Handles: typing effect, smooth scroll, mobile nav,
            navbar scroll state, skill bar animation,
            scroll reveal, contact form feedback
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────
   1. TYPING EFFECT
   ───────────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'CSE Student & Hardware Hacker',
    'Bridging Software & Silicon',
    'Arduino + Python Enthusiast',
    'Biofeedback System Builder',
    'Data Visualization Explorer',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPaused    = false;

  const TYPE_SPEED   = 65;
  const DELETE_SPEED = 35;
  const PAUSE_AFTER  = 1800;
  const PAUSE_BEFORE = 300;

  function tick() {
    const current = phrases[phraseIndex];

    if (isPaused) {
      isPaused = false;
      setTimeout(tick, PAUSE_BEFORE);
      return;
    }

    if (!isDeleting) {
      // Typing
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        // Finished typing — pause then delete
        setTimeout(() => {
          isDeleting = true;
          tick();
        }, PAUSE_AFTER);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      // Deleting
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting  = false;
        isPaused    = true;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  // Small initial delay so page loads first
  setTimeout(tick, 900);
})();


/* ─────────────────────────────────────────
   2. SMOOTH SCROLL (all anchor links)
   ───────────────────────────────────────── */
(function initSmoothScroll() {
  const OFFSET = 80; // navbar height

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const href   = this.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ─────────────────────────────────────────
   3. MOBILE NAVIGATION TOGGLE
   ───────────────────────────────────────── */
(function initMobileNav() {
  const btn        = document.getElementById('menu-btn');
  const menu       = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  if (!btn || !menu) return;

  function closeMenu() {
    menu.classList.add('hidden');
    btn.classList.remove('menu-open');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    if (isOpen) {
      closeMenu();
    } else {
      menu.classList.remove('hidden');
      btn.classList.add('menu-open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });

  // Close when a link is tapped
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      closeMenu();
    }
  });
})();


/* ─────────────────────────────────────────
   4. NAVBAR SCROLL STATE
   ───────────────────────────────────────── */
(function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function update() {
    if (window.scrollY > 20) {
      navbar.classList.add('nav-scrolled');
    } else {
      navbar.classList.remove('nav-scrolled');
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update(); // run once on load
})();


/* ─────────────────────────────────────────
   5. SKILL BAR ANIMATION (Intersection Observer)
   ───────────────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el       = entry.target;
        const target   = el.getAttribute('data-width') || '0';
        // Small delay for staggered feel
        const index    = [...fills].indexOf(el);
        setTimeout(() => {
          el.style.width = target + '%';
        }, index * 120);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => observer.observe(fill));
})();


/* ─────────────────────────────────────────
   6. SCROLL REVEAL (sections & cards)
   ───────────────────────────────────────── */
(function initScrollReveal() {
  // Add .reveal class to target elements
  const targets = [
    '#about .grid > *',
    '#about .stat-card',
    '.skill-panel',
    '.project-card',
    '#contact .form-group',
    '#contact button',
    '.tag',
    '.section-label',
  ];

  targets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Staggered delay based on sibling index
        const siblings = [...entry.target.parentElement.children];
        const idx      = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = (idx * 80) + 'ms';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* ─────────────────────────────────────────
   7. CONTACT FORM (placeholder feedback)
   ───────────────────────────────────────── */
(function initContactForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Disable submit button during "send"
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent  = 'Sending...';
    btn.disabled     = true;

    // Simulate async send
    setTimeout(() => {
      if (status) {
        status.classList.remove('hidden');
        status.style.opacity = '0';
        // Fade in
        requestAnimationFrame(() => {
          status.style.transition = 'opacity .4s';
          status.style.opacity    = '1';
        });
      }
      btn.textContent = originalText;
      btn.disabled    = false;
      form.reset();

      // Hide status after 4s
      setTimeout(() => {
        if (status) status.classList.add('hidden');
      }, 4000);
    }, 1200);
  });
})();


/* ─────────────────────────────────────────
   8. ACTIVE NAV HIGHLIGHT (on scroll)
   ───────────────────────────────────────── */
(function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  const OFFSET    = 120;

  function update() {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - OFFSET) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      if (href === current) {
        link.style.color = 'var(--accent)';
      } else {
        link.style.color = '';
      }
    });
  }

  window.addEventListener('scroll', update, { passive: true });
})();
