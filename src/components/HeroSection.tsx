import { ArrowDown, QrCode, UtensilsCrossed, ShoppingBag } from 'lucide-react';
import { HERO_IMAGE, TABLE_NUMBERS } from '../data/menuData';
import { DessertImage } from './DessertImage';

export type ServiceMode = 'mesa' | 'llevar';

interface HeroSectionProps {
  serviceMode: ServiceMode;
  tableNumber: string;
  onChangeServiceMode: (mode: ServiceMode) => void;
  onChangeTableNumber: (table: string) => void;
  onOpenQrModal: () => void;
}

export function HeroSection({
  serviceMode,
  tableNumber,
  onChangeServiceMode,
  onChangeTableNumber,
  onOpenQrModal,
}: HeroSectionProps) {
  return (
    <section
      id="inicio"
      className="mx-auto max-w-[1200px] px-4 pt-8 pb-10 sm:px-8 sm:pt-12 sm:pb-14 lg:px-14 lg:pt-14 lg:pb-16"
    >
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Left editorial column */}
        <div className="flex flex-col justify-between lg:col-span-5">
          <div>
            <p className="text-[13px] font-semibold tracking-[0.04em] text-[#8D4B00]">
              Panadería artesanal · Carta QR de sobremesa
            </p>

            <h1 className="mt-3 font-serif text-[34px] leading-[40px] font-semibold tracking-[-0.015em] text-[#372A20] sm:text-[44px] sm:leading-[52px] lg:text-[48px] lg:leading-[56px]">
              Postres de obrador,{' '}
              <em className="font-semibold italic text-[#B45309]">
                recién salidos del horno
              </em>
            </h1>

            <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-[#554336] sm:text-[17px]">
              Masa madre viva, mantequilla fermentada y fruta de temporada. Elige
              tu porción desde la mesa, personaliza cada detalle y envía tu orden
              directo a nuestra vitrina.
            </p>

            {/* Primary CTA + QR access */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <a
                href="#carta"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#B45309] px-7 py-3 text-[15px] font-semibold text-white shadow-[0_6px_18px_-4px_rgba(180,83,9,0.4)] transition-all duration-150 hover:bg-[#8D4B00] active:scale-[0.98] whitespace-nowrap shrink-0"
              >
                <span>Explorar la carta</span>
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={onOpenQrModal}
                className="inline-flex min-h-[46px] cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-[#372A20] bg-transparent px-5 py-2.5 text-[15px] font-semibold text-[#372A20] transition-colors duration-150 hover:bg-[#372A20] hover:text-white whitespace-nowrap shrink-0"
              >
                <QrCode className="h-4 w-4" aria-hidden="true" />
                <span>QR de mesa</span>
              </button>
            </div>
          </div>

          {/* Inline service mode & table selector (interactive control in Hero body) */}
          <div className="mt-8 border-t border-[#E7DACB] pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                role="group"
                aria-label="Modalidad de pedido"
                className="inline-flex rounded-full border border-[#E7DACB] bg-[#F5ECE1] p-1"
              >
                <button
                  type="button"
                  onClick={() => onChangeServiceMode('mesa')}
                  className={`inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    serviceMode === 'mesa'
                      ? 'bg-[#372A20] text-white'
                      : 'text-[#554336] hover:text-[#372A20]'
                  }`}
                >
                  <UtensilsCrossed className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>En mesa</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeServiceMode('llevar')}
                  className={`inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    serviceMode === 'llevar'
                      ? 'bg-[#372A20] text-white'
                      : 'text-[#554336] hover:text-[#372A20]'
                  }`}
                >
                  <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Para llevar</span>
                </button>
              </div>

              {serviceMode === 'mesa' ? (
                <label className="inline-flex items-center gap-2 text-sm font-medium text-[#554336]">
                  <span>Tu mesa:</span>
                  <select
                    aria-label="Seleccionar número de mesa"
                    value={tableNumber}
                    onChange={(e) => onChangeTableNumber(e.target.value)}
                    className="min-h-[38px] cursor-pointer rounded-lg border border-[#E7DACB] bg-white px-3 py-1.5 text-sm font-semibold text-[#372A20] tabular-nums transition-colors focus:border-[#D97706] focus:outline-none focus:ring-2 focus:ring-[#D97706]/20"
                  >
                    {TABLE_NUMBERS.map((num) => (
                      <option key={num} value={num}>
                        Mesa {num}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <span className="text-sm font-medium text-[#554336]">
                  Retiro en barra · Listo en 10–15 min
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Hero Photography */}
        <div className="lg:col-span-7">
          <div className="relative h-full overflow-hidden rounded-2xl border border-[#E7DACB] shadow-[0_12px_32px_-8px_rgba(55,42,32,0.12)]">
            <DessertImage
              src={HERO_IMAGE}
              alt="Mesa de postres artesanales de Dulce Trigo con tarta vasca, croissants de pistacho y galette de manzana"
              aspectClassName="aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[420px]"
              priority
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2A1F17]/80 via-[#2A1F17]/30 to-transparent px-5 pt-12 pb-4 sm:px-6 sm:pb-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-[#FFF8F0]/95 sm:text-sm">
                <span className="font-serif text-[15px] font-medium text-white sm:text-base">
                  Vitrina del día · Horneado en Calle del Trigo, 14
                </span>
                <span className="tabular-nums text-[#FFDCC3]">
                  Abierto 07:30 – 20:30
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
