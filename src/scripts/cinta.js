// Cintas que corren: botón de pausa; con «movimiento reducido» arrancan quietas.
const calmado = matchMedia('(prefers-reduced-motion: reduce)').matches;
for (const cinta of document.querySelectorAll('[data-cinta]')) {
  const pista = cinta.querySelector('[data-pista]'), boton = cinta.querySelector('[data-pausa]');
  const poner = quieta => {
    pista.toggleAttribute('data-quieta', quieta);
    boton.setAttribute('aria-pressed', String(quieta));
    boton.textContent = quieta ? boton.dataset.moverTexto : boton.dataset.pausaTexto;
  };
  poner(calmado);
  boton.addEventListener('click', () => poner(!pista.hasAttribute('data-quieta')));
}
