import { useState } from 'react';
import { Croissant } from 'lucide-react';

interface DessertImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectClassName?: string;
  priority?: boolean;
}

export function DessertImage({
  src,
  alt,
  className = '',
  aspectClassName = 'aspect-[4/3]',
  priority = false,
}: DessertImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-[#F5ECE1] ${aspectClassName} ${className}`}
    >
      {!hasError ? (
        <>
          {!isLoaded && (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-br from-[#F5ECE1] via-[#EFE4D5] to-[#E7DACB]"
            />
          )}
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            loading={priority ? 'eager' : 'lazy'}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`h-full w-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#F5ECE1] to-[#E7DACB] p-6 text-center text-[#6C5B4F]">
          <Croissant className="h-8 w-8 stroke-[1.5] text-[#8D4B00]" aria-hidden="true" />
          <span className="font-serif text-sm font-medium text-[#372A20]">
            {alt}
          </span>
        </div>
      )}
    </div>
  );
}
