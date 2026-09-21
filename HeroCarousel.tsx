import { useState, useEffect, useCallback, useRef, type TouchEvent } from 'react';
import { Link } from 'react-router-dom';

const assetPrefix = '/assets';

const slides = [
  {
    img: `${assetPrefix}/d21c5.png`,
    label: 'Ladoo Stack Candle',
    headline: "Handcrafted candles inspired by India's sweetest traditions.",
    cta: 'SHOP LADOO STACK',
    to: '/product/ladoo-stack',
  },
  {
    img: `${assetPrefix}/35c57.png`,
    label: 'Filter Coffee Candle',
    headline: 'Rich South Indian filter coffee in an authentic brass tumbler.',
    cta: 'SHOP FILTER COFFEE',
    to: '/product/filter-coffee-candle',
  },
  {
    img: `${assetPrefix}/f2192.png`,
    label: 'Cutting Chai Glass',
    headline: 'Warm spiced masala chai poured in a classic cutting glass.',
    cta: 'SHOP CUTTING CHAI',
    to: '/product/cutting-chai-candle',
  },
  {
    img: `${assetPrefix}/ce96a.png`,
    label: 'Kaju Katli Candle',
    headline: 'Pure silver vark finish infused with cardamom & condensed milk attar.',
    cta: 'SHOP KAJU KATLI',
    to: '/product/kaju-katli-quartet',
  },
  {
    img: `${assetPrefix}/c400d.png`,
    label: 'Lotus Water Platter',
    headline: 'Floating lotus soy wax sculpture hand-poured in small batches.',
    cta: 'SHOP LOTUS PLATTER',
    to: '/product/lotus-garden-montage',
  },
  {
    img: `${assetPrefix}/3b53d.png`,
    label: 'Midnight Bat Glass',
    headline: 'Dark violet gel & a bat wax embed. Our spookiest candle yet.',
    cta: 'SHOP MIDNIGHT BAT',
    to: '/product/pumpkin-patch-glass',
    halloween: true,
  },
  {
    img: `${assetPrefix}/f2ff6.png`,
    label: 'Sorcerer Elixir Skull',
    headline: 'Black rose, vetiver & smoked oud sealed inside a skull-cast vessel.',
    cta: 'SHOP SORCERER SKULL',
    to: '/product/sorcerer-elixir-skull',
    halloween: true,
  },
  {
    img: `${assetPrefix}/da24a.png`,
    label: 'Blueberry Gel Glass',
    headline: 'Indigo wild-berry gel with floating botanicals. Intensely pigmented.',
    cta: 'SHOP BLUEBERRY GEL',
    to: '/product/blueberry-gel-glass',
    halloween: true,
  },
  {
    img: `${assetPrefix}/13945.png`,
    label: 'Electric Trio Gift Set',
    headline: 'Three Halloween vessels in a velvet collector box. Limited to 33 sets.',
    cta: 'SHOP ELECTRIC TRIO',
    to: '/product/halloween-electric-trio',
    halloween: true,
  },
] as const;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((index: number) => {
    setCurrent(((index % slides.length) + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, next]);

  function handleTouchStart(e: TouchEvent<HTMLElement>) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: TouchEvent<HTMLElement>) {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
    touchStartX.current = null;
  }

  const slide = slides[current];

  return (
    <section
      className="relative h-[600px] md:h-[700px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide backgrounds — inactive slides are fully hidden via visibility */}
      {slides.map((s, i) => (
        <div
          key={s.label}
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: i === current ? 1 : 0,
            visibility: i === current ? 'visible' : 'hidden',
            zIndex: 1,
          }}
        >
          <img
            src={s.img}
            alt={s.label}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </div>
      ))}

      {/* Dark gradient overlay — always present, z above backgrounds */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.72) 100%)',
          zIndex: 2,
        }}
      />

      {/* Single active slide content — no stacking of invisible text layers */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 3 }}
      >
        <div className="text-center flex flex-col items-center gap-5 px-6 max-w-[860px]">
          {'halloween' in slide && slide.halloween ? (
            <span
              className="inline-flex items-center gap-2 text-[#e08a2e] text-[11px] font-bold tracking-[3px] uppercase drop-shadow"
              style={{ fontFamily: 'Manrope' }}
            >
              🎃 Halloween Drop — Limited Edition
            </span>
          ) : (
            <p className="text-white/90 text-[20px] md:text-[22px] font-bold italic drop-shadow-sm" style={{ fontFamily: 'Playfair Display' }}>
              Melt Culture.
            </p>
          )}
          <h1
            className="text-white text-[34px] md:text-[54px] font-bold italic leading-tight drop-shadow"
            style={{ fontFamily: 'Playfair Display' }}
          >
            {slide.headline}
          </h1>
          <div className="flex gap-3 md:gap-4 flex-wrap justify-center mt-1">
            <Link
              to={slide.to}
              data-testid={`hero-cta-${slide.label.toLowerCase().replace(/\s+/g, '-')}`}
              aria-label={`${slide.cta} — ${slide.headline}`}
              className="bg-[#d97706] text-white text-[12px] md:text-[13px] font-bold uppercase tracking-[1.5px] px-6 md:px-8 py-3 md:py-3.5 rounded-full hover:bg-[#b86000] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              style={{ fontFamily: 'Manrope' }}
            >
              {slide.cta}
            </Link>
            <Link
              to={'halloween' in slide && slide.halloween ? '/category/halloween' : '/gifting-guide'}
              aria-label={'halloween' in slide && slide.halloween ? 'Shop Halloween' : 'Explore Gift Boxes'}
              className="border-[1.5px] border-white text-white text-[12px] md:text-[13px] font-bold uppercase tracking-[1.5px] px-6 md:px-8 py-3 md:py-3.5 rounded-full hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{ fontFamily: 'Manrope' }}
            >
              {'halloween' in slide && slide.halloween ? 'Shop Halloween' : 'Explore Boxes'}
            </Link>
          </div>
        </div>
      </div>

      {/* Arrow: Previous */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full bg-black/30 hover:bg-black/50 text-white text-xl transition-colors hidden md:flex"
        style={{ zIndex: 4 }}
      >
        ‹
      </button>

      {/* Arrow: Next */}
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full bg-black/30 hover:bg-black/50 text-white text-xl transition-colors hidden md:flex"
        style={{ zIndex: 4 }}
      >
        ›
      </button>

      {/* Pagination dots */}
      <div
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2.5"
        style={{ zIndex: 4 }}
      >
        {slides.map((slide, i) => (
          <button
            key={`dot-${slide.label}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: i === current ? '#d97706' : 'rgba(255,255,255,0.55)',
              transform: i === current ? 'scale(1.4)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* Trust strip — infinite marquee ticker */}
      <div className="absolute bottom-0 left-0 right-0 bg-[rgba(26,24,23,0.75)] py-3 overflow-hidden" style={{ zIndex: 4 }}>
        <div className="marquee-track">
          {[...Array(2)].map((_, pass) =>
            ['100% SOY WAX', 'TOXIN-FREE & KID-SAFE', 'HAND-POURED IN INDIA', '8-20 HR+ BURN TIME', 'FREE SHIPPING ₹499+', 'PAN-INDIA EXPRESS SHIPPING'].map((item, i) => (
              <span
                key={`${pass}-${i}`}
                className="inline-flex items-center gap-4 mx-4 text-white text-[11px] font-bold tracking-[1.5px] uppercase"
                style={{ fontFamily: 'Manrope' }}
              >
                {item}
                <span className="text-[#c5a059] text-[10px]">✦</span>
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
