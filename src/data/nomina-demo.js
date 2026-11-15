// Tablero de nómina de DEMOSTRACIÓN. Todas las cifras son inventadas para este sitio:
// no provienen de ninguna empresa ni de ningún sistema real.
const AREAS = { es: ['Producción', 'Ventas', 'Administración', 'Logística', 'Sistemas'], en: ['Production', 'Sales', 'Administration', 'Logistics', 'Systems'] };
const MESES = { es: ['Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov'], en: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'] };

// Cada pestaña: tres cifras y una serie para el gráfico de barras. Las series suman lo que dice su cifra.
export const tablero = {
  resumen: {
    cifras: [
      { valor: '48', nombre: { es: 'Colaboradores', en: 'Employees' } },
      { valor: '61.240', nombre: { es: 'Costo de nómina del mes', en: 'Payroll cost this month' } },
      { valor: '312 h', nombre: { es: 'Horas extra', en: 'Overtime' } },
    ],
    grafico: { titulo: { es: 'Costo de nómina por área', en: 'Payroll cost by area' }, etiquetas: AREAS, valores: [24100, 13240, 11500, 8300, 4100] },
  },
  horas: {
    cifras: [
      { valor: '8.064', nombre: { es: 'Horas trabajadas', en: 'Hours worked' } },
      { valor: '312', nombre: { es: 'Horas extra', en: 'Overtime hours' } },
      { valor: '2,1 %', nombre: { es: 'Ausentismo', en: 'Absenteeism' } },
    ],
    grafico: { titulo: { es: 'Horas extra por área', en: 'Overtime hours by area' }, etiquetas: AREAS, valores: [148, 42, 24, 86, 12] },
  },
  rotacion: {
    cifras: [
      { valor: '3', nombre: { es: 'Ingresos del mes', en: 'Hires this month' } },
      { valor: '2', nombre: { es: 'Salidas del mes', en: 'Exits this month' } },
      { valor: '4,2 %', nombre: { es: 'Rotación', en: 'Turnover' } },
    ],
    grafico: { titulo: { es: 'Salidas en los últimos seis meses', en: 'Exits over the last six months' }, etiquetas: MESES, valores: [1, 0, 2, 1, 1, 2] },
  },
  vacaciones: {
    cifras: [
      { valor: '386', nombre: { es: 'Días pendientes', en: 'Days pending' } },
      { valor: '5', nombre: { es: 'Personas con más de 30 días', en: 'People with over 30 days' } },
      { valor: '41', nombre: { es: 'Días tomados en el mes', en: 'Days taken this month' } },
    ],
    grafico: { titulo: { es: 'Días de vacaciones pendientes por área', en: 'Pending leave days by area' }, etiquetas: AREAS, valores: [162, 84, 71, 48, 21] },
  },
};
