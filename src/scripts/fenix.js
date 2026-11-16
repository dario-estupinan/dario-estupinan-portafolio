// Fénix en semitono. Igual que la mascota de letras: se dibuja en un lienzo oculto con un píxel por punto
// y cada píxel se pinta como un punto. Alfa = densidad (radio del punto); canal verde = calor (color del fuego).

const suave = x => x * x * (3 - 2 * x);
const mezcla = (a, b, v) => a + (b - a) * v;
export const tramo = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));

// Punto del fondo hacia el que se aleja y desde el que vuelve (fracciones de la ventana; e = escala).
// La bienvenida cierra su iris en este mismo punto: ver @keyframes fuera en Bienvenida.astro.
export const FUGA = { x: 0.74, y: 0.26, e: 0.04 };
const RITMO = 0.0138;   // radianes de aleteo por milisegundo en vuelo (≈ 2,2 aleteos por segundo)

// Las alas se mueven como medio + amp · cos(fase): altas y casi quietas al nacer o planear, amplias en vuelo.
// Bienvenida (2,5 s en total): nace a un costado, visto de lado (0,1–0,8 s), y cruza la pantalla alejándose al fondo (0,7–2 s).
// perfil: las dos alas se dibujan del mismo lado del cuerpo (la de atrás, más chica) y giro lo acuesta: se ve de costado, volando hacia arriba a la derecha.
export function poseBienvenida(ms) {
  const v = suave(tramo(ms, 700, 2000)), vuela = tramo(ms, 500, 800);
  return {
    nace: tramo(ms, 100, 800), x: mezcla(0.26, FUGA.x, v), y: mezcla(0.52, FUGA.y, v), e: mezcla(0.8, FUGA.e, v), perfil: true, giro: 1.1,
    medio: mezcla(1.1, 0.35, vuela), amp: mezcla(0.1, 0.85, vuela), fase: ms * RITMO, brasa: v > 0 && v < 1 ? 1 : 0.2,
  };
}

// Contacto: llega desde el fondo de su recuadro hasta `destino` en 1,1 s y se queda planeando.
export function poseContacto(ms, destino) {
  const v = suave(tramo(ms, 0, 1100)), planea = tramo(ms, 900, 1600);
  return {
    nace: 1, x: destino.x, y: mezcla(0.3, destino.y, v) + Math.sin(ms / 700) * 0.012 * v, e: mezcla(FUGA.e, destino.e, v),
    medio: mezcla(0.35, 0.7, planea), amp: mezcla(0.85, 0.32, planea), fase: Math.min(ms, 1100) * RITMO + Math.max(0, ms - 1100) / 420,
    brasa: v < 1 ? 1 : 0.25,
  };
}

// El ave, de frente, en unidades propias: cabe en ±1,5 de ancho y de −1,5 a 1,35 de alto.
// p.mx / p.my (−1…1): hacia dónde mira la cabeza.
function ave(g, p) {
  const t = performance.now() / 1000, calor = (h, a) => `rgba(255,${Math.round(h * 255)},0,${a})`;
  const raya = (x0, y0, x1, y1) => { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); };
  // Pluma: trazo que se enfría y se desvanece hacia la punta; al pasar a puntos, la punta se deshace.
  const pluma = (x, y, d, largo, ancho, h, tono) => {
    const ex = x + Math.cos(d) * largo, ey = y - Math.sin(d) * largo, deg = g.createLinearGradient(x, y, ex, ey);
    deg.addColorStop(0.2, calor(h, tono)); deg.addColorStop(1, calor(0, 0));
    g.strokeStyle = deg; g.lineWidth = ancho; raya(x, y, ex, ey);
  };

  // Cola: cintas que ondean; la onda baja por cada una.
  for (let i = 0; i < 7; i++) {
    const c = i / 3 - 1; let x = 0, y = 0.34;
    for (let n = 1; n <= 10; n++) {
      const s = n / 10, nx = c * 0.36 * s + 0.1 * s * Math.sin(t * 2.4 - s * 4.5 + i * 1.3), ny = 0.34 + s * (1 - 0.3 * Math.abs(c));
      g.strokeStyle = calor(0.85 - 0.8 * s, 1 - 0.75 * s); g.lineWidth = 0.075 * (1 - 0.6 * s); raya(x, y, nx, ny); x = nx; y = ny;
    }
  }

  // Alas: tres huesos (brazo, antebrazo, mano); cada uno va un poco detrás del anterior, así el ala ondula como una tela.
  const LARGOS = [0.26, 0.3, 0.3], ang = i => p.medio + p.amp * Math.cos(p.fase - i * 0.55), abre = 1.25 + 0.45 * Math.sin(ang(0));
  for (const lado of p.perfil ? [-0.75, -1] : [1, -1]) {
    g.save(); g.scale(lado, Math.abs(lado)); g.translate(0.06, -0.02);
    const hueso = [[0, 0]];
    LARGOS.forEach((l, i) => hueso.push([hueso[i][0] + l * Math.cos(ang(i)), hueso[i][1] - l * Math.sin(ang(i))]));
    const N = 26, arriba = [], plumas = [];
    for (let n = 0; n < N; n++) {
      const u = n / (N - 1), s = u * 2.999, i = s | 0, f = s - i;   // tramo de hueso y avance dentro de él
      const x = mezcla(hueso[i][0], hueso[i + 1][0], f), y = mezcla(hueso[i][1], hueso[i + 1][1], f);
      const d = mezcla(ang(i), ang(Math.min(2, i + 1)), f * 0.5) + 0.15 - abre * (1 - u) + 0.07 * Math.sin(t * 2.6 - u * 5 + lado);
      const largo = (0.26 + 0.5 * Math.sin(u * 2.1)) * (1 + 0.05 * Math.sin(t * 3.1 - u * 7));
      arriba.push([x, y]); plumas.push([x, y, d, largo, x + Math.cos(d) * largo, y - Math.sin(d) * largo, u]);
    }
    // La tela: una sola superficie del hombro al borde, amarilla junto al cuerpo y roja en las puntas.
    const tela = g.createRadialGradient(0, 0, 0.1, 0, 0, 1.5);
    tela.addColorStop(0, calor(0.75, 0.95)); tela.addColorStop(0.4, calor(0.5, 0.85)); tela.addColorStop(0.7, calor(0.3, 0.6)); tela.addColorStop(1, calor(0.05, 0.2));
    g.fillStyle = tela; g.beginPath();
    arriba.forEach(([x, y]) => g.lineTo(x, y)); [...plumas].reverse().forEach(q => g.lineTo(q[4], q[5])); g.fill();
    plumas.forEach(([x, y, d, largo, , , u], n) => pluma(x, y, d, largo, 0.04, 0.9 - 0.5 * u, n % 2 ? 0.9 : 0.4));
    g.restore();
  }

  // Cuerpo: patas recogidas, torso, pecho más claro, cuello que se curva hacia donde mira, cabeza, pico y cresta de llamas.
  g.strokeStyle = calor(0.5, 1); g.lineWidth = 0.03;
  for (const s of [-1, 1]) { raya(s * 0.04, 0.3, s * 0.075, 0.43); raya(s * 0.075, 0.43, s * 0.11, 0.47); raya(s * 0.075, 0.43, s * 0.05, 0.48); }
  g.fillStyle = calor(0.7, 1); g.beginPath(); g.ellipse(0, 0.13, 0.1, 0.25, 0, 0, 7); g.fill();
  g.fillStyle = calor(0.95, 1); g.beginPath(); g.ellipse(0, 0.05, 0.065, 0.13, 0, 0, 7); g.fill();
  const mx = p.mx || 0, hx = mx * 0.08 + 0.02 * Math.sin(t * 1.3), hy = -0.27 + (p.my || 0) * 0.03, l = mx < 0 ? -1 : 1;
  g.strokeStyle = calor(0.7, 1); g.lineWidth = 0.075; g.beginPath(); g.moveTo(0, -0.06); g.quadraticCurveTo(-hx * 0.8, -0.17, hx, hy); g.stroke();
  for (let i = 0; i < 5; i++) pluma(hx, hy - 0.04, Math.PI / 2 + (i - 2) * 0.28 + l * 0.25, 0.17 + 0.06 * Math.sin(t * 6 + i * 2), 0.035, 0.5, 1);
  g.fillStyle = calor(0.7, 1); g.beginPath(); g.arc(hx, hy, 0.062, 0, 7); g.fill();
  g.fillStyle = calor(0.3, 1); g.beginPath(); g.moveTo(hx + l * 0.04, hy - 0.025); g.lineTo(hx + l * 0.16, hy + 0.02); g.lineTo(hx + l * 0.04, hy + 0.04); g.fill();
}

// Devuelve pintar(pose). pose: { x, y, e, medio, amp, fase, nace, giro, perfil, brasa, mx, my } — brasa = chispas nuevas por cuadro.
export function crearFenix(lienzo) {
  const oculto = document.createElement('canvas'), g = oculto.getContext('2d', { willReadFrequently: true }), c = lienzo.getContext('2d');
  const estilo = getComputedStyle(lienzo), FUEGO = [1, 2, 3, 4, 5].map(n => estilo.getPropertyValue('--fuego-' + n));   // del rojo al crema
  let w = 0, h = 0, dpr = 1, celda = 6, cols = 0, filas = 0, brasas = [];
  return p => {
    if (lienzo.clientWidth !== w || lienzo.clientHeight !== h) {
      w = lienzo.clientWidth; h = lienzo.clientHeight; dpr = Math.min(2, devicePixelRatio);
      lienzo.width = w * dpr; lienzo.height = h * dpr;
      celda = Math.max(4, Math.min(w, h) / 150); cols = oculto.width = Math.ceil(w / celda); filas = oculto.height = Math.ceil(h / celda);
    }
    if (!w || !h) return;
    const k = p.e * Math.min(cols, filas) * 0.3, cx = p.x * cols, cy = p.y * filas;
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cols, filas);
    g.setTransform(k, 0, 0, k, cx, cy); g.rotate(p.giro || 0); g.lineCap = 'round'; g.lineJoin = 'round';
    ave(g, p);

    const d = g.getImageData(0, 0, cols, filas).data, capas = FUEGO.map(() => new Path2D());
    const punto = (calor, x, y, r) => { const capa = capas[Math.min(4, (calor * 5) | 0)]; capa.moveTo(x + r, y); capa.arc(x, y, r, 0, 7); };
    const borde = cy + k * (1.4 - 3.3 * p.nace);   // por debajo de esta fila ya «nació»
    for (let j = 0; j < filas; j++) for (let i = 0; i < cols; i++) {
      const n = (j * cols + i) * 4, a = (d[n + 3] / 255) * tramo(j, borde, borde + 0.3 * k);
      if (a > 0.05) punto(d[n + 1] / 255, (i + (j & 1 ? 1 : 0.5)) * celda, (j + 0.5) * celda, celda * 0.62 * Math.sqrt(a));
    }
    // shortcut: las brasas avanzan por cuadro, no por tiempo (más rápidas a 120 Hz); pasar a delta si molesta.
    for (let n = p.brasa || 0; n > Math.random() && brasas.length < 120; n--) brasas.push({ x: cx + (Math.random() - 0.5) * k * 0.6, y: cy + k * (0.3 + Math.random() * 0.6), vx: (Math.random() - 0.5) * 0.5, vy: 0.1 + Math.random() * 0.45, v: 1 });
    brasas = brasas.filter(b => (b.v -= 0.02) > 0);
    for (const b of brasas) { b.x += b.vx; b.y += b.vy; punto(b.v * 0.7, (Math.round(b.x) + 0.5) * celda, (Math.round(b.y) + 0.5) * celda, celda * 0.5 * b.v); }

    c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, h);
    capas.forEach((capa, i) => { c.fillStyle = FUEGO[i]; c.fill(capa); });
  };
}
