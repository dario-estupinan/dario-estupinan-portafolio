// Pestañas del tablero. Sin JavaScript se ven los cuatro paneles seguidos, cada uno con su título.
for (const tablero of document.querySelectorAll('[data-tablero]')) {
  const lista = tablero.querySelector('[role=tablist]'), pestanas = [...lista.querySelectorAll('[role=tab]')];
  const elegir = (p, enfocar) => {
    for (const q of pestanas) {
      const activa = q === p;
      q.setAttribute('aria-selected', String(activa)); q.tabIndex = activa ? 0 : -1;
      document.getElementById(q.getAttribute('aria-controls')).hidden = !activa;
    }
    if (enfocar) p.focus();
  };
  lista.hidden = false; tablero.dataset.listo = '';
  elegir(pestanas[0], false);
  lista.addEventListener('click', e => { const p = e.target.closest('[role=tab]'); if (p) elegir(p, false); });
  lista.addEventListener('keydown', e => {
    const i = pestanas.indexOf(document.activeElement), n = pestanas.length;
    const destino = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
    if (i < 0 || destino === undefined) return;
    e.preventDefault(); elegir(pestanas[destino], true);
  });
}
