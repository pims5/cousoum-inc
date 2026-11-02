(() => {
  'use strict';

  document.querySelectorAll('[data-cyber-accordion]').forEach((root) => {
    root.querySelectorAll('button[aria-controls]').forEach((button) => {
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      if (!panel) return;

      button.setAttribute('aria-expanded', String(!panel.hidden));
      button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!expanded));
        panel.hidden = expanded;
      });
    });
  });
})();
