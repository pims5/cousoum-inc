const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.navigation');
if (toggle && nav) {
  const closeMenu = (returnFocus) => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'Menu';
    if (returnFocus) toggle.focus();
  };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Fermer' : 'Menu';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) closeMenu(true);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760 && nav.classList.contains('is-open')) closeMenu(false);
  });
}
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
