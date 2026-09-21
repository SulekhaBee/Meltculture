import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import NavigationHeader from '../components/NavigationHeader';
import { useCart } from '../context/CartContext';

const assetPrefix = '/assets';
const bannerImg = `${assetPrefix}/21885.png`;
const ellipseIcon = `${assetPrefix}/f7abf.svg`;

const products = [
  { name: 'Ladoo Stack', price: '₹249', rating: '4.9 (35+)', img: `${assetPrefix}/d21c5.png`, desc: 'Golden besan ladoo with saffron strands, on brass thali', badge: 'Pre-Order', cat: 'Mithai Sculptures', slug: 'ladoo-stack' },
  { name: 'Kaju Katli Quartet', price: '₹299', rating: '4.9 (35+)', img: `${assetPrefix}/ce96a.png`, desc: 'Diamond-shaped kaju katli with silver varq, rose-pistachio scent', badge: 'Pre-Order', cat: 'Mithai Sculptures', slug: 'kaju-katli-quartet' },
  { name: 'Modak Quartet', price: '₹299', rating: '4.8 (22+)', img: `${assetPrefix}/4bc1c.png`, desc: 'Hand-shaped coconut modak set with lotus-honey fragrance', badge: 'Pre-Order', cat: 'Mithai Sculptures', slug: 'modak-quartet' },
  { name: 'Nankati Bharati', price: '₹349', rating: '4.9 (18+)', img: `${assetPrefix}/5aaec.png`, desc: 'Crispy Diwali swirls, rose-cardamom infused soy wax', badge: 'Pre-Order', cat: 'Mithai Sculptures', slug: 'nankati-bharati' },
  { name: 'Peony Lake', price: '₹699', rating: '4.7 (14+)', img: `${assetPrefix}/85d04.png`, desc: 'Floating peony and rose blooms in aqua gel, cedar-peony scent', badge: 'New', cat: 'Urli Bowls', slug: 'peony-lake' },
  { name: 'Mithai Dabba Set', price: '₹549', rating: '5.0 (41+)', img: `${assetPrefix}/5a082.png`, desc: 'Curated assortment in a lacquer dabba, perfect gift', badge: 'Bestseller', cat: 'Mithai Sculptures', slug: 'mithai-dabba-set' },
  { name: 'Water Lily Lake', price: '₹799', rating: '4.8 (9+)', img: `${assetPrefix}/64561.png`, desc: 'Lotus blooms in clear gel vessel, aquatic-green fragrance', badge: 'New', cat: 'Urli Bowls', slug: 'water-lily-lake' },
  { name: 'Lotus Dawn', price: '₹449', rating: '4.6 (7+)', img: `${assetPrefix}/73778.png`, desc: 'Sunrise lotus in cream soy wax, jasmine & sandalwood', badge: 'New', cat: 'Urli Bowls', slug: 'lotus-dawn' },
  { name: 'Lotus Garden Montage', price: '₹1,100', rating: '5.0 (3+)', img: `${assetPrefix}/960e1.png`, desc: 'Panoramic lotus garden, artisan-grade botanical embed', badge: 'Limited', cat: 'Urli Bowls', slug: 'lotus-garden-montage' },
];

const giftBoxes = [
  { name: 'Standard Brown Daan Box', price: '₹Inclusive', img: `${assetPrefix}/e2356.png`, desc: 'Natural kraft finish, tissue wrap and satin ribbon.' },
  { name: 'Pastel Blue Festive Gift Box', price: '₹129', img: `${assetPrefix}/0e412.png`, desc: 'Premium thick-walled lidded box with silk ribbon.' },
  { name: 'Magnetic Flip Corporate Diwali Hamper', price: '₹325', img: `${assetPrefix}/b6c4c.png`, desc: 'Complete with logo spot for enterprise gifting.' },
];

const cats = ['All Diwali Pours', 'Mithai Sculptures', 'Urli Bowls'];

export default function FestivePage() {
  const [activeTab, setActiveTab] = useState('All Diwali Pours');

  const filtered = activeTab === 'All Diwali Pours' ? products : products.filter((p) => p.cat === activeTab);
  const { addItem } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Nav />
      <NavigationHeader
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Collections', to: '/shop' },
          { label: 'Diwali Specials' },
        ]}
        backContext="Collections"
      />

      {/* Banner */}
      <div className="bg-[#fef8f0] border-t border-b border-[#e2ceae] flex flex-col md:flex-row gap-10 items-center p-10 md:p-14">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <img src={ellipseIcon} alt="" className="w-1.5 h-1.5" />
            <p className="text-[#2c1a10] text-[11px] font-bold tracking-[3px] uppercase" style={{ fontFamily: 'Manrope' }}>MELT CULTURE BESTSELLERS</p>
          </div>
          <h1 className="text-[#2c1a10] text-[44px] font-bold italic leading-tight" style={{ fontFamily: 'Playfair Display' }}>
            The Diwali Specials
          </h1>
          <p className="text-[#7a5c44] text-[15px] leading-relaxed max-w-[500px]" style={{ fontFamily: 'Manrope' }}>
            Luminous celebrations in clay, wax, and brass. Each signature piece replicates traditional festive offerings, hand-molded and meticulously scented for sweet memories.
          </p>
        </div>
        <div className="w-full md:w-[560px] h-[260px] rounded-[16px] overflow-hidden shrink-0">
          <img src={bannerImg} alt="Diwali Collection" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 md:px-20 pt-6 flex gap-2 flex-wrap">
        {cats.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`text-[13px] font-semibold px-6 py-3 rounded-full transition-colors ${activeTab === cat ? 'bg-[#2c1a10] text-white' : 'bg-[#fef8f0] border border-[#e2ceae] text-[#2c1a10] hover:bg-[#f5e9d9]'}`}
            style={{ fontFamily: 'Manrope' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="px-6 md:px-20 py-12">
        <div className="flex flex-wrap gap-6">
          {filtered.map((p) => (
            <div key={p.name} className="bg-[#fdf6ed] border border-[#e2ceae] rounded-[12px] overflow-hidden flex flex-col hover:shadow-lg transition-shadow" style={{ flex: '1 1 300px', minWidth: '280px', maxWidth: '420px' }}>
              <Link to={`/product/${p.slug}`} className="block">
                <div className="relative h-[280px] bg-[#f0e8d8] overflow-hidden">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-[#d4871a] text-white text-[10px] font-bold px-2 py-1 rounded" style={{ fontFamily: 'Manrope' }}>
                    📅 {p.badge}
                  </div>
                </div>
              </Link>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <p className="text-[#d97706] text-[12px] font-bold" style={{ fontFamily: 'Manrope' }}>★ {p.rating}</p>
                <div className="flex items-start justify-between">
                  <Link to={`/product/${p.slug}`}>
                    <h3 className="text-[#2c1a10] text-[18px] font-bold hover:text-[#d97706] transition-colors" style={{ fontFamily: 'Playfair Display' }}>{p.name}</h3>
                  </Link>
                  <span className="text-[#2b170f] text-[16px] font-bold ml-2 shrink-0" style={{ fontFamily: 'Manrope' }}>{p.price}</span>
                </div>
                <p className="text-[#2c1810] text-[13px] leading-relaxed flex-1" style={{ fontFamily: 'Manrope' }}>{p.desc}</p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => addItem({ slug: p.slug, name: p.name, price: parseInt(p.price.replace(/[₹,]/g, ''), 10), img: p.img })}
                    className="bg-[#d97706] text-white text-[13px] font-bold uppercase py-2.5 rounded-full flex-1 hover:bg-[#b86000] transition-colors"
                    style={{ fontFamily: 'Manrope' }}
                  >
                    Add to Cart
                  </button>
                  <Link to={`/product/${p.slug}`} className="border border-[#8a6a3b] text-[#8a6a3b] text-[12px] font-semibold px-4 py-2.5 rounded-full hover:bg-[#fef8f0] transition-colors" style={{ fontFamily: 'Manrope' }}>
                    View →
                  </Link>
                </div>
                <button onClick={() => navigate(`/custom-pour?product=${p.slug}`)} className="border border-[#8a6a3b] text-[#8a6a3b] text-[12px] font-semibold py-2 rounded-full w-full hover:bg-[#fef8f0] transition-colors" style={{ fontFamily: 'Manrope' }}>
                  🎨 Customize ₹99
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complete the Gift — informational; packaging is chosen in cart & checkout */}
      <section className="bg-[#fef8f0] py-20 px-6 md:px-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-[#2c1a10] text-[32px] font-bold" style={{ fontFamily: 'Playfair Display' }}>Complete the Gift</h2>
            <p className="text-[#7a5c44] text-[14px] mt-2" style={{ fontFamily: 'Manrope' }}>
              Premium packaging is selected at checkout — add your candles to the cart first.
            </p>
          </div>
          <Link
            to="/shop"
            className="shrink-0 bg-[#2c1a10] text-white text-[13px] font-bold uppercase px-6 py-3 rounded-full hover:bg-[#d97706] transition-colors"
            style={{ fontFamily: 'Manrope' }}
          >
            Shop All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {giftBoxes.map((b) => (
            <div key={b.name} className="bg-white border border-[#e2ceae] rounded-[12px] overflow-hidden">
              <div className="h-[200px] overflow-hidden">
                <img src={b.img} alt={b.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-[#2c1a10] text-[15px] font-bold mb-1" style={{ fontFamily: 'Manrope' }}>{b.name}</h3>
                <p className="text-[#7a5c44] text-[13px] mb-3" style={{ fontFamily: 'Manrope' }}>{b.desc}</p>
                <p className="text-[#d97706] text-[13px] font-bold" style={{ fontFamily: 'Manrope' }}>🛒 {b.price === '₹Inclusive' ? 'Included free' : `${b.price} at checkout`}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* A Taste of Home in a Glass */}
      <section className="py-20 px-6 md:px-20">
        <h2 className="text-[#2c1a10] text-[32px] font-bold mb-2 text-center" style={{ fontFamily: 'Playfair Display' }}>A Taste of Home, In a Glass</h2>
        <p className="text-[#7a5c44] text-[14px] text-center mb-10" style={{ fontFamily: 'Manrope' }}>Beverage-inspired candles, instantly dispatched</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'Cutting Chai Candle', price: '₹349', img: `${assetPrefix}/f2192.png`, desc: 'Masala chai soy wax with a dipped biscuit embed.', slug: 'cutting-chai-candle' },
            { name: 'Filter Coffee Candle', price: '₹399', img: `${assetPrefix}/35c57.png`, desc: 'South Indian filter coffee in a brass tumbler vessel.', slug: 'filter-coffee-candle' },
          ].map((p) => (
            <div key={p.name} className="bg-[#fef8f0] border border-[#e2ceae] rounded-[12px] overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-shadow">
              <div className="w-full h-[230px] md:h-auto md:w-[220px] shrink-0 overflow-hidden">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex flex-col gap-3 justify-center">
                <h3 className="text-[#2c1a10] text-[20px] font-bold" style={{ fontFamily: 'Playfair Display' }}>{p.name}</h3>
                <p className="text-[#2b170f] text-[18px] font-bold" style={{ fontFamily: 'Manrope' }}>{p.price}</p>
                <p className="text-[#2c1810] text-[14px]" style={{ fontFamily: 'Manrope' }}>{p.desc}</p>
                <div className="flex gap-3">
                  <button onClick={() => addItem({ slug: p.slug, name: p.name, price: parseInt(p.price.replace(/[₹,]/g, ''), 10), img: p.img })} className="bg-[#d97706] text-white text-[13px] font-bold uppercase py-2.5 px-5 rounded-full hover:bg-[#b86000] transition-colors" style={{ fontFamily: 'Manrope' }}>Add to Cart</button>
                  <Link to={`/product/${p.slug}`} className="border border-[#8a6a3b] text-[#8a6a3b] text-[12px] font-semibold px-4 py-2.5 rounded-full hover:bg-[#fef8f0] transition-colors" style={{ fontFamily: 'Manrope' }}>View →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
