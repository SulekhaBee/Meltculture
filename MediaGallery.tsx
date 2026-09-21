import React, { useState, useEffect, useCallback } from 'react';

interface MediaGalleryProps {
  images: string[];
  alt: string;
  badge?: string;
  badgeColor?: string;
}

export default function MediaGallery({ images, alt, badge, badgeColor }: MediaGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  // Reset when image set changes (e.g. wax color switch)
  useEffect(() => { setSelectedIdx(0); }, [images[0]]);

  const openLightbox = (idx: number) => { setLightboxIdx(idx); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const prev = useCallback(() => setLightboxIdx((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setLightboxIdx((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, prev, next]);

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  return (
    <>
      {/* ── Gallery ── */}
      <div className="flex flex-col w-full">

        {/* Main image — matches Figma: 515×515, cream bg, amber border, 16px radius */}
        <div
          className="relative w-full aspect-square rounded-[16px] overflow-hidden bg-[#f4efe6] border border-[#e8e1d5] cursor-zoom-in"
          onClick={() => openLightbox(selectedIdx)}
          role="button"
          aria-label="View full size"
        >
          <img
            src={images[selectedIdx]}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* PRE-ORDER badge — Figma: left-[11px] top-[11px], bg-[#e08a2e], px-[10px] py-[5px], rounded-[6px], Inter Bold 11px */}
          {badge && (
            <div
              className="absolute left-[11px] top-[11px] flex items-center justify-center px-[10px] py-[5px] rounded-[6px]"
              style={{ backgroundColor: badgeColor ?? '#e08a2e' }}
            >
              <p
                className="text-[11px] font-bold text-white uppercase leading-normal whitespace-nowrap"
                style={{ fontFamily: 'Inter' }}
              >
                {badge}
              </p>
            </div>
          )}
        </div>

        {/* Thumbnail strip — full width, 4 slots evenly distributed */}
        {images.length > 1 && (
          <div className="w-full flex justify-between gap-2 mt-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedIdx(i)}
                aria-label={`View image ${i + 1}`}
                className={`flex-1 aspect-square rounded-[10px] overflow-hidden bg-[#f4efe6] transition-all duration-150 ${
                  selectedIdx === i
                    ? 'border-2 border-[#e08a2e]'
                    : 'border border-[#e8e1d5] opacity-75 hover:opacity-100 hover:border-[#e08a2e]'
                }`}
              >
                <img
                  src={img}
                  alt={`${alt} ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <div
            className="relative rounded-[12px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightboxIdx]}
              alt={alt}
              className="max-w-[90vw] max-h-[90vh] object-contain block"
            />
            {/* Counter */}
            {images.length > 1 && (
              <div
                className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[12px] font-semibold px-3 py-1 rounded-full"
                style={{ fontFamily: 'Manrope' }}
              >
                {lightboxIdx + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Prev / Next */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 w-11 h-11 rounded-full flex items-center justify-center transition-colors"
                aria-label="Previous"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 w-11 h-11 rounded-full flex items-center justify-center transition-colors"
                aria-label="Next"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
              {/* Dot indicators */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setLightboxIdx(i); }}
                    className={`w-2 h-2 rounded-full transition-all ${lightboxIdx === i ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`}
                    aria-label={`Image ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
