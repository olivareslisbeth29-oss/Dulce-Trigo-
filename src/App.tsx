import { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import {
  CATEGORIES,
  CartItem,
  CategoryId,
  DessertItem,
  ExtraOption,
  MENU_ITEMS,
  PortionOption,
  TABLE_NUMBERS,
} from './data/menuData';
import { Header } from './components/Header';
import { HeroSection, ServiceMode } from './components/HeroSection';
import { DessertCard } from './components/DessertCard';
import { DessertDetailModal } from './components/DessertDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { FloatingCartBar } from './components/FloatingCartBar';
import { ObradorSection } from './components/ObradorSection';
import { QrTableModal } from './components/QrTableModal';

type DietaryFilter = 'sin-gluten' | 'masa-madre' | 'horneado-hoy';

function getInitialTableFromUrl(): string {
  if (typeof window === 'undefined') return '04';
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('mesa');
  if (raw) {
    const padded = raw.padStart(2, '0');
    if (TABLE_NUMBERS.includes(padded)) return padded;
  }
  return '04';
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilters, setDietaryFilters] = useState<DietaryFilter[]>([]);

  const [serviceMode, setServiceMode] = useState<ServiceMode>('mesa');
  const [tableNumber, setTableNumber] = useState<string>(getInitialTableFromUrl);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedDessert, setSelectedDessert] = useState<DessertItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Keep URL ?mesa= in sync cleanly when table changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      if (serviceMode === 'mesa') {
        url.searchParams.set('mesa', tableNumber);
      } else {
        url.searchParams.delete('mesa');
      }
      window.history.replaceState({}, '', url.toString());
    } catch {
      // Ignore history API restrictions in sandboxed iframes
    }
  }, [serviceMode, tableNumber]);

  const toggleDietaryFilter = (filter: DietaryFilter) => {
    setDietaryFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((item) => item !== filter)
        : [...prev, filter]
    );
  };

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MENU_ITEMS.filter((item) => {
      if (activeCategory !== 'todos' && item.category !== activeCategory) {
        return false;
      }

      if (dietaryFilters.includes('sin-gluten') && !item.dietary.glutenFree) {
        return false;
      }
      if (dietaryFilters.includes('masa-madre') && !item.dietary.sourdough) {
        return false;
      }
      if (dietaryFilters.includes('horneado-hoy') && !item.dietary.freshlyBaked) {
        return false;
      }

      if (q) {
        const haystack = [
          item.name,
          item.shortDescription,
          item.categoryLabel,
          ...item.metadataLabels,
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      }

      return true;
    });
  }, [activeCategory, dietaryFilters, searchQuery]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cart]
  );

  const getDessertQuantityInCart = (dessertId: string) =>
    cart
      .filter((entry) => entry.dessert.id === dessertId)
      .reduce((sum, entry) => sum + entry.quantity, 0);

  const handleAddToCart = ({
    dessert,
    portion,
    extras,
    note,
    quantity,
  }: {
    dessert: DessertItem;
    portion: PortionOption;
    extras: ExtraOption[];
    note: string;
    quantity: number;
  }) => {
    const extraKey = extras
      .map((e) => e.id)
      .sort()
      .join(',');
    const cartItemId = `${dessert.id}__${portion.id}__${extraKey}__${note}`;
    const extrasPrice = extras.reduce((sum, e) => sum + e.price, 0);
    const unitPrice = dessert.price + portion.priceDelta + extrasPrice;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          dessert,
          portion,
          extras,
          note,
          quantity,
          unitPrice,
        },
      ];
    });
  };

  const handleQuickAdd = (dessert: DessertItem) => {
    const defaultPortion = dessert.portions[0];
    if (!defaultPortion) return;
    handleAddToCart({
      dessert,
      portion: defaultPortion,
      extras: [],
      note: '',
      quantity: 1,
    });
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const resetMenuFilters = () => {
    setActiveCategory('todos');
    setSearchQuery('');
    setDietaryFilters([]);
  };

  const pairingForSelected = selectedDessert?.pairingId
    ? MENU_ITEMS.find((m) => m.id === selectedDessert.pairingId) ?? null
    : null;

  return (
    <div className="min-h-screen bg-[#FDF6ED] text-[#372A20]">
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenQrModal={() => setIsQrModalOpen(true)}
      />

      <main className={cartCount > 0 ? 'pb-24' : ''}>
        <HeroSection
          serviceMode={serviceMode}
          tableNumber={tableNumber}
          onChangeServiceMode={setServiceMode}
          onChangeTableNumber={setTableNumber}
          onOpenQrModal={() => setIsQrModalOpen(true)}
        />

        {/* Digital Dessert Menu Section */}
        <section
          id="carta"
          aria-labelledby="carta-heading"
          className="mx-auto max-w-[1200px] px-4 pt-4 sm:px-8 lg:px-14"
        >
          <div className="flex flex-col gap-4 border-t border-[#E7DACB] pt-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[13px] font-semibold tracking-[0.04em] text-[#8D4B00]">
                Selección del día
              </p>
              <h2
                id="carta-heading"
                className="mt-1 font-serif text-[28px] leading-[34px] font-semibold text-[#372A20] sm:text-[36px] sm:leading-[44px]"
              >
                Postres a la carta
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#7C6A5A]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar tarta, pistacho, café..."
                aria-label="Buscar postres en la carta"
                className="min-h-[42px] w-full rounded-full border border-[#E7DACB] bg-white py-2 pr-9 pl-10 text-sm text-[#372A20] placeholder:text-[#7C6A5A] transition-shadow focus:border-[#D97706] focus:outline-none focus:ring-3 focus:ring-[#D97706]/15"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpiar búsqueda"
                  className="absolute top-1/2 right-2.5 inline-flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[#7C6A5A] hover:bg-[#F5ECE1] hover:text-[#372A20]"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {/* Horizontal Scrollable Category Tabs + Dietary Filter Toggles */}
          <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div
              role="tablist"
              aria-label="Categorías de la carta"
              className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 sm:pb-0"
            >
              {CATEGORIES.map((category) => {
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCategory(category.id)}
                    className={`min-h-[40px] cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#372A20] text-white'
                        : 'border border-[#E7DACB] bg-[#F5ECE1] text-[#372A20] hover:border-[#D8C2B4] hover:bg-[#EFE3D3]'
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>

            <div
              role="group"
              aria-label="Filtros de elaboración"
              className="flex flex-wrap items-center gap-2"
            >
              {(
                [
                  { id: 'horneado-hoy', label: 'Horneado hoy' },
                  { id: 'masa-madre', label: 'Masa madre' },
                  { id: 'sin-gluten', label: 'Sin gluten' },
                ] as const
              ).map((filter) => {
                const active = dietaryFilters.includes(filter.id);
                return (
                  <button
                    key={filter.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleDietaryFilter(filter.id)}
                    className={`min-h-[36px] cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'border-[#B45309] bg-[#B45309] text-white'
                        : 'border-[#E7DACB] bg-white text-[#554336] hover:border-[#8D4B00] hover:text-[#372A20]'
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Grid */}
          {filteredItems.length > 0 ? (
            <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
              {filteredItems.map((item) => (
                <DessertCard
                  key={item.id}
                  item={item}
                  quantityInCart={getDessertQuantityInCart(item.id)}
                  onSelect={setSelectedDessert}
                  onQuickAdd={handleQuickAdd}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-[#E7DACB] bg-white px-6 py-12 text-center">
              <h3 className="font-serif text-xl font-semibold text-[#372A20]">
                No encontramos postres con ese filtro
              </h3>
              <p className="mt-2 text-sm text-[#6C5B4F]">
                Prueba quitando alguno de los filtros o revisando toda la carta
                del obrador.
              </p>
              <button
                type="button"
                onClick={resetMenuFilters}
                className="mt-5 min-h-[42px] cursor-pointer rounded-full bg-[#372A20] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2A1F17]"
              >
                Ver toda la carta
              </button>
            </div>
          )}
        </section>

        <ObradorSection />
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-white/10 bg-[#2A1F17] text-[#E7DACB]">
        <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-8 lg:px-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-serif text-2xl font-semibold text-[#FFF8F0]">
                Dulce Trigo
              </p>
              <p className="mt-1.5 text-sm text-[#D8C2B4]">
                Calle del Trigo, 14 · Panadería artesanal y pastelería de obrador
              </p>
              <p className="mt-1 text-xs text-[#C4B09F]">
                Martes a domingo · 07:30 a 20:30 · Pedidos en mesa y para llevar
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-sm">
              <a
                href="#carta"
                className="text-[#F7F0E7] transition-colors hover:text-[#FFB77D]"
              >
                La Carta
              </a>
              <a
                href="#horno"
                className="text-[#F7F0E7] transition-colors hover:text-[#FFB77D]"
              >
                Horno de Hoy
              </a>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(true)}
                className="cursor-pointer text-[#F7F0E7] transition-colors hover:text-[#FFB77D]"
              >
                QR de Mesa
              </button>
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="cursor-pointer text-[#FFB77D] transition-colors hover:text-white"
              >
                Mi Pedido
              </button>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-5 text-xs text-[#B6A190]">
            © {new Date().getFullYear()} Dulce Trigo Panadería Artesanal. Carta
            digital de temporada.
          </div>
        </div>
      </footer>

      {/* Sticky Floating Order Bar */}
      {!isCartOpen && (
        <FloatingCartBar
          count={cartCount}
          total={cartTotal}
          serviceMode={serviceMode}
          tableNumber={tableNumber}
          onOpen={() => setIsCartOpen(true)}
        />
      )}

      {/* Customization Bottom Sheet / Modal */}
      <DessertDetailModal
        item={selectedDessert}
        pairingItem={pairingForSelected}
        onClose={() => setSelectedDessert(null)}
        onAddToCart={handleAddToCart}
        onSelectPairing={(pairing) => setSelectedDessert(pairing)}
      />

      {/* Order Summary & WhatsApp Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        serviceMode={serviceMode}
        tableNumber={tableNumber}
        onClose={() => setIsCartOpen(false)}
        onChangeServiceMode={setServiceMode}
        onChangeTableNumber={setTableNumber}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Scannable Table QR Code Modal */}
      <QrTableModal
        isOpen={isQrModalOpen}
        activeTable={tableNumber}
        onClose={() => setIsQrModalOpen(false)}
        onSelectTable={(newTable) => {
          setServiceMode('mesa');
          setTableNumber(newTable);
        }}
      />
    </div>
  );
}
