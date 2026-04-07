/* ============================================================
   SHREE GAU DHAM GAUSHALA — MAIN JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAVBAR ──────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ── HAMBURGER MENU ──────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const mobileOverlay = document.getElementById('mobileOverlay');

  function openNav() {
    navLinks.classList.add('open');
    mobileOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
    const s = hamburger.querySelectorAll('span');
    s[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    s[1].style.opacity   = '0';
    s[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  }
  function closeNav() {
    navLinks.classList.remove('open');
    mobileOverlay?.classList.remove('open');
    document.body.style.overflow = '';
    const s = hamburger.querySelectorAll('span');
    s[0].style.transform = '';
    s[1].style.opacity   = '';
    s[2].style.transform = '';
  }

  hamburger?.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeNav() : openNav();
  });
  mobileOverlay?.addEventListener('click', closeNav);
  navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  // ── SCROLL REVEAL ───────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObs.observe(el));

  // ── STAT COUNTERS ───────────────────────────────────
  const counters = document.querySelectorAll('.stat-num[data-target]');
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target._counted) {
        entry.target._counted = true;
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => countObs.observe(c));

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const fps      = 60;
    const steps    = Math.ceil(duration / (1000 / fps));
    let   frame    = 0;
    const timer    = setInterval(() => {
      frame++;
      const progress = 1 - Math.pow(1 - frame / steps, 3);
      el.textContent = Math.round(target * progress).toLocaleString('en-IN');
      if (frame >= steps) {
        el.textContent = target.toLocaleString('en-IN');
        clearInterval(timer);
      }
    }, 1000 / fps);
  }

  // ── FLOATING DONATE BUTTON ──────────────────────────
  const floatDonate = document.getElementById('floatDonate');
  if (floatDonate) {
    let donateSection = document.getElementById('donate') || document.querySelector('.donate-tabs');
    window.addEventListener('scroll', () => {
      const pastHero = window.scrollY > window.innerHeight * 0.65;
      let nearDonate = false;
      if (donateSection) {
        const rect = donateSection.getBoundingClientRect();
        nearDonate = rect.top < window.innerHeight && rect.bottom > 0;
      }
      floatDonate.classList.toggle('visible', pastHero && !nearDonate);
    }, { passive: true });
  }

  // ── CONTACT FORM ─────────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const modal = document.getElementById('thankModal');
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      } else {
        showToast('Thank you! We\'ll be in touch soon. 🙏', 'success');
        contactForm.reset();
      }
    });
  }

  // Close thank modal
  const closeModal    = document.getElementById('closeModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const thankModal    = document.getElementById('thankModal');
  [closeModal, closeModalBtn].forEach(btn => {
    btn?.addEventListener('click', () => {
      thankModal?.classList.remove('open');
      document.body.style.overflow = '';
      contactForm?.reset();
    });
  });
  thankModal?.addEventListener('click', e => {
    if (e.target === thankModal) {
      thankModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // ── ADOPT PLAN SELECTOR (home page) ─────────────────
  const adoptPlans = document.querySelectorAll('.adopt-plan');
  adoptPlans.forEach(plan => {
    plan.addEventListener('click', () => {
      adoptPlans.forEach(p => p.classList.remove('selected'));
      plan.classList.add('selected');
    });
  });

  // ── PERK CARDS (donate page) ────────────────────────
  const perkCards = document.querySelectorAll('.perk-card');
  perkCards.forEach(card => {
    card.addEventListener('click', () => {
      perkCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // ── SMOOTH SCROLL for anchor links ──────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 100;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth'
        });
      }
    });
  });

  // ── GLOBAL TOAST FUNCTION ────────────────────────────
  window.showToast = function(msg, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 400);
    }, 3800);
  };

  // ── ESC KEY CLOSES MODALS ────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open, .lightbox.open').forEach(m => {
        m.classList.remove('open');
        document.body.style.overflow = '';
        const frame = m.querySelector('#videoFrame');
        if (frame) frame.src = '';
      });
    }
  });

  // ── NAVBAR ACTIVE LINK (home page) ──────────────────
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && navAnchors.length) {
    const activeObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(a => a.classList.remove('active'));
          const match = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (match) match.classList.add('active');
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(s => activeObs.observe(s));
  }

});
