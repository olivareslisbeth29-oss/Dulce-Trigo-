export type CategoryId = 'todos' | 'tartas' | 'bolleria' | 'cuchara' | 'cafe';

export interface PortionOption {
  id: string;
  label: string;
  detail: string;
  priceDelta: number;
}

export interface ExtraOption {
  id: string;
  label: string;
  price: number;
}

export interface DessertItem {
  id: string;
  name: string;
  category: Exclude<CategoryId, 'todos'>;
  categoryLabel: string;
  price: number;
  weight: string;
  bakedAt: string;
  shortDescription: string;
  story: string;
  image: string;
  imageAlt: string;
  metadataLabels: string[];
  allergens: string[];
  dietary: {
    glutenFree?: boolean;
    vegetarian?: boolean;
    sourdough?: boolean;
    freshlyBaked?: boolean;
  };
  portions: PortionOption[];
  extras: ExtraOption[];
  pairingId?: string;
  featured?: boolean;
}

export interface CartItem {
  cartItemId: string;
  dessert: DessertItem;
  portion: PortionOption;
  extras: ExtraOption[];
  note: string;
  quantity: number;
  unitPrice: number;
}

export interface CategoryDef {
  id: CategoryId;
  label: string;
}

export const CATEGORIES: CategoryDef[] = [
  { id: 'todos', label: 'Toda la carta' },
  { id: 'tartas', label: 'Tartas & Pasteles' },
  { id: 'bolleria', label: 'Bollería de Horno' },
  { id: 'cuchara', label: 'Postres de Cuchara' },
  { id: 'cafe', label: 'Café & Maridaje' },
];

export const HERO_IMAGE = '/src/assets/images/hero_dulce_trigo_1794934550402.jpg';

export const MENU_ITEMS: DessertItem[] = [
  {
    id: 'tarta-vasca-quemada',
    name: 'Tarta Vasca Quemada',
    category: 'tartas',
    categoryLabel: 'Tartas & Pasteles',
    price: 24.0,
    weight: '190 g',
    bakedAt: 'Horneado a las 09:30',
    shortDescription:
      'Corteza tostada a fuego alto y corazón cremoso de queso artesanal con nata fresca de granja.',
    story:
      'Horneada en lotes cortos cada mañana a 235 °C para lograr ese caramelizado caoba inconfundible y un centro fundente que reposa cuatro horas antes de cortarse en vitrina.',
    image: '/src/assets/images/tarta_vasca_quemada_1794934551117.jpg',
    imageAlt:
      'Porción artesanal de tarta vasca quemada con centro cremoso en plato de cerámica',
    metadataLabels: ['Horneado hoy', 'Sin gluten', '190 g'],
    allergens: ['Lácteos', 'Huevo'],
    dietary: {
      glutenFree: true,
      vegetarian: true,
      freshlyBaked: true,
    },
    portions: [
      { id: 'porcion', label: 'Porción individual', detail: '190 g · Corte del día', priceDelta: 0 },
      { id: 'duo', label: 'Dúo para compartir', detail: '2 porciones · 380 g', priceDelta: 21.0 },
      { id: 'entera', label: 'Tarta entera (6–8 pers.)', detail: 'Molde de 18 cm bajo pedido en barra', priceDelta: 96.0 },
    ],
    extras: [
      { id: 'coulis-frutos', label: 'Coulis casero de frutos rojos', price: 5.0 },
      { id: 'caramelo-salado', label: 'Salsa tibia de caramelo salado', price: 5.5 },
      { id: 'crema-vainilla', label: 'Quenelle de crema de vainilla', price: 4.5 },
    ],
    pairingId: 'flat-white-especialidad',
    featured: true,
  },
  {
    id: 'croissant-pistacho',
    name: 'Croissant de Pistacho Siciliano',
    category: 'bolleria',
    categoryLabel: 'Bollería de Horno',
    price: 18.5,
    weight: '145 g',
    bakedAt: 'Horneado a las 07:30',
    shortDescription:
      'Hojaldre de masa madre fermentado 48 horas, relleno de praliné tostado de pistacho verde y trocitos crujientes.',
    story:
      'Laminado con mantequilla fermentada al 84 % de materia grasa y nuestra masa madre dulce. Rellenado al momento con crema sedosa de pistacho tostado a la piedra.',
    image: '/src/assets/images/croissant_pistacho_1794934551677.jpg',
    imageAlt:
      'Croissant hojaldrado relleno de crema de pistacho y cubierto con pistachos tostados',
    metadataLabels: ['Masa madre', 'Horneado hoy', '145 g'],
    allergens: ['Gluten', 'Lácteos', 'Huevo', 'Frutos secos'],
    dietary: {
      sourdough: true,
      vegetarian: true,
      freshlyBaked: true,
    },
    portions: [
      { id: 'pieza', label: 'Pieza individual', detail: '145 g · Crujiente del horno', priceDelta: 0 },
      { id: 'caja-2', label: 'Caja degustación x2', detail: '2 croissants en caja artesanal', priceDelta: 16.5 },
    ],
    extras: [
      { id: 'calentar', label: 'Servir templado (2 min en horno)', price: 0 },
      { id: 'extra-praline', label: 'Vasito extra de praliné de pistacho', price: 6.0 },
    ],
    pairingId: 'flat-white-especialidad',
    featured: true,
  },
  {
    id: 'galette-manzana',
    name: 'Galette de Manzana Caramelizada',
    category: 'tartas',
    categoryLabel: 'Tartas & Pasteles',
    price: 22.5,
    weight: '210 g',
    bakedAt: 'Horneado a las 09:00',
    shortDescription:
      'Masa quebrada rústica de mantequilla dorada con láminas de manzana asada, miel de azahar y crema de mascarpone.',
    story:
      'Elaborada a mano sin molde con harina molida a la piedra y manzanas Reineta caramelizadas lentamente en mantequilla avellana, servida con mascarpone batido con vaina de Madagascar.',
    image: '/src/assets/images/galette_manzana_caramelizada_1794934552698.jpg',
    imageAlt:
      'Galette rústica de manzana caramelizada con crema de vainilla mascarpone',
    metadataLabels: ['Horneado hoy', 'Vegetariano', '210 g'],
    allergens: ['Gluten', 'Lácteos', 'Huevo'],
    dietary: {
      vegetarian: true,
      freshlyBaked: true,
    },
    portions: [
      { id: 'individual', label: 'Galette individual', detail: '210 g · Servida tibia', priceDelta: 0 },
      { id: 'compartir', label: 'Galette para 2 personas', detail: '390 g · Con doble mascarpone', priceDelta: 19.5 },
    ],
    extras: [
      { id: 'helado-nata', label: 'Bola de helado artesanal de nata', price: 7.5 },
      { id: 'miel-tostada', label: 'Hilo extra de miel de azahar y canela', price: 3.5 },
    ],
    pairingId: 'flat-white-especialidad',
    featured: true,
  },
  {
    id: 'milhojas-vainilla-frutos',
    name: 'Milhojas de Vainilla y Frutos del Bosque',
    category: 'tartas',
    categoryLabel: 'Tartas & Pasteles',
    price: 25.5,
    weight: '175 g',
    bakedAt: 'Montado al pedido',
    shortDescription:
      'Tres láminas de hojaldre invertido caramelizado, crema diplomática de vainilla Bourbon, frambuesas y moras frescas.',
    story:
      'Montamos cada milhojas minutos antes de servir para preservar el crujido cristalino del hojaldre caramelizado frente a la ligereza de la crema diplomática con semillas naturales de vainilla.',
    image: '/src/assets/images/milhojas_vainilla_frutos_1794934554603.jpg',
    imageAlt:
      'Milhojas de hojaldre crujiente con crema de vainilla y frutos rojos frescos',
    metadataLabels: ['Montado al momento', 'Vegetariano', '175 g'],
    allergens: ['Gluten', 'Lácteos', 'Huevo'],
    dietary: {
      vegetarian: true,
      freshlyBaked: true,
    },
    portions: [
      { id: 'individual', label: 'Porción clásica', detail: '175 g · 3 capas crujientes', priceDelta: 0 },
      { id: 'caja-regalo', label: 'Caja pastelería x2', detail: '2 milhojas · Empaque rígido', priceDelta: 22.5 },
    ],
    extras: [
      { id: 'frutos-extra', label: 'Guarnición extra de frambuesas y moras', price: 6.5 },
      { id: 'vela-cera', label: 'Vela artesanal de cumpleaños', price: 3.0 },
    ],
    pairingId: 'flat-white-especialidad',
  },
  {
    id: 'rollo-canela-brioche',
    name: 'Rollo de Canela en Brioche',
    category: 'bolleria',
    categoryLabel: 'Bollería de Horno',
    price: 16.0,
    weight: '165 g',
    bakedAt: 'Horneado a las 08:00 y 15:30',
    shortDescription:
      'Espiral tierna de brioche con masa madre, mantequilla tostada, canela de Ceilán y glaseado ligero de vainilla.',
    story:
      'Nuestra masa brioche fermenta en frío durante 24 horas para ofrecer una miga algodonosa que se deshace capa a capa. Sale en dos hornadas diarias: mañana y merienda.',
    image: '/src/assets/images/rollo_canela_brioche_1794934553769.jpg',
    imageAlt:
      'Rollo de canela artesanal de brioche con glaseado de vainilla sobre plato de gres',
    metadataLabels: ['Masa madre', 'Horneado hoy', '165 g'],
    allergens: ['Gluten', 'Lácteos', 'Huevo'],
    dietary: {
      sourdough: true,
      vegetarian: true,
      freshlyBaked: true,
    },
    portions: [
      { id: 'pieza', label: 'Rollo individual', detail: '165 g · Recién glaseado', priceDelta: 0 },
      { id: 'bandeja-4', label: 'Caja de merienda x4', detail: '4 rollos tibios para llevar', priceDelta: 44.0 },
    ],
    extras: [
      { id: 'sin-glaseado', label: 'Sin glaseado superior', price: 0 },
      { id: 'queso-crema', label: 'Glaseado extra de queso crema y naranja', price: 4.0 },
      { id: 'nueces-pecanas', label: 'Topping de nueces pecanas tostadas', price: 5.0 },
    ],
    pairingId: 'flat-white-especialidad',
  },
  {
    id: 'tiramisu-espresso',
    name: 'Tiramisú de Espresso Artesanal',
    category: 'cuchara',
    categoryLabel: 'Postres de Cuchara',
    price: 23.0,
    weight: '200 g',
    bakedAt: 'Reposo en frío 18 h',
    shortDescription:
      'Bizcochos soletilla horneados en casa, empapados en espresso recién extraído, crema sabayón de mascarpone y cacao puro.',
    story:
      'Nuestros propios bizcochos savoiardi absorben café de tueste medio con una nota sutil de vino Marsala, alternados con mascarpone aireado y cacao holandés tamizado al instante.',
    image: '/src/assets/images/tiramisu_espresso_artesanal_1794934553245.jpg',
    imageAlt:
      'Tiramisú artesanal en cuenco de cerámica con cacao espolvoreado y cuchara de latón',
    metadataLabels: ['Vitrina fría', 'Vegetariano', '200 g'],
    allergens: ['Gluten', 'Lácteos', 'Huevo'],
    dietary: {
      vegetarian: true,
    },
    portions: [
      { id: 'cuenco', label: 'Cuenco individual', detail: '200 g · Servido frío', priceDelta: 0 },
      { id: 'tarro-doble', label: 'Tarro de vidrio para 2', detail: '380 g · Ideal para compartir', priceDelta: 20.0 },
    ],
    extras: [
      { id: 'sin-licor', label: 'Versión sin alcohol (100 % espresso)', price: 0 },
      { id: 'extra-cacao', label: 'Cacao 70 % y virutas de chocolate negro', price: 4.0 },
    ],
    pairingId: 'croissant-pistacho',
  },
  {
    id: 'flat-white-especialidad',
    name: 'Flat White de Especialidad & Sablé',
    category: 'cafe',
    categoryLabel: 'Café & Maridaje',
    price: 14.0,
    weight: '220 ml',
    bakedAt: 'Tueste semanal · Colombia Huila',
    shortDescription:
      'Doble ristretto con notas de panela y avellana, leche emulsionada sedosa y galleta sablé de mantequilla de la casa.',
    story:
      'Seleccionado específicamente para acompañar la dulzura de nuestra pastelería. Se sirve en taza de gres artesanal junto a nuestra galleta sablé horneada esa mañana.',
    image: '/src/assets/images/cafe_flat_white_artesanal_1794934554977.jpg',
    imageAlt:
      'Taza de cerámica terracota con flat white de especialidad y galleta sablé de mantequilla',
    metadataLabels: ['Maridaje', 'Origen único', '220 ml'],
    allergens: ['Lácteos', 'Gluten (galleta)'],
    dietary: {
      vegetarian: true,
      glutenFree: true,
    },
    portions: [
      { id: 'estandar', label: 'Taza estándar (220 ml)', detail: 'Doble ristretto + leche entera', priceDelta: 0 },
      { id: 'grande', label: 'Taza grande (300 ml)', detail: 'Doble espresso largo', priceDelta: 3.0 },
    ],
    extras: [
      { id: 'bebida-avena', label: 'Cambiar a bebida de avena barista', price: 2.5 },
      { id: 'descafeinado', label: 'Grano descafeinado al agua', price: 0 },
      { id: 'sin-galleta', label: 'Servir sin galleta (100 % sin gluten)', price: 0 },
    ],
  },
];

export const BAKE_SCHEDULE = [
  {
    time: '07:30',
    batch: 'Primera hornada de bollería',
    detail: 'Croissants de masa madre, rollos de canela en brioche y panes de desayuno recién salidos del horno de suela.',
  },
  {
    time: '09:30',
    batch: 'Tartas y vitrina de pastelería',
    detail: 'Corte de la Tarta Vasca Quemada tras su reposo, galettes de manzana de temporada y postres de cuchara.',
  },
  {
    time: '15:30',
    batch: 'Hornada tibia de merienda',
    detail: 'Segundo pase de rollos de canela recién glaseados y montaje al instante de milhojas de vainilla Bourbon.',
  },
];

export const TABLE_NUMBERS = [
  '01', '02', '03', '04', '05', '06',
  '07', '08', '09', '10', '11', '12',
];

export const BAKERY_WHATSAPP_NUMBER = '51935246885';
export const YAPE_NUMBER_RAW = '935246885';
export const YAPE_NUMBER_DISPLAY = '935 246 885';
export const YAPE_HOLDER_NAME = 'Lisbeth Juanita Olivares Alayo';
export const YAPE_QR_IMAGE = '/assets/aistudio/image_638a2422.png';

export type PaymentMethod = 'yape' | 'plin' | 'pos' | 'efectivo';

export interface PaymentMethodDef {
  id: PaymentMethod;
  label: string;
  subtitle: string;
}

export const PAYMENT_METHODS: PaymentMethodDef[] = [
  { id: 'yape', label: 'Yape', subtitle: 'QR o número' },
  { id: 'plin', label: 'Plin', subtitle: 'Transferencia' },
  { id: 'pos', label: 'POS / Tarjeta', subtitle: 'Al entregar' },
  { id: 'efectivo', label: 'Efectivo', subtitle: 'En soles' },
];

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(amount);
}
