document.addEventListener('DOMContentLoaded', () => {
  const siteMain = document.getElementById('site-main');
  if (!siteMain) return;

  const footer = document.createElement('footer');
  footer.className = 'dev-footer';
  footer.innerHTML = `
    <div class="dev-footer__brand-group">
      <a class="dev-footer__brand" href="/" aria-label="dev.mas0ng.com home">
        <span>dev.mas0ng.com</span>
      </a>
    </div>
    <div class="dev-footer__columns">
      <div class="dev-footer__col">
        <div class="dev-footer__section-title">Software</div>
        <a href="/releases/">Releases</a>
        <a href="https://github.com/mas0ng" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
      <div class="dev-footer__col">
        <div class="dev-footer__section-title">Legal</div>
        <a href="https://mas0ng.com/legal/privacy/">Privacy Policy</a>
        <a href="https://mas0ng.com/legal/licences/">Licence Info</a>
      </div>
      <div class="dev-footer__col">
        <div class="dev-footer__section-title">Security</div>
        <a href="https://mas0ng.com/legal/security?reportModalPopup=true">Report Security</a>
        <a href="https://mas0ng.com/">Main Site</a>
      </div>
    </div>
  `;
  
  const mobileScreen = siteMain.querySelector('.mobile-block-screen');
  if (mobileScreen) {
    siteMain.insertBefore(footer, mobileScreen);
  } else {
    siteMain.appendChild(footer);
  }
});
