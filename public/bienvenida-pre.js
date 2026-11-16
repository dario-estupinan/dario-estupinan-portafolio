// Va en <head> y bloquea a propósito (es mínimo): decide antes del primer pintado si hay animación y si se muestra
// la bienvenida, para que no parpadee. Sin almacenamiento disponible no se muestra: no habría forma de recordar que ya se vio.
// «?animar» en la dirección fuerza ambas cosas, para revisar en un equipo con «movimiento reducido».
try {
  var raiz = document.documentElement, forzar = /[?&]animar/.test(location.search);
  if (forzar || !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    raiz.setAttribute('data-animar', '');
    if (forzar || !sessionStorage.getItem('bienvenida-vista')) {
      sessionStorage.setItem('bienvenida-vista', '1');
      raiz.setAttribute('data-bienvenida', '');
    }
  }
} catch (e) { /* almacenamiento bloqueado */ }
