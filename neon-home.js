/* Homepage hero search integrates with Convertios' existing script.min.js suggestions. */
(() => {
  const form = document.getElementById('neonSearchForm');
  const input = document.getElementById('toolSearch');
  const results = document.getElementById('searchResults');
  if (!form || !input || !results) return;

  // Keep the existing tool catalog and localized routing; no duplicate search index.
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!input.value.trim()) { input.focus(); return; }
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const matches = Array.from(results.querySelectorAll('.search-item'));
    if (matches.length === 1) {
      matches[0].click();
    } else if (matches.length > 1) {
      results.style.display = 'block';
      results.setAttribute('role', 'listbox');
      matches[0].focus();
    } else {
      const lang = document.documentElement.lang.toLowerCase().split('-')[0];
      window.location.assign((lang === 'ar' ? '/ar/' : lang === 'es' ? '/es/' : lang === 'pt' ? '/pt-br/' : '/') + 'all-tools/');
    }
  });

  function makeResultsKeyboardAccessible() {
    results.querySelectorAll('.search-item').forEach((item) => {
      item.tabIndex = 0;
      item.setAttribute('role', 'option');
    });
  }
  const observer = new MutationObserver(makeResultsKeyboardAccessible);
  observer.observe(results, { childList: true });
  results.addEventListener('keydown', (event) => {
    const item = event.target.closest('.search-item');
    if (!item) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      item.click();
    }
  });
})();
