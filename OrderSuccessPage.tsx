import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const brandMark = '/assets/d764b.svg';
const igIcon = '/assets/033cb.svg';

interface OrderData {
  orderId: string;
  items: { name: string; price: number; qty: number; img: string }[];
  total: number;
  method: string;
  checkout: { firstName: string; lastName: string; email: string; address: string; city: string; state: string; pincode: string };
}

const METHOD_LABELS: Record<string, string> = {
  upi: 'UPI Payment', card: 'Credit / Debit Card', netbanking: 'Net Banking',
  wallet: 'Digital Wallet', cod: 'Cash on Delivery',
};

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('lastOrder');
    if (stored) setOrder(JSON.parse(stored));
  }, []);

  const deliveryDays = order?.method === 'cod' ? '5–7' : '2–4';
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + (order?.method === 'cod' ? 6 : 3));
  const dateStr = estimatedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Header */}
      <header className="bg-[#fdf6ed] border-b border-[#e2ceae] px-6 md:px-20 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={brandMark} alt="" className="h-7 w-[21px]" />
          <span className="text-[#2c1a10] text-[22px] font-bold italic" style={{ fontFamily: 'Playfair Display' }}>Melt Culture.</span>
        </Link>
        <div className="hidden md:flex items-center gap-3 text-[13px]" style={{ fontFamily: 'Manrope' }}>
          {['Cart', 'Details', 'Payment', 'Confirm'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#218c21] text-white">✓</span>
              <span className={i === 3 ? 'text-[#218c21] font-bold' : 'text-[#7a5c44]'}>{s}</span>
              {i < 3 && <span className="text-[#e2ceae] mx-1">›</span>}
            </div>
          ))}
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-8">
        {/* Success Banner */}
        <div className="bg-[#218c21] rounded-[20px] p-8 md:p-10 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[32px]">
            🎉
          </div>
          <div>
            <h1 className="text-white text-[32px] md:text-[36px] font-bold italic mb-2" style={{ fontFamily: 'Playfair Display' }}>
              Order Confirmed!
            </h1>
            <p className="text-white/80 text-[15px]" style={{ fontFamily: 'Manrope' }}>
              Thank you for choosing Melt Culture. Your handcrafted candles are in good hands.
            </p>
          </div>
          {order && (
            <div className="bg-white/10 rounded-[12px] px-6 py-3">
              <p className="text-white/70 text-[12px] font-semibold uppercase tracking-[1px]" style={{ fontFamily: 'Manrope' }}>Order ID</p>
              <p className="text-white text-[20px] font-bold tracking-widest" style={{ fontFamily: 'Manrope' }}>#{order.orderId}</p>
            </div>
          )}
        </div>

        {/* Delivery Info */}
        <div className="bg-white rounded-[16px] border border-[#e2ceae] p-6">
          <h2 className="text-[#2c1a10] text-[20px] font-bold mb-5" style={{ fontFamily: 'Playfair Display' }}>Delivery Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: '📦', label: 'Estimated Delivery', value: dateStr },
              { icon: '💳', label: 'Payment Method', value: METHOD_LABELS[order?.method ?? 'upi'] },
              { icon: '📍', label: 'Delivery To', value: order ? `${order.checkout.city}, ${order.checkout.state} ${order.checkout.pincode}` : 'Loading…' },
            ].map((info) => (
              <div key={info.label} className="flex flex-col gap-1">
                <p className="text-[28px]">{info.icon}</p>
                <p className="text-[#7a5c44] text-[12px] font-semibold uppercase tracking-[1px]" style={{ fontFamily: 'Manrope' }}>{info.label}</p>
                <p className="text-[#2c1a10] text-[14px] font-bold" style={{ fontFamily: 'Manrope' }}>{info.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Items */}
        {order && (
          <div className="bg-white rounded-[16px] border border-[#e2ceae] p-6">
            <h2 className="text-[#2c1a10] text-[20px] font-bold mb-5" style={{ fontFamily: 'Playfair Display' }}>Your Order</h2>
            <div className="flex flex-col gap-4 mb-5">
              {order.items.map((item) => (
                <div key={item.name} className="flex gap-4 items-center">
                  <div className="w-[72px] h-[72px] rounded-[10px] overflow-hidden shrink-0 bg-[#f0e8d8]">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#2c1a10] text-[16px] font-bold" style={{ fontFamily: 'Playfair Display' }}>{item.name}</p>
                    <p className="text-[#7a5c44] text-[13px]" style={{ fontFamily: 'Manrope' }}>Qty: {item.qty}</p>
                  </div>
                  <p className="text-[#2c1a10] text-[15px] font-bold shrink-0" style={{ fontFamily: 'Manrope' }}>₹{item.price * item.qty}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-[#e2ceae] pt-4 flex justify-between">
              <p className="text-[#2c1a10] text-[16px] font-bold" style={{ fontFamily: 'Manrope' }}>Total Paid</p>
              <p className="text-[#d97706] text-[18px] font-bold" style={{ fontFamily: 'Manrope' }}>₹{order.total}</p>
            </div>
          </div>
        )}

        {/* What's Next */}
        <div className="bg-[#fef8f0] border border-[#e2ceae] rounded-[16px] p-6">
          <h2 className="text-[#2c1a10] text-[20px] font-bold mb-5" style={{ fontFamily: 'Playfair Display' }}>What happens next?</h2>
          <div className="flex flex-col gap-4">
            {[
              { icon: '📧', step: '1', title: 'Confirmation Email', desc: `We'll send your order confirmation and invoice to ${order?.checkout?.email ?? 'your email'}.` },
              { icon: '🕯️', step: '2', title: 'We begin crafting', desc: 'Your candles are hand-poured fresh in our Mumbai studio within 4–6 hours.' },
              { icon: '⚡', step: '3', title: 'Dispatch notification', desc: `Your order ships in ${deliveryDays} business days. You'll get a tracking link via SMS and email.` },
              { icon: '🏠', step: '4', title: 'Arrive at your doorstep', desc: `Expected by ${dateStr}. All glass items travel in custom foam inserts.` },
            ].map((step) => (
              <div key={step.step} className="flex gap-4 items-start">
                <div className="bg-[#d97706] text-white w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0" style={{ fontFamily: 'Manrope' }}>{step.step}</div>
                <div>
                  <p className="text-[#2c1a10] text-[15px] font-bold" style={{ fontFamily: 'Manrope' }}>{step.icon} {step.title}</p>
                  <p className="text-[#7a5c44] text-[13px] mt-0.5" style={{ fontFamily: 'Manrope' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp Support */}
        <div className="bg-[#2c1a10] rounded-[16px] p-6 flex flex-col md:flex-row items-center gap-5 justify-between">
          <div>
            <p className="text-white text-[18px] font-bold italic mb-1" style={{ fontFamily: 'Playfair Display' }}>Need help with your order?</p>
            <p className="text-[#7a5c44] text-[14px]" style={{ fontFamily: 'Manrope' }}>
              Message us directly on WhatsApp — we reply within minutes.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <a
              href={`https://wa.me/917905758070?text=${encodeURIComponent(`Hi! I placed order #${order?.orderId ?? ''} and need help.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white text-[14px] font-bold py-3 px-6 rounded-full hover:bg-[#1ebe5a] transition-colors"
              style={{ fontFamily: 'Manrope' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
            <p className="text-[#7a5c44] text-[11px] text-center" style={{ fontFamily: 'Manrope' }}>+91 79057 58070</p>
          </div>
        </div>

        {/* Share / Social */}
        <div className="text-center flex flex-col items-center gap-4">
          <p className="text-[#7a5c44] text-[14px]" style={{ fontFamily: 'Manrope' }}>
            Share your Melt Culture experience 🕯️
          </p>
          <div className="flex gap-3">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="border border-[#e2ceae] rounded-full px-5 py-2.5 text-[13px] font-bold text-[#2c1a10] flex items-center gap-2 hover:bg-[#fef8f0] transition-colors" style={{ fontFamily: 'Manrope' }}>
              <img src={igIcon} alt="" className="w-4 h-4" /> @meltculture
            </a>
            <a href={`https://wa.me/?text=${encodeURIComponent('I just ordered from Melt Culture — handcrafted candles inspired by India! 🕯️ Check them out at meltculture.in')}`} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white text-[13px] font-bold px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-[#1ebe5a] transition-colors" style={{ fontFamily: 'Manrope' }}>
              Share on WhatsApp
            </a>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/" className="bg-[#d97706] text-white text-[14px] font-bold uppercase px-8 py-3.5 rounded-full hover:bg-[#b86000] transition-colors" style={{ fontFamily: 'Manrope' }}>
            Back to Home
          </Link>
          <Link to="/shop" className="border border-[#2c1a10] text-[#2c1a10] text-[14px] font-bold uppercase px-8 py-3.5 rounded-full hover:bg-[#fdf6ed] transition-colors" style={{ fontFamily: 'Manrope' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
