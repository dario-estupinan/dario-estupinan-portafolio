import { crearFenix, poseBienvenida } from './fenix.js';

// Retira la bienvenida al terminar su animación o al primer toque o tecla.
const raiz = document.documentElement, capa = document.querySelector('div[data-bienvenida]');
if (capa && raiz.hasAttribute('data-bienvenida')) {
  const quitar = () => { raiz.removeAttribute('data-bienvenida'); removeEventListener('keydown', quitar); };
  capa.addEventListener('click', quitar);
  addEventListener('keydown', quitar);
  // El fénix sigue el reloj de la animación CSS que retira la capa: así el vuelo y el iris no se desfasan.
  const reloj = capa.getAnimations().find(a => a.animationName?.startsWith('fuera'));
  if (reloj) {
    const pinta = crearFenix(capa.querySelector('canvas'));
    const paso = () => { if (raiz.hasAttribute('data-bienvenida')) { pinta(poseBienvenida(reloj.currentTime)); requestAnimationFrame(paso); } };
    paso();
  }
  capa.addEventListener('animationend', e => { if (e.animationName.startsWith('fuera') || e.target === capa) quitar(); });
}
