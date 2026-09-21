import { useEffect, useState } from 'react';
import { useCart, PACKAGING_OPTIONS } from '../context/CartContext';

const brandMark = '/assets/e1d00.svg';
const RZP_KEY = 'rzp_test_TeEs1UrBbW6xEh';
const WHATSAPP_NUMBER = '917905758070';

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CartDrawer() {
  const {
    items, removeItem, updateQty, subtotal, totalItems, isOpen, closeCart,
    packaging, setPackaging, packagingTotal, clearCart,
  } = useCart();

  const shipping = subtotal >= 499 ? 0 : 79;
  const total = subtotal + shipping + packagingTotal;

  const [rzpLoading, setRzpLoading] = useState(false);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  async function handleCheckout() {
    setRzpLoading(true);
    const loaded = await loadRazorpayScript();
    setRzpLoading(false);

    if (!loaded) {
      alert('Payment service failed to load. Please try WhatsApp order instead.');
      return;
    }

    const options = {
      key: RZP_KEY,
      amount: total * 100,
      currency: 'INR',
      name: 'Melt Culture',
      description: 'Artisanal Candle Purchase',
      theme: { color: '#3C2218' },
      handler: (response: { razorpay_payment_id: string }) => {
        setConfirmationId(response.razorpay_payment_id);
        clearCart();
        closeCart();
      },
    };

    // iFrame breakout: GoDaddy and similar hosts block Razorpay popups inside iframes
    if (window.self !== window.top) {
      try {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } catch {
        // If blocked inside iframe, surface a fallback top-level link
        const params = new URLSearchParams({
          key: RZP_KEY,
          amount: String(total * 100),
          currency: 'INR',
          name: 'Melt Culture',
        });
        window.open(`https://rzp.io/rzp/meltculture?${params}`, '_blank');
      }
    } else {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    }
  }

  function handleWhatsApp() {
    const lines = items.map(
      (i) => `• ${i.name} × ${i.qty} = ₹${i.price * i.qty}`
    );
    if (packagingTotal > 0) lines.push(`• Packaging (${packaging.label}) = +₹${packagingTotal}`);
    lines.push(`• Shipping = ${shipping === 0 ? 'FREE' : `₹${shipping}`}`);
    lines.push('');
    lines.push(`*Total: ₹${total}*`);
    const message = `Hi! I'd like to place an order with Melt Culture 🕯️\n\n${lines.join('\n')}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  }

  if (!isOpen && !confirmationId) return null;

  return (
    <>
      {/* Confirmation modal */}
      {confirmationId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
          <div className="bg-[#fdf6ed] rounded-[20px] shadow-2xl p-8 max-w-sm w-full text-center flex flex-col gap-5">
            <div className="text-[48px]">🎉</div>
            <div>
              <h2 className="text-[#2c1a10] text-[24px] font-bold italic mb-2" style={{ fontFamily: 'Playfair Display' }}>
                Order Confirmed!
              </h2>
              <p className="text-[#7a5c44] text-[14px]" style={{ fontFamily: 'Manrope' }}>
                Thank you for shopping with Melt Culture. Your candles are being hand-poured with love.
              </p>
            </div>
            <div className="bg-[#fef8f0] border border-[#e2ceae] rounded-[12px] px-5 py-3">
              <p className="text-[#7a5c44] text-[11px] uppercase tracking-[1px] mb-1" style={{ fontFamily: 'Manrope' }}>Payment ID</p>
              <p className="text-[#2c1a10] text-[13px] font-bold font-mono break-all">{confirmationId}</p>
            </div>
            <button
              onClick={() => setConfirmationId(null)}
              className="bg-[#d97706] text-white text-[14px] font-bold uppercase py-3.5 rounded-full hover:bg-[#b86000] transition-colors"
              style={{ fontFamily: 'Manrope' }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[2px]" onClick={closeCart} />
          <div className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-[#fdf6ed] z-50 flex flex-col shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e2ceae]">
              <div className="flex items-center gap-2">
                <img src={brandMark} alt="" className="h-6 w-[18px]" />
                <p className="text-[#2c1a10] text-[18px] font-bold italic" style={{ fontFamily: 'Playfair Display' }}>
                  Your Bag
                </p>
                {totalItems > 0 && (
                  <span className="bg-[#d97706] text-white text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ fontFamily: 'Manrope' }}>
                    {totalItems}
                  </span>
                )}
              </div>
              <button onClick={closeCart} className="text-[#7a5c44] hover:text-[#2c1a10] text-[24px] w-8 h-8 flex items-center justify-center" aria-label="Close cart">×</button>
            </div>

            {/* Free shipping bar */}
            {subtotal > 0 && subtotal < 499 && (
              <div className="px-6 py-3 bg-[#fef8f0] border-b border-[#e2ceae]">
                <p className="text-[#7a5c44] text-[12px] mb-1.5" style={{ fontFamily: 'Manrope' }}>
                  Add <strong className="text-[#2c1a10]">₹{499 - subtotal}</strong> more for free shipping
                </p>
                <div className="h-1.5 bg-[#e2ceae] rounded-full overflow-hidden">
                  <div className="h-full bg-[#d97706] rounded-full transition-all duration-500" style={{ width: `${Math.min((subtotal / 499) * 100, 100)}%` }} />
                </div>
              </div>
            )}
            {subtotal >= 499 && (
              <div className="px-6 py-2.5 bg-[#218c21]/10 border-b border-[#e2ceae]">
                <p className="text-[#218c21] text-[12px] font-bold" style={{ fontFamily: 'Manrope' }}>⚡ You qualify for FREE shipping!</p>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
                  <p className="text-[48px]">🕯️</p>
                  <div>
                    <p className="text-[#2c1a10] text-[20px] font-bold italic mb-2" style={{ fontFamily: 'Playfair Display' }}>Your bag is empty</p>
                    <p className="text-[#7a5c44] text-[14px]" style={{ fontFamily: 'Manrope' }}>Discover handcrafted candles inspired by India.</p>
                  </div>
                  <button onClick={closeCart} className="bg-[#d97706] text-white text-[13px] font-bold uppercase px-8 py-3 rounded-full hover:bg-[#b86000] transition-colors" style={{ fontFamily: 'Manrope' }}>
                    Start Shopping
                  </button>
                </div>
              ) : (
                <>
                  {items.map((item) => (
                    <div key={item.slug} className="flex gap-4 bg-[#fef8f0] border border-[#e2ceae] rounded-[12px] p-4">
                      <div className="w-[80px] h-[80px] rounded-[8px] overflow-hidden shrink-0 bg-[#f0e8d8]">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#2c1a10] text-[15px] font-bold leading-snug truncate" style={{ fontFamily: 'Playfair Display' }}>{item.name}</p>
                        {item.customization && (
                          <p className="text-[#7a5c44] text-[11px] mt-0.5 truncate" style={{ fontFamily: 'Manrope' }}>{item.customization}</p>
                        )}
                        <p className="text-[#d97706] text-[14px] font-bold mt-1" style={{ fontFamily: 'Manrope' }}>₹{item.price}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 border border-[#e2ceae] rounded-full px-3 py-1">
                            <button onClick={() => updateQty(item.slug, item.qty - 1)} className="text-[#2c1a10] text-[16px] font-bold w-4 text-center">−</button>
                            <span className="text-[#2c1a10] text-[13px] font-bold w-4 text-center" style={{ fontFamily: 'Manrope' }}>{item.qty}</span>
                            <button onClick={() => updateQty(item.slug, item.qty + 1)} className="text-[#2c1a10] text-[16px] font-bold w-4 text-center">+</button>
                          </div>
                          <button onClick={() => removeItem(item.slug)} className="text-[#7a5c44] text-[12px] hover:text-red-500 transition-colors" style={{ fontFamily: 'Manrope' }}>Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Gift Packaging */}
                  <div className="border border-[#e2ceae] rounded-[12px] p-4 bg-[#fef8f0]">
                    <p className="text-[#2c1a10] text-[13px] font-bold mb-3 flex items-center gap-2" style={{ fontFamily: 'Manrope' }}>
                      🎁 Gift Packaging
                    </p>
                    <div className="flex flex-col gap-2">
                      {PACKAGING_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setPackaging(opt)}
                          className={`flex items-center gap-3 rounded-[10px] p-3 border text-left transition-colors ${
                            packaging.id === opt.id
                              ? 'border-[#d97706] bg-[#fff8ee]'
                              : 'border-[#e2ceae] bg-white hover:border-[#d97706]/50'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-[6px] overflow-hidden shrink-0">
                            <img src={opt.img} alt={opt.label} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[#2c1a10] text-[12px] font-bold leading-tight" style={{ fontFamily: 'Manrope' }}>{opt.label}</p>
                            <p className="text-[#7a5c44] text-[11px] leading-tight mt-0.5 line-clamp-1" style={{ fontFamily: 'Manrope' }}>{opt.desc}</p>
                          </div>
                          <span className={`text-[11px] font-bold shrink-0 px-2 py-0.5 rounded-full ${
                            opt.price === 0 ? 'bg-[#218c21]/10 text-[#218c21]' : 'bg-[#fdf6ed] text-[#2c1a10] border border-[#e2ceae]'
                          }`} style={{ fontFamily: 'Manrope' }}>
                            {opt.price === 0 ? 'Free' : `+₹${opt.price}`}
                          </span>
                          {packaging.id === opt.id && (
                            <span className="w-4 h-4 rounded-full bg-[#d97706] flex items-center justify-center shrink-0">
                              <span className="text-white text-[8px] font-bold">✓</span>
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[#e2ceae] px-6 py-5 flex flex-col gap-3 bg-[#fdf6ed]">
                {/* Order summary */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[13px]" style={{ fontFamily: 'Manrope' }}>
                    <span className="text-[#7a5c44]">Subtotal</span>
                    <span className="text-[#2c1a10] font-bold">₹{subtotal}</span>
                  </div>
                  {packagingTotal > 0 && (
                    <div className="flex justify-between text-[13px]" style={{ fontFamily: 'Manrope' }}>
                      <span className="text-[#7a5c44]">Packaging ({packaging.label})</span>
                      <span className="text-[#2c1a10] font-bold">+₹{packagingTotal}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[13px]" style={{ fontFamily: 'Manrope' }}>
                    <span className="text-[#7a5c44]">Shipping</span>
                    <span className={shipping === 0 ? 'text-[#218c21] font-bold' : 'text-[#2c1a10] font-bold'}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[#e2ceae] pt-2 mt-1" style={{ fontFamily: 'Manrope' }}>
                    <span className="text-[#2c1a10] text-[15px] font-bold">Total</span>
                    <span className="text-[#2c1a10] text-[15px] font-bold">₹{total}</span>
                  </div>
                </div>

                {/* Primary CTA — Razorpay */}
                <button
                  onClick={handleCheckout}
                  disabled={rzpLoading}
                  className="bg-[#d97706] text-white text-[14px] font-bold uppercase py-4 rounded-full text-center hover:bg-[#b86000] transition-colors tracking-[0.5px] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Manrope' }}
                >
                  {rzpLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Loading Payment…
                    </>
                  ) : (
                    `Proceed to Checkout — ₹${total}`
                  )}
                </button>

                <p className="text-[#7a5c44] text-[11px] text-center" style={{ fontFamily: 'Manrope' }}>🔒 Secure checkout · UPI · Cards · Net Banking</p>

                {/* WhatsApp fallback */}
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white text-[13px] font-bold py-3 rounded-full hover:bg-[#1eba57] transition-colors"
                  style={{ fontFamily: 'Manrope' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Order via WhatsApp
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
