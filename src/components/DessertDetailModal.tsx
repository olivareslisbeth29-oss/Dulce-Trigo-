import { useEffect, useState } from 'react';
import { X, Minus, Plus, Check, Coffee } from 'lucide-react';
import {
  DessertItem,
  ExtraOption,
  PortionOption,
  formatPrice,
} from '../data/menuData';
import { DessertImage } from './DessertImage';

interface DessertDetailModalProps {
  item: DessertItem | null;
  pairingItem: DessertItem | null;
  onClose: () => void;
  onAddToCart: (payload: {
    dessert: DessertItem;
    portion: PortionOption;
    extras: ExtraOption[];
    note: string;
    quantity: number;
  }) => void;
  onSelectPairing: (item: DessertItem) => void;
}

export function DessertDetailModal({
  item,
  pairingItem,
  onClose,
  onAddToCart,
  onSelectPairing,
}: DessertDetailModalProps) {
  const [selectedPortionId, setSelectedPortionId] = useState<string>('');
  const [selectedExtraIds, setSelectedExtraIds] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (item) {
      setSelectedPortionId(item.portions[0]?.id ?? '');
      setSelectedExtraIds([]);
      setNote('');
      setQuantity(1);
    }
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  const selectedPortion =
    item.portions.find((p) => p.id === selectedPortionId) ?? item.portions[0];
  const selectedExtras = item.extras.filter((ex) =>
    selectedExtraIds.includes(ex.id)
  );
  const extrasTotal = selectedExtras.reduce((sum, ex) => sum + ex.price, 0);
  const unitPrice = item.price + (selectedPortion?.priceDelta ?? 0) + extrasTotal;
  const lineTotal = unitPrice * quantity;

  const toggleExtra = (id: string) => {
    setSelectedExtraIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    if (!selectedPortion) return;
    onAddToCart({
      dessert: item,
      portion: selectedPortion,
      extras: selectedExtras,
      note: note.trim(),
      quantity,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dessert-modal-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#2A1F17]/55 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-[#E7DACB] bg-[#FDF6ED] shadow-[0_20px_40px_-8px_rgba(55,42,32,0.28)] sm:rounded-3xl"
      >
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="relative">
            <DessertImage
              src={item.image}
              alt={item.imageAlt}
              aspectClassName="aspect-[16/10] sm:aspect-[16/9]"
              priority
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar detalle del postre"
              className="absolute top-4 right-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#2A1F17]/80 text-white backdrop-blur-sm transition-colors hover:bg-[#2A1F17]"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="p-5 sm:p-7">
            {/* Unboxed Metadata */}
            <p className="text-xs font-semibold tracking-[0.03em] text-[#8D4B00]">
              {item.categoryLabel} · {item.metadataLabels.join(' · ')}
            </p>

            <div className="mt-1.5 flex items-start justify-between gap-4">
              <h2
                id="dessert-modal-title"
                className="font-serif text-[26px] leading-[32px] font-semibold text-[#372A20] sm:text-[30px] sm:leading-[36px]"
              >
                {item.name}
              </h2>
              <span className="shrink-0 font-sans text-xl font-bold text-[#B45309] tabular-nums">
                {formatPrice(item.price)}
              </span>
            </div>

            <p className="mt-3 text-[15px] leading-relaxed text-[#554336]">
              {item.story}
            </p>

            {/* Allergens */}
            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 border-y border-[#E7DACB] py-3 text-xs text-[#6C5B4F]">
              <span className="font-semibold text-[#372A20]">Alérgenos:</span>
              <span>{item.allergens.join(', ')}</span>
              <span aria-hidden="true">·</span>
              <span>{item.bakedAt}</span>
            </div>

            {/* Portion Selection */}
            <fieldset className="mt-6">
              <legend className="font-serif text-lg font-semibold text-[#372A20]">
                Elige tu formato
              </legend>
              <div className="mt-3 space-y-2.5">
                {item.portions.map((portion) => {
                  const isSelected = portion.id === selectedPortion?.id;
                  return (
                    <label
                      key={portion.id}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3.5 transition-colors ${
                        isSelected
                          ? 'border-[#B45309] bg-white shadow-[0_2px_10px_-2px_rgba(180,83,9,0.14)]'
                          : 'border-[#E7DACB] bg-white/70 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="portion"
                          value={portion.id}
                          checked={isSelected}
                          onChange={() => setSelectedPortionId(portion.id)}
                          className="mt-1 h-4 w-4 accent-[#B45309]"
                        />
                        <div>
                          <span className="block text-[15px] font-semibold text-[#372A20]">
                            {portion.label}
                          </span>
                          <span className="block text-xs text-[#6C5B4F]">
                            {portion.detail}
                          </span>
                        </div>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-[#372A20] tabular-nums">
                        {portion.priceDelta === 0
                          ? formatPrice(item.price)
                          : `+${formatPrice(portion.priceDelta)}`}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Artisan Extras */}
            {item.extras.length > 0 && (
              <fieldset className="mt-6">
                <legend className="font-serif text-lg font-semibold text-[#372A20]">
                  Acompañamientos de obrador
                </legend>
                <div className="mt-3 space-y-2">
                  {item.extras.map((extra) => {
                    const checked = selectedExtraIds.includes(extra.id);
                    return (
                      <button
                        key={extra.id}
                        type="button"
                        onClick={() => toggleExtra(extra.id)}
                        aria-pressed={checked}
                        className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors ${
                          checked
                            ? 'border-[#372A20] bg-white'
                            : 'border-[#E7DACB] bg-white/60 hover:bg-white'
                        }`}
                      >
                        <span className="flex items-center gap-3 text-[15px] font-medium text-[#372A20]">
                          <span
                            className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                              checked
                                ? 'border-[#372A20] bg-[#372A20] text-white'
                                : 'border-[#887364] bg-white'
                            }`}
                          >
                            {checked && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                          </span>
                          <span>{extra.label}</span>
                        </span>
                        <span className="shrink-0 text-sm font-semibold text-[#6C5B4F] tabular-nums">
                          {extra.price === 0 ? 'Incluido' : `+${formatPrice(extra.price)}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {/* Kitchen Note */}
            <div className="mt-6">
              <label
                htmlFor="kitchen-note"
                className="block font-serif text-lg font-semibold text-[#372A20]"
              >
                Nota para el obrador
              </label>
              <textarea
                id="kitchen-note"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ej. Sin azúcar glas por encima, servir con dos tenedores, alergia a nueces..."
                className="mt-2 w-full rounded-xl border border-[#E7DACB] bg-white px-3.5 py-2.5 text-sm text-[#372A20] placeholder:text-[#887364] transition-shadow focus:border-[#D97706] focus:outline-none focus:ring-3 focus:ring-[#D97706]/15"
              />
            </div>

            {/* Suggested Pairing */}
            {pairingItem && (
              <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-[#E7DACB] bg-[#F5ECE1] p-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#8D4B00]">
                    <Coffee className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#8D4B00]">
                      Maridaje recomendado
                    </p>
                    <p className="truncate font-serif text-[15px] font-semibold text-[#372A20]">
                      {pairingItem.name} · {formatPrice(pairingItem.price)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectPairing(pairingItem)}
                  className="shrink-0 cursor-pointer rounded-full border border-[#372A20] px-3.5 py-1.5 text-xs font-semibold text-[#372A20] transition-colors hover:bg-[#372A20] hover:text-white whitespace-nowrap"
                >
                  Ver maridaje
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="border-t border-[#E7DACB] bg-white px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3.5">
            <div className="inline-flex items-center rounded-full border border-[#E7DACB] bg-[#FDF6ED] p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Reducir cantidad"
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#372A20] transition-colors hover:bg-[#E7DACB]/60"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="min-w-[2.25rem] text-center text-base font-bold text-[#372A20] tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Aumentar cantidad"
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#372A20] transition-colors hover:bg-[#E7DACB]/60"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="flex min-h-[46px] flex-1 cursor-pointer items-center justify-between gap-3 rounded-full bg-[#B45309] px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#8D4B00] active:scale-[0.99]"
            >
              <span>Añadir al pedido</span>
              <span className="tabular-nums">{formatPrice(lineTotal)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
