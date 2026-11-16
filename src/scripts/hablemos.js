// El fénix de la sección Contacto: llega volando cuando la sección entra en pantalla, y de nuevo cada vez
// que se toca un botón «Hablemos» (enlaces a #contacto). Sigue al cursor o al dedo y aletea al tocarlo.
import { crearFenix, poseContacto } from './fenix.js';

const lienzo = document.querySelector('#contacto canvas');
if (lienzo) {
  const calmado = !document.documentElement.hasAttribute('data-animar');   // lo decide /bienvenida-pre.js
  const pinta = crearFenix(lienzo), limita = v => Math.max(-1, Math.min(1, v));
  let inicio = 0, llega = true, visible = false, mx = 0, my = 0, sx = 0, sy = 0, imp = 0, golpe = 0, cuadro = 0;

  const paso = ms => {
    if (llega) { inicio = ms; llega = false; }
    // Con movimiento reducido el ave ya está en su sitio y solo se mueve cuando la tocan.
    const p = poseContacto(calmado && !imp ? 1e4 : ms - inicio, { x: 0.5, y: 0.52, e: 1 });
    sx += (mx - sx) * 0.08; sy += (my - sy) * 0.08; imp *= 0.96; if (imp < 0.02) imp = 0;
    p.x += sx * 0.04; p.y += sy * 0.03; p.giro = sx * 0.2; p.mx = sx; p.my = sy;   // se inclina y mira hacia el cursor
    p.amp += imp * 0.6; p.fase += (golpe += imp * 0.3); if (imp > 0.5) p.brasa = 4;   // al tocarla aletea fuerte y suelta brasas
    pinta(p);
    cuadro = visible && (!calmado || imp) ? requestAnimationFrame(paso) : 0;
  };
  const arranca = () => { if (visible && !cuadro) cuadro = requestAnimationFrame(paso); };

  new IntersectionObserver(e => { visible = e[0].isIntersecting; arranca(); }, { threshold: 0.4 }).observe(lienzo);
  document.addEventListener('click', e => { if (e.target.closest('a[href$="#contacto"]')) { llega = true; arranca(); } });
  addEventListener('pointermove', e => {
    const q = lienzo.getBoundingClientRect();
    mx = limita((e.clientX - q.left - q.width / 2) / (innerWidth * 0.45)); my = limita((e.clientY - q.top - q.height / 2) / (innerHeight * 0.45));
  }, { passive: true });
  lienzo.addEventListener('pointerdown', () => { imp = 1; arranca(); });
  addEventListener('resize', arranca);
}
