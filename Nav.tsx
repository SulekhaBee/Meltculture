import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

const brandMark = '/assets/e1d00.svg';
const searchIcon = '/assets/77d2b.svg';
const cartIcon = '/assets/37a89.svg';

interface NavProps {
  dark?: boolean;
}

export default function Nav({ dark = false }: NavProps) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  const bg = dark ? 'bg-[#2c1a10]' : 'bg-[#fdf6ed]';
  const textColor = dark ? 'text-white' : 'text-[#2c1a10]';
  const borderColor = dark ? 'border-[#3d2515]' : 'border-[#e2ceae]';

  const links = [
    { label: 'Shop All', to: '/shop' },
    { label: 'Festive Drops', to: '/festive-drops' },
    { label: 'Gifting Guide', to: '/gifting-guide' },
    { label: 'Our Story', to: '/our-story' },
  ];

  return (
    <>
      <div className="bg-[#2c1a10] flex items-center justify-center px-4 py-2 w-full">
        <p className="text-white text-[11px] font-semibold tracking-[1px] uppercase" style={{ fontFamily: 'Manrope' }}>
          ✨ FREE PAN-INDIA SHIPPING ON ORDERS OVER ₹499 · HAND-POURED WITH LOVE
        </p>
      </div>
      <nav className={`${bg} ${borderColor} border-b sticky top-0 z-40 flex items-center justify-between px-6 md:px-20 py-4 w-full`}>
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0"
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <img src={brandMark} alt="" className="h-[30px] w-[22px]" />
          <span className={`${textColor} text-[22px] font-bold italic`} style={{ fontFamily: 'Playfair Display' }}>
            Melt Culture.
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-8 items-center">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-[13px] font-semibold tracking-[1px] uppercase transition-colors ${
                location.pathname === l.to ? 'text-[#d97706]' : textColor
              } hover:text-[#d97706]`}
              style={{ fontFamily: 'Manrope' }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <button className="p-1" aria-label="Search">
            <img src={searchIcon} alt="Search" className="w-5 h-5" style={{ filter: dark ? 'invert(1)' : 'none' }} />
          </button>
          {/* Cart button */}
          <button onClick={openCart} className="flex items-center gap-2 relative" aria-label="Open cart">
            <img src={cartIcon} alt="Cart" className="w-5 h-5" style={{ filter: dark ? 'invert(1)' : 'none' }} />
            <span
              className={`${totalItems > 0 ? 'bg-[#d97706]' : 'bg-[#2c1a10]'} text-white text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center transition-colors`}
              style={{ fontFamily: 'Manrope' }}
            >
              {totalItems}
            </span>
          </button>
          {/* Mobile burger */}
          <button className="md:hidden ml-1" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <div className={`w-5 h-0.5 mb-1 transition-all ${dark ? 'bg-white' : 'bg-[#2c1a10]'} ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <div className={`w-5 h-0.5 mb-1 ${dark ? 'bg-white' : 'bg-[#2c1a10]'} ${menuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-0.5 transition-all ${dark ? 'bg-white' : 'bg-[#2c1a10]'} ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#fdf6ed] border-b border-[#e2ceae] px-6 py-4 flex flex-col gap-4 z-40 relative">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className={`text-[14px] font-semibold tracking-[1px] uppercase ${location.pathname === l.to ? 'text-[#d97706]' : 'text-[#2c1a10]'}`}
              style={{ fontFamily: 'Manrope' }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
