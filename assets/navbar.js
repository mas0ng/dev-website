document.addEventListener('DOMContentLoaded', () => {
  const siteMain = document.getElementById('site-main');
  if (!siteMain) return;
  
  const header = document.createElement('header');
  header.className = 'dev-nav';
  header.setAttribute('aria-label', 'Developer site navigation');
  header.innerHTML = `
    <a class="dev-nav__brand" href="/" aria-label="dev.mas0ng.com home">
      <span>dev.mas0ng.com</span>
    </a>
    <nav class="dev-nav__links" aria-label="Sections">
      <a href="/releases/">Releases</a>
      <a href="https://mas0ng.com/legal/privacy/">Privacy</a>
      <a href="https://mas0ng.com/legal/security?reportModalPopup=true" class="dev-nav__link--red">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; vertical-align: -2px; display: inline-block;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        Report a Security Issue
      </a>
    </nav>
  `;
  siteMain.insertBefore(header, siteMain.firstChild);
});
