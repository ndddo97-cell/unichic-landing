/* ============================================
   UNICHIC — JAVASCRIPT
   ============================================ */

'use strict';

/* ── Utility ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================
   ANNOUNCEMENT BAR — Mobile Slider
   ============================================ */

function initAnnouncementSlider() {
  const items = $$('.announcement-item');
  if (!items.length) return;

  const isMobile = () => window.innerWidth < 768;
  let current = 0;
  let timer = null;

  function showSlide(idx) {
    items.forEach((el, i) => el.classList.toggle('active', i === idx));
  }

  function startSlider() {
    if (!isMobile()) {
      items.forEach(el => el.classList.remove('active'));
      if (timer) clearInterval(timer);
      return;
    }
    showSlide(current);
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      current = (current + 1) % items.length;
      showSlide(current);
    }, 3500);
  }

  startSlider();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(startSlider, 200);
  });
}


/* ============================================
   STICKY HEADER
   ============================================ */

function initStickyHeader() {
  const header = $('#mainHeader');
  if (!header) return;

  let lastScroll = 0;

  function onScroll() {
    const scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 10);
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


/* ============================================
   MOBILE MENU
   ============================================ */

function initMobileMenu() {
  const hamburger = $('#hamburgerBtn');
  const menu = $('#mobileMenu');
  const overlay = $('#menuOverlay');
  const closeBtn = $('#menuCloseBtn');

  if (!hamburger || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });

  // Footer mobile accordion
  const footerCols = $$('.footer-col:not(.footer-brand-col) .footer-col-heading');
  footerCols.forEach(heading => {
    heading.addEventListener('click', () => {
      if (window.innerWidth > 767) return;
      const col = heading.closest('.footer-col');
      col.classList.toggle('open');
    });
  });
}


/* ============================================
   SEARCH OVERLAY
   ============================================ */

function initSearch() {
  const searchBtn = $('#searchBtn');
  const overlay = $('#searchOverlay');
  const closeBtn = $('#searchClose');
  const input = $('#searchInput');

  if (!overlay) return;

  function openSearch() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    setTimeout(() => input?.focus(), 50);
  }

  function closeSearch() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
  }

  searchBtn?.addEventListener('click', openSearch);
  closeBtn?.addEventListener('click', closeSearch);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearch();
  });

  // Keyboard shortcut: / or Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && !overlay.classList.contains('open')) {
      if (document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        openSearch();
      }
    }
  });
}


/* ============================================
   HERO IMAGE REVEAL
   ============================================ */

function initHeroReveal() {
  const heroContent = $('.reveal-fade');
  if (!heroContent) return;

  // Short delay to allow image load
  setTimeout(() => {
    heroContent.classList.add('revealed');
  }, 120);
}


/* ============================================
   SCROLL REVEAL (Intersection Observer)
   ============================================ */

function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    $$('.reveal-section').forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  $$('.reveal-section').forEach(el => observer.observe(el));
}


/* ============================================
   PRODUCT CAROUSEL
   ============================================ */

function createCarousel(trackId, prevId, nextId, progressId) {
  const track = $(`#${trackId}`);
  const prevBtn = $(`#${prevId}`);
  const nextBtn = $(`#${nextId}`);
  const progressBar = progressId ? $(`#${progressId}`) : null;

  if (!track || !prevBtn || !nextBtn) return;

  const items = $$('.carousel-item', track);
  const total = items.length;
  let currentIndex = 0;

  function getVisibleCount() {
    const w = window.innerWidth;
    if (w >= 1280) return 4;
    if (w >= 768) return 2;
    return 2;
  }

  function getItemWidth() {
    if (!items[0]) return 0;
    const style = window.getComputedStyle(items[0]);
    const gap = parseFloat(window.getComputedStyle(track).gap) || 14;
    return items[0].offsetWidth + gap;
  }

  function getMaxIndex() {
    const visible = getVisibleCount();
    return Math.max(0, total - visible);
  }

  function updateProgress() {
    if (!progressBar) return;
    const maxIdx = getMaxIndex();
    const pct = maxIdx > 0
      ? ((currentIndex / maxIdx) * (100 - 100/total)) + (100/total)
      : 100/total;
    progressBar.style.width = `${Math.min(100, pct)}%`;
  }

  function goTo(idx) {
    const maxIdx = getMaxIndex();
    currentIndex = Math.max(0, Math.min(idx, maxIdx));
    const offset = currentIndex * getItemWidth();
    track.style.transform = `translateX(-${offset}px)`;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIdx;

    prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
    nextBtn.style.opacity = currentIndex >= maxIdx ? '0.4' : '1';

    updateProgress();
  }

  prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  // Touch / swipe support
  let startX = 0;
  let isDragging = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = false;
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    isDragging = true;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
    }
    isDragging = false;
  });

  // Recalculate on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => goTo(currentIndex), 200);
  });

  goTo(0);
}


/* ============================================
   LOOKBOOK — DRAG SCROLL
   ============================================ */

function initLookbookDrag() {
  const wrap = $('.lookbook-track-wrap');
  if (!wrap) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  wrap.addEventListener('mousedown', (e) => {
    isDown = true;
    wrap.style.cursor = 'grabbing';
    startX = e.pageX - wrap.offsetLeft;
    scrollLeft = wrap.scrollLeft;
  });

  document.addEventListener('mouseup', () => {
    isDown = false;
    wrap.style.cursor = 'grab';
  });

  wrap.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrap.offsetLeft;
    const walk = (x - startX) * 1.5;
    wrap.scrollLeft = scrollLeft - walk;
  });
}


/* ============================================
   NEWSLETTER FORM
   ============================================ */

function initNewsletter() {
  const form = $('#newsletterForm');
  const input = $('#emailInput');
  const errorEl = $('#emailError');
  const successEl = $('#emailSuccess');

  if (!form) return;

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();

    // Reset
    errorEl.textContent = '';
    successEl.textContent = '';
    input.style.borderColor = '';

    if (!val) {
      errorEl.textContent = 'Vui lòng nhập địa chỉ email.';
      input.focus();
      return;
    }
    if (!isValidEmail(val)) {
      errorEl.textContent = 'Địa chỉ email không hợp lệ.';
      input.focus();
      return;
    }

    // Simulate success
    input.value = '';
    successEl.textContent = '✓ Đăng ký thành công! Hẹn gặp bạn trong email tiếp theo.';
    setTimeout(() => { successEl.textContent = ''; }, 5000);
  });
}


/* ============================================
   CART COUNTER (demo)
   ============================================ */

function initCartCounter() {
  const badge = $('.cart-badge');
  if (!badge) return;

  let count = 0;

  $$('.product-quick-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      count++;
      badge.textContent = count;

      const cartBtn = $('#cartBtn');
      if (cartBtn) {
        cartBtn.setAttribute('aria-label', `Giỏ hàng (${count} sản phẩm)`);
        cartBtn.classList.add('bounce');
        setTimeout(() => cartBtn.classList.remove('bounce'), 400);
      }
    });
  });
}


/* ============================================
   BACK TO TOP
   ============================================ */

function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  function onScroll() {
    const show = window.scrollY > 400;
    btn.style.display = show ? 'flex' : 'none';
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ============================================
   CHAT BUTTON (placeholder)
   ============================================ */

function initChatButton() {
  const btn = $('#chatBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    // Placeholder: in production, open chat widget
    btn.style.animation = 'none';
    btn.classList.add('pulse');
    setTimeout(() => btn.classList.remove('pulse'), 800);
  });
}


/* ============================================
   CART BOUNCE ANIMATION (CSS injection)
   ============================================ */

function injectDynamicStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes bounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.18); }
    }
    .bounce { animation: bounce 0.35s ease; }

    @keyframes pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 2px 12px rgba(0,0,0,0.15); }
      50% { transform: scale(1.1); box-shadow: 0 4px 20px rgba(31,42,68,0.35); }
    }
    .pulse { animation: pulse 0.7s ease; }
  `;
  document.head.appendChild(style);
}


/* ============================================
   SMOOTH ANCHOR LINKS
   ============================================ */

function initSmoothLinks() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = $(href);
      if (!target) return;
      e.preventDefault();
      const headerH = $('#mainHeader')?.offsetHeight || 62;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


/* ============================================
   LAZY IMAGE OBSERVER
   ============================================ */

function initLazyImages() {
  // Native loading="lazy" is set on all non-hero images
  // This adds a fade-in effect when images load
  const imgs = $$('img[loading="lazy"]');
  imgs.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.4s ease';
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
    }
  });
}


/* ============================================
   INIT ALL
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  injectDynamicStyles();
  initAnnouncementSlider();
  initStickyHeader();
  initMobileMenu();
  initSearch();
  initHeroReveal();
  initScrollReveal();
  initLazyImages();

  // Carousels
  createCarousel('newCarouselTrack', 'newPrev', 'newNext', 'newProgressBar');
  createCarousel('sigCarouselTrack', 'sigPrev', 'sigNext', 'sigProgressBar');

  initLookbookDrag();
  initNewsletter();
  initCartCounter();
  initBackToTop();
  initChatButton();
  initSmoothLinks();
});
