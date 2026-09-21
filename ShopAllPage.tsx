import { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import NavigationHeader from '../components/NavigationHeader';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../components/ProductCard';

const assetPrefix = '/assets';
const bannerImg = `${assetPrefix}/94871.png`;
const ellipseIcon = `${assetPrefix}/f7abf.svg`;
const plusIcon = `${assetPrefix}/1c8f4.svg`;

const tabs = ['All Products', 'Express Beverages', 'Minis & Gel', 'Halloween', 'Mithai Classics'];

type ShopProduct = Product & { cat: string };

const allProducts: ShopProduct[] = [
  { id: 'cutting-chai-candle', slug: 'cutting-chai-candle', name: 'Cutting Chai Candle', price: 349, rating: 4.9, reviewsCount: 42, badge: '⚡ Express 24h', image: `${assetPrefix}/f2192.png`, subtitle: 'Masala chai soy wax with a dipped biscuit embed, cinnamon and whole-spice notes.', cat: 'Express Beverages' },
  { id: 'filter-coffee-candle', slug: 'filter-coffee-candle', name: 'Filter Coffee Candle', price: 399, rating: 4.8, reviewsCount: 31, badge: '⚡ Express 24h', image: `${assetPrefix}/35c57.png`, subtitle: 'South Indian filter coffee in a brass tumbler vessel, dark roast and cardamom.', cat: 'Express Beverages' },
  { id: 'six-minis-tray', slug: 'six-minis-tray', name: 'Six Minis Tray', price: 309, rating: 4.7, reviewsCount: 19, badge: '⚡ Express 24h', image: `${assetPrefix}/14781.png`, subtitle: 'A delightful assortment of six hand-poured sculptural mini candles on an elegant tray.', cat: 'Minis & Gel' },
  { id: 'serene-lotus-lake', slug: 'serene-lotus-lake', name: 'Serene Lotus Lake', price: 799, rating: 4.8, reviewsCount: 9, badge: '📅 Pre-Order', image: `${assetPrefix}/0b246.png`, subtitle: 'Lotus blooms in clear gel with aquatic-green fragrance. Serene Green & Cotton Phlox variants.', cat: 'Minis & Gel' },
  { id: 'ladoo-stack', slug: 'ladoo-stack', name: 'Ladoo Stack', price: 249, rating: 4.9, reviewsCount: 35, badge: '📅 Pre-Order', image: `${assetPrefix}/d21c5.png`, subtitle: 'Golden besan ladoo with saffron strands, on brass thali', cat: 'Mithai Classics' },
  { id: 'modak-quartet', slug: 'modak-quartet', name: 'Modak Quartet', price: 299, rating: 4.8, reviewsCount: 22, badge: '📅 Pre-Order', image: `${assetPrefix}/4bc1c.png`, subtitle: 'Hand-shaped coconut modak set with lotus-honey fragrance', cat: 'Mithai Classics' },
  { id: 'kaju-katli-quartet', slug: 'kaju-katli-quartet', name: 'Kaju Katli Quartet', price: 299, rating: 4.9, reviewsCount: 35, badge: '📅 Pre-Order', image: `${assetPrefix}/ce96a.png`, subtitle: 'Diamond-shaped kaju katli with silver varq, rose-pistachio scent', cat: 'Mithai Classics' },
  { id: 'nankati-bharati', slug: 'nankati-bharati', name: 'Nankati Bharati', price: 349, rating: 4.9, reviewsCount: 18, badge: '📅 Pre-Order', image: `${assetPrefix}/5aaec.png`, subtitle: 'Crispy Diwali swirls, rose-cardamom infused soy wax', cat: 'Mithai Classics' },
  { id: 'pumpkin-patch-glass', slug: 'pumpkin-patch-glass', name: 'Midnight Bat Glass Candle', price: 529, rating: 4.7, reviewsCount: 14, badge: '🎃 Halloween', image: `${assetPrefix}/694c4.png`, subtitle: 'Dark violet gel with a bat wax embed perched on top, spiced clove and smoky amber.', cat: 'Halloween' },
  { id: 'sorcerer-elixir-skull', slug: 'sorcerer-elixir-skull', name: 'Sorcerer Elixir Skull Candle', price: 499, rating: 4.8, reviewsCount: 11, badge: '🎃 Halloween', image: `${assetPrefix}/f2ff6.png`, subtitle: 'Skull embed in midnight gel, night-blooming jasmine & cedar.', cat: 'Halloween' },
  { id: 'blueberry-gel-glass', slug: 'blueberry-gel-glass', name: 'Blueberry Gel Glass Candle', price: 449, rating: 4.6, reviewsCount: 9, badge: '🎃 Halloween', image: `${assetPrefix}/da24a.png`, subtitle: 'Vibrant blueberry gel in a clear glass vessel, wild berry & violet.', cat: 'Halloween' },
  { id: 'halloween-electric-trio', slug: 'halloween-electric-trio', name: 'Halloween Electric Trio', price: 1389, rating: 4.9, reviewsCount: 6, badge: '🎃 Halloween', image: `${assetPrefix}/13945.png`, subtitle: 'Limited gift set of three Halloween candles in collector packaging.', cat: 'Halloween' },
  { id: 'scorching-hope-mix', slug: 'scorching-hope-mix', name: 'Scorching Hope Mix', price: 2098, rating: 5.0, reviewsCount: 4, badge: 'Limited', image: `${assetPrefix}/06769.png`, subtitle: 'Exclusive artisan mix of seven Halloween vessels, velvet gift box.', cat: 'Halloween' },
];

const faqs = [
  { q: 'Are there exactly the same quality as in an Instagram post?', a: 'Absolutely! Every product you see online is exactly what gets shipped to you. We use the same natural soy wax, premium fragrances, and hand-crafted technique — no studio tricks, no filters.' },
  { q: 'What is the likely call time for same-day dispatch?', a: 'For Express Ready-Stock items, orders placed before 1 PM IST Monday–Saturday are dispatched the same day. Orders after 1 PM are dispatched the following business morning.' },
  { q: 'Can I still customize works-in-ready-stock?', a: 'Yes! All Express Ready-Stock products support our +₹99 customization add-on. Choose your embed shape, wax color, and packaging at checkout — we complete the personalization before shipping within 24-48 hours.' },
];

export default function ShopAllPage() {
  const [activeTab, setActiveTab] = useState('All Products');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [gridCols, setGridCols] = useState<2 | 1>(2);
  const { addItem } = useCart();

  const filtered = activeTab === 'All Products' ? allProducts : allProducts.filter((p) => p.cat === activeTab);

  return (
    <div className="min-h-screen bg-[#fdf6ed]">
      <Nav dark />

      <NavigationHeader
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Ways to Shop' },
          { label: 'Ready to Shop' },
        ]}
        backContext="Home"
      />

      {/* Banner */}
      <div className="bg-[#fef8f0] border-t border-b border-[#e2ceae] flex flex-col md:flex-row gap-10 items-center p-10 md:p-14">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <img src={ellipseIcon} alt="" className="w-1.5 h-1.5" />
            <p className="text-[#2c1a10] text-[11px] font-bold tracking-[3px] uppercase" style={{ fontFamily: 'Manrope' }}>⚡ INSTANT DISPATCH</p>
          </div>
          <h1 className="text-[#2c1a10] text-[44px] font-bold italic" style={{ fontFamily: 'Playfair Display' }}>Ready to Shop</h1>
          <p className="text-[#7a5c44] text-[15px] leading-relaxed max-w-[500px]" style={{ fontFamily: 'Manrope' }}>
            Handcrafted in small batches and pre-poured. These selections are currently resting on our studio shelves, cured and ready for instant dispatch to your doorstep.
          </p>
          <div className="border border-[#218c21] text-[#218c21] text-[12px] font-bold px-3 py-1.5 rounded w-fit" style={{ fontFamily: 'Manrope' }}>
            ⚡ SHIPS IN 24 HOURS GUARANTEE
          </div>
        </div>
        <div className="w-full md:w-[560px] h-[320px] rounded-[16px] overflow-hidden shrink-0">
          <img src={bannerImg} alt="Ready to Shop" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Products section */}
      <div className="px-4 sm:px-6 lg:px-8 py-14 md:py-16 flex flex-col gap-10">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[#2c1a10] text-[32px] font-bold" style={{ fontFamily: 'Playfair Display' }}>Tealights & Minis Assortment</h2>
            <p className="text-[#7a5c44] text-[14px]" style={{ fontFamily: 'Manrope' }}>Pre-poured fresh ready-stock. Range ₹249 – ₹699.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[#218c21] text-white text-[12px] font-bold px-4 py-2 rounded-full" style={{ fontFamily: 'Manrope' }}>⚡ 24H DELIVERY READY</div>
            {/* Grid toggle */}
            <div className="flex items-center gap-1 rounded-full p-1 bg-[#fef8f0] border border-[#e2ceae]">
              <button
                onClick={() => setGridCols(2)}
                aria-pressed={gridCols === 2}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-[14px]"
                style={{ backgroundColor: gridCols === 2 ? '#2c1a10' : 'transparent', color: gridCols === 2 ? '#fff' : '#7a5c44' }}
                title="Two columns"
              >
                ⊞
              </button>
              <button
                onClick={() => setGridCols(1)}
                aria-pressed={gridCols === 1}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-[14px]"
                style={{ backgroundColor: gridCols === 1 ? '#2c1a10' : 'transparent', color: gridCols === 1 ? '#fff' : '#7a5c44' }}
                title="Single column"
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2.5 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[13px] font-semibold px-6 py-3 rounded-full transition-colors ${activeTab === tab ? 'bg-[#2c1a10] text-white' : 'bg-[#fef8f0] border border-[#e2ceae] text-[#2c1a10] hover:bg-[#f5e9d9]'}`}
              style={{ fontFamily: 'Manrope' }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className={`grid items-stretch ${gridCols === 2 ? 'grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-6' : 'grid-cols-1 gap-4'}`}>
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} compact={gridCols === 2} landscape={gridCols === 1} />
          ))}
        </div>
        </div>{/* /max-w-7xl */}
      </div>

      {/* Trust badges */}
      <div className="bg-[#fef8f0] border-t border-[#e2ceae] py-10 px-6 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: '⚡', title: 'Instant Dispatch', desc: 'Express ready-stock ships in 24 hours from our Mumbai studio.' },
            { icon: '✓', title: 'Glass-Safe Guarantee', desc: 'Every candle is QC tested for safe burning and accurate scent throw.' },
            { icon: '🛡', title: 'Safe-Glass Ship', desc: 'Gel candles travel in custom-fit foam inserts with double-wall packaging.' },
          ].map((b) => (
            <div key={b.title} className="flex gap-3 items-start">
              <div className="text-[#d97706] text-[20px]">{b.icon}</div>
              <div>
                <p className="text-[#2c1a10] text-[14px] font-bold mb-1" style={{ fontFamily: 'Manrope' }}>→ {b.title}</p>
                <p className="text-[#7a5c44] text-[13px]" style={{ fontFamily: 'Manrope' }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="py-16 px-6 md:px-20 max-w-3xl mx-auto w-full">
        <h2 className="text-[#2c1a10] text-[28px] font-bold mb-8" style={{ fontFamily: 'Playfair Display' }}>Express Shopping FAQs</h2>
        <div className="flex flex-col gap-0 border-t border-[#e2ceae]">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-[#e2ceae]">
              <button
                className="w-full flex items-center justify-between py-5 text-left"
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
              >
                <p className="text-[#2c1a10] text-[15px] font-semibold pr-4" style={{ fontFamily: 'Manrope' }}>{faq.q}</p>
                <img src={plusIcon} alt="" className={`w-5 h-5 shrink-0 transition-transform ${expandedFaq === i ? 'rotate-45' : ''}`} />
              </button>
              {expandedFaq === i && (
                <p className="text-[#7a5c44] text-[14px] leading-relaxed pb-5" style={{ fontFamily: 'Manrope' }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
