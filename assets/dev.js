(function () {
  const state = {
    releases: [],
    filter: 'all',
    query: ''
  };

  const grid = document.getElementById('release-grid');
  const latest = document.getElementById('latest-release');
  const search = document.getElementById('release-search');
  const filters = Array.from(document.querySelectorAll('[data-filter]'));
  const COOKIE_KEY = 'mas0ngDevCookieConsent';

  boot();

  async function boot() {
    initMobileBlock();
    if (grid || latest) {
      await loadReleases();
      bindControls();
      render();
    }
    initCookieBanner();
  }

  function initMobileBlock() {
    const siteMain = document.getElementById('site-main');
    if (!siteMain) return;

    if (document.querySelector('.mobile-block-screen')) return;

    const block = document.createElement('div');
    block.className = 'mobile-block-screen';
    block.style.display = 'none';
    block.innerHTML = `
      <div class="dev-hero" style="max-width: 440px; padding: 48px 24px; text-align: center; min-height: auto; margin: 0 auto;">
        <div class="dev-hero__copy">
          <h1 style="font-size: 1.8rem; margin: 0 0 16px; line-height: 1.3;">Mobile Access Unavailable</h1>
          <p style="color: rgba(255, 255, 255, 0.85); margin: 0; font-size: 0.95rem; line-height: 1.6;">
            dev.mas0ng.com is currently not optimized for mobile browsers. Please access this site from a desktop device.
          </p>
        </div>
      </div>
      <a href="https://mas0ng.com/legal/security?reportModalPopup=true" class="nav-pill nav-pill--red" style="margin-top: 24px; display: inline-flex;">
        Report Security Issue
      </a>
    `;
    siteMain.appendChild(block);
  }

  async function loadReleases() {
    const source = grid?.dataset.releasesSrc || latest?.dataset.releasesSrc || 'releases.json';

    try {
      const response = await fetch(new URL(source, window.location.href), { cache: 'default' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      state.releases = Array.isArray(data.releases) ? data.releases : [];
    } catch (error) {
      console.warn('Failed to load dev releases:', error);
      state.releases = [];
    }
  }

  function bindControls() {
    search?.addEventListener('input', () => {
      state.query = search.value.trim().toLowerCase();
      renderCards();
    });

    filters.forEach((button) => {
      button.addEventListener('click', () => {
        state.filter = button.dataset.filter || 'all';
        filters.forEach((item) => item.classList.toggle('is-active', item === button));
        renderCards();
      });
    });
  }

  function render() {
    renderLatest();
    renderCards();
  }

  function renderLatest() {
    if (!latest) return;
    const item = state.releases[0];
    if (!item) {
      latest.innerHTML = '<p class="dev-terminal__muted">No releases have been published yet.</p>';
      return;
    }

    latest.innerHTML = `
      <h2>${escapeHtml(item.title)}</h2>
      <p>${escapeHtml(item.summary)}</p>
      <div class="dev-terminal__meta">
        <span class="dev-chip">${escapeHtml(item.version || 'release')}</span>
        <span class="dev-chip">${escapeHtml(item.date || 'undated')}</span>
        <span class="dev-chip">${escapeHtml(item.type || 'code')}</span>
      </div>
    `;
  }

  function renderCards() {
    if (!grid) return;
    const items = state.releases.filter(matchesState);

    if (!items.length) {
      grid.innerHTML = `
        <article class="dev-card dev-card--empty">
          <div>
            <h3>No matching releases</h3>
            <p>Try a different search or filter.</p>
          </div>
        </article>
      `;
      return;
    }

    grid.innerHTML = items.map(renderCard).join('');
  }

  function matchesState(item) {
    const typeMatches = state.filter === 'all' || item.type === state.filter;
    if (!typeMatches) return false;
    if (!state.query) return true;

    const haystack = [
      item.title,
      item.summary,
      item.version,
      item.status,
      item.type,
      ...(item.tags || [])
    ].join(' ').toLowerCase();

    return haystack.includes(state.query);
  }

  function renderCard(item) {
    const tags = (item.tags || []).map((tag) => `<span class="dev-card__tag">${escapeHtml(tag)}</span>`).join('');
    const links = (item.links || []).map((link) => {
      const href = safeHref(link.href);
      const external = href.startsWith('http');
      const target = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a class="dev-card__link" href="${href}"${target}>${escapeHtml(link.label || 'Open')}</a>`;
    }).join('');

    return `
      <article class="dev-card">
        <div class="dev-card__top">
          <span class="dev-card__type">${escapeHtml(item.type || 'release')}</span>
          <span class="dev-card__status">${escapeHtml(item.status || 'active')}</span>
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <div class="dev-card__meta">
          <span>${escapeHtml(item.version || 'v0')}</span>
          <span>${escapeHtml(item.date || 'undated')}</span>
        </div>
        <p>${escapeHtml(item.summary)}</p>
        ${tags ? `<div class="dev-card__tags">${tags}</div>` : ''}
        ${links ? `<div class="dev-card__links">${links}</div>` : ''}
      </article>
    `;
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]);
  }

  function safeHref(value) {
    const href = String(value || '#').trim();
    if (!href) return '#';
    if (href.startsWith('/') || href.startsWith('#')) return href;
    if (/^https?:\/\//i.test(href)) return href;
    return '#';
  }

  function initCookieBanner() {
    let banner = document.getElementById('cookie-banner');
    if (!banner) {
      const siteMain = document.getElementById('site-main');
      if (!siteMain) return;

      banner = document.createElement('div');
      banner.id = 'cookie-banner';
      banner.className = 'cookie-banner';
      banner.hidden = true;
      banner.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <h2 style="margin: 0; font-size: 1.1rem;">Privacy & Preferences</h2>
        </div>
        <p style="margin: 6px 0 12px; font-size: 0.88rem; line-height: 1.5; color: #cbd5e1;">
          We do not use tracking or analytical cookies. We only save your site preferences locally on your browser storage.
        </p>
        <div class="cookie-banner__options">
          <div style="font-size: 0.85rem; color: #cbd5e1; font-weight: 700;">Essential Preferences (LocalStorage)</div>
          <div style="font-size: 0.85rem; color: #64748b; font-weight: 700;">Third-Party Cookies (None Used)</div>
        </div>
        <div class="cookie-banner__actions" style="margin-top: 8px;">
          <a href="https://mas0ng.com/legal/privacy/" style="font-size: 0.8rem; color: #cbd5e1; align-self: center; margin-right: auto; text-decoration: underline; font-weight: 500;">Privacy Policy</a>
          <button data-cookie-ok class="dev-button" style="padding: 6px 16px; min-height: auto; font-size: 0.82rem; border-radius: 6px; cursor: pointer;">Got it</button>
        </div>
      `;
      siteMain.appendChild(banner);
    }

    const openButtons = Array.from(document.querySelectorAll('[data-cookie-open]'));
    const okButton = banner.querySelector('[data-cookie-ok]');

    const saved = readCookieChoice();
    if (!saved) {
      banner.hidden = false;
    }

    openButtons.forEach((button) => {
      button.addEventListener('click', () => {
        banner.hidden = false;
        okButton?.focus({ preventScroll: true });
      });
    });

    okButton?.addEventListener('click', () => {
      saveCookieChoice();
      banner.hidden = true;
    });
  }

  function readCookieChoice() {
    try {
      const raw = window.localStorage.getItem(COOKIE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveCookieChoice() {
    try {
      window.localStorage.setItem(COOKIE_KEY, JSON.stringify({
        noticeSeen: true,
        savedAt: new Date().toISOString(),
        version: 1
      }));
    } catch {
      // If storage is blocked, keep the site usable and simply dismiss for this page view.
    }
  }
})();
