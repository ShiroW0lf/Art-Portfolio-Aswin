// gallery.js — public portfolio rendering + lightbox

(function () {
  'use strict';

  const sections = ['fundamentals', 'environments', 'characters', 'fanarts'];
  let currentSectionItems = [];
  let currentLightboxIndex = 0;

  // ── RENDER GALLERIES ──────────────────────────
  function renderAll() {
    sections.forEach(sec => {
      const items = PORTFOLIO_DATA[sec] || [];
      const grid = document.getElementById('grid-' + sec);
      if (!grid) return;
      grid.innerHTML = '';

      if (items.length === 0) {
        grid.innerHTML = '<div class="gallery-empty"><p>Artwork coming soon ✦</p></div>';
        return;
      }

      // Featured first
      const sorted = [...items].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      sorted.forEach((item, idx) => {
        const card = createCard(item, idx, sorted, sec);
        grid.appendChild(card);
      });
    });
  }

  function createCard(item, idx, allItems, sec) {
    const card = document.createElement('article');
    card.className = 'art-card' + (item.featured ? ' featured' : '');
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'View ' + item.title);

    card.innerHTML = `
      <div class="art-img-wrap">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
        ${item.featured ? '<span class="featured-badge">✦ Featured</span>' : ''}
      </div>
      <div class="art-info">
        <p class="art-title">${item.title}</p>
        <p class="art-meta">${item.meta || ''}</p>
      </div>`;

    card.addEventListener('click', () => openLightbox(allItems, idx));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openLightbox(allItems, idx); });
    return card;
  }

  // ── LIGHTBOX ──────────────────────────────────
  function openLightbox(items, idx) {
    currentSectionItems = items;
    currentLightboxIndex = idx;
    showLightboxItem();
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('lightbox').focus();
  }

  function showLightboxItem() {
    const item = currentSectionItems[currentLightboxIndex];
    if (!item) return;
    document.getElementById('lightbox-img').src = item.image;
    document.getElementById('lightbox-img').alt = item.title;
    document.getElementById('lightbox-title').textContent = item.title;
    document.getElementById('lightbox-meta').textContent = item.meta || '';
  }

  window.closeLightbox = function (e) {
    if (e && e.target !== e.currentTarget && !e.target.classList.contains('lightbox-close')) return;
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
  };

  window.lightboxNav = function (dir) {
    currentLightboxIndex = (currentLightboxIndex + dir + currentSectionItems.length) % currentSectionItems.length;
    showLightboxItem();
  };

  // Keyboard nav
  document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox');
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') window.closeLightbox();
    if (e.key === 'ArrowRight') window.lightboxNav(1);
    if (e.key === 'ArrowLeft') window.lightboxNav(-1);
  });

  // ── SECTION TAB SCROLL TRACKING ───────────────
  const sectionEls = sections.map(s => document.getElementById('sec-' + s)).filter(Boolean);

  function updateActiveTab() {
    const scrollY = window.scrollY + window.innerHeight * 0.35;
    let activeSection = sections[0];
    sectionEls.forEach(el => {
      if (el.getBoundingClientRect().top + window.scrollY <= scrollY) {
        activeSection = el.dataset.name;
      }
    });
    document.querySelectorAll('.section-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.section === activeSection);
      tab.setAttribute('aria-selected', tab.dataset.section === activeSection);
    });
  }

  window.addEventListener('scroll', updateActiveTab, { passive: true });

  // ── SCROLL TO SECTION ─────────────────────────
  window.scrollToSection = function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 62;
    const tabH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--tabs-h')) || 48;
    const top = el.getBoundingClientRect().top + window.scrollY - navH - tabH - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  // ── MOBILE MENU ───────────────────────────────
  window.toggleMobileMenu = function () {
    document.getElementById('mobile-menu').classList.toggle('open');
  };
  window.closeMobileMenu = function () {
    document.getElementById('mobile-menu').classList.remove('open');
  };

  // ── INIT ──────────────────────────────────────
  renderAll();
  updateActiveTab();
})();
