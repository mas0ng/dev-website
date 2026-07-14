(function () {
  const suggestion = document.getElementById('main-page-suggestion');
  const link = document.getElementById('main-page-suggestion-link');
  const title = document.getElementById('main-page-suggestion-title');
  const urlLabel = document.getElementById('main-page-suggestion-url');
  if (!suggestion || !link || !title || !urlLabel) return;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 4500);
  const endpoint = `https://mas0ng.com/search-api/main-page?path=${encodeURIComponent(window.location.pathname)}`;

  fetch(endpoint, { method: 'GET', mode: 'cors', credentials: 'omit', signal: controller.signal })
    .then((response) => response.ok ? response.json() : null)
    .then((result) => {
      if (!result?.available || typeof result.title !== 'string' || typeof result.url !== 'string') return;
      const target = new URL(result.url);
      if (target.origin !== 'https://mas0ng.com') return;
      title.textContent = result.title;
      urlLabel.textContent = target.href;
      link.href = target.href;
      suggestion.hidden = false;
    })
    .catch(() => undefined)
    .finally(() => window.clearTimeout(timeout));
})();
