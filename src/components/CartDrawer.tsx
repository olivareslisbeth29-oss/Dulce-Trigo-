import { useEffect, useMemo, useState } from 'react';
import {
  X,
  Minus,
  Plus,
  Trash2,
  MessageCircle,
  CheckCircle2,
  Copy,
  Check,
  UtensilsCrossed,
  ShoppingBag,
  Clock,
  Smartphone,
  CreditCard,
  Banknote,
  QrCode,
} from 'lucide-react';
import {
  BAKERY_WHATSAPP_NUMBER,
  CartItem,
  PAYMENT_METHODS,
  PaymentMethod,
  TABLE_NUMBERS,
  YAPE_HOLDER_NAME,
  YAPE_NUMBER_DISPLAY,
  YAPE_NUMBER_RAW,
  YAPE_QR_IMAGE,
  formatPrice,
} from '../data/menuData';
import { ServiceMode } from './HeroSection';

interface ConfirmedOrder {
  code: string;
  createdAt: string;
  serviceMode: ServiceMode;
  tableNumber: string;
  pickupTime: string;
  guestName: string;
  paymentMethod: PaymentMethod;
  cashPayWith: string;
  items: CartItem[];
  total: number;
  whatsappText: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  serviceMode: ServiceMode;
  tableNumber: string;
  onClose: () => void;
  onChangeServiceMode: (mode: ServiceMode) => void;
  onChangeTableNumber: (table: string) => void;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
}

const PICKUP_SLOTS = [
  'Lo antes posible (15 min)',
  'En 30 minutos',
  'En 1 hora',
  'Merienda (16:00)',
];

function generateOrderCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `DT-${num}`;
}

function getPaymentLabel(method: PaymentMethod): string {
  return PAYMENT_METHODS.find((m) => m.id === method)?.label ?? 'Yape';
}

export function CartDrawer({
  isOpen,
  items,
  serviceMode,
  tableNumber,
  onClose,
  onChangeServiceMode,
  onChangeTableNumber,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [guestName, setGuestName] = useState('');
  const [pickupTime, setPickupTime] = useState(PICKUP_SLOTS[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('yape');
  const [cashPayWith, setCashPayWith] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isQrExpanded, setIsQrExpanded] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isQrExpanded) {
          setIsQrExpanded(false);
        } else {
          onClose();
        }
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isQrExpanded, onClose]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items]
  );

  const buildWhatsAppMessage = (orderCode?: string) => {
    const header = orderCode
      ? `Hola Dulce Trigo, confirmo mi pedido ${orderCode}:`
      : 'Hola Dulce Trigo, quiero realizar este pedido desde la Carta QR:';

    const serviceLine =
      serviceMode === 'mesa'
        ? `Modalidad: Servir en Mesa ${tableNumber}`
        : `Modalidad: Para llevar (${pickupTime})`;

    const nameLine = guestName.trim() ? `Nombre: ${guestName.trim()}` : '';

    let paymentLine = `Método de pago: ${getPaymentLabel(paymentMethod)}`;
    if (paymentMethod === 'efectivo' && cashPayWith.trim()) {
      paymentLine += ` (Pago con ${cashPayWith.trim()})`;
    } else if (paymentMethod === 'yape' || paymentMethod === 'plin') {
      paymentLine += ` (${YAPE_NUMBER_DISPLAY})`;
    }

    const itemLines = items.map((entry) => {
      const extrasText =
        entry.extras.length > 0
          ? ` [${entry.extras.map((e) => e.label).join(', ')}]`
          : '';
      const noteText = entry.note ? ` — Nota: ${entry.note}` : '';
      return `• ${entry.quantity}x ${entry.dessert.name} (${entry.portion.label})${extrasText}${noteText} — ${formatPrice(entry.unitPrice * entry.quantity)}`;
    });

    const receiptHint =
      paymentMethod === 'yape' || paymentMethod === 'plin'
        ? 'Adjunto mi captura de pago por aquí.'
        : '';

    return [
      header,
      serviceLine,
      nameLine,
      paymentLine,
      '',
      ...itemLines,
      '',
      `Total a pagar: ${formatPrice(subtotal)}`,
      receiptHint,
    ]
      .filter((line, idx, arr) => !(line === '' && arr[idx - 1] === ''))
      .join('\n')
      .trim();
  };

  const currentWhatsAppText = buildWhatsAppMessage();
  const whatsappHref = `https://wa.me/${BAKERY_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    confirmedOrder ? confirmedOrder.whatsappText : currentWhatsAppText
  )}`;

  const handleConfirmDirectOrder = () => {
    if (items.length === 0) return;
    const code = generateOrderCode();
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const snapshot: ConfirmedOrder = {
      code,
      createdAt: formattedTime,
      serviceMode,
      tableNumber,
      pickupTime,
      guestName: guestName.trim(),
      paymentMethod,
      cashPayWith: cashPayWith.trim(),
      items: [...items],
      total: subtotal,
      whatsappText: buildWhatsAppMessage(code),
    };

    setConfirmedOrder(snapshot);
    onClearCart();
  };

  const handleCopySummary = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessage(true);
      window.setTimeout(() => setCopiedMessage(false), 2000);
    } catch {
      setCopiedMessage(false);
    }
  };

  const handleCopyYapeNumber = async () => {
    try {
      await navigator.clipboard.writeText(YAPE_NUMBER_RAW);
      setCopiedNumber(true);
      window.setTimeout(() => setCopiedNumber(false), 2000);
    } catch {
      setCopiedNumber(false);
    }
  };

  const handleCloseDrawer = () => {
    setIsQrExpanded(false);
    onClose();
  };

  const handleStartNewOrder = () => {
    setConfirmedOrder(null);
    setCashPayWith('');
    setIsQrExpanded(false);
    onClose();
  };

  const renderPaymentIcon = (id: PaymentMethod) => {
    switch (id) {
      case 'yape':
        return <QrCode className="h-4 w-4 shrink-0" aria-hidden="true" />;
      case 'plin':
        return <Smartphone className="h-4 w-4 shrink-0" aria-hidden="true" />;
      case 'pos':
        return <CreditCard className="h-4 w-4 shrink-0" aria-hidden="true" />;
      case 'efectivo':
        return <Banknote className="h-4 w-4 shrink-0" aria-hidden="true" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 flex justify-end bg-[#2A1F17]/55 backdrop-blur-sm"
      onClick={handleCloseDrawer}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-md flex-col border-l border-[#E7DACB] bg-[#FDF6ED] shadow-[0_20px_40px_-8px_rgba(55,42,32,0.28)]"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#E7DACB] bg-white px-5 py-4">
          <div>
            <h2
              id="cart-drawer-title"
              className="font-serif text-2xl font-semibold text-[#372A20]"
            >
              {confirmedOrder ? 'Pedido confirmado' : 'Tu pedido'}
            </h2>
            <p className="text-xs font-medium text-[#6C5B4F]">
              {confirmedOrder
                ? `Comanda #${confirmedOrder.code} · ${confirmedOrder.createdAt}`
                : serviceMode === 'mesa'
                  ? `Servicio en Mesa ${tableNumber}`
                  : 'Retiro en barra · Dulce Trigo'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCloseDrawer}
            aria-label="Cerrar resumen del pedido"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#372A20] transition-colors hover:bg-[#F5ECE1]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Confirmed Order State */}
        {confirmedOrder ? (
          <div className="flex flex-1 flex-col justify-between overflow-y-auto p-5">
            <div>
              <div className="rounded-2xl border border-[#E7DACB] bg-white p-5 shadow-[0_4px_16px_-2px_rgba(55,42,32,0.05)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#15803D]/10 text-[#15803D]">
                    <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#15803D]">
                      En preparación en obrador
                    </p>
                    <h3 className="font-serif text-xl font-semibold text-[#372A20] tabular-nums">
                      Pedido #{confirmedOrder.code}
                    </h3>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#F5ECE1] px-3.5 py-2.5 text-sm font-medium text-[#372A20]">
                  <Clock className="h-4 w-4 shrink-0 text-[#8D4B00]" aria-hidden="true" />
                  <span>
                    {confirmedOrder.serviceMode === 'mesa'
                      ? `Lo llevaremos a la Mesa ${confirmedOrder.tableNumber} en 8–12 min.`
                      : `Listo en barra: ${confirmedOrder.pickupTime}.`}
                  </span>
                </div>

                {/* Payment summary inside receipt */}
                <div className="mt-3 rounded-xl border border-[#E7DACB] bg-[#FDF6ED] px-3.5 py-2.5 text-xs text-[#554336]">
                  <span className="font-semibold text-[#372A20]">
                    Método de pago:{' '}
                  </span>
                  <span>{getPaymentLabel(confirmedOrder.paymentMethod)}</span>
                  {confirmedOrder.paymentMethod === 'efectivo' &&
                    confirmedOrder.cashPayWith && (
                      <span> · Pago con {confirmedOrder.cashPayWith}</span>
                    )}
                </div>

                {(confirmedOrder.paymentMethod === 'yape' ||
                  confirmedOrder.paymentMethod === 'plin') && (
                  <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[#E7DACB] bg-white p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={() => setIsQrExpanded(true)}
                        aria-label="Ampliar código QR de Yape"
                        className="h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-[#E7DACB] bg-[#742284]"
                      >
                        <img
                          src={YAPE_QR_IMAGE}
                          alt="Código QR de Yape Dulce Trigo"
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                      </button>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#372A20]">
                          {confirmedOrder.paymentMethod === 'yape'
                            ? 'Yapea al número o QR'
                            : 'Plinea al número o QR'}
                        </p>
                        <p className="font-sans text-sm font-bold text-[#8D4B00] tabular-nums">
                          {YAPE_NUMBER_DISPLAY}
                        </p>
                        <p className="truncate text-[11px] text-[#6C5B4F]">
                          {YAPE_HOLDER_NAME}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyYapeNumber}
                      className="inline-flex min-h-[36px] shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[#E7DACB] bg-[#FDF6ED] px-3 py-1.5 text-xs font-semibold text-[#372A20] hover:bg-[#F5ECE1]"
                    >
                      {copiedNumber ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-[#15803D]" aria-hidden="true" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <ul className="mt-5 divide-y divide-[#F5ECE1] text-sm">
                  {confirmedOrder.items.map((entry) => (
                    <li
                      key={entry.cartItemId}
                      className="flex items-start justify-between gap-3 py-3 first:pt-0"
                    >
                      <div>
                        <p className="font-semibold text-[#372A20]">
                          <span className="tabular-nums">{entry.quantity}×</span>{' '}
                          {entry.dessert.name}
                        </p>
                        <p className="text-xs text-[#6C5B4F]">
                          {entry.portion.label}
                          {entry.extras.length > 0 &&
                            ` · ${entry.extras.map((e) => e.label).join(', ')}`}
                        </p>
                        {entry.note && (
                          <p className="mt-0.5 text-xs italic text-[#8D4B00]">
                            Nota: {entry.note}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 font-bold text-[#372A20] tabular-nums">
                        {formatPrice(entry.unitPrice * entry.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex items-center justify-between border-t border-[#E7DACB] pt-3.5">
                  <span className="font-serif text-lg font-semibold text-[#372A20]">
                    Total comanda
                  </span>
                  <span className="text-xl font-bold text-[#B45309] tabular-nums">
                    {formatPrice(confirmedOrder.total)}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[#16A34A] px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#15803D]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {confirmedOrder.paymentMethod === 'yape' ||
                    confirmedOrder.paymentMethod === 'plin'
                      ? 'Enviar comprobante por WhatsApp'
                      : 'Enviar copia por WhatsApp'}
                  </span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopySummary(confirmedOrder.whatsappText)}
                  className="flex min-h-[42px] w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[#E7DACB] bg-white px-4 py-2.5 text-sm font-semibold text-[#372A20] transition-colors hover:bg-[#F5ECE1]"
                >
                  {copiedMessage ? (
                    <>
                      <Check className="h-4 w-4 text-[#15803D]" aria-hidden="true" />
                      <span>Comanda copiada</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      <span>Copiar ticket de pedido</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartNewOrder}
              className="mt-6 min-h-[46px] w-full cursor-pointer rounded-full bg-[#372A20] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2A1F17]"
            >
              Volver a la carta
            </button>
          </div>
        ) : items.length === 0 ? (
          /* Empty Cart State */
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F5ECE1] text-[#8D4B00]">
              <ShoppingBag className="h-7 w-7 stroke-[1.6]" aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-serif text-xl font-semibold text-[#372A20]">
              Tu bandeja está vacía
            </h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#6C5B4F]">
              Añade tartas recién cortadas, bollería de masa madre o un café de
              especialidad para armar tu pedido.
            </p>
            <button
              type="button"
              onClick={handleCloseDrawer}
              className="mt-6 min-h-[44px] cursor-pointer rounded-full bg-[#B45309] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#8D4B00]"
            >
              Explorar postres
            </button>
          </div>
        ) : (
          /* Active Cart State */
          <>
            <div className="flex-1 overflow-y-auto p-5">
              {/* Service Mode Selector inside Drawer */}
              <div className="rounded-2xl border border-[#E7DACB] bg-white p-4">
                <div className="grid grid-cols-2 gap-1.5 rounded-full bg-[#F5ECE1] p-1">
                  <button
                    type="button"
                    onClick={() => onChangeServiceMode('mesa')}
                    className={`inline-flex min-h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      serviceMode === 'mesa'
                        ? 'bg-[#372A20] text-white'
                        : 'text-[#554336] hover:text-[#372A20]'
                    }`}
                  >
                    <UtensilsCrossed className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Servir en mesa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeServiceMode('llevar')}
                    className={`inline-flex min-h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      serviceMode === 'llevar'
                        ? 'bg-[#372A20] text-white'
                        : 'text-[#554336] hover:text-[#372A20]'
                    }`}
                  >
                    <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Para llevar</span>
                  </button>
                </div>

                <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {serviceMode === 'mesa' ? (
                    <label className="block text-xs font-semibold text-[#554336]">
                      Número de mesa
                      <select
                        value={tableNumber}
                        onChange={(e) => onChangeTableNumber(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-[#E7DACB] bg-[#FDF6ED] px-3 py-2 text-sm font-semibold text-[#372A20] tabular-nums focus:border-[#D97706] focus:outline-none focus:ring-2 focus:ring-[#D97706]/15"
                      >
                        {TABLE_NUMBERS.map((num) => (
                          <option key={num} value={num}>
                            Mesa {num}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <label className="block text-xs font-semibold text-[#554336]">
                      Hora de retiro
                      <select
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-[#E7DACB] bg-[#FDF6ED] px-3 py-2 text-sm font-semibold text-[#372A20] focus:border-[#D97706] focus:outline-none focus:ring-2 focus:ring-[#D97706]/15"
                      >
                        {PICKUP_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  <label className="block text-xs font-semibold text-[#554336]">
                    Tu nombre (opcional)
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Ej. Clara"
                      className="mt-1 w-full rounded-lg border border-[#E7DACB] bg-[#FDF6ED] px-3 py-2 text-sm text-[#372A20] placeholder:text-[#887364] focus:border-[#D97706] focus:outline-none focus:ring-2 focus:ring-[#D97706]/15"
                    />
                  </label>
                </div>
              </div>

              {/* Cart Items */}
              <ul className="mt-4 space-y-3">
                {items.map((entry) => (
                  <li
                    key={entry.cartItemId}
                    className="rounded-2xl border border-[#E7DACB] bg-white p-4 shadow-[0_2px_10px_-2px_rgba(55,42,32,0.04)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-serif text-[17px] leading-snug font-semibold text-[#372A20]">
                          {entry.dessert.name}
                        </h3>
                        <p className="mt-0.5 text-xs font-medium text-[#6C5B4F]">
                          {entry.portion.label}
                        </p>
                        {entry.extras.length > 0 && (
                          <p className="mt-1 text-xs text-[#6C5B4F]">
                            + {entry.extras.map((e) => e.label).join(', ')}
                          </p>
                        )}
                        {entry.note && (
                          <p className="mt-1 text-xs italic text-[#8D4B00]">
                            Nota: {entry.note}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(entry.cartItemId)}
                        aria-label={`Quitar ${entry.dessert.name} del pedido`}
                        className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#7C6A5A] transition-colors hover:bg-[#F5ECE1] hover:text-[#BA1A1A]"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-[#F5ECE1] pt-3">
                      <div className="inline-flex items-center rounded-full border border-[#E7DACB] bg-[#FDF6ED] p-0.5">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(entry.cartItemId, -1)}
                          aria-label={`Quitar una unidad de ${entry.dessert.name}`}
                          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#372A20] hover:bg-[#E7DACB]/60"
                        >
                          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <span className="min-w-[2rem] text-center text-sm font-bold text-[#372A20] tabular-nums">
                          {entry.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(entry.cartItemId, 1)}
                          aria-label={`Sumar una unidad de ${entry.dessert.name}`}
                          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#372A20] hover:bg-[#E7DACB]/60"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>

                      <span className="text-base font-bold text-[#B45309] tabular-nums">
                        {formatPrice(entry.unitPrice * entry.quantity)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Payment Method Selector */}
              <fieldset className="mt-5 rounded-2xl border border-[#E7DACB] bg-white p-4">
                <legend className="px-1 font-serif text-lg font-semibold text-[#372A20]">
                  Método de pago
                </legend>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map((method) => {
                    const isSelected = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex min-h-[54px] cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                          isSelected
                            ? 'border-[#372A20] bg-[#372A20] text-white'
                            : 'border-[#E7DACB] bg-[#FDF6ED] text-[#372A20] hover:border-[#D8C2B4] hover:bg-[#F5ECE1]'
                        }`}
                      >
                        <span
                          className={
                            isSelected ? 'text-[#FFB77D]' : 'text-[#8D4B00]'
                          }
                        >
                          {renderPaymentIcon(method.id)}
                        </span>
                        <span className="min-w-0 leading-tight">
                          <span className="block truncate text-sm font-semibold">
                            {method.label}
                          </span>
                          <span
                            className={`block truncate text-[11px] ${
                              isSelected ? 'text-[#E7DACB]' : 'text-[#6C5B4F]'
                            }`}
                          >
                            {method.subtitle}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Yape / Plin Payment Details & QR */}
                {(paymentMethod === 'yape' || paymentMethod === 'plin') && (
                  <div className="mt-3.5 rounded-xl border border-[#E7DACB] bg-[#FDF6ED] p-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-[#8D4B00]">
                          {paymentMethod === 'yape'
                            ? 'Paga con Yape (QR o número)'
                            : 'Paga con Plin (número o QR interoperable)'}
                        </p>
                        <p className="mt-1 font-sans text-lg font-bold text-[#372A20] tabular-nums">
                          {YAPE_NUMBER_DISPLAY}
                        </p>
                        <p className="text-xs text-[#6C5B4F]">
                          Titular: {YAPE_HOLDER_NAME}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyYapeNumber}
                        className="inline-flex min-h-[38px] shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[#E7DACB] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#372A20] transition-colors hover:bg-[#F5ECE1]"
                      >
                        {copiedNumber ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-[#15803D]" aria-hidden="true" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="mt-3 flex flex-col items-center rounded-xl border border-[#E7DACB] bg-white p-3 text-center">
                      <button
                        type="button"
                        onClick={() => setIsQrExpanded(true)}
                        aria-label="Ver QR de Yape en tamaño grande"
                        className="group relative w-44 cursor-pointer overflow-hidden rounded-xl border border-[#E7DACB] bg-[#742284] shadow-sm transition-transform hover:scale-[1.02]"
                      >
                        <img
                          src={YAPE_QR_IMAGE}
                          alt="Código QR de Yape de Lisbeth Juanita Olivares Alayo"
                          referrerPolicy="no-referrer"
                          className="h-auto w-full object-contain"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsQrExpanded(true)}
                        className="mt-2 cursor-pointer text-xs font-semibold text-[#8D4B00] underline-offset-2 hover:underline"
                      >
                        Tocar para ampliar el QR
                      </button>
                      <p className="mt-1 text-xs text-[#6C5B4F]">
                        Monto exacto:{' '}
                        <strong className="font-bold text-[#372A20] tabular-nums">
                          {formatPrice(subtotal)}
                        </strong>
                        . Luego envía tu captura por WhatsApp.
                      </p>
                    </div>
                  </div>
                )}

                {/* POS Details */}
                {paymentMethod === 'pos' && (
                  <p className="mt-3 rounded-xl bg-[#FDF6ED] px-3.5 py-2.5 text-xs leading-relaxed text-[#554336]">
                    {serviceMode === 'mesa'
                      ? `Llevaremos el POS inalámbrico a la Mesa ${tableNumber}. Aceptamos tarjetas Visa, Mastercard y pagos sin contacto.`
                      : 'Paga con tarjeta de crédito o débito en barra al recoger tu pedido.'}
                  </p>
                )}

                {/* Cash Details */}
                {paymentMethod === 'efectivo' && (
                  <div className="mt-3 rounded-xl bg-[#FDF6ED] p-3">
                    <label className="block text-xs font-semibold text-[#554336]">
                      ¿Con cuánto pagarás? (opcional, para llevar vuelto)
                      <input
                        type="text"
                        value={cashPayWith}
                        onChange={(e) => setCashPayWith(e.target.value)}
                        placeholder="Ej. S/ 50.00 o monto exacto"
                        className="mt-1.5 w-full rounded-lg border border-[#E7DACB] bg-white px-3 py-2 text-sm text-[#372A20] placeholder:text-[#887364] focus:border-[#D97706] focus:outline-none focus:ring-2 focus:ring-[#D97706]/15"
                      />
                    </label>
                  </div>
                )}
              </fieldset>
            </div>

            {/* Sticky Checkout Footer */}
            <div className="border-t border-[#E7DACB] bg-white p-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-[#6C5B4F]">
                  Total estimado (IGV incl.)
                </span>
                <span className="font-sans text-2xl font-bold text-[#372A20] tabular-nums">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="mt-4 space-y-2.5">
                <button
                  type="button"
                  onClick={handleConfirmDirectOrder}
                  className="flex min-h-[48px] w-full cursor-pointer items-center justify-center rounded-full bg-[#B45309] px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#8D4B00] active:scale-[0.99]"
                >
                  {serviceMode === 'mesa'
                    ? `Confirmar en Mesa ${tableNumber}`
                    : 'Confirmar pedido para llevar'}
                </button>

                <div className="flex gap-2">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-full bg-[#16A34A] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#15803D]"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    <span>
                      {paymentMethod === 'yape' || paymentMethod === 'plin'
                        ? 'Enviar pedido y constancia'
                        : 'Pedir por WhatsApp'}
                    </span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopySummary(currentWhatsAppText)}
                    aria-label="Copiar texto del pedido"
                    title="Copiar resumen del pedido"
                    className="inline-flex min-h-[46px] min-w-[46px] cursor-pointer items-center justify-center rounded-full border border-[#E7DACB] bg-[#FDF6ED] text-[#372A20] transition-colors hover:bg-[#F5ECE1]"
                  >
                    {copiedMessage ? (
                      <Check className="h-4 w-4 text-[#15803D]" aria-hidden="true" />
                    ) : (
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Expanded Yape QR Lightbox */}
      {isQrExpanded && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsQrExpanded(false);
          }}
          className="fixed inset-0 z-60 flex items-center justify-center bg-[#2A1F17]/80 p-5 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-[#E7DACB] bg-white p-4 text-center shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setIsQrExpanded(false)}
              aria-label="Cerrar vista ampliada del QR de Yape"
              className="absolute top-3 right-3 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#2A1F17]/80 text-white hover:bg-[#2A1F17]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="overflow-hidden rounded-2xl bg-[#742284]">
              <img
                src={YAPE_QR_IMAGE}
                alt="Código QR de Yape de Lisbeth Juanita Olivares Alayo"
                referrerPolicy="no-referrer"
                className="mx-auto max-h-[62vh] w-full object-contain"
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 px-1">
              <div className="text-left">
                <p className="text-xs text-[#6C5B4F]">Número Yape / Plin</p>
                <p className="text-base font-bold text-[#372A20] tabular-nums">
                  {YAPE_NUMBER_DISPLAY}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyYapeNumber}
                className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-full bg-[#372A20] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2A1F17]"
              >
                {copiedNumber ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#22C55E]" aria-hidden="true" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Copiar número</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
