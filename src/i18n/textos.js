import es from './es.json';
import en from './en.json';

export const usarTextos = lang => (lang === 'en' ? en : es);
// rutaLocal('en', '/trabajos/x') → '/en/work/x'
export const rutaLocal = (lang, ruta) => (lang === 'en' ? '/en' + ruta.replace('/trabajos/', '/work/') : ruta);
