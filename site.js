const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.navigation');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Fermer' : 'Menu';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'Menu';
  }));
}
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
