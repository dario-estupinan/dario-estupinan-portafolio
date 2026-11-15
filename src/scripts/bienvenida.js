// Retira la bienvenida al terminar su animación o al primer toque o tecla.
const raiz = document.documentElement, capa = document.querySelector('[data-bienvenida]');
if (capa && raiz.hasAttribute('data-bienvenida')) {
  const quitar = () => { raiz.removeAttribute('data-bienvenida'); removeEventListener('keydown', quitar); };
  capa.addEventListener('click', quitar);
  addEventListener('keydown', quitar);
  capa.addEventListener('animationend', e => { if (e.animationName.startsWith('fuera') || e.target === capa) quitar(); });
}
