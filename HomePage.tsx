import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import HeroCarousel from '../components/HeroCarousel';
import { useCart } from '../context/CartContext';
import { ProductCard, ProductGrid } from '../components/ProductCard';
import type { Product } from '../components/ProductCard';

const assetPrefix = '/assets';

const img3WaysExpress = `${assetPrefix}/14781.png`;
const img3WaysFestive = `${assetPrefix}/9bb8d.png`;
const img3WaysCustom = `${assetPrefix}/b9b61.png`;
const starIcon = `${assetPrefix}/0a46e.svg`;
const ellipseIcon = `${assetPrefix}/f7abf.svg`;

// Diwali collection products
const imgLadoo = `${assetPrefix}/d21c5.png`;
const imgKajuKatli = `${assetPrefix}/ce96a.png`;
const imgModak = `${assetPrefix}/4bc1c.png`;
const imgImarthi = `${assetPrefix}/5aaec.png`;
const imgPeonyLake = `${assetPrefix}/85d04.png`;
const imgMithaiDabba = `${assetPrefix}/5a082.png`;
const imgWaterLily = `${assetPrefix}/64561.png`;
const imgSereneLotusLake = `${assetPrefix}/0b246.png`;
const imgLotusDawn = `${assetPrefix}/73778.png`;
const imgLotusGarden = `${assetPrefix}/960e1.png`;

// Chai / beverage
const imgChaiCandle = `${assetPrefix}/f2192.png`;
const imgCoffeeCandle = `${assetPrefix}/35c57.png`;

// Gift boxes
const imgKraftBox = `${assetPrefix}/e2356.png`;
const imgPastelBox = `${assetPrefix}/0e412.png`;
const imgCorporateHamper = `${assetPrefix}/b6c4c.png`;

// Corporate tiers
const imgGiftAssort = `${assetPrefix}/2ea36.png`;

// "Full Catalog" coming soon blocks
const imgHalloween = `${assetPrefix}/4fd31.png`;
const imgDrinkDazzle = `${assetPrefix}/34a0f.png`;
const imgFurniture = `${assetPrefix}/49d2e.png`;
const imgCraftKitchen = `${assetPrefix}/bd6c4.png`;
const imgChristmas = `${assetPrefix}/f9e6f.png`;
const imgDessert = `${assetPrefix}/661d4.png`;
const imgWedding = `${assetPrefix}/50c2c.png`;

const diwaliProducts: Product[] = [
  { id: 'ladoo-stack', slug: 'ladoo-stack', name: 'Ladoo Stack', price: 249, rating: 4.9, reviewsCount: 35, image: imgLadoo, subtitle: 'Golden besan ladoo with saffron strands, on brass thali', badge: '📅 Pre-Order' },
  { id: 'kaju-katli-quartet', slug: 'kaju-katli-quartet', name: 'Kaju Katli Quartet', price: 299, rating: 4.9, reviewsCount: 35, image: imgKajuKatli, subtitle: 'Diamond-shaped kaju katli with silver varq, rose-pistachio scent', badge: '📅 Pre-Order' },
  { id: 'modak-quartet', slug: 'modak-quartet', name: 'Modak Quartet', price: 299, rating: 4.8, reviewsCount: 22, image: imgModak, subtitle: 'Hand-shaped coconut modak set with lotus-honey fragrance', badge: '📅 Pre-Order' },
  { id: 'nankati-bharati', slug: 'nankati-bharati', name: 'Nankati Bharati', price: 349, rating: 4.9, reviewsCount: 18, image: imgImarthi, subtitle: 'Crispy Diwali swirls, rose-cardamom infused soy wax', badge: '📅 Pre-Order' },
  { id: 'peony-lake', slug: 'peony-lake', name: 'Peony Lake', price: 699, rating: 4.7, reviewsCount: 14, image: imgPeonyLake, subtitle: 'Floating peony and rose blooms in aqua gel, cedar-peony scent' },
  { id: 'mithai-dabba-set', slug: 'mithai-dabba-set', name: 'Mithai Dabba Set', price: 549, rating: 5.0, reviewsCount: 41, image: imgMithaiDabba, subtitle: 'Curated assortment in a lacquer dabba, perfect gift' },
  { id: 'serene-lotus-lake', slug: 'serene-lotus-lake', name: 'Serene Lotus Lake', price: 799, rating: 4.8, reviewsCount: 9, image: imgSereneLotusLake, subtitle: 'Lotus blooms in clear gel · Serene Green & Cotton Phlox', badge: '📅 Pre-Order' },
  { id: 'water-lily-lake', slug: 'water-lily-lake', name: 'Water Lily Lake', price: 799, rating: 4.8, reviewsCount: 9, image: imgWaterLily, subtitle: 'Lotus blooms in clear gel vessel, aquatic-green fragrance' },
  { id: 'lotus-dawn', slug: 'lotus-dawn', name: 'Lotus Dawn', price: 749, rating: 4.6, reviewsCount: 7, image: imgLotusDawn, subtitle: 'Sunrise lotus in cream soy wax, jasmine & sandalwood' },
  { id: 'lotus-garden-montage', slug: 'lotus-garden-montage', name: 'Lotus Garden Montage', price: 1100, rating: 5.0, reviewsCount: 3, image: imgLotusGarden, subtitle: 'Panoramic lotus garden, artisan-grade botanical embed' },
];

const catalogItems = [
  { label: 'Halloween & Zodiac', img: imgHalloween, badge: 'LIVE NOW', link: '/category/halloween' },
  { label: 'Drink & Dazzle', img: imgDrinkDazzle, badge: 'LIVE NOW', link: '/category/drinks' },
  { label: 'Furniture Brand', img: imgFurniture, badge: 'COMING SOON', link: '#' },
  { label: 'Craft Kitchen', img: imgCraftKitchen, badge: 'COMING SOON', link: '#' },
  { label: 'Christmas Atelier', img: imgChristmas, badge: 'COMING SOON', link: '#' },
  { label: 'Dessert & Edible', img: imgDessert, badge: 'COMING SOON', link: '#' },
  { label: 'Wedding & Baby Shower', img: imgWedding, badge: 'COMING SOON', link: '#' },
];

// Local ProductCard kept only for type-checking; actual rendering uses shared component
function _unusedProductCard({ name, price, rating, img, desc, slug, compact = false }: {
  name: string; price: string; rating: string; img: string; desc: string; slug?: string; compact?: boolean;
}) {
  const { addItem, openCart } = useCart();
  const navigate = useNavigate();
  const priceNum = parseInt(price.replace(/[₹,]/g, ''), 10);
  const cardSlug = slug ?? name.toLowerCase().replace(/ /g, '-');

  if (compact) {
    return (
      <div
        className="bg-[#fdf6ed] border border-[#e2ceae] rounded-[10px] flex flex-col overflow-hidden group w-full"
        style={{ transition: 'all 0.2s ease' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
      >
        {/* Square image — plain div to avoid nested <a> */}
        <div
          className="block relative overflow-hidden bg-[#f0e8d8] cursor-pointer"
          style={{ aspectRatio: '1/1' }}
          onClick={() => navigate(`/product/${cardSlug}`)}
        >
          <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {/* Customise icon badge — standalone link, not nested */}
          <Link
            to={`/custom-pour/${cardSlug}`}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center text-[14px] shadow-sm hover:bg-white transition-colors"
            aria-label={`Customize ${name}`}
            title="Customize +₹99"
          >
            🎨
          </Link>
          <div className="absolute top-2 left-2 bg-[#d4871a] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ fontFamily: 'Manrope' }}>
            📅
          </div>
        </div>

        {/* Text body */}
        <Link to={`/product/${cardSlug}`} className="flex flex-col gap-1 px-2.5 pt-2.5 pb-1">
          <h3
            className="text-[#2c1a10] text-[14px] font-semibold leading-snug group-hover:text-[#d97706] transition-colors"
            style={{ fontFamily: 'Playfair Display', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {name}
          </h3>
          <div className="flex items-center justify-between gap-1">
            <span className="text-[#d97706] text-[11px] font-bold" style={{ fontFamily: 'Manrope' }}>★ {rating.split(' ')[0]}</span>
            <span className="text-[#1f2937] text-[13px] font-bold" style={{ fontFamily: 'Playfair Display' }}>{price}</span>
          </div>
        </Link>

        {/* Compact CTA */}
        <div className="px-2.5 pb-2.5 pt-1">
          <button
            onClick={(e) => { e.stopPropagation(); addItem({ slug: cardSlug, name, price: priceNum, img }); openCart(); }}
            className="w-full bg-[#d97706] text-white text-[11px] font-bold uppercase tracking-[0.5px] rounded-full hover:bg-[#b86000] transition-colors flex items-center justify-center"
            style={{ fontFamily: 'Manrope', height: '36px' }}
          >
            ADD TO CART
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-[#fdf6ed] border border-[#e2ceae] rounded-[12px] flex flex-col h-full overflow-hidden group w-full"
      style={{ transition: 'all 0.2s ease' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.08)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
    >
      <Link to={`/product/${cardSlug}`} className="block">
        <div className="relative aspect-[4/5] bg-[#f0e8d8] overflow-hidden">
          <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-3 left-3 bg-[#d4871a] text-white text-[10px] font-bold px-2 py-1 rounded-full" style={{ fontFamily: 'Manrope' }}>
            📅 Pre-Order
          </div>
        </div>
      </Link>
      <Link to={`/product/${cardSlug}`} className="px-5 pt-4 pb-1 flex flex-col gap-2 flex-1">
        <p className="text-[#d97706] text-[12px] font-bold" style={{ fontFamily: 'Manrope' }}>★ {rating}</p>
        <h3 className="text-[#2c1a10] text-[18px] font-bold leading-snug group-hover:text-[#d97706] transition-colors" style={{ fontFamily: 'Playfair Display' }}>{name}</h3>
        <p className="text-[#2c1810] text-[13px] leading-relaxed" style={{ fontFamily: 'Manrope' }}>{desc}</p>
      </Link>
      <div className="px-5 pb-5 pt-3 flex flex-col gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); addItem({ slug: cardSlug, name, price: priceNum, img }); openCart(); }}
          className="w-full bg-[#d97706] text-white text-[12px] font-bold uppercase tracking-[0.5px] py-[11px] rounded-full hover:bg-[#b86000] transition-colors"
          style={{ fontFamily: 'Manrope' }}
        >
          ADD TO CART — {price}
        </button>
        <Link
          to={`/custom-pour/${cardSlug}`}
          onClick={(e) => e.stopPropagation()}
          className="w-full text-center border border-[#2c1a10] text-[#2c1a10] text-[12px] font-bold uppercase tracking-[0.5px] py-[10px] rounded-full hover:bg-[#2c1a10] hover:text-white transition-colors"
          style={{ fontFamily: 'Manrope' }}
        >
          CUSTOMIZE +₹99
        </Link>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { addItem, openCart } = useCart();
  const navigate = useNavigate();
  const [diwaliGridCols, setDiwaliGridCols] = useState<2 | 1>(2);
  return (
    <div className="min-h-screen bg-[#fdf6ed]">
      <Nav />

      <HeroCarousel />

      {/* Three Ways to Shop */}
      <section className="py-24 px-6 md:px-20 flex flex-col gap-12 items-center">
        <div className="text-center">
          <div className="flex items-center gap-2 justify-center mb-3">
            <img src={ellipseIcon} alt="" className="w-1.5 h-1.5" />
            <p className="text-[#2c1810] text-[11px] font-bold tracking-[3px] uppercase" style={{ fontFamily: 'Manrope' }}>HOW WE CRAFT</p>
          </div>
          <h2 className="text-[#2c1a10] text-[36px] font-bold" style={{ fontFamily: 'Playfair Display' }}>Three Ways to Shop</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {[
            { img: img3WaysExpress, title: '⚡ Express Ready-Stock', sub: 'Ships in 24hrs · Tealights & Minis', price: '₹249 - ₹699', cta: 'Shop Express', ctaStyle: 'bg-[#2c1a10] text-white', to: '/shop' },
            { img: img3WaysFestive, title: '📅 Festive Pre-Order Drops', sub: 'Limited Diwali & Seasonal Sets', price: '₹399 - ₹599', cta: 'Pre-Order Now', ctaStyle: 'bg-[#d97706] text-white', to: '/festive-drops' },
          ].map((card) => (
            <div key={card.title} className="bg-[#fef8f0] border border-[#e2ceae] rounded-[12px] overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-[280px] overflow-hidden">
                <img src={card.img} alt={card.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <p className="text-[#2c1a10] text-[20px] font-bold" style={{ fontFamily: 'Playfair Display' }}>{card.title}</p>
                  <p className="text-[#7a5c44] text-[13px] mt-1" style={{ fontFamily: 'Manrope' }}>{card.sub}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#2b170f] text-[15px] font-bold" style={{ fontFamily: 'Manrope' }}>{card.price}</span>
                  <Link to={card.to} className={`${card.ctaStyle} text-[12px] font-bold uppercase px-4 py-2 rounded-full transition-opacity hover:opacity-80`} style={{ fontFamily: 'Manrope' }}>
                    {card.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Custom Pour Studio — navigates directly to Midnight Bat Glass configurator */}
          <div className="bg-[#fef8f0] border border-[#e2ceae] rounded-[12px] overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-[280px] overflow-hidden">
              <img src={img3WaysCustom} alt="Custom Pour Studio" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <p className="text-[#2c1a10] text-[20px] font-bold" style={{ fontFamily: 'Playfair Display' }}>🎨 Custom Pour Studio</p>
                <p className="text-[#7a5c44] text-[13px] mt-1" style={{ fontFamily: 'Manrope' }}>Choose base, scent, and wick type</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#2b170f] text-[15px] font-bold" style={{ fontFamily: 'Manrope' }}>Personalize +₹99</span>
                <button
                  onClick={() => navigate('/custom-pour/pumpkin-patch-glass')}
                  className="border-2 border-[#2c1a10] text-[#2c1a10] hover:bg-[#2c1a10] hover:text-white transition-colors text-[12px] font-bold uppercase px-4 py-2 rounded-full"
                  style={{ fontFamily: 'Manrope' }}
                >
                  Start Creating
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-[#2c1a10] py-16 px-6 md:px-20 flex flex-col items-center gap-10">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <img key={i} src={starIcon} alt="★" className="w-3.5 h-3.5" />
            ))}
          </div>
          <p className="text-white text-[14px] font-bold" style={{ fontFamily: 'Manrope' }}>Happy Homes & Glowing Celebrations</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-5xl">
          {[
            { quote: '"My guests thought these were real mithai!"', author: '- Priya M., Mumbai' },
            { quote: '"The chai candle smells exactly like Rain on a Highway"', author: '- Rahul S., Delhi' },
            { quote: '"Cool Diwali gift I\'ve ever given, specially making your own candle customization"', author: '- Sneha K., Pune' },
          ].map((t) => (
            <div key={t.author} className="flex flex-col items-center gap-2 text-center">
              <p className="text-white text-[16px] italic leading-relaxed" style={{ fontFamily: 'Playfair Display' }}>{t.quote}</p>
              <p className="text-[#7a5c44] text-[12px] font-semibold" style={{ fontFamily: 'Manrope' }}>{t.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Diwali Collection */}
      <section className="bg-[#fef8f0] w-full py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E8E1D5]">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#E08A2E] mb-1" style={{ fontFamily: 'Manrope' }}>
                Melt Culture Bestsellers
              </p>
              <h2 className="font-bold text-2xl sm:text-3xl text-[#2A1E17]" style={{ fontFamily: 'Playfair Display' }}>
                Diwali Collection
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {/* Grid toggle */}
              <div className="flex items-center gap-1 rounded-full p-1 bg-white border border-[#e2ceae]">
                <button
                  onClick={() => setDiwaliGridCols(2)}
                  aria-pressed={diwaliGridCols === 2}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-[14px]"
                  style={{ backgroundColor: diwaliGridCols === 2 ? '#2c1a10' : 'transparent', color: diwaliGridCols === 2 ? '#fff' : '#7a5c44' }}
                  title="Grid view"
                >
                  ⊞
                </button>
                <button
                  onClick={() => setDiwaliGridCols(1)}
                  aria-pressed={diwaliGridCols === 1}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-[14px]"
                  style={{ backgroundColor: diwaliGridCols === 1 ? '#2c1a10' : 'transparent', color: diwaliGridCols === 1 ? '#fff' : '#7a5c44' }}
                  title="List view"
                >
                  ☰
                </button>
              </div>
              <Link
                to="/category/diwali"
                className="text-xs font-bold uppercase tracking-wider text-[#2A1E17] hover:text-[#E08A2E] flex items-center gap-1 transition-colors"
                style={{ fontFamily: 'Manrope' }}
              >
                View All <span>→</span>
              </Link>
            </div>
          </div>

          {/* Product grid */}
          <div className={`grid items-stretch ${
            diwaliGridCols === 2
              ? 'grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-6'
              : 'grid-cols-1 gap-4'
          }`}>
            {diwaliProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                compact={diwaliGridCols === 2}
                landscape={diwaliGridCols === 1}
                customizeTo={`/product/${product.slug ?? product.id}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Halloween Collection ── */}
      <section className="bg-[#0d0208] py-20 px-6 md:px-20 overflow-hidden relative">
        {/* Spooky texture overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #ff6b00 0%, transparent 60%), radial-gradient(circle at 80% 20%, #7c3aed 0%, transparent 60%)' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[20px] leading-none">🎃</span>
            <p className="text-[#e08a2e] text-[11px] font-bold tracking-[4px] uppercase" style={{ fontFamily: 'Manrope' }}>
              Halloween Drop — Limited Edition
            </p>
          </div>

          {/* Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2
                className="text-white text-[40px] md:text-[52px] font-bold italic leading-tight"
                style={{ fontFamily: 'Playfair Display' }}
              >
                Things That Go<br />
                <span className="text-[#e08a2e]">Burn</span> in the Night.
              </h2>
              <p className="text-[#9d7a6a] text-[15px] mt-3 max-w-[480px] leading-relaxed" style={{ fontFamily: 'Manrope' }}>
                Skull embeds. Ember gel. Midnight jasmine. Our spookiest candles yet — brewed in small batches and shipping fast before they haunt someone else's doorstep.
              </p>
            </div>
            <Link
              to="/category/halloween"
              className="shrink-0 border border-[#e08a2e] text-[#e08a2e] text-[13px] font-bold uppercase tracking-[1.5px] px-7 py-3.5 rounded-full hover:bg-[#e08a2e] hover:text-black transition-all"
              style={{ fontFamily: 'Manrope' }}
            >
              Shop Halloween →
            </Link>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {[
              { slug: 'pumpkin-patch-glass', name: 'Midnight Bat Glass', price: 529, img: `${assetPrefix}/694c4.png`, tag: '🎃 Violet gel · bat embed' },
              { slug: 'sorcerer-elixir-skull', name: 'Sorcerer Elixir Skull', price: 499, img: `${assetPrefix}/f2ff6.png`, tag: '💀 Skull embed' },
              { slug: 'blueberry-gel-glass', name: 'Blueberry Gel Glass', price: 449, img: `${assetPrefix}/da24a.png`, tag: '🫐 Wild berry violet' },
              { slug: 'halloween-electric-trio', name: 'Electric Trio Gift Set', price: 1389, img: `${assetPrefix}/13945.png`, tag: '⚡ Collector set' },
            ].map((p) => (
              <div
                key={p.slug}
                className="group flex flex-col overflow-hidden rounded-[14px] border border-[rgba(255,255,255,0.07)] hover:border-[#e08a2e]/50 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <Link to={`/product/${p.slug}`} className="relative aspect-square overflow-hidden block">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span
                    className="absolute bottom-2 left-2 text-[10px] font-bold text-white/80 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full"
                    style={{ fontFamily: 'Manrope' }}
                  >
                    {p.tag}
                  </span>
                </Link>
                <div className="p-3 flex items-center justify-between">
                  <p className="text-white text-[14px] font-bold leading-snug" style={{ fontFamily: 'Playfair Display' }}>{p.name}</p>
                  <p className="text-[#e08a2e] text-[13px] font-bold shrink-0 ml-2" style={{ fontFamily: 'Manrope' }}>₹{p.price}</p>
                </div>
                <div className="px-3 pb-3 flex flex-col gap-2">
                  <Link
                    to={`/product/${p.slug}`}
                    className="text-center text-[11px] font-bold uppercase tracking-[0.8px] py-2 rounded-full border border-[#e08a2e] text-[#e08a2e] hover:bg-[#e08a2e] hover:text-black transition-all"
                    style={{ fontFamily: 'Manrope' }}
                  >
                    View
                  </Link>
                  {p.slug === 'pumpkin-patch-glass' ? (
                    <Link
                      to={`/customize/${p.slug}`}
                      state={{ product: { name: p.name, price: p.price, img: p.img } }}
                      className="text-center text-[11px] font-bold uppercase tracking-[0.8px] py-2 rounded-full border border-white/20 text-white/70 hover:border-white/50 hover:text-white transition-all"
                      style={{ fontFamily: 'Manrope' }}
                    >
                      Customise
                    </Link>
                  ) : (
                    <button
                      onClick={() => { addItem({ slug: p.slug, name: p.name, price: p.price, img: p.img }); openCart(); }}
                      className="text-center text-[11px] font-bold uppercase tracking-[0.8px] py-2 rounded-full border border-white/20 text-white/70 hover:border-white/50 hover:text-white transition-all"
                      style={{ fontFamily: 'Manrope' }}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom scorched-hope banner */}
          <div className="mt-6 rounded-[14px] overflow-hidden border border-[rgba(255,255,255,0.07)] flex flex-col sm:flex-row items-center gap-0"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="sm:w-[280px] h-[140px] shrink-0 overflow-hidden">
              <img src={`${assetPrefix}/06769.png`} alt="Scorching Hope Mix" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 px-7 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-[#e08a2e] text-[10px] font-bold tracking-[3px] uppercase mb-1" style={{ fontFamily: 'Manrope' }}>Most Depraved · Limited to 33 sets</p>
                <h3 className="text-white text-[24px] font-bold italic" style={{ fontFamily: 'Playfair Display' }}>Scorching Hope Mix</h3>
                <p className="text-[#9d7a6a] text-[13px] mt-1" style={{ fontFamily: 'Manrope' }}>Seven Halloween vessels in a velvet gift box. Only for the truly haunted.</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-white text-[28px] font-bold italic" style={{ fontFamily: 'Playfair Display' }}>₹2,098</span>
                <button
                  onClick={() => { addItem({ slug: 'scorching-hope-mix', name: 'Scorching Hope Mix', price: 2098, img: `${assetPrefix}/06769.png` }); openCart(); }}
                  className="bg-[#e08a2e] hover:bg-[#c07020] text-black text-[12px] font-bold uppercase tracking-[1px] px-6 py-3 rounded-full transition-colors"
                  style={{ fontFamily: 'Manrope' }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chai/Beverage Row */}
      <section className="py-24 px-6 md:px-20">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <img src={ellipseIcon} alt="" className="w-1.5 h-1.5" />
            <p className="text-[#2c1810] text-[11px] font-bold tracking-[3px] uppercase" style={{ fontFamily: 'Manrope' }}>A Taste of Home, In a Glass</p>
          </div>
          <h2 className="text-[#2c1a10] text-[32px] font-bold" style={{ fontFamily: 'Playfair Display' }}>Beverage Candles</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'Cutting Chai Candle', price: '₹349', img: imgChaiCandle, desc: 'Masala chai soy wax with a dipped biscuit embed, cinnamon and whole-spice notes.', slug: 'cutting-chai-candle' },
            { name: 'Filter Coffee Candle', price: '₹589', img: imgCoffeeCandle, desc: 'South Indian filter coffee in a brass tumbler vessel, dark roast and cardamom.', slug: 'filter-coffee-candle' },
          ].map((p) => (
            <div
              key={p.name}
              className="bg-[#fef8f0] border border-[#e2ceae] rounded-[12px] overflow-hidden flex flex-col md:flex-row group cursor-pointer"
              style={{ transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.08)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
            >
              <Link to={`/product/${p.slug}`} className="h-[280px] md:h-auto md:w-[280px] shrink-0 overflow-hidden block">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </Link>
              <div className="p-6 flex flex-col gap-3 justify-center flex-1">
                <Link to={`/product/${p.slug}`} className="text-[#2c1a10] text-[22px] font-bold group-hover:text-[#d97706] transition-colors" style={{ fontFamily: 'Playfair Display' }}>{p.name}</Link>
                <p className="text-[#2c1810] text-[14px] leading-relaxed" style={{ fontFamily: 'Manrope' }}>{p.desc}</p>
                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-[#1f2937] text-[20px] font-bold" style={{ fontFamily: 'Playfair Display' }}>{p.price}</span>
                  <button
                    onClick={() => { addItem({ slug: p.slug, name: p.name, price: parseInt(p.price.replace(/[₹,]/g, ''), 10), img: p.img }); openCart(); }}
                    className="bg-[#d97706] text-white text-[12px] font-bold uppercase tracking-[0.5px] py-[11px] rounded-full hover:bg-[#b86000] transition-colors w-full"
                    style={{ fontFamily: 'Manrope' }}
                  >
                    ADD TO CART — {p.price}
                  </button>
                  <Link
                    to={`/custom-pour/${p.slug}`}
                    className="text-center border border-[#2c1a10] text-[#2c1a10] text-[12px] font-bold uppercase tracking-[0.5px] py-[10px] rounded-full hover:bg-[#2c1a10] hover:text-white transition-colors w-full"
                    style={{ fontFamily: 'Manrope' }}
                  >
                    CUSTOMIZE +₹99
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Corporate / Gifting CTA */}
      <section className="bg-[#2c1a10] py-16 px-6 md:px-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1">
            <p className="text-[#d97706] text-[11px] font-bold tracking-[3px] uppercase mb-2" style={{ fontFamily: 'Manrope' }}>Diwali Hampers For Your Whole Team</p>
            <h2 className="text-white text-[36px] font-bold italic mb-4" style={{ fontFamily: 'Playfair Display' }}>Diwali hampers for your whole team.</h2>
            <p className="text-[#7a5c44] text-[15px] leading-relaxed mb-6" style={{ fontFamily: 'Manrope' }}>
              Bulk corporate Diwali hampers with branded packaging, logo letterpress, and complete logistics. From small startups to enterprise gifting.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
            {[
              { tier: 'Starter Pack', price: '₹899', items: '5 Products · Logo Sticker · Kraft Dabba · Express Ship', cta: 'Select Bundle' },
              { tier: 'Premium Collection', price: '₹1,499', items: '10 Products · Foil Logo · Magnetic Box · Priority Ship', cta: 'Select Bundle', featured: true },
              { tier: 'Enterprise Custom', price: 'Custom Quote', items: 'Fully white-label. Call for inventory, delivery, and design brief.', cta: 'Get Enquiry Form' },
            ].map((t) => (
              <div key={t.tier} className={`${t.featured ? 'bg-[#d97706]' : 'bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)]'} p-5 rounded-[12px] flex flex-col gap-3`}>
                <p className={`text-[12px] font-bold uppercase tracking-[1px] ${t.featured ? 'text-white/70' : 'text-[#7a5c44]'}`} style={{ fontFamily: 'Manrope' }}>{t.tier}</p>
                <p className={`text-[28px] font-bold italic ${t.featured ? 'text-white' : 'text-[#e8d5b7]'}`} style={{ fontFamily: 'Playfair Display' }}>{t.price}</p>
                <p className={`text-[13px] leading-relaxed ${t.featured ? 'text-white/80' : 'text-[#7a5c44]'}`} style={{ fontFamily: 'Manrope' }}>{t.items}</p>
                <Link to="/gifting-guide" className={`text-center text-[13px] font-bold uppercase py-2.5 rounded-full transition-colors ${t.featured ? 'bg-white text-[#d97706] hover:bg-[#fef8f0]' : 'border border-[#d97706] text-[#d97706] hover:bg-[#d97706] hover:text-white'}`} style={{ fontFamily: 'Manrope' }}>
                  {t.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Boxes */}
      <section className="py-24 px-6 md:px-20">
        <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src={ellipseIcon} alt="" className="w-1.5 h-1.5" />
              <p className="text-[#2c1810] text-[11px] font-bold tracking-[3px] uppercase" style={{ fontFamily: 'Manrope' }}>• Complete the Gift</p>
            </div>
            <h2 className="text-[#2c1a10] text-[32px] font-bold" style={{ fontFamily: 'Playfair Display' }}>Gift Boxes & Hampers</h2>
          </div>
          <Link to="/gifting-guide" className="text-[#d97706] text-[14px] font-bold uppercase tracking-[1px] hover:underline" style={{ fontFamily: 'Manrope' }}>View All →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Standard Brown Daan Box',
              desc: 'Natural kraft finish, tissue wrap and satin ribbon.',
              price: 'Inclusive',
              img: imgKraftBox,
            },
            {
              name: 'Pastel Blue Festive Gift Box',
              desc: 'Premium thick-walled lidded box with silk ribbon.',
              price: '₹129',
              img: imgPastelBox,
            },
            {
              name: 'Magnetic Flip Corporate Diwali Hamper',
              desc: 'So thick it can take 12+ items, complete with logo spot.',
              price: '₹325',
              img: imgCorporateHamper,
            },
          ].map((box) => (
            <div
              key={box.name}
              className="bg-[#fdfbf7] border border-[#eae4d9] rounded-[16px] overflow-hidden flex flex-col group"
              style={{ transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 20px -4px rgba(0,0,0,0.09)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
            >
              <div className="h-[220px] overflow-hidden">
                <img src={box.img} alt={box.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="px-5 pt-4 pb-1">
                <h3 className="text-[#18181b] text-[18px] font-bold leading-snug" style={{ fontFamily: 'Playfair Display' }}>{box.name}</h3>
              </div>
              <div className="px-5 pb-4 flex-1">
                <p className="text-[#71717a] text-[14px] leading-[1.4]" style={{ fontFamily: 'Manrope', minHeight: '48px' }}>{box.desc}</p>
              </div>
              <div className="px-5 pb-5 flex items-center justify-between">
                <span className="text-[#18181b] text-[18px] font-bold" style={{ fontFamily: 'Playfair Display' }}>{box.price}</span>
                <Link
                  to="/gifting-guide"
                  className="bg-[#d97706] text-white text-[13px] font-bold uppercase px-5 py-2 rounded-full hover:bg-[#b86000] transition-colors"
                  style={{ fontFamily: 'Manrope', letterSpacing: '0.05em' }}
                >
                  VIEW →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Full Catalog Teaser */}
      <section className="bg-[#fef8f0] py-24 px-6 md:px-20">
        <div className="mb-10 text-center">
          <h2 className="text-[#2c1a10] text-[36px] font-bold italic" style={{ fontFamily: 'Playfair Display' }}>We don't stock candles.</h2>
          <p className="text-[#7a5c44] text-[16px] mt-2 italic" style={{ fontFamily: 'Playfair Display' }}>We craft small, scent years.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {catalogItems.map((item) => (
            <Link key={item.label} to={item.link} className="relative rounded-[12px] overflow-hidden group block">
              <img src={item.img} alt={item.label} className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-[14px] font-bold" style={{ fontFamily: 'Manrope' }}>{item.label}</p>
                <span className={`text-[10px] font-bold uppercase tracking-[1px] ${item.badge === 'LIVE NOW' ? 'text-[#d97706]' : 'text-white/70'}`} style={{ fontFamily: 'Manrope' }}>
                  {item.badge}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
