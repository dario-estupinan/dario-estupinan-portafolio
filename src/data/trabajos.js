// Los nueve trabajos, en el orden en que se listan. `caso: true` genera su propia página.
// Sin `url` ni `repo`, la fila no lleva enlace externo.
export const trabajos = [
  {
    slug: 'npc-guayaquil', nombre: 'NPC Guayaquil Muscle Show', anio: 2026, caso: true, captura: true,
    url: 'https://guayaquilmuscleshow.com',
    tipo: { es: 'Sitio web y acceso por QR', en: 'Website and QR access' },
    resumen: { es: 'El sitio del evento y el sistema que registra a los asistentes y controla la entrada con un código QR.', en: 'The event site and the system that registers attendees and controls entry with a QR code.' },
    necesidad: { es: 'Un evento de fisicoculturismo en Guayaquil necesitaba un sitio propio y una forma de registrar gratis a sus asistentes y controlar quién entra.', en: 'A bodybuilding event in Guayaquil needed its own site and a way to register attendees for free and control who gets in.' },
    hecho: { es: ['Sitio público del evento con divisiones, marcas y galería.', 'Registro gratuito que entrega un código QR a cada asistente.', 'Control de acceso en la puerta, desde el celular.', 'Panel con las métricas del evento.'], en: ['A public event site with divisions, sponsors and a gallery.', 'Free registration that gives each attendee a QR code.', 'Access control at the door, from a phone.', 'A panel with the event metrics.'] },
    con: 'Astro · PHP 8.3 · MariaDB',
  },
  {
    slug: 'maple-tree', nombre: 'Maple Tree', anio: 2026, caso: true, captura: true,
    tipo: { es: 'Sitio web', en: 'Website' },
    resumen: { es: 'El sitio de un salón especializado en rizos y afros en Guayaquil.', en: 'The site of a salon in Guayaquil that specializes in curls and afro hair.' },
    necesidad: { es: 'Un salón especializado en rizos y afros necesitaba un sitio que mostrara su trabajo y llevara a reservar una cita.', en: 'A salon that specializes in curls and afro hair needed a site that showed its work and led visitors to book an appointment.' },
    hecho: { es: ['Portada con carrusel de fotos a pantalla completa.', 'Servicios, productos y transformaciones.', 'Reserva de cita desde cualquier página.'], en: ['A home page with a full-screen photo carousel.', 'Services, products and transformations.', 'Appointment booking from any page.'] },
    con: 'HTML · CSS · JavaScript, sin librerías',
  },
  {
    slug: 'dra-lorena-martinez', nombre: 'Dra. Lorena Martínez', anio: 2026, caso: true, captura: true,
    tipo: { es: 'Sitio web', en: 'Website' },
    resumen: { es: 'El sitio de una otorrinolaringóloga que atiende en varias ciudades del Ecuador.', en: 'The site of an ear, nose and throat specialist who sees patients in several cities in Ecuador.' },
    necesidad: { es: 'Una otorrinolaringóloga que atiende en varias ciudades necesitaba presentarse y que sus pacientes pudieran agendar una cita.', en: 'An ear, nose and throat specialist who works in several cities needed to introduce herself and let patients book an appointment.' },
    hecho: { es: ['Presentación, servicios y formación.', 'Ciudades de atención y testimonios.', 'Agenda de citas por WhatsApp.'], en: ['Introduction, services and training.', 'Cities served and testimonials.', 'Appointment booking over WhatsApp.'] },
    con: 'HTML · CSS · JavaScript',
  },
  {
    slug: 'fiscalio', nombre: 'Fiscalio', anio: 2026, caso: true, captura: false, enConstruccion: true,
    tipo: { es: 'Aplicación web', en: 'Web application' },
    resumen: { es: 'Facturas, cobros e impuestos explicados en simple, empezando por Ecuador.', en: 'Invoices, payments and taxes explained simply, starting with Ecuador.' },
    necesidad: { es: 'Personas sin conocimientos tributarios que necesitan tener sus comprobantes en orden, saber quién les debe y cuánto de su dinero es realmente suyo.', en: 'People with no tax background who need their receipts in order, to know who owes them and how much of their money is really theirs.' },
    hecho: { es: ['Arquitectura y especificación del producto.', 'Estructura del proyecto: interfaz, servicio y núcleo de cálculo.', 'Primeras piezas en construcción.'], en: ['Product architecture and specification.', 'Project structure: interface, service and calculation core.', 'First pieces under construction.'] },
    con: 'Java · Spring Boot · Angular',
  },
  {
    slug: 'cnel-ep', nombre: 'CNEL EP', anio: 2026, captura: true,
    tipo: { es: 'Prototipo de rediseño', en: 'Redesign prototype' },
    resumen: { es: 'Prototipo de rediseño del sitio de la empresa eléctrica: trámites, cortes de luz y noticias más fáciles de encontrar.', en: 'A redesign prototype for the electricity company site: procedures, outages and news made easier to find.' },
  },
  {
    slug: 'construaceros', nombre: 'ConstruAceros', anio: 2026, captura: true,
    url: 'https://construaceros-web.onrender.com', repo: 'https://github.com/dario-estupinan/construaceros-web',
    tipo: { es: 'Sitio web', en: 'Website' },
    resumen: { es: 'El sitio de una empresa de construcciones en acero inoxidable, hierro y vidrio, con sus obras y cotización.', en: 'The site of a company that builds in stainless steel, iron and glass, with its projects and a quote request.' },
  },
  {
    slug: 'chuku-gym', nombre: 'Chuku Cross Gym', anio: 2026, captura: true,
    tipo: { es: 'Sitio web', en: 'Website' },
    resumen: { es: 'El sitio de un gimnasio: eventos, entrenadores y membresías.', en: 'A gym site: events, coaches and memberships.' },
  },
  {
    slug: 'mesura', nombre: 'Mesura', anio: 2026, captura: true,
    repo: 'https://github.com/dario-estupinan/mesura',
    tipo: { es: 'Herramienta de código abierto', en: 'Open-source tool' },
    resumen: { es: 'Un método para revisar y diseñar interfaces con evidencia: medir antes de opinar. Publicado con licencia MIT.', en: 'A method for reviewing and designing interfaces with evidence: measure before giving an opinion. Published under the MIT license.' },
  },
  {
    slug: 'vigia-ug', nombre: 'Vigía UG', anio: 2026, captura: false,
    tipo: { es: 'Bot de Telegram', en: 'Telegram bot' },
    resumen: { es: 'Un bot que revisa el aula virtual de la universidad y avisa por Telegram de tareas nuevas y fechas que cambian.', en: 'A bot that checks the university virtual classroom and sends Telegram alerts about new assignments and changed dates.' },
  },
];

export const casos = trabajos.filter(t => t.caso);
