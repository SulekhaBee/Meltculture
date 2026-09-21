import { Link } from 'react-router-dom';

const brandMark = '/assets/d764b.svg';
const igIcon = '/assets/033cb.svg';

export default function Footer() {
  return (
    <footer className="bg-[#fdf6ed] border-t border-[#e2ceae]">
      {/* Newsletter */}
      <div className="bg-[#2c1a10] px-6 md:px-20 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-white text-[22px] font-bold mb-1" style={{ fontFamily: 'Playfair Display' }}>
              Join the Melt Circle
            </h3>
            <p className="text-[#7a5c44] text-[14px]" style={{ fontFamily: 'Manrope' }}>
              Receive early access to seasonal festive drops, exclusive scent launches, and limited-run artisanal candle pours.
            </p>
          </div>
          <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email address"
              className="bg-white border border-[#e2ceae] rounded-full px-4 py-2.5 text-[14px] text-[#2c1a10] w-full md:w-64 outline-none focus:border-[#d97706]"
              style={{ fontFamily: 'Manrope' }}
            />
            <button
              type="submit"
              className="bg-[#d97706] text-white text-[13px] font-bold uppercase tracking-[1px] px-6 py-2.5 rounded-full hover:bg-[#b86000] transition-colors whitespace-nowrap"
              style={{ fontFamily: 'Manrope' }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="px-6 md:px-20 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={brandMark} alt="" className="h-6 w-[18px]" />
              <span className="text-[#2c1a10] text-[18px] font-bold italic" style={{ fontFamily: 'Playfair Display' }}>
                Melt Culture.
              </span>
            </div>
            <p className="text-[#7a5c44] text-[13px] leading-relaxed" style={{ fontFamily: 'Manrope' }}>
              Scented wax art rooted in Indian memory. Beautifully handcrafted, meticulously hand-poured, and made entirely for your needs.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" aria-label="Instagram">
                <img src={igIcon} alt="Instagram" className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[#2c1a10] text-[12px] font-bold tracking-[2px] uppercase mb-4" style={{ fontFamily: 'Manrope' }}>Shop</h4>
            <ul className="space-y-2">
              {[
                { label: 'All Products', to: '/shop' },
                { label: 'Festive Drops', to: '/festive-drops' },
                { label: 'Beverages', to: '/shop' },
                { label: 'Custom Pour', to: '/custom-pour' },
              ].map((l) => (
                <li key={l.to + l.label}>
                  <Link to={l.to} className="text-[#7a5c44] text-[13px] hover:text-[#d97706] transition-colors" style={{ fontFamily: 'Manrope' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[#2c1a10] text-[12px] font-bold tracking-[2px] uppercase mb-4" style={{ fontFamily: 'Manrope' }}>Help</h4>
            <ul className="space-y-2">
              {['Shipping', 'Returns', 'FAQ', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[#7a5c44] text-[13px] hover:text-[#d97706] transition-colors" style={{ fontFamily: 'Manrope' }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[#2c1a10] text-[12px] font-bold tracking-[2px] uppercase mb-4" style={{ fontFamily: 'Manrope' }}>Connect</h4>
            <ul className="space-y-2">
              {['Instagram', 'Join Newsletter', 'Wholesale', 'Stockists'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[#7a5c44] text-[13px] hover:text-[#d97706] transition-colors" style={{ fontFamily: 'Manrope' }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-[#e2ceae] mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[#7a5c44] text-[12px]" style={{ fontFamily: 'Manrope' }}>
            Made with love in India 🇮🇳 © 2026 Melt Culture
          </p>
          <p className="text-[#7a5c44] text-[12px]" style={{ fontFamily: 'Manrope' }}>
            Privacy · Terms · Sitemap
          </p>
        </div>
      </div>
    </footer>
  );
}
