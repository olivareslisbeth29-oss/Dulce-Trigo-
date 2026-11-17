import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Printer } from 'lucide-react';
import { TABLE_NUMBERS } from '../data/menuData';

interface QrTableModalProps {
  isOpen: boolean;
  activeTable: string;
  onClose: () => void;
  onSelectTable: (table: string) => void;
}

export function QrTableModal({
  isOpen,
  activeTable,
  onClose,
  onSelectTable,
}: QrTableModalProps) {
  const [previewTable, setPreviewTable] = useState(activeTable);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPreviewTable(activeTable);
  }, [activeTable, isOpen]);

  const tableUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?mesa=${previewTable}`
      : `?mesa=${previewTable}`;

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    QRCode.toDataURL(tableUrl, {
      width: 240,
      margin: 2,
      color: {
        dark: '#2A1F17',
        light: '#FFF8F0',
      },
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl('');
      });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelled = true;
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, tableUrl, onClose]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(tableUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleApplyTable = () => {
    onSelectTable(previewTable);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A1F17]/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-3xl border border-[#E7DACB] bg-[#FDF6ED] shadow-[0_20px_40px_-8px_rgba(55,42,32,0.28)]"
      >
        <div className="flex items-center justify-between border-b border-[#E7DACB] bg-white px-6 py-4">
          <div>
            <h2
              id="qr-modal-title"
              className="font-serif text-2xl font-semibold text-[#372A20]"
            >
              Carta QR de Mesa
            </h2>
            <p className="text-xs font-medium text-[#6C5B4F]">
              Escanea o comparte el enlace directo de tu mesa
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar código QR de mesa"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#372A20] hover:bg-[#F5ECE1]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6">
          {/* Table selector */}
          <label className="block text-xs font-semibold text-[#554336]">
            Seleccionar mesa para el código QR
            <select
              value={previewTable}
              onChange={(e) => setPreviewTable(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#E7DACB] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#372A20] tabular-nums focus:border-[#D97706] focus:outline-none focus:ring-2 focus:ring-[#D97706]/15"
            >
              {TABLE_NUMBERS.map((num) => (
                <option key={num} value={num}>
                  Mesa {num}
                </option>
              ))}
            </select>
          </label>

          {/* Printable Table Tent Preview */}
          <div className="mt-5 flex flex-col items-center rounded-2xl border border-[#E7DACB] bg-white p-6 text-center shadow-[0_4px_16px_-2px_rgba(55,42,32,0.05)]">
            <span className="font-serif text-xl font-semibold text-[#372A20]">
              Dulce Trigo
            </span>
            <span className="mt-0.5 text-xs font-semibold text-[#8D4B00]">
              Postres a la Carta · Mesa {previewTable}
            </span>

            <div className="mt-4 flex h-[216px] w-[216px] items-center justify-center overflow-hidden rounded-2xl border border-[#E7DACB] bg-[#FFF8F0] p-2">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`Código QR de la carta digital para la Mesa ${previewTable}`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-xs text-[#6C5B4F]">Generando QR...</span>
              )}
            </div>

            <p className="mt-3 text-xs text-[#6C5B4F]">
              Apunta con la cámara para pedir desde tu mesa
            </p>
          </div>

          {/* Actions */}
          <div className="mt-5 space-y-2.5">
            <button
              type="button"
              onClick={handleApplyTable}
              className="min-h-[46px] w-full cursor-pointer rounded-full bg-[#B45309] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#8D4B00]"
            >
              Usar Mesa {previewTable} en mi pedido
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex min-h-[42px] cursor-pointer items-center justify-center gap-2 rounded-full border border-[#E7DACB] bg-white px-4 py-2 text-xs font-semibold text-[#372A20] transition-colors hover:bg-[#F5ECE1]"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#15803D]" aria-hidden="true" />
                    <span>Enlace copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Copiar enlace</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex min-h-[42px] cursor-pointer items-center justify-center gap-2 rounded-full border border-[#E7DACB] bg-white px-4 py-2 text-xs font-semibold text-[#372A20] transition-colors hover:bg-[#F5ECE1]"
              >
                <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Imprimir QR</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
