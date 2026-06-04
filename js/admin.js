// admin.js — studio dashboard logic

(function () {
  'use strict';

  const SECTION_LABELS = {
    fundamentals: 'Art Fundamentals',
    environments: 'Environment Concepts',
    characters: 'Character Concepts',
    fanarts: 'Fan Arts'
  };

  // Local working copy — starts from data.js, editable in session
  let portfolioData = JSON.parse(JSON.stringify(PORTFOLIO_DATA));
  let activeSection = 'fundamentals';
  let editingId = null;
  let toastTimer = null;

  // ── INIT ─────────────────────────────────────
  function init() {
    renderAdminGrid();
    updateCounts();
  }

  // ── SECTION SWITCHING ────────────────────────
  window.switchSection = function (btn) {
    document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeSection = btn.dataset.section;
    document.getElementById('admin-section-title').textContent = SECTION_LABELS[activeSection];
    renderAdminGrid();
  };

  // ── RENDER ADMIN GRID ────────────────────────
  function renderAdminGrid() {
    const grid = document.getElementById('admin-grid');
    const items = portfolioData[activeSection] || [];
    grid.innerHTML = '';

    document.getElementById('admin-empty').style.display = items.length === 0 ? 'block' : 'none';
    if (items.length === 0) {
      grid.appendChild(document.getElementById('admin-empty'));
      return;
    }

    items.forEach(item => {
      const card = createAdminCard(item);
      grid.appendChild(card);
    });
  }

  function createAdminCard(item) {
    const card = document.createElement('div');
    card.className = 'admin-card';
    card.dataset.id = item.id;
    card.innerHTML = `
      <div class="admin-thumb">
        <img src="${item.image}" alt="${item.title}">
        <div class="admin-thumb-overlay">
          <button class="admin-ctrl ctrl-edit" onclick="openEdit('${item.id}')" title="Edit">✎</button>
          <button class="admin-ctrl ctrl-delete" onclick="deleteItem('${item.id}')" title="Delete">✕</button>
        </div>
      </div>
      <div class="admin-card-label">
        <p class="admin-card-name" title="${item.title}">${item.title}</p>
        <p class="admin-card-meta">${item.meta || ''}</p>
      </div>
      <div class="admin-card-chips">
        <button class="chip ${item.featured ? 'on' : ''}" onclick="toggleFeatured('${item.id}')">
          ${item.featured ? '★ Featured' : '☆ Feature'}
        </button>
      </div>`;
    return card;
  }

  // ── TOGGLE FEATURED ──────────────────────────
  window.toggleFeatured = function (id) {
    const item = findItem(id);
    if (!item) return;
    item.featured = !item.featured;
    renderAdminGrid();
    toast(item.featured ? '✦ Marked as featured' : 'Removed from featured');
  };

  // ── DELETE ───────────────────────────────────
  window.deleteItem = function (id) {
    if (!confirm('Remove this artwork?')) return;
    portfolioData[activeSection] = portfolioData[activeSection].filter(i => i.id !== id);
    renderAdminGrid();
    updateCounts();
    toast('Artwork removed');
  };

  // ── EDIT MODAL ───────────────────────────────
  window.openEdit = function (id) {
    const item = findItem(id);
    if (!item) return;
    editingId = id;
    document.getElementById('edit-preview').src = item.image;
    document.getElementById('edit-title').value = item.title;
    document.getElementById('edit-meta').value = item.meta || '';
    document.getElementById('edit-section').value = activeSection;
    document.getElementById('edit-featured').checked = !!item.featured;
    document.getElementById('edit-modal').classList.add('open');
  };

  window.closeEditModal = function () {
    document.getElementById('edit-modal').classList.remove('open');
    editingId = null;
  };

  window.saveEdit = function () {
    const item = findItem(editingId);
    if (!item) return;
    const newSection = document.getElementById('edit-section').value;

    item.title = document.getElementById('edit-title').value.trim() || item.title;
    item.meta = document.getElementById('edit-meta').value.trim();
    item.featured = document.getElementById('edit-featured').checked;

    // Move to new section if changed
    if (newSection !== activeSection) {
      portfolioData[activeSection] = portfolioData[activeSection].filter(i => i.id !== editingId);
      portfolioData[newSection].push(item);
      updateCounts();
    }

    closeEditModal();
    renderAdminGrid();
    toast('Saved ✓');
  };

  // ── FILE UPLOAD ──────────────────────────────
  window.handleFiles = function (files) {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = e => {
        const id = 'art_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
        const name = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
        const item = {
          id,
          title: name,
          meta: 'Digital · 2024',
          image: e.target.result, // base64 for preview — replace with real path after adding to repo
          featured: false
        };
        portfolioData[activeSection].push(item);
        renderAdminGrid();
        updateCounts();
        toast('Uploaded: ' + name);
      };
      reader.readAsDataURL(file);
    });
  };

  // ── DRAG & DROP ──────────────────────────────
  window.handleDragOver = function (e) {
    e.preventDefault();
    document.getElementById('upload-zone').classList.add('dragover');
  };
  window.handleDragLeave = function () {
    document.getElementById('upload-zone').classList.remove('dragover');
  };
  window.handleDrop = function (e) {
    e.preventDefault();
    document.getElementById('upload-zone').classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  };

  // ── EXPORT DATA.JS ───────────────────────────
  window.exportData = function () {
    // Strip base64 previews — remind user to replace with real paths
    const exportCopy = {};
    Object.keys(portfolioData).forEach(sec => {
      exportCopy[sec] = portfolioData[sec].map(item => {
        const out = { ...item };
        if (out.image && out.image.startsWith('data:')) {
          out.image = 'images/' + sec + '/' + out.id + '.jpg';
          out._note = 'Replace image path with the actual file path in your repo';
        }
        return out;
      });
    });

    const output = `// ─────────────────────────────────────────────
//  data.js  —  aswin draws portfolio data
//  Generated by Studio Dashboard
// ─────────────────────────────────────────────

const PORTFOLIO_DATA = ${JSON.stringify(exportCopy, null, 2)};
`;
    document.getElementById('export-textarea').value = output;
    document.getElementById('export-panel').style.display = 'block';
    document.getElementById('export-panel').scrollIntoView({ behavior: 'smooth' });
  };

  window.copyExport = function () {
    const ta = document.getElementById('export-textarea');
    ta.select();
    document.execCommand('copy');
    toast('Copied to clipboard ✓');
  };

  // ── HELPERS ──────────────────────────────────
  function findItem(id) {
    for (const sec of Object.keys(portfolioData)) {
      const item = portfolioData[sec].find(i => i.id === id);
      if (item) return item;
    }
    return null;
  }

  function updateCounts() {
    Object.keys(portfolioData).forEach(sec => {
      const el = document.getElementById('count-' + sec);
      if (el) el.textContent = portfolioData[sec].length;
    });
  }

  let toastTimerRef = null;
  window.toast = function (msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimerRef);
    toastTimerRef = setTimeout(() => t.classList.remove('show'), 2400);
  };

  // ── START ────────────────────────────────────
  init();
})();
