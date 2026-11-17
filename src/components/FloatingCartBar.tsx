import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPrice } from '../data/menuData';
import { ServiceMode } from './HeroSection';

interface FloatingCartBarProps {
  count: number;
  total: number;
  serviceMode: ServiceMode;
  tableNumber: string;
  onOpen: () => void;
}

export function FloatingCartBar({
  count,
  total,
  serviceMode,
  tableNumber,
  onOpen,
}: FloatingCartBarProps) {
  if (count === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
      <button
        type="button"
        onClick={onOpen}
        className="pointer-events-auto flex h-[54px] w-full max-w-md cursor-pointer items-center justify-between gap-4 rounded-full bg-[#2A1F17] px-4 py-2 text-white shadow-[0_10px_30px_-4px_rgba(55,42,32,0.28)] transition-transform duration-150 hover:bg-[#372A20] active:scale-[0.98]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="inline-flex h-8 min-w-[2rem] items-center justify-center rounded-full bg-[#D97706] px-2 text-sm font-bold text-white tabular-nums">
            {count}
          </span>
          <div className="text-left leading-tight min-w-0">
            <span className="block truncate text-sm font-semibold text-white">
              Ver mi pedido
            </span>
            <span className="block truncate text-xs text-[#FFDCC3]">
              {serviceMode === 'mesa' ? `Mesa ${tableNumber}` : 'Para llevar'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 border-l border-white/15 pl-3.5 shrink-0">
          <ShoppingBag className="hidden h-4 w-4 text-[#FFB77D] sm:block" aria-hidden="true" />
          <span className="text-base font-bold text-white tabular-nums">
            {formatPrice(total)}
          </span>
          <ArrowRight className="h-4 w-4 text-[#FFB77D]" aria-hidden="true" />
        </div>
      </button>
    </div>
  );
}
