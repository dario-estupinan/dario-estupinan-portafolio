// Mascota hecha de letras. Se dibuja en un lienzo oculto de 84×31 píxeles (uno por letra)
// y cada píxel se convierte en un carácter. Canal rojo = densidad; canal verde = capa de acento.

export const COLS = 84, FILAS = 31, NOMBRES = ['ojo', 'datos', 'gato'];   // la primera es la de partida
const W = 100, H = 62, RAMPA = ' .:=+*#@', CLAVE = 'mascota';

export function aLetras(pixeles, cols, filas) {
  let tinta = '', acento = '';
  for (let j = 0; j < filas; j++) {
    for (let i = 0; i < cols; i++) {
      const k = (j * cols + i) * 4;
      const letra = RAMPA[Math.round((pixeles[k] / 255) * (pixeles[k + 3] / 255) * 7)];
      if (pixeles[k + 1] > 127) { tinta += ' '; acento += letra; } else { tinta += letra; acento += ' '; }
    }
    tinta += '\n'; acento += '\n';
  }
  return { tinta, acento };
}

// s: { x, y } mirada en [-1, 1] · ab: apertura del ojo (1 abierto) · t: segundos · imp: impulso tras un toque (1 → 0) · gesto
function dibujos(g) {
  const tin = d => `rgb(${(d * 255) | 0},0,0)`, ace = d => `rgb(${(d * 255) | 0},255,0)`;
  const circ = (x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const elip = (x, y, rx, ry, rot = 0, a = 0, b = 7) => { g.beginPath(); g.ellipse(x, y, rx, ry, rot, a, b); g.fill(); };
  const rr = (x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); g.fill(); };
  const lin = (...p) => { g.beginPath(); g.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) g.lineTo(p[i], p[i + 1]); g.stroke(); };
  const hueco = f => { g.globalCompositeOperation = 'destination-out'; f(); g.globalCompositeOperation = 'source-over'; };
  const pupila = (x, y, r, s) => {
    hueco(() => circ(x, y, r)); g.fillStyle = g.strokeStyle = tin(1);
    if (s.ab < 0.35) { g.lineWidth = 1; lin(x - r, y, x + r, y); } else circ(x + s.x * r * 0.5, y + s.y * r * 0.45, r * 0.55);
  };

  return {
    datos(s) {
      g.lineCap = 'round'; g.lineJoin = 'round';
      // Gráfico: eje y cinco barras que cambian con la mirada
      g.strokeStyle = tin(1); g.lineWidth = 1.4; lin(60, 8, 60, 56, 99, 56);
      g.fillStyle = ace(1);
      for (let i = 0; i < 5; i++) {
        const h = 9 + 36 * (0.5 + 0.5 * Math.sin(i * 1.15 + s.x * 2.8 + s.t * 0.7 + s.imp * 6));
        g.fillRect(64 + i * 7, 55 - h, 5, h);
      }
      // Persona: sudadera, cuello, cara limpia, pelo, audífonos
      const cx = 30;
      g.fillStyle = tin(0.45); g.strokeStyle = tin(1); g.lineWidth = 1.6;
      g.beginPath(); g.moveTo(cx - 29, 63); g.lineTo(cx - 25, 47); g.quadraticCurveTo(cx, 37, cx + 25, 47); g.lineTo(cx + 29, 63); g.fill(); g.stroke();
      g.fillStyle = tin(0.3); g.fillRect(cx - 4, 35, 8, 7);
      hueco(() => elip(cx, 23, 11.5, 13.5)); g.beginPath(); g.ellipse(cx, 23, 11.5, 13.5, 0, 0, 7); g.stroke();
      g.fillStyle = tin(1); elip(cx, 18.5, 12.4, 9.5, 0, Math.PI, 2 * Math.PI);
      for (const x of [cx - 4.8, cx + 4.8]) {
        if (s.ab < 0.35) { g.lineWidth = 1.2; lin(x - 2, 25, x + 2, 25); } else circ(x + s.x * 1.3, 25 + s.y * 1.1, 1.9);
      }
      g.lineWidth = 1.4; g.beginPath(); g.arc(cx, 29.5, 3.6, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke();
      g.strokeStyle = ace(1); g.lineWidth = 2.6; g.beginPath(); g.arc(cx, 22, 14.4, 1.1 * Math.PI, 1.9 * Math.PI); g.stroke();
      g.fillStyle = ace(1); rr(cx - 16.4, 19.5, 4.8, 10, 2); rr(cx + 11.6, 19.5, 4.8, 10, 2);
      // Brazo: señala el gráfico; con el gesto «saluda» o tras un toque, se levanta y se mueve
      const sube = s.gesto === 'saluda' || s.imp ? Math.sin(s.t * 9) * 3 - 10 : 0;
      g.strokeStyle = tin(1); g.lineWidth = 3.6; lin(cx + 18, 50, 57, 41 + s.y * 3 + sube);
    },

    gato(s) {
      g.lineCap = 'round'; g.lineJoin = 'round';
      g.fillStyle = ace(0.22); rr(22, 27, 56, 27, 2); g.strokeStyle = ace(1); g.lineWidth = 2; g.stroke();
      g.fillStyle = ace(1); g.fillRect(46, 54, 8, 4.5); rr(36, 58, 28, 2.6, 1);
      g.lineWidth = 1.5;
      [30, 18, 36, 24, 14].forEach((l, i) => lin(27, 32 + i * 4.4, 27 + (i === 4 ? l * (0.3 + 0.7 * ((s.t * 0.6) % 1)) : l), 32 + i * 4.4));
      const b = s.t ? Math.sin(s.t * (2 + s.imp * 6)) : s.x;
      g.strokeStyle = tin(1); g.lineWidth = 2.8; g.beginPath(); g.moveTo(30, 21); g.quadraticCurveTo(21 + b * 5, 33, 25 + b * 10, 45); g.stroke();
      g.lineWidth = 1.6; g.fillStyle = tin(0.52); elip(48, 19, 21, 8.5); g.stroke(); circ(66, 13, 7.6); g.stroke();
      g.fillStyle = tin(1);
      g.beginPath(); g.moveTo(59.5, 9); g.lineTo(61, 1.5); g.lineTo(65.5, 6.4); g.fill();
      g.beginPath(); g.moveTo(66.8, 6.2); g.lineTo(71.2, 1.5); g.lineTo(72.6, 9); g.fill();
      circ(57, 27, 2.1); circ(63, 27, 2.1); circ(66.2, 15.6, 0.9);
      pupila(63, 12.4, 2.3, s); pupila(69.2, 12.4, 2.3, s);
    },

    ojo(s) {
      g.translate(50, 34); g.scale(0.9, 0.9); g.translate(-50, -31);   // deja sitio arriba: las pestañas se salían del lienzo
      const k = 37 * Math.max(0.03, s.ab);
      const almendra = () => { g.beginPath(); g.moveTo(4, 31); g.quadraticCurveTo(50, 31 - k * 1.7, 96, 31); g.quadraticCurveTo(50, 31 + k * 1.55, 4, 31); g.closePath(); };
      g.strokeStyle = tin(1); g.lineWidth = 1.8; g.lineCap = 'round';
      for (const [a, b, c, d] of [[18, 12, 13, 5], [33, 5, 30, -1], [50, 2.5, 50, -3], [67, 5, 70, -1], [82, 12, 87, 5]]) lin(a, b + (1 - s.ab) * 14, c, d + (1 - s.ab) * 14);
      g.save(); almendra(); g.clip();
      g.fillStyle = tin(0.14); g.fillRect(0, 0, W, H);
      const ix = 50 + s.x * 21, iy = 31 + s.y * 7;
      g.fillStyle = ace(0.72); circ(ix, iy, 18); g.strokeStyle = ace(1); g.lineWidth = 1.6; g.beginPath(); g.arc(ix, iy, 18, 0, 7); g.stroke();
      g.lineWidth = 1.2;
      for (let n = 0; n < 12; n++) { const a = (n * Math.PI) / 6; lin(ix + Math.cos(a) * 10, iy + Math.sin(a) * 10, ix + Math.cos(a) * 16, iy + Math.sin(a) * 16); }
      hueco(() => circ(ix, iy, 9)); g.fillStyle = tin(1); circ(ix, iy, 7); hueco(() => circ(ix - 2.6, iy - 2.6, 2));
      g.restore(); almendra(); g.strokeStyle = tin(1); g.lineWidth = 2.2; g.stroke();
    },
  };
}

// Dibuja un cuadro y devuelve las dos capas de texto.
export function crearMotor() {
  const lienzo = document.createElement('canvas'); lienzo.width = COLS; lienzo.height = FILAS;
  const g = lienzo.getContext('2d', { willReadFrequently: true }), d = dibujos(g);
  return (nombre, s) => {
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, COLS, FILAS); g.setTransform(COLS / W, 0, 0, FILAS / H, 0, 0);
    d[nombre](s);
    return aLetras(g.getImageData(0, 0, COLS, FILAS).data, COLS, FILAS);
  };
}

// El almacenamiento puede estar bloqueado (modo privado): nunca debe romper la página.
const leer = () => { try { return localStorage.getItem(CLAVE); } catch { return null; } };
const guardar = v => { try { localStorage.setItem(CLAVE, v); } catch { /* sin almacenamiento: la elección dura lo que la página */ } };

export function montarMascota(raiz) {
  const calmado = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [tinta, acento] = raiz.querySelectorAll('pre'), marco = tinta.parentElement;
  const rotulo = raiz.querySelector('[data-rotulo]'), boton = raiz.querySelector('[data-cambiar]');
  const nombres = JSON.parse(raiz.dataset.nombres);            // { datos: 'Ing. de datos', … } ya traducidos
  const motor = crearMotor(), s = { x: 0, y: 0, ab: 1, t: 0, imp: 0, gesto: raiz.dataset.gesto || '' };
  let cual = NOMBRES.includes(leer()) ? leer() : NOMBRES[0], tx = 0, ty = 0, cierra = 0, ultimo = -1e9, visible = true, cuadro = 0, vivo = true;

  const rotula = () => {
    const n = String(NOMBRES.indexOf(cual) + 1).padStart(2, '0');
    if (rotulo) rotulo.textContent = `Fig. ${n} — ${nombres[cual]}`;
    marco.setAttribute('aria-label', `${raiz.dataset.etiqueta}: ${nombres[cual]}`);
  };
  const cambiar = nombre => { cual = nombre; guardar(nombre); rotula(); document.dispatchEvent(new CustomEvent('mascota', { detail: nombre })); };
  const alCambiar = e => { if (e.detail !== cual) { cual = e.detail; rotula(); } };

  // Windows redondea el ancho de cada letra a píxeles enteros: se mide una fila real y se escala para que quepa justa.
  const ajusta = () => {
    const px = Math.max(6, Math.floor(marco.clientWidth / COLS) / 0.6);
    const m = document.createElement('span'); m.textContent = '0'.repeat(COLS);
    m.style.cssText = `position:absolute;visibility:hidden;white-space:pre;font:700 ${px}px/1 ${getComputedStyle(tinta).fontFamily}`;
    document.body.append(m);
    const ancho = m.getBoundingClientRect().width, k = Math.min(marco.clientWidth / ancho, marco.clientHeight / (FILAS * px)); m.remove();
    // Centrado: el bloque de letras rara vez llena el marco en las dos direcciones.
    const dx = (marco.clientWidth - ancho * k) / 2, dy = (marco.clientHeight - FILAS * px * k) / 2;
    for (const e of [tinta, acento]) { e.style.fontSize = px + 'px'; e.style.transform = `translate(${dx}px, ${dy}px) scale(${k})`; }
  };

  const alMover = e => {
    const q = raiz.getBoundingClientRect();
    tx = Math.max(-1, Math.min(1, (e.clientX - q.left - q.width / 2) / (innerWidth * 0.45)));
    ty = Math.max(-1, Math.min(1, (e.clientY - q.top - q.height / 2) / (innerHeight * 0.45)));
    ultimo = performance.now();
  };
  const alTocar = () => { if (!cierra) cierra = 1; s.imp = 1; };
  const paso = ms => {
    if (!vivo) return;
    if (visible) {
      if (!calmado && ms - ultimo > 3000) { tx = Math.sin(ms / 1700) * 0.7; ty = Math.sin(ms / 2300) * 0.5; }   // mira por su cuenta
      s.x += (tx - s.x) * 0.14; s.y += (ty - s.y) * 0.14; s.imp *= 0.975; if (s.imp < 0.02) s.imp = 0;
      if (cierra) { s.ab -= cierra * 0.2; if (s.ab <= 0) { s.ab = 0; cierra = -1; } else if (s.ab >= 1) { s.ab = 1; cierra = 0; } }
      s.t = calmado && !s.imp ? 0 : ms / 1000;                 // con movimiento reducido solo se mueve al tocarla
      const capas = motor(cual, s); tinta.textContent = capas.tinta; acento.textContent = capas.acento;
    }
    cuadro = requestAnimationFrame(paso);
  };

  const mira = new IntersectionObserver(e => { visible = e[0].isIntersecting; });
  const mide = new ResizeObserver(ajusta);
  mira.observe(raiz); mide.observe(marco); document.fonts.ready.then(ajusta);
  addEventListener('pointermove', alMover, { passive: true });
  document.addEventListener('mascota', alCambiar);
  marco.addEventListener('click', alTocar);
  boton?.addEventListener('click', () => cambiar(NOMBRES[(NOMBRES.indexOf(cual) + 1) % NOMBRES.length]));
  const parpadeo = setInterval(() => { if (!calmado && !cierra && Math.random() < 0.5) cierra = 1; }, 3400);
  raiz.dataset.lista = '';
  rotula(); cuadro = requestAnimationFrame(paso);

  return {
    cambiar,
    destruir() {
      vivo = false; cancelAnimationFrame(cuadro); clearInterval(parpadeo); mira.disconnect(); mide.disconnect();
      removeEventListener('pointermove', alMover); document.removeEventListener('mascota', alCambiar);
    },
  };
}
