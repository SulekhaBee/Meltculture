import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import NavigationHeader from '../components/NavigationHeader';
import { useCart } from '../context/CartContext';

const assetPrefix = '/assets';
const ellipseIcon = `${assetPrefix}/f7abf.svg`;
const imgKraftBox = `${assetPrefix}/e2356.png`;
const imgPastelBox = `${assetPrefix}/0e412.png`;
const imgCorporate = `${assetPrefix}/b6c4c.png`;
const imgHamperChai = `${assetPrefix}/f2192.png`;
const imgHamperDiwali = `${assetPrefix}/5a082.png`;
const imgHamperHalloween = `${assetPrefix}/4fd31.png`;
const imgDrinkDazzle = `${assetPrefix}/34a0f.png`;

const occasions = [
  { label: 'Diwali Gifting', emoji: '🪔', link: '/festive-drops', img: `${assetPrefix}/d21c5.png`, live: true },
  { label: 'Corporate Hampers', emoji: '🏢', link: '#corporate', img: imgCorporate, live: true },
  { label: 'Halloween Gifting', emoji: '🎃', link: '/shop', img: `${assetPrefix}/4fd31.png`, live: true },
  { label: 'Wedding Favours', emoji: '💍', link: '#', img: `${assetPrefix}/50c2c.png`, live: false },
  { label: 'Baby Shower', emoji: '🍼', link: '#', img: `${assetPrefix}/bd6c4.png`, live: false },
  { label: 'Housewarming', emoji: '🏠', link: '#', img: `${assetPrefix}/34a0f.png`, live: false },
  { label: 'Christmas Gifting', emoji: '🎄', link: '#', img: `${assetPrefix}/f9e6f.png`, live: false },
];

const curated = [
  {
    slug: 'diwali-starter-bundle',
    name: 'The Diwali Starter',
    price: 899,
    img: imgHamperDiwali,
    includes: ['3 × Mithai Candles', 'Standard Kraft Box', 'Handwritten Note', 'Express Delivery'],
    badge: 'Most Popular',
  },
  {
    slug: 'chai-lover-kit',
    name: 'The Chai Lover Kit',
    price: 799,
    img: imgHamperChai,
    includes: ['Cutting Chai Candle', 'Filter Coffee Candle', 'Beverage Tray', 'Premium Box'],
    badge: 'Gift of the Season',
  },
  {
    slug: 'halloween-special-bundle',
    name: 'The Halloween Special',
    price: 1389,
    img: imgHamperHalloween,
    includes: ['3 × Halloween Candles', 'Limited Edition Box', 'Wax Seal', 'Premium Ship'],
    badge: 'Limited Edition',
  },
  {
    slug: 'festive-pour-studio-bundle',
    name: 'The Festive Pour Studio',
    price: 1199,
    img: imgDrinkDazzle,
    includes: ['Custom Built Candle', 'Shape + Color + Base', 'Wooden Keepsake Box', 'Letterpress Label'],
    badge: 'Fully Customized',
  },
];

const corporateTiers = [
  {
    tier: 'Starter Pack',
    price: '₹899',
    moq: 'Min. 10 units',
    features: ['5 Products · Logo Sticker · Kraft Dabba · Express Ship', 'Standard customization', 'Delivery in 5–7 days'],
    cta: 'Select Bundle',
    featured: false,
  },
  {
    tier: 'Premium Collection',
    price: '₹1,499',
    moq: 'Min. 25 units',
    features: ['10 Products · Foil Logo · Magnetic Box · Priority Ship', 'Full branding suite', 'Delivery in 3–5 days'],
    cta: 'Select Bundle',
    featured: true,
  },
  {
    tier: 'Enterprise Custom',
    price: 'Custom Quote',
    moq: 'Min. 100 units',
    features: ['Fully white-label', 'Complete logistics management', 'Design brief included', 'Dedicated account manager'],
    cta: 'Get Enquiry Form',
    featured: false,
  },
];

export default function GiftingGuidePage() {
  const { addItem } = useCart();

  return (
    <div className="min-h-screen bg-[#fdf6ed]">
      <Nav />
      <NavigationHeader
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Gifting Guide' },
        ]}
        backContext="Home"
      />

      {/* Hero */}
      <section className="bg-[#2c1a10] py-20 px-6 md:px-20 text-center">
        <div className="flex items-center gap-2 justify-center mb-3">
          <span className="bg-[#d97706] w-1.5 h-1.5 rounded-full inline-block" />
          <p className="text-[#d97706] text-[11px] font-bold tracking-[3px] uppercase" style={{ fontFamily: 'Manrope' }}>Gifting Guide</p>
        </div>
        <h1 className="text-white text-[44px] md:text-[56px] font-bold italic mb-4" style={{ fontFamily: 'Playfair Display' }}>
          Gift Light, Give Memory.
        </h1>
        <p className="text-[#7a5c44] text-[16px] max-w-xl mx-auto" style={{ fontFamily: 'Manrope' }}>
          From intimate Diwali tokens to large-scale corporate hampers — every Melt Culture gift is an experience, not just a candle.
        </p>
      </section>

      {/* Occasions */}
      <section className="py-20 px-6 md:px-20">
        <div className="flex items-center gap-2 mb-3">
          <img src={ellipseIcon} alt="" className="w-1.5 h-1.5" />
          <p className="text-[#2c1810] text-[11px] font-bold tracking-[3px] uppercase" style={{ fontFamily: 'Manrope' }}>Shop by Occasion</p>
        </div>
        <h2 className="text-[#2c1a10] text-[36px] font-bold mb-10" style={{ fontFamily: 'Playfair Display' }}>Find the perfect gift</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {occasions.map((occ) => (
            <Link
              key={occ.label}
              to={occ.live ? occ.link : '#'}
              onClick={occ.live ? undefined : (e) => e.preventDefault()}
              className={`relative rounded-[12px] overflow-hidden group block h-[180px] ${!occ.live ? 'cursor-default' : ''}`}
            >
              <img src={occ.img} alt={occ.label} className={`w-full h-full object-cover transition-transform duration-500 ${occ.live ? 'group-hover:scale-105' : ''}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {!occ.live && <div className="absolute inset-0 bg-black/30" />}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-[15px] font-bold" style={{ fontFamily: 'Manrope' }}>{occ.label}</p>
                <span className={`text-[10px] font-bold uppercase tracking-[1px] ${occ.live ? 'text-[#d97706]' : 'text-white/70'}`} style={{ fontFamily: 'Manrope' }}>
                  {occ.live ? 'LIVE NOW' : 'COMING SOON'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Curated Bundles */}
      <section className="bg-[#fef8f0] py-20 px-6 md:px-20">
        <div className="flex items-center gap-2 mb-3">
          <img src={ellipseIcon} alt="" className="w-1.5 h-1.5" />
          <p className="text-[#2c1810] text-[11px] font-bold tracking-[3px] uppercase" style={{ fontFamily: 'Manrope' }}>Curated Sets</p>
        </div>
        <h2 className="text-[#2c1a10] text-[36px] font-bold mb-10" style={{ fontFamily: 'Playfair Display' }}>Ready-made gifts they'll love</h2>
        <div className="flex flex-wrap gap-6">
          {curated.map((b) => (
            <div key={b.name} className="bg-white border border-[#e2ceae] rounded-[12px] overflow-hidden flex flex-col hover:shadow-lg transition-shadow" style={{ flex: '1 1 260px', minWidth: '260px', maxWidth: '400px' }}>
              <div className="relative h-[200px] overflow-hidden">
                <img src={b.img} alt={b.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-[#d97706] text-white text-[10px] font-bold px-2 py-1 rounded" style={{ fontFamily: 'Manrope' }}>
                  {b.badge}
                </div>
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <h3 className="text-[#2c1a10] text-[17px] font-bold" style={{ fontFamily: 'Playfair Display' }}>{b.name}</h3>
                <ul className="flex flex-col gap-1">
                  {b.includes.map((item) => (
                    <li key={item} className="text-[#7a5c44] text-[12px] flex gap-2" style={{ fontFamily: 'Manrope' }}>
                      <span className="text-[#d97706]">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between mt-auto pt-3">
                  <span className="text-[#2b170f] text-[18px] font-bold" style={{ fontFamily: 'Manrope' }}>₹{b.price}</span>
                  <button
                    onClick={() => addItem({ slug: b.slug, name: b.name, price: b.price, img: b.img })}
                    className="bg-[#d97706] text-white text-[12px] font-bold uppercase px-4 py-2 rounded-full hover:bg-[#b86000] transition-colors"
                    style={{ fontFamily: 'Manrope' }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Packaging — informational; selection happens in cart & checkout */}
      <section className="py-20 px-6 md:px-20">
        <div className="flex items-center gap-2 mb-3">
          <img src={ellipseIcon} alt="" className="w-1.5 h-1.5" />
          <p className="text-[#2c1810] text-[11px] font-bold tracking-[3px] uppercase" style={{ fontFamily: 'Manrope' }}>Our Signature Packaging</p>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-[#2c1a10] text-[36px] font-bold" style={{ fontFamily: 'Playfair Display' }}>Every gift, beautifully wrapped</h2>
            <p className="text-[#7a5c44] text-[14px] mt-2 max-w-lg" style={{ fontFamily: 'Manrope' }}>
              Packaging is selected during checkout — add products to your cart first, then choose your wrap before you pay.
            </p>
          </div>
          <Link
            to="/shop"
            className="shrink-0 bg-[#2c1a10] text-white text-[13px] font-bold uppercase px-6 py-3 rounded-full hover:bg-[#d97706] transition-colors"
            style={{ fontFamily: 'Manrope' }}
          >
            Shop Gifts →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Standard Kraft Box', price: 'Included free', img: imgKraftBox, desc: 'Natural kraft finish with tissue wrap and satin ribbon. Compostable.', badge: 'Eco-Friendly' },
            { name: 'Pastel Gift Box', price: '+₹129 at checkout', img: imgPastelBox, desc: 'Premium thick-walled rigid box with silk ribbon and letterpress label.', badge: 'Most Gifted' },
            { name: 'Magnetic Hamper Box', price: '+₹325 at checkout', img: imgCorporate, desc: 'Executive-grade magnetic flip box with gold foil logo spot.', badge: 'Corporate Pick' },
          ].map((pkg) => (
            <div key={pkg.name} className="bg-[#fef8f0] border border-[#e2ceae] rounded-[12px] overflow-hidden">
              <div className="relative h-[220px] overflow-hidden">
                <img src={pkg.img} alt={pkg.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-[#2c1a10] text-white text-[10px] font-bold px-2 py-1 rounded" style={{ fontFamily: 'Manrope' }}>{pkg.badge}</div>
              </div>
              <div className="p-5">
                <h3 className="text-[#2c1a10] text-[17px] font-bold mb-2" style={{ fontFamily: 'Playfair Display' }}>{pkg.name}</h3>
                <p className="text-[#7a5c44] text-[13px] mb-3" style={{ fontFamily: 'Manrope' }}>{pkg.desc}</p>
                <p className="text-[#d97706] text-[13px] font-bold" style={{ fontFamily: 'Manrope' }}>🛒 {pkg.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Corporate */}
      <section id="corporate" className="bg-[#2c1a10] py-20 px-6 md:px-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#d97706] w-1.5 h-1.5 rounded-full inline-block" />
            <p className="text-[#d97706] text-[11px] font-bold tracking-[3px] uppercase" style={{ fontFamily: 'Manrope' }}>Corporate Gifting</p>
          </div>
          <h2 className="text-white text-[36px] font-bold italic mb-4" style={{ fontFamily: 'Playfair Display' }}>Diwali hampers for your whole team.</h2>
          <p className="text-[#7a5c44] text-[15px] mb-12 max-w-xl" style={{ fontFamily: 'Manrope' }}>
            Bulk corporate Diwali hampers with branded packaging, logo letterpress, and complete logistics. From small startups to enterprise gifting.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {corporateTiers.map((t) => (
              <div key={t.tier} className={`p-6 rounded-[12px] flex flex-col gap-4 ${t.featured ? 'bg-[#d97706]' : 'bg-white/5 border border-white/10'}`}>
                <div>
                  <p className={`text-[12px] font-bold uppercase tracking-[1px] mb-1 ${t.featured ? 'text-white/70' : 'text-[#7a5c44]'}`} style={{ fontFamily: 'Manrope' }}>{t.tier}</p>
                  <p className={`text-[30px] font-bold italic ${t.featured ? 'text-white' : 'text-[#e8d5b7]'}`} style={{ fontFamily: 'Playfair Display' }}>{t.price}</p>
                  <p className={`text-[12px] font-semibold ${t.featured ? 'text-white/70' : 'text-[#7a5c44]'}`} style={{ fontFamily: 'Manrope' }}>{t.moq}</p>
                </div>
                <ul className="flex flex-col gap-2">
                  {t.features.map((f) => (
                    <li key={f} className={`text-[13px] flex gap-2 ${t.featured ? 'text-white/80' : 'text-[#7a5c44]'}`} style={{ fontFamily: 'Manrope' }}>
                      <span>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <a href="mailto:corporate@meltculture.in" className={`text-center text-[13px] font-bold uppercase py-3 rounded-full transition-colors ${t.featured ? 'bg-white text-[#d97706] hover:bg-[#fef8f0]' : 'border border-[#d97706] text-[#d97706] hover:bg-[#d97706] hover:text-white'}`} style={{ fontFamily: 'Manrope' }}>
                  {t.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
