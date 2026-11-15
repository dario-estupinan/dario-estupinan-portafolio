// Menú de celular, marcador de la sección activa y enlace de idioma que conserva la sección.
const menu = document.getElementById('menu');
const abrir = document.querySelector('[data-menu-abrir]');

abrir?.addEventListener('click', () => menu.showModal());
menu?.querySelector('[data-menu-cerrar]').addEventListener('click', () => menu.close());
menu?.addEventListener('click', e => { if (e.target.closest('a')) menu.close(); });

const enlaces = [...document.querySelectorAll('[data-nav] [data-seccion]')];
const idiomas = document.querySelectorAll('[data-idioma]');
const marcar = id => {
  for (const a of enlaces) a.dataset.seccion === id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
  for (const a of idiomas) a.href = a.dataset.base + (id ? '#' + id : '');
};

// La sección activa es la que cruza una línea a un tercio de la ventana.
const secciones = [...document.querySelectorAll('main section[id]')];
if (secciones.length) {
  const mira = new IntersectionObserver(entradas => {
    for (const e of entradas) if (e.isIntersecting) marcar(e.target.id === 'portada' ? '' : e.target.id);
  }, { rootMargin: '-33% 0px -66% 0px' });
  secciones.forEach(s => mira.observe(s));
}
