// Va en <head> y bloquea a propósito (es mínimo): decide antes del primer pintado si se muestra la bienvenida,
// para que no parpadee. Sin almacenamiento disponible no se muestra: no habría forma de recordar que ya se vio.
try {
  if (!sessionStorage.getItem('bienvenida-vista') && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    sessionStorage.setItem('bienvenida-vista', '1');
    document.documentElement.setAttribute('data-bienvenida', '');
  }
} catch (e) { /* almacenamiento bloqueado */ }
