import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  price: number;
  rating: number;
  reviewsCount?: number;
  image: string;
  badge?: string;
  slug?: string;
}

export interface ProductGridProps {
  title?: string;
  subtitle?: string;
  products: Product[];
  viewAllLink?: string;
  columns?: 2 | 3 | 4;
}

const NON_CUSTOMIZABLE = new Set([
  'kaju-katli-quartet', 'modak-quartet', 'nankati-bharati',
  'ladoo-stack', 'mithai-dabba-set', 'six-minis-tray',
  'cutting-chai-candle', 'filter-coffee-candle',
  'the-diwali-starter', 'the-chai-lover-kit',
]);

export const ProductCard: React.FC<{ product: Product; compact?: boolean; landscape?: boolean; customizeTo?: string }> = ({ product, compact = false, landscape = false, customizeTo }) => {
  const { addItem, openCart } = useCart();
  const navigate = useNavigate();
  const slug = product.slug ?? product.id;
  const isCustomizable = !NON_CUSTOMIZABLE.has(slug);
  const customizeHref = customizeTo ?? `/product/${slug}`;

  function handleAddToCart(e: React.MouseEvent) {
    e.stopPropagation();
    addItem({ slug, name: product.name, price: product.price, img: product.image });
    openCart();
  }

  if (compact) {
    return (
      <div
        className="group flex flex-col h-full bg-[#FFFDF9] rounded-xl border border-[#E8E1D5] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
        onClick={() => navigate(`/product/${slug}`)}
      >
        <div className="relative w-full aspect-square overflow-hidden bg-[#F4EFE6]">
          {product.badge && (
            <span className="absolute top-2 left-2 z-10 px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase bg-[#E08A2E] text-white rounded-full shadow-sm">
              {product.badge}
            </span>
          )}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-3 flex flex-col flex-grow justify-between gap-1.5">
          <div>
            <div className="flex items-center gap-1 text-[10px] text-[#8C6D46] mb-0.5">
              <span className="text-amber-500">★</span>
              <span className="font-medium">{product.rating}</span>
              {product.reviewsCount && <span className="text-gray-400">({product.reviewsCount})</span>}
            </div>
            <h3
              className="font-bold text-[13px] leading-snug text-[#2A1E17] group-hover:text-[#E08A2E] transition-colors line-clamp-2"
              style={{ fontFamily: 'Playfair Display' }}
            >
              {product.name}
            </h3>
            <p className="font-bold text-[13px] text-[#2A1E17] mt-1" style={{ fontFamily: 'Manrope' }}>₹{product.price}</p>
          </div>
          <div className="flex flex-col gap-1.5 w-full mt-auto">
            <button
              onClick={handleAddToCart}
              className="w-full py-1.5 text-[10px] font-bold uppercase tracking-wide text-white bg-[#E08A2E] hover:bg-[#C9751E] rounded-full transition-colors"
              style={{ fontFamily: 'Manrope' }}
            >
              Add to Cart
            </button>
            {isCustomizable && (
              <Link
                to={customizeHref}
                state={{ product: { name: product.name, price: product.price, img: product.image } }}
                onClick={(e) => e.stopPropagation()}
                className="w-full text-center border border-[#2A1E17] text-[#2A1E17] text-[9px] font-bold uppercase tracking-[0.5px] py-1.5 rounded-full hover:bg-[#2A1E17] hover:text-white transition-colors"
                style={{ fontFamily: 'Manrope' }}
              >
                View Product
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (landscape) {
    return (
      <div
        className="group flex flex-row items-center gap-4 p-3 bg-[#FFFDF9] rounded-xl border border-[#E8E1D5] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
        onClick={() => navigate(`/product/${slug}`)}
      >
        <div className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-[#F4EFE6]">
          {product.badge && (
            <span className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 text-[8px] font-semibold tracking-wider uppercase bg-[#E08A2E] text-white rounded-full shadow-sm">
              {product.badge}
            </span>
          )}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="flex flex-col flex-grow justify-between gap-2 min-w-0">
          <div>
            <div className="flex items-center gap-1 text-[11px] text-[#8C6D46] mb-0.5">
              <span className="text-amber-500">★</span>
              <span className="font-medium">{product.rating}</span>
              {product.reviewsCount && <span className="text-gray-400">({product.reviewsCount})</span>}
            </div>
            <h3
              className="font-bold text-[15px] leading-snug text-[#2A1E17] group-hover:text-[#E08A2E] transition-colors line-clamp-1"
              style={{ fontFamily: 'Playfair Display' }}
            >
              {product.name}
            </h3>
            {product.subtitle && (
              <p className="text-[12px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed" style={{ fontFamily: 'Manrope' }}>
                {product.subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[14px] text-[#2A1E17]" style={{ fontFamily: 'Manrope' }}>₹{product.price}</span>
            <button
              onClick={handleAddToCart}
              className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-[#E08A2E] hover:bg-[#C9751E] rounded-full shadow-sm transition-colors"
              style={{ fontFamily: 'Manrope' }}
            >
              Add To Cart
            </button>
            {isCustomizable && (
              <Link
                to={customizeHref}
                state={{ product: { name: product.name, price: product.price, img: product.image } }}
                onClick={(e) => e.stopPropagation()}
                className="border border-[#2A1E17] text-[#2A1E17] text-[10px] font-bold uppercase tracking-[0.5px] px-3 py-1.5 rounded-full hover:bg-[#2A1E17] hover:text-white transition-colors whitespace-nowrap"
                style={{ fontFamily: 'Manrope' }}
              >
                View Product
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group flex flex-col justify-between h-full bg-[#FFFDF9] rounded-2xl border border-[#E8E1D5] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/product/${slug}`)}
    >
      {/* Fixed Aspect Ratio Image Container */}
      <div className="relative w-full aspect-square overflow-hidden bg-[#F4EFE6]">
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase bg-[#E08A2E] text-white rounded-full shadow-sm">
            {product.badge}
          </span>
        )}
        {isCustomizable && (
          <Link
            to={customizeHref}
            state={{ product: { name: product.name, price: product.price, img: product.image } }}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center text-[14px] shadow-sm hover:bg-white transition-colors"
            aria-label={`Customize ${product.name}`}
            title="Customize +₹99"
          >
            🎨
          </Link>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
        <div>
          <div className="flex items-center space-x-1 text-xs text-[#8C6D46] mb-1">
            <span className="text-amber-500">★</span>
            <span className="font-medium">{product.rating}</span>
            {product.reviewsCount && (
              <span className="text-gray-400">({product.reviewsCount})</span>
            )}
          </div>
          <h3
            className="font-bold text-base sm:text-lg leading-snug text-[#2A1E17] group-hover:text-[#E08A2E] transition-colors line-clamp-2"
            style={{ fontFamily: 'Playfair Display' }}
          >
            {product.name}
          </h3>
          {product.subtitle && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed" style={{ fontFamily: 'Manrope' }}>
              {product.subtitle}
            </p>
          )}
        </div>

        {/* Footer — price + CTA always aligned at bottom */}
        <div className="pt-3 border-t border-[#E8E1D5] flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-base text-[#2A1E17]" style={{ fontFamily: 'Manrope' }}>
              ₹{product.price}
            </span>
            <button
              onClick={handleAddToCart}
              className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#E08A2E] hover:bg-[#C9751E] rounded-full shadow-sm transition-colors"
              style={{ fontFamily: 'Manrope' }}
            >
              Add To Cart
            </button>
          </div>
          {isCustomizable && (
            <Link
              to={customizeHref}
              state={{ product: { name: product.name, price: product.price, img: product.image } }}
              onClick={(e) => e.stopPropagation()}
              className="w-full text-center border border-[#2A1E17] text-[#2A1E17] text-[11px] font-bold uppercase tracking-[0.5px] py-[9px] rounded-full hover:bg-[#2A1E17] hover:text-white transition-colors"
              style={{ fontFamily: 'Manrope' }}
            >
              View Product
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export const ProductGrid: React.FC<ProductGridProps> = ({
  title,
  subtitle,
  products,
  viewAllLink,
  columns = 4,
}) => {
  const colClass =
    columns === 2 ? 'grid-cols-2' :
    columns === 3 ? 'grid-cols-2 md:grid-cols-3' :
    'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {(title || subtitle) && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E8E1D5]">
          <div>
            {subtitle && (
              <p className="text-xs font-bold uppercase tracking-widest text-[#E08A2E] mb-1" style={{ fontFamily: 'Manrope' }}>
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="font-bold text-2xl sm:text-3xl text-[#2A1E17]" style={{ fontFamily: 'Playfair Display' }}>
                {title}
              </h2>
            )}
          </div>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="mt-2 sm:mt-0 text-xs font-bold uppercase tracking-wider text-[#2A1E17] hover:text-[#E08A2E] flex items-center gap-1 transition-colors"
              style={{ fontFamily: 'Manrope' }}
            >
              View All <span>→</span>
            </Link>
          )}
        </div>
      )}

      <div className={`grid ${colClass} gap-3 md:gap-4 lg:gap-6 items-stretch`}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
