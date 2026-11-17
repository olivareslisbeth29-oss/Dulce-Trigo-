import { BAKE_SCHEDULE } from '../data/menuData';

export function ObradorSection() {
  return (
    <section
      id="obrador"
      className="mt-16 bg-[#2A1F17] text-[#F7F0E7] sm:mt-20"
    >
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-8 sm:py-20 lg:px-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Craft manifesto */}
          <div className="lg:col-span-5">
            <p className="text-[13px] font-semibold tracking-[0.05em] text-[#FFB77D]">
              Nuestro obrador
            </p>
            <h2 className="mt-3 font-serif text-[28px] leading-[36px] font-semibold tracking-[0.005em] text-[#FFF8F0] sm:text-[36px] sm:leading-[44px]">
              Fermentación lenta,{' '}
              <em className="italic text-[#FFB77D]">sin prisas ni atajos</em>
            </h2>
            <p className="mt-4 text-base leading-relaxed tracking-[0.01em] text-[#E7DACB]">
              Cada mañana encendemos el horno de suela refractaria antes del
              amanecer. Trabajamos con harinas molidas a la piedra, mantequilla
              fermentada y vainilla natural en vaina para que cada bocado sepa a
              cocina de barrio hecha con oficio.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-white/12 pt-7">
              <div>
                <dt className="text-xs font-medium tracking-[0.02em] text-[#D8C2B4]">
                  Fermentación en frío
                </dt>
                <dd className="mt-1 font-serif text-2xl font-semibold text-[#FFF8F0] tabular-nums">
                  48 horas
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium tracking-[0.02em] text-[#D8C2B4]">
                  Hornadas diarias
                </dt>
                <dd className="mt-1 font-serif text-2xl font-semibold text-[#FFF8F0] tabular-nums">
                  3 pases al día
                </dd>
              </div>
            </dl>
          </div>

          {/* Daily baking schedule */}
          <div id="horno" className="lg:col-span-7">
            <div className="rounded-2xl border border-white/12 bg-[#372A20] p-6 sm:p-8">
              <div className="flex items-baseline justify-between gap-4 border-b border-white/12 pb-4">
                <h3 className="font-serif text-2xl font-semibold text-[#FFF8F0]">
                  Horno de hoy
                </h3>
                <span className="text-sm font-medium text-[#FFDCC3]">
                  Salidas en directo de vitrina
                </span>
              </div>

              <ol className="divide-y divide-white/10">
                {BAKE_SCHEDULE.map((slot) => (
                  <li
                    key={slot.time}
                    className="grid grid-cols-1 gap-2 py-5 first:pt-5 last:pb-0 sm:grid-cols-12 sm:gap-4"
                  >
                    <div className="sm:col-span-3">
                      <span className="font-serif text-xl font-semibold text-[#FFB77D] tabular-nums">
                        {slot.time}
                      </span>
                    </div>
                    <div className="sm:col-span-9">
                      <h4 className="font-serif text-lg font-semibold text-[#FFF8F0]">
                        {slot.batch}
                      </h4>
                      <p className="mt-1 text-[15px] leading-relaxed text-[#E7DACB]">
                        {slot.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
