import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import NavigationHeader from '../components/NavigationHeader';

const assetPrefix = '/assets';
const heroImg = `${assetPrefix}/b9b61.png`;
const studioImg = `${assetPrefix}/image-6.png`;
const ellipseIcon = `${assetPrefix}/f7abf.svg`;

// Craft gallery — visual proof of sculptural work
const craftGallery = [
  { img: `${assetPrefix}/5a082.png`, label: 'Mithai Dabba Set' },
  { img: `${assetPrefix}/4bc1c.png`, label: 'Modak Quartet' },
  { img: `${assetPrefix}/960e1.png`, label: 'Lotus Garden Montage' },
  { img: `${assetPrefix}/694c4.png`, label: 'Midnight Bat Glass' },
  { img: `${assetPrefix}/85d04.png`, label: 'Peony Lake Urli' },
  { img: `${assetPrefix}/13945.png`, label: 'Halloween Electric Trio' },
];

// Series drops — the collectible culture
const series = [
  {
    name: 'Diwali Mithai Series',
    season: 'Series 01 · Oct 2024',
    status: 'SOLD OUT',
    statusColor: '#7a5c44',
    img: `${assetPrefix}/d21c5.png`,
    desc: 'Besan ladoos, kaju katli, and modaks hand-sculpted in soy wax. 48 pieces. Gone in 6 hours.',
  },
  {
    name: 'Halloween Electric Series',
    season: 'Series 02 · Oct 2024',
    status: 'SOLD OUT',
    statusColor: '#7a5c44',
    img: `${assetPrefix}/f2ff6.png`,
    desc: 'Skulls, elixirs, and bats in midnight gel. Limited to 30 sets. Built for collectors.',
  },
  {
    name: 'Urli Bloom Series',
    season: 'Series 03 · Nov 2024',
    status: 'LIVE NOW',
    statusColor: '#d97706',
    img: `${assetPrefix}/64561.png`,
    desc: 'Water lily and lotus bowls in clear gel. A still-life you can burn. 60 pieces available.',
  },
];

// What we actually stand for — visual-first reframe
const pillars = [
  {
    icon: '🎨',
    title: 'Visual sculpture first',
    desc: 'We design for the shelf before the flame. Every candle is an object worth displaying — the burn is the finale, not the feature.',
  },
  {
    icon: '🏷️',
    title: 'Drops, not products',
    desc: 'Each series is limited by design. We pour in small batches, name them, number them, and retire them. Scarcity is the point.',
  },
  {
    icon: '🇮🇳',
    title: 'Indian craft revival',
    desc: 'Our embeds reference centuries of Indian visual tradition — temple offerings, festive sweets, brass urlis. We archive culture in wax.',
  },
  {
    icon: '🌿',
    title: 'Clean material, always',
    desc: '100% natural soy wax, organic cotton wicks, no synthetics. What you burn should be as considered as what you display.',
  },
];

// Process — reframed for the visual/sculptural dimension
const process = [
  { step: '01', title: 'Design', desc: 'Each series starts with a visual brief — mood boards, reference textures, colour stories. We design the look before we think about the scent.' },
  { step: '02', title: 'Sculpt', desc: 'Our artisans hand-sculpt each embed in food-grade silicone moulds. Ladoos, lotus petals, skulls — built by hand with precision tweezers under magnification.' },
  { step: '03', title: 'Pour', desc: 'Small-batch hand-pouring in our Mumbai studio. Wax temperature, fragrance load, and layer timing are all done by feel — no machines, no shortcuts.' },
  { step: '04', title: 'Set & Embed', desc: 'Embeds are placed at exactly the right wax temperature so they\'re held in position without sinking. Timing is everything.' },
  { step: '05', title: 'Cure', desc: '48–72 hours of resting time. The wax contracts and bonds with fragrance, the sculpture firms. We don\'t rush this.' },
  { step: '06', title: 'Number & Ship', desc: 'Limited runs are numbered. Each piece is packed in custom foam inserts, documented, and dispatched with a certificate of the series.' },
];

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-[#fdf6ed]">
      <Nav />
      <NavigationHeader
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Our Story' },
        ]}
        backContext="Home"
      />

      {/* Hero — visual-art framing, not scent-first */}
      <section className="relative h-[580px] flex items-end overflow-hidden">
        <img src={heroImg} alt="Melt Culture Studio" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(44,26,16,0.2) 0%, rgba(44,26,16,0.92) 100%)' }} />
        <div className="relative px-6 md:px-20 pb-16 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <img src={ellipseIcon} alt="" className="w-1.5 h-1.5" style={{ filter: 'invert(1)' }} />
            <p className="text-white/60 text-[11px] font-bold tracking-[3px] uppercase" style={{ fontFamily: 'Manrope' }}>Our Story</p>
          </div>
          <h1 className="text-white text-[52px] md:text-[68px] font-bold italic leading-[1.05] mb-5" style={{ fontFamily: 'Playfair Display' }}>
            We make art<br />you can light.
          </h1>
          <p className="text-white/70 text-[17px] leading-relaxed max-w-xl" style={{ fontFamily: 'Manrope' }}>
            Melt Culture is India's first collectible candle studio. Every piece is a limited-run sculpture. The fragrance is the epilogue.
          </p>
        </div>
      </section>

      {/* Manifesto — the bold UX-designed statement block */}
      <section className="bg-[#2c1a10] py-24 px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#c5a059] text-[11px] font-bold tracking-[3px] uppercase mb-8" style={{ fontFamily: 'Manrope' }}>
            Why we exist
          </p>
          <blockquote className="text-white text-[28px] md:text-[40px] font-bold italic leading-tight mb-10" style={{ fontFamily: 'Playfair Display' }}>
            "The candle market tells you it's about the smell. Rose, jasmine, vanilla. We think that's half the story — and the less interesting half."
          </blockquote>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-10">
            {[
              { stat: '₹0', label: 'spent on artificial fragrances', sub: 'All natural, always.' },
              { stat: '48–72h', label: 'minimum cure per batch', sub: 'Rushed art isn\'t art.' },
              { stat: '< 100', label: 'pieces per drop', sub: 'Scarcity is by design.' },
            ].map((s) => (
              <div key={s.stat}>
                <p className="text-[#d97706] text-[42px] font-bold italic" style={{ fontFamily: 'Playfair Display' }}>{s.stat}</p>
                <p className="text-white text-[14px] font-bold mt-1" style={{ fontFamily: 'Manrope' }}>{s.label}</p>
                <p className="text-white/40 text-[12px] mt-1" style={{ fontFamily: 'Manrope' }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual proof — craft gallery strip */}
      <section className="py-20 px-6 md:px-20 bg-[#faf6f0]">
        <div className="flex items-center gap-2 mb-3">
          <img src={ellipseIcon} alt="" className="w-1.5 h-1.5" />
          <p className="text-[#2c1810] text-[11px] font-bold tracking-[3px] uppercase" style={{ fontFamily: 'Manrope' }}>The Work</p>
        </div>
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <h2 className="text-[#2c1a10] text-[36px] font-bold italic" style={{ fontFamily: 'Playfair Display' }}>
            Objects worth displaying.
          </h2>
          <Link to="/shop" className="text-[#d97706] text-[14px] font-bold uppercase tracking-[1px] flex items-center gap-2 hover:gap-3 transition-all" style={{ fontFamily: 'Manrope' }}>
            Browse all pieces →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {craftGallery.map((item) => (
            <div key={item.label} className="group relative rounded-[10px] overflow-hidden aspect-square bg-[#f0e8d8]">
              <img src={item.img} alt={item.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p className="text-white text-[11px] font-bold" style={{ fontFamily: 'Manrope' }}>{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Origin story — reframed: visual discovery, not scent discovery */}
      <section className="py-20 px-6 md:px-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="rounded-[16px] overflow-hidden h-[460px] order-2 md:order-1">
            <img src={studioImg} alt="Studio" className="w-full h-full object-cover" />
          </div>
          <div className="order-1 md:order-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#d97706] w-1.5 h-1.5 rounded-full inline-block shrink-0" />
              <p className="text-[#d97706] text-[11px] font-bold tracking-[3px] uppercase" style={{ fontFamily: 'Manrope' }}>• How It Began</p>
            </div>
            <h2 className="text-[#2c1a10] text-[36px] font-bold italic leading-tight mb-6" style={{ fontFamily: 'Playfair Display' }}>
              Fascinated at five.<br />Captivated forever.
            </h2>
            <div className="text-[#7a5c44] text-[15px]" style={{ fontFamily: 'Manrope', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '1.25rem' }}>
                When I was five years old, I could sit on the floor for hours just staring at an artisan candle. I was hypnotized by the quiet dance of the flame, the rich textures, and the patient art of hand-pouring—how simple wax could be shaped into something so hyper-realistic and believable that it felt alive.
              </p>
              <p style={{ marginBottom: '1.25rem' }}>
                To me, a handcrafted candle was never just utility; it was living sculpture. I learned early on that parting with a piece like that—or watching it melt away—felt deeply personal.
              </p>
              <p style={{ marginBottom: '1.25rem' }}>
                That childhood wonder became the core foundation of Melt Culture. We don't just formulate fragrances; we sculpt tangible art. Every vessel, pour, and embed is crafted with the exact same obsession with detail that mesmerized me as a child.
              </p>
              <p className="text-[#2c1a10] font-bold" style={{ lineHeight: '1.6' }}>
                Every series is hand-poured in small, artisan batches. Created to hold, treasure, and cherish long before you ever strike a match.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Collectible drops / Series culture */}
      <section className="bg-[#2c1a10] py-20 px-6 md:px-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#d97706] w-1.5 h-1.5 rounded-full inline-block" />
            <p className="text-[#d97706] text-[11px] font-bold tracking-[3px] uppercase" style={{ fontFamily: 'Manrope' }}>The Series</p>
          </div>
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
            <h2 className="text-white text-[36px] font-bold italic" style={{ fontFamily: 'Playfair Display' }}>
              Drops, not products.
            </h2>
            <p className="text-white/50 text-[14px] max-w-sm" style={{ fontFamily: 'Manrope' }}>
              Each series is poured once. Named, numbered, retired. We don't restock — we move forward.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {series.map((s) => (
              <div key={s.name} className="bg-white/5 border border-white/10 rounded-[14px] overflow-hidden group hover:border-[#d97706]/50 transition-colors">
                <div className="relative h-[220px] overflow-hidden">
                  <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 left-3">
                    <span
                      className="text-[10px] font-bold uppercase px-2 py-1 rounded"
                      style={{ fontFamily: 'Manrope', backgroundColor: s.status === 'LIVE NOW' ? '#d97706' : 'rgba(0,0,0,0.6)', color: 'white' }}
                    >
                      {s.status}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-white/40 text-[11px] font-bold uppercase tracking-[1px] mb-1" style={{ fontFamily: 'Manrope' }}>{s.season}</p>
                  <h3 className="text-white text-[18px] font-bold italic mb-2" style={{ fontFamily: 'Playfair Display' }}>{s.name}</h3>
                  <p className="text-white/60 text-[13px] leading-relaxed" style={{ fontFamily: 'Manrope' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 border border-[#d97706] text-[#d97706] text-[13px] font-bold uppercase px-8 py-3.5 rounded-full hover:bg-[#d97706] hover:text-white transition-colors"
              style={{ fontFamily: 'Manrope' }}
            >
              View the current drop →
            </Link>
          </div>
        </div>
      </section>

      {/* Four pillars — visual-first reframe */}
      <section className="py-20 px-6 md:px-20 bg-[#faf6f0]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <img src={ellipseIcon} alt="" className="w-1.5 h-1.5" />
            <p className="text-[#2c1810] text-[11px] font-bold tracking-[3px] uppercase" style={{ fontFamily: 'Manrope' }}>What We Stand For</p>
          </div>
          <h2 className="text-[#2c1a10] text-[36px] font-bold italic mb-12" style={{ fontFamily: 'Playfair Display' }}>Built on four beliefs.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((p, i) => (
              <div key={p.title} className="flex gap-6 items-start p-6 bg-white border border-[#e2ceae] rounded-[14px]">
                <div className="w-12 h-12 rounded-full bg-[#fdf6ed] border border-[#e2ceae] flex items-center justify-center shrink-0 text-[22px]">
                  {p.icon}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[#d97706] text-[11px] font-bold" style={{ fontFamily: 'Manrope' }}>0{i + 1}</span>
                    <h3 className="text-[#2c1a10] text-[17px] font-bold" style={{ fontFamily: 'Manrope' }}>{p.title}</h3>
                  </div>
                  <p className="text-[#7a5c44] text-[14px] leading-relaxed" style={{ fontFamily: 'Manrope' }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Craft process — sculpture-forward */}
      <section className="py-20 px-6 md:px-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <img src={ellipseIcon} alt="" className="w-1.5 h-1.5" />
            <p className="text-[#2c1810] text-[11px] font-bold tracking-[3px] uppercase" style={{ fontFamily: 'Manrope' }}>How We Work</p>
          </div>
          <h2 className="text-[#2c1a10] text-[36px] font-bold italic mb-12" style={{ fontFamily: 'Playfair Display' }}>Six steps. No shortcuts.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {process.map((p) => (
              <div key={p.step} className="bg-[#fef8f0] border border-[#e2ceae] rounded-[14px] p-6 relative overflow-hidden">
                <p className="text-[#e2ceae] text-[64px] font-bold absolute top-2 right-4 leading-none select-none" style={{ fontFamily: 'Playfair Display' }}>{p.step}</p>
                <div className="relative">
                  <p className="text-[#d97706] text-[13px] font-bold uppercase tracking-[1px] mb-3" style={{ fontFamily: 'Manrope' }}>{p.step}</p>
                  <h3 className="text-[#2c1a10] text-[20px] font-bold italic mb-2" style={{ fontFamily: 'Playfair Display' }}>{p.title}</h3>
                  <p className="text-[#7a5c44] text-[14px] leading-relaxed" style={{ fontFamily: 'Manrope' }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA — collector-culture framing */}
      <section className="bg-[#2c1a10] py-24 px-6 md:px-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img src={heroImg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-2xl mx-auto">
          <p className="text-[#c5a059] text-[11px] font-bold tracking-[3px] uppercase mb-4" style={{ fontFamily: 'Manrope' }}>Start your collection</p>
          <h2 className="text-white text-[44px] md:text-[56px] font-bold italic mb-5 leading-tight" style={{ fontFamily: 'Playfair Display' }}>
            Own a piece<br />before it's gone.
          </h2>
          <p className="text-white/60 text-[16px] mb-10 max-w-md mx-auto" style={{ fontFamily: 'Manrope' }}>
            Each series is limited, each piece is numbered. Once a drop closes, it's archived. We don't look back.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/shop" className="bg-[#d97706] text-white text-[14px] font-bold uppercase tracking-[1px] px-8 py-4 rounded-full hover:bg-[#b86000] transition-colors" style={{ fontFamily: 'Manrope' }}>
              Shop Current Drop
            </Link>
            <Link to="/custom-pour" className="border border-white/20 text-white text-[14px] font-bold uppercase tracking-[1px] px-8 py-4 rounded-full hover:border-white/50 transition-colors" style={{ fontFamily: 'Manrope' }}>
              Commission a Custom Piece
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
