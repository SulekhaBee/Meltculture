import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import NavigationHeader from '../components/NavigationHeader';
import { productsData, categoryMeta, type CategoryId } from '../data/productsData';
import { ProductCard as SharedProductCard } from '../components/ProductCard';
import type { Product as SharedProduct } from '../components/ProductCard';

const assetPrefix = '/assets';
const ellipseIcon = `${assetPrefix}/f7abf.svg`;

const categoryHeroImg: Record<CategoryId, string> = {
  drinks:    `${assetPrefix}/34a0f.png`,
  halloween: `${assetPrefix}/4fd31.png`,
  diwali:    `${assetPrefix}/d21c5.png`,
};

const categoryLabel: Record<CategoryId, string> = {
  drinks:    '☕ Drinks & Chai',
  halloween: '🎃 Halloween Edition',
  diwali:    '🪔 Festive Drops',
};

function toSharedProduct(p: { slug: string; name: string; priceNum: number; badge: string; img: string; desc: string; rating: string }): SharedProduct {
  const ratingNum = parseFloat(p.rating);
  const reviewsMatch = p.rating.match(/\((\d+)/);
  return {
    id: p.slug,
    slug: p.slug,
    name: p.name,
    price: p.priceNum,
    rating: isNaN(ratingNum) ? 4.8 : ratingNum,
    reviewsCount: reviewsMatch ? parseInt(reviewsMatch[1]) : undefined,
    image: p.img,
    subtitle: p.desc,
    badge: p.badge,
  };
}

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const id = (categoryId ?? '') as CategoryId;
  const meta = categoryMeta[id];
  const products = productsData.filter((p) => p.category === id);
  const heroImg = categoryHeroImg[id];
  const label = categoryLabel[id] ?? id;
  const isDark = id === 'halloween';
  const [gridCols, setGridCols] = useState<2 | 1>(2);

  if (!meta) {
    return (
      <div className="min-h-screen bg-[#fdf6ed]">
        <Nav />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <p className="text-[#2c1a10] text-[24px] font-bold" style={{ fontFamily: 'Playfair Display' }}>
            Category not found.
          </p>
          <Link to="/shop" className="text-[#d97706] underline text-[14px]" style={{ fontFamily: 'Manrope' }}>
            Browse all products →
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: meta.bgColor }}>
      <Nav dark={isDark} />
      <NavigationHeader
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Collections', to: '/shop' },
          { label },
        ]}
        backContext="Collections"
      />

      {/* Hero banner */}
      <div
        className="relative h-[280px] md:h-[360px] overflow-hidden flex items-end"
        style={{ marginBottom: '0' }}
      >
        <img
          src={heroImg} alt={meta.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: isDark
            ? 'linear-gradient(180deg, rgba(15,5,25,0.2) 0%, rgba(15,5,25,0.82) 100%)'
            : 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)'
          }}
        />
        <div className="relative px-6 md:px-20 pb-10 md:pb-14 flex flex-col gap-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <img src={ellipseIcon} alt="" className="w-1.5 h-1.5 opacity-80" />
            <p className="text-white/70 text-[11px] font-bold tracking-[3px] uppercase" style={{ fontFamily: 'Manrope' }}>
              {label}
            </p>
          </div>
          <h1
            className="text-white text-[32px] md:text-[46px] font-bold italic leading-tight"
            style={{ fontFamily: 'Playfair Display' }}
          >
            {meta.title}
          </h1>
          <p className="text-white/80 text-[15px] leading-relaxed" style={{ fontFamily: 'Manrope' }}>
            {meta.subtitle}
          </p>
        </div>
      </div>

      {/* Product count strip */}
      <div
        className="px-6 md:px-20 py-5 flex items-center justify-between border-b"
        style={{
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2ceae',
          backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'transparent',
        }}
      >
        <p
          className="text-[13px] font-semibold"
          style={{ fontFamily: 'Manrope', color: isDark ? '#c5a059' : '#7a5c44' }}
        >
          {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-3">
          {/* Grid toggle */}
          <div
            className="flex items-center gap-1 rounded-full p-1"
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#fdf6ed', border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#e2ceae'}` }}
          >
            <button
              onClick={() => setGridCols(2)}
              aria-pressed={gridCols === 2}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-[14px]"
              style={{ backgroundColor: gridCols === 2 ? (isDark ? '#c5a059' : '#2c1a10') : 'transparent', color: gridCols === 2 ? '#fff' : (isDark ? '#c5a059' : '#7a5c44') }}
              title="Two columns"
            >
              ⊞
            </button>
            <button
              onClick={() => setGridCols(1)}
              aria-pressed={gridCols === 1}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-[14px]"
              style={{ backgroundColor: gridCols === 1 ? (isDark ? '#c5a059' : '#2c1a10') : 'transparent', color: gridCols === 1 ? '#fff' : (isDark ? '#c5a059' : '#7a5c44') }}
              title="Single column"
            >
              ☰
            </button>
          </div>
          <Link
            to="/shop"
            className="text-[12px] font-bold uppercase tracking-[1px] hover:opacity-70 transition-opacity"
            style={{ fontFamily: 'Manrope', color: isDark ? '#c5a059' : '#d97706' }}
          >
            View All →
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
        {products.length > 0 ? (
          <div className={`grid items-stretch ${
            gridCols === 2
              ? 'grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-6'
              : 'grid-cols-1 gap-4'
          }`}>
            {products.map((p) => (
              <SharedProductCard
                key={p.slug}
                product={toSharedProduct(p)}
                compact={gridCols === 2}
                landscape={gridCols === 1}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p
              className="text-[20px] font-bold italic"
              style={{ fontFamily: 'Playfair Display', color: isDark ? '#e8d5b7' : '#2c1a10' }}
            >
              More products coming soon.
            </p>
            <Link
              to="/shop"
              className="text-[14px] font-bold uppercase px-6 py-3 rounded-full transition-colors"
              style={{
                fontFamily: 'Manrope',
                backgroundColor: meta.accentColor,
                color: '#fff',
              }}
            >
              Browse All Products
            </Link>
          </div>
        )}
        </div>{/* /max-w-7xl */}
      </div>

      <Footer />
    </div>
  );
}
