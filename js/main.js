/* =========================================================
   VerbaBridge — main.js
   Global: theme toggle, RTL, sticky header, mobile menu,
   scroll reveal, accordions, smooth scroll, toast system
   ========================================================= */

(function () {
  'use strict';

  // Load the shared motion layer on every page that uses this script.
  const motionStyles = document.createElement('link');
  motionStyles.rel = 'stylesheet';
  motionStyles.href = 'css/banner-motion.css';
  document.head.appendChild(motionStyles);

  // ---- DOM Ready ---- //
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initTheme();
    normalizeBrand();
    initRTL();
    initHeader();
    initMobileMenu();
    initMobileNavAccordion();
    initBannerAnimations();
    initScrollReveal();
    initAccordions();
    initToasts();
    initContextMenus();
    highlightActiveNav();
    initBackToTop();
  }

  /* ============================================================
     BACK TO TOP
  ============================================================ */
  function initBackToTop() {
    if (document.querySelector('.vb-back-to-top')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'vb-back-to-top';
    button.setAttribute('aria-label', 'Back to top');
    button.setAttribute('title', 'Back to top');
    button.innerHTML = '<i class="ri-arrow-up-line" aria-hidden="true"></i>';
    document.body.appendChild(button);

    const updateVisibility = () => {
      button.classList.toggle('is-visible', window.scrollY > 320);
    };

    window.addEventListener('scroll', updateVisibility, { passive: true });
    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    updateVisibility();
  }

  /* ============================================================
     BANNER + CTA MOTION
  ============================================================ */
  function initBannerAnimations() {
    const sections = document.querySelectorAll('.vb-hero, .vb-page-banner, .vb-cta-section');
    if (!sections.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    sections.forEach(section => section.classList.add('motion-ready'));

    if (reduceMotion || !('IntersectionObserver' in window)) {
      sections.forEach(section => section.classList.add('motion-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('motion-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.02, rootMargin: '60px 0px 60px 0px' });

    sections.forEach(section => {
      const bounds = section.getBoundingClientRect();
      const isAlreadyVisible = bounds.top < window.innerHeight && bounds.bottom > 0;

      if (isAlreadyVisible || section.classList.contains('vb-cta-section')) {
        requestAnimationFrame(() => section.classList.add('motion-visible'));
      }
      observer.observe(section);
    });

    // Safety fallback: ensure all sections become visible
    setTimeout(() => {
      document.querySelectorAll('.motion-ready:not(.motion-visible)').forEach(el => {
        el.classList.add('motion-visible');
      });
    }, 250);
  }

  // Toasts are created on demand by VB.toast; this keeps initialization explicit.
  function initToasts() {}

  function normalizeBrand() {
    document.querySelectorAll('.auth-mobile-brand').forEach(el => {
      el.innerHTML = '<a href="index.html" class="vb-brand" aria-label="VerbaBridge Corporate Learning"><img src="assets/images/logo.png" alt="VerbaBridge Corporate Learning" class="vb-brand-img" height="46"></a>';
    });
  }

  /* ============================================================
     THEME TOGGLE
  ============================================================ */
  function initTheme() {
    const saved = localStorage.getItem('vb-theme') || 'light';
    applyTheme(saved);

    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('vb-theme', next);
      });
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // Update icon
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      const icon = btn.querySelector('i');
      if (!icon) return;
      if (theme === 'dark') {
        icon.className = icon.className.replace(/ri-moon-line|ri-sun-line/g, '');
        icon.classList.add('ri-sun-line');
      } else {
        icon.className = icon.className.replace(/ri-moon-line|ri-sun-line/g, '');
        icon.classList.add('ri-moon-line');
      }
    });
  }

  /* ============================================================
     RTL TOGGLE
  ============================================================ */
  function initRTL() {
    const saved = localStorage.getItem('vb-dir') || 'ltr';
    applyDir(saved);

    document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('dir') || 'ltr';
        const next = current === 'rtl' ? 'ltr' : 'rtl';
        applyDir(next);
        localStorage.setItem('vb-dir', next);
      });
    });
  }

  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
      const label = btn.querySelector('span');
      if (label) label.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });
  }

  /* ============================================================
     STICKY HEADER + SCROLL SHADOW
  ============================================================ */
  function initHeader() {
    const header = document.querySelector('.vb-header');
    if (!header) return;

    const onScroll = () => {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     MOBILE MENU
  ============================================================ */
  function initMobileMenu() {
    const toggle = document.querySelector('.vb-menu-toggle');
    const menu   = document.querySelector('.vb-mobile-menu');
    const overlay = document.querySelector('.vb-overlay:not(.sidebar-overlay)');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    // Close on nav link click
    menu.querySelectorAll('.vb-mobile-nav-link, .vmn-sub-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    function openMenu() {
      menu.classList.add('visible');
      requestAnimationFrame(() => menu.classList.add('open'));
      if (overlay) overlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      menu.setAttribute('aria-hidden', 'false');
      const icon = toggle.querySelector('i');
      if (icon) { icon.classList.remove('ri-menu-line'); icon.classList.add('ri-close-line'); }

      // Ensure open accordion groups have their height calculated
      menu.querySelectorAll('.vmn-group.open .vmn-submenu').forEach(sm => {
        sm.style.maxHeight = sm.scrollHeight ? (sm.scrollHeight + 30) + 'px' : '300px';
        sm.style.opacity = '1';
      });
    }

    function closeMenu() {
      menu.classList.remove('open');
      if (overlay) overlay.classList.remove('visible');
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      menu.setAttribute('aria-hidden', 'true');
      setTimeout(() => menu.classList.remove('visible'), 300);
      const icon = toggle.querySelector('i');
      if (icon) { icon.classList.add('ri-menu-line'); icon.classList.remove('ri-close-line'); }
    }
  }

  /* ============================================================
     MOBILE NAV ACCORDION (Home & Programs dropdowns)
  ============================================================ */
  function initMobileNavAccordion() {
    document.querySelectorAll('.vmn-group-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const group   = toggle.closest('.vmn-group');
        const submenu = group.querySelector('.vmn-submenu');
        const icon    = toggle.querySelector('.vmn-arrow');
        const isOpen  = group.classList.contains('open');

        // Close all other open groups first
        document.querySelectorAll('.vmn-group.open').forEach(g => {
          if (g !== group) {
            g.classList.remove('open');
            const sm = g.querySelector('.vmn-submenu');
            const ic = g.querySelector('.vmn-arrow');
            const tg = g.querySelector('.vmn-group-toggle');
            if (sm) { sm.style.maxHeight = '0'; sm.style.opacity = '0'; }
            if (ic) ic.style.transform = 'rotate(0deg)';
            if (tg) tg.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current group
        if (isOpen) {
          group.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          if (submenu) { submenu.style.maxHeight = '0'; submenu.style.opacity = '0'; }
          if (icon) icon.style.transform = 'rotate(0deg)';
        } else {
          group.classList.add('open');
          toggle.setAttribute('aria-expanded', 'true');
          if (submenu) {
            submenu.style.maxHeight = (submenu.scrollHeight + 30) + 'px';
            submenu.style.opacity = '1';
          }
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    });
  }


  /* ============================================================
     SCROLL REVEAL
  ============================================================ */
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    // Reduce motion: reveal immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach((element) => observer.observe(element));

    // A restored scroll position can leave off-screen elements outside the
    // observer's first intersection pass. Never allow decorative reveal
    // animation state to keep real page content permanently hidden.
    setTimeout(() => {
      elements.forEach((element) => {
        if (!element.classList.contains('revealed')) {
          element.classList.add('revealed');
          observer.unobserve(element);
        }
      });
    }, 700);
  }

  /* ============================================================
     ACCORDIONS
  ============================================================ */
  function initAccordions() {
    document.querySelectorAll('.vb-accordion-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const body = btn.nextElementSibling;
        if (!body) return;
        const isOpen = btn.classList.contains('open');

        // Close siblings in same group
        const group = btn.closest('.vb-accordion-group');
        if (group) {
          group.querySelectorAll('.vb-accordion-btn.open').forEach(ob => {
            if (ob !== btn) {
              ob.classList.remove('open');
              const ob_body = ob.nextElementSibling;
              if (ob_body) ob_body.classList.remove('open');
            }
          });
        }

        btn.classList.toggle('open', !isOpen);
        body.classList.toggle('open', !isOpen);
      });
    });

    // Module accordions
    document.querySelectorAll('.module-header').forEach(header => {
      header.addEventListener('click', () => {
        const body = header.nextElementSibling;
        if (!body) return;
        const isOpen = header.classList.contains('open');
        header.classList.toggle('open', !isOpen);
        body.classList.toggle('open', !isOpen);
      });
    });
  }

  /* ============================================================
     TOAST SYSTEM
  ============================================================ */
  window.VB = window.VB || {};

  window.VB.toast = function (message, type = 'info', duration = 3500) {
    let container = document.querySelector('.vb-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'vb-toast-container';
      document.body.appendChild(container);
    }

    const icons = { info: 'ri-information-line', success: 'ri-checkbox-circle-line', warning: 'ri-alert-line', danger: 'ri-error-warning-line' };
    const colors = { info: 'var(--teal)', success: 'var(--success)', warning: 'var(--warning)', danger: 'var(--danger)' };

    const toast = document.createElement('div');
    toast.className = `vb-toast ${type}`;
    toast.innerHTML = `
      <i class="toast-icon ${icons[type] || icons.info}" style="color:${colors[type] || colors.info}"></i>
      <span class="toast-msg">${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'opacity 0.3s, transform 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  /* ============================================================
     CONTEXT MENUS (TABLE ACTIONS)
  ============================================================ */
  function initContextMenus() {
    document.addEventListener('click', (e) => {
      // Close all open context menus
      document.querySelectorAll('.context-menu-dropdown.open').forEach(menu => {
        if (!menu.closest('.table-context-menu')?.contains(e.target)) {
          menu.classList.remove('open');
        }
      });
    });

    document.querySelectorAll('.table-context-menu').forEach(wrapper => {
      const btn = wrapper.querySelector('[data-context-trigger]');
      const menu = wrapper.querySelector('.context-menu-dropdown');
      if (btn && menu) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const wasOpen = menu.classList.contains('open');
          document.querySelectorAll('.context-menu-dropdown.open').forEach(m => m.classList.remove('open'));
          if (!wasOpen) menu.classList.add('open');
        });
      }
    });
  }

  /* ============================================================
     ACTIVE NAV HIGHLIGHT
  ============================================================ */
  function highlightActiveNav() {
    const fullPath = window.location.pathname;
    let current = fullPath.split('/').pop() || 'index.html';
    if (!current || current === '') current = 'index.html';

    // Remove existing active states
    document.querySelectorAll('.vb-nav-link, .vb-mobile-nav-link, .vmn-sub-link, .vb-dropdown-link, .vmn-group-toggle').forEach(el => {
      el.classList.remove('active');
    });
    document.querySelectorAll('.vmn-group').forEach(el => {
      el.classList.remove('has-active');
    });

    // Match links across desktop & mobile
    document.querySelectorAll('.vb-nav-link, .vb-mobile-nav-link, .vmn-sub-link, .vb-dropdown-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

      const [hrefPath] = href.split('?');
      const page = hrefPath.split('#')[0].split('/').pop();

      const isPageMatch = (page === current) || 
                          ((current === '' || current === '/' || current === 'index.html') && (page === 'index.html' || page === ''));

      if (isPageMatch) {
        link.classList.add('active');

        // Handle desktop dropdown parent
        const parentNavItem = link.closest('.vb-nav-item');
        if (parentNavItem) {
          const parentLink = parentNavItem.querySelector('.vb-nav-link');
          if (parentLink) parentLink.classList.add('active');
        }

        // Handle mobile accordion parent group (.vmn-group)
        const parentGroup = link.closest('.vmn-group');
        if (parentGroup) {
          parentGroup.classList.add('has-active', 'open');
          const groupToggle = parentGroup.querySelector('.vmn-group-toggle');
          if (groupToggle) {
            groupToggle.classList.add('active');
            groupToggle.setAttribute('aria-expanded', 'true');
            const arrow = groupToggle.querySelector('.vmn-arrow');
            if (arrow) arrow.style.transform = 'rotate(180deg)';
          }
          const submenu = parentGroup.querySelector('.vmn-submenu');
          if (submenu) {
            submenu.style.maxHeight = '300px';
            submenu.style.opacity = '1';
          }
        }
      }
    });
  }

  /* ============================================================
     SMOOTH SCROLL FOR ANCHOR LINKS
  ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = document.querySelector('.vb-header')?.offsetHeight || 68;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ============================================================
     FILTER PILLS (public pages)
  ============================================================ */
  document.querySelectorAll('.filter-pill[data-filter]').forEach(pill => {
    pill.addEventListener('click', function () {
      const group = this.closest('.filter-group');
      if (group) {
        group.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      }
      this.classList.add('active');

      const filter = this.dataset.filter;
      const target = this.dataset.filterTarget;
      if (target) {
        document.querySelectorAll(`[data-category]`).forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      }
    });
  });

  /* ============================================================
     COUNTER ANIMATION
  ============================================================ */
  window.VB.animateCounter = function (el, end, duration = 1500) {
    const start = 0;
    const increment = end / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString();
    }, 16);
  };

  /* ============================================================
     PROGRAM / CASE STUDY TABS
  ============================================================ */
  document.querySelectorAll('.prog-tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const panel = this.dataset.tab;
      const container = this.closest('.prog-tabs-container');
      if (!container) return;

      container.querySelectorAll('.prog-tab-btn').forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.prog-tab-panel').forEach(p => p.classList.remove('active'));

      this.classList.add('active');
      const target = container.querySelector(`#${panel}`);
      if (target) target.classList.add('active');
    });
  });

})();

// Auth provider buttons — static demo feedback
 document.querySelectorAll('.auth-social-button[data-social]').forEach((button) => {
  button.addEventListener('click', () => {
    const status = button.closest('.auth-social')?.querySelector('.auth-social-note');
    if (status) status.textContent = `${button.dataset.social} sign-in is connected in the production portal.`;
  });
});
