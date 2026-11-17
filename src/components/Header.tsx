import { ShoppingBag } from 'lucide-react';
import { formatPrice } from '../data/menuData';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenQrModal: () => void;
}

export function Header({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenQrModal,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#E7DACB] bg-[#FDF6ED]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-8 px-4 sm:px-8 lg:px-14">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#inicio"
          className="font-serif text-2xl font-semibold tracking-tight text-[#372A20] whitespace-nowrap shrink-0 transition-colors hover:text-[#8D4B00] focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          Dulce Trigo
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-7 text-[15px] font-medium text-[#554336]"
        >
          <a
            href="#carta"
            className="whitespace-nowrap shrink-0 border-b border-transparent py-1 transition-colors duration-150 hover:border-[#B45309] hover:text-[#372A20]"
          >
            La Carta
          </a>
          <a
            href="#horno"
            className="whitespace-nowrap shrink-0 border-b border-transparent py-1 transition-colors duration-150 hover:border-[#B45309] hover:text-[#372A20]"
          >
            Horno de Hoy
          </a>
          <a
            href="#obrador"
            className="whitespace-nowrap shrink-0 border-b border-transparent py-1 transition-colors duration-150 hover:border-[#B45309] hover:text-[#372A20]"
          >
            El Obrador
          </a>
          <button
            type="button"
            onClick={onOpenQrModal}
            className="cursor-pointer whitespace-nowrap shrink-0 border-b border-transparent py-1 transition-colors duration-150 hover:border-[#B45309] hover:text-[#372A20]"
          >
            QR de Mesa
          </button>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={
              cartCount > 0
                ? `Abrir mi pedido, ${cartCount} productos, total ${formatPrice(cartTotal)}`
                : 'Abrir mi pedido'
            }
            className="inline-flex min-h-[42px] cursor-pointer items-center gap-2.5 rounded-full bg-[#2A1F17] px-5 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#372A20] active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="h-4 w-4 text-[#FFB77D]" aria-hidden="true" />
            <span>Mi Pedido</span>
            {cartCount > 0 && (
              <span className="inline-flex items-center gap-1.5 border-l border-white/20 pl-2.5 tabular-nums text-[#FFB77D]">
                <span>{cartCount}</span>
                <span aria-hidden="true">·</span>
                <span className="hidden sm:inline text-white">
                  {formatPrice(cartTotal)}
                </span>
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
