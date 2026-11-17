import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { DessertItem, formatPrice } from '../data/menuData';
import { DessertImage } from './DessertImage';

interface DessertCardProps {
  item: DessertItem;
  quantityInCart: number;
  onSelect: (item: DessertItem) => void;
  onQuickAdd: (item: DessertItem) => void;
}

export function DessertCard({
  item,
  quantityInCart,
  onSelect,
  onQuickAdd,
}: DessertCardProps) {
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onQuickAdd(item);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 900);
  };

  return (
    <article
      onClick={() => onSelect(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(item);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Personalizar ${item.name}, ${formatPrice(item.price)}`}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#E7DACB] bg-white shadow-[0_4px_16px_-2px_rgba(55,42,32,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D8C2B4] hover:shadow-[0_12px_26px_-6px_rgba(55,42,32,0.11)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D97706]"
    >
      {/* Top 4:3 Photography */}
      <div className="relative overflow-hidden">
        <DessertImage
          src={item.image}
          alt={item.imageAlt}
          aspectClassName="aspect-[4/3]"
          className="transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Clean unboxed metadata row */}
        <p className="text-xs font-semibold tracking-[0.02em] text-[#7C6A5A]">
          {item.metadataLabels.join(' · ')}
        </p>

        {/* Headline in Vollkorn */}
        <h3 className="mt-1.5 font-serif text-[20px] leading-[26px] font-semibold text-[#372A20] transition-colors group-hover:text-[#8D4B00]">
          {item.name}
        </h3>

        {/* Description */}
        <p className="mt-2 line-clamp-2 flex-1 text-[15px] leading-[22px] text-[#554336]">
          {item.shortDescription}
        </p>

        {/* Bottom Price + Quick Add row */}
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#F5ECE1] pt-4">
          <div>
            <span className="block text-[12px] text-[#7C6A5A]">
              {item.bakedAt}
            </span>
            <span className="mt-0.5 block font-sans text-[20px] leading-6 font-bold text-[#B45309] tabular-nums">
              {formatPrice(item.price)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label={`Añadir rápido ${item.name} al pedido`}
            className={`inline-flex min-h-[42px] cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-150 active:scale-95 whitespace-nowrap shrink-0 ${
              justAdded
                ? 'bg-[#15803D] text-white'
                : quantityInCart > 0
                  ? 'bg-[#372A20] text-white hover:bg-[#2A1F17]'
                  : 'bg-[#F5ECE1] text-[#372A20] hover:bg-[#B45309] hover:text-white'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="h-4 w-4" aria-hidden="true" />
                <span>Añadido</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>
                  {quantityInCart > 0 ? `Añadir (${quantityInCart})` : 'Añadir'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
