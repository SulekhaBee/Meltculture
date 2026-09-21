import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const brandMark = '/assets/d764b.svg';

type PayMethod = 'upi' | 'card' | 'netbanking' | 'cod' | 'wallet' | 'upi-qr';

const BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Yes Bank', 'IndusInd Bank', 'Punjab National Bank'];
const WALLETS = [
  { name: 'PhonePe', emoji: '💜', color: '#5f259f' },
  { name: 'Google Pay', emoji: '🔵', color: '#4285f4' },
  { name: 'Paytm', emoji: '💙', color: '#002970' },
  { name: 'Amazon Pay', emoji: '🟡', color: '#ff9900' },
];

export default function PaymentPage() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [checkout, setCheckout] = useState<{ total: number; shipping: number } | null>(null);
  const [method, setMethod] = useState<PayMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [cardErrors, setCardErrors] = useState<Partial<typeof card>>({});
  const [bank, setBank] = useState('');
  const [wallet, setWallet] = useState('');
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'form' | 'processing' | 'otp'>('form');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [upiCopied, setUpiCopied] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('checkout');
    if (stored) setCheckout(JSON.parse(stored));
  }, []);

  const total = checkout?.total ?? subtotal + (subtotal >= 499 ? 0 : 79);

  function formatCardNumber(val: string) {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  }
  function formatExpiry(val: string) {
    const d = val.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  }

  function validateAndPay(e: React.FormEvent) {
    e.preventDefault();

    if (method === 'upi') {
      if (!upiId.match(/^[\w.\-_]+@[\w]+$/)) {
        setUpiError('Enter a valid UPI ID (e.g. 9876543210@upi)');
        return;
      }
      setUpiError('');
    }

    if (method === 'card') {
      const errs: Partial<typeof card> = {};
      if (card.number.replace(/\s/g, '').length < 16) errs.number = 'Enter valid 16-digit number';
      if (!card.name.trim()) errs.name = 'Required';
      if (!card.expiry.match(/^\d{2}\/\d{2}$/)) errs.expiry = 'MM/YY format';
      if (card.cvv.length < 3) errs.cvv = '3 digits';
      setCardErrors(errs);
      if (Object.keys(errs).length) return;
    }

    if (method === 'netbanking' && !bank) {
      alert('Please select a bank');
      return;
    }
    if (method === 'wallet' && !wallet) {
      alert('Please select a wallet');
      return;
    }

    // UPI QR — show 2s "verifying" then success
    if (method === 'upi-qr') {
      setStep('processing');
      setTimeout(() => processSuccess(), 2000);
      return;
    }
    // Simulate UPI/Card OTP flow
    if (method === 'upi' || method === 'card') {
      setStep('processing');
      setTimeout(() => setStep('otp'), 2000);
    } else {
      processSuccess();
    }
  }

  function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp !== '123456') {
      setOtpError('Invalid OTP. Use 123456 for demo.');
      return;
    }
    processSuccess();
  }

  function processSuccess() {
    setProcessing(true);
    const orderId = 'MC' + Date.now().toString().slice(-8);
    const checkoutData = JSON.parse(sessionStorage.getItem('checkout') || '{}');
    const finalTotal = method === 'cod' ? total + 30 : total;

    sessionStorage.setItem('lastOrder', JSON.stringify({
      orderId,
      items,
      total: finalTotal,
      method,
      checkout: checkoutData,
    }));

    // For COD orders, open WhatsApp so the business gets notified
    if (method === 'cod') {
      const itemLines = items.map((i) => `• ${i.name} × ${i.qty} — ₹${i.price * i.qty}`).join('\n');
      const msg = encodeURIComponent(
        `🕯️ *New COD Order — ${orderId}*\n\n${itemLines}\n\n*Total (incl. ₹30 COD fee): ₹${finalTotal}*\n\nName: ${checkoutData.name ?? ''}\nPhone: ${checkoutData.phone ?? ''}\nAddress: ${checkoutData.address ?? ''}, ${checkoutData.city ?? ''} — ${checkoutData.pincode ?? ''}\n\nPayment: Cash on Delivery`
      );
      window.open(`https://wa.me/917905758070?text=${msg}`, '_blank');
    }

    clearCart();
    sessionStorage.removeItem('checkout');
    setTimeout(() => navigate('/order-success'), method === 'cod' ? 500 : 1500);
  }

  if (items.length === 0 && !processing) {
    return (
      <div className="min-h-screen bg-[#fdf6ed] flex items-center justify-center flex-col gap-6">
        <p className="text-[48px]">🛒</p>
        <p className="text-[#2c1a10] text-[24px] font-bold italic" style={{ fontFamily: 'Playfair Display' }}>Nothing to pay for</p>
        <Link to="/shop" className="bg-[#d97706] text-white font-bold uppercase px-8 py-3 rounded-full" style={{ fontFamily: 'Manrope' }}>Shop Now</Link>
      </div>
    );
  }

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
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${i === 2 ? 'bg-[#d97706] text-white' : i < 2 ? 'bg-[#2c1a10] text-white' : 'bg-[#e2ceae] text-[#7a5c44]'}`}>
                {i < 2 ? '✓' : i + 1}
              </span>
              <span className={i === 2 ? 'text-[#2c1a10] font-bold' : 'text-[#7a5c44]'}>{s}</span>
              {i < 3 && <span className="text-[#e2ceae] mx-1">›</span>}
            </div>
          ))}
        </div>
        <Link to="/checkout" className="text-[#7a5c44] text-[13px] hover:text-[#d97706]" style={{ fontFamily: 'Manrope' }}>
          ← Back to Details
        </Link>
      </header>

      {/* Processing overlay */}
      {processing && (
        <div className="fixed inset-0 bg-[#fdf6ed] z-50 flex flex-col items-center justify-center gap-6">
          <div className="w-16 h-16 border-4 border-[#e2ceae] border-t-[#d97706] rounded-full animate-spin" />
          <p className="text-[#2c1a10] text-[20px] font-bold italic" style={{ fontFamily: 'Playfair Display' }}>Confirming your order…</p>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 flex flex-col lg:flex-row gap-10">
        {/* Payment Form */}
        <div className="flex-1">
          {step === 'form' && (
            <form onSubmit={validateAndPay} className="flex flex-col gap-6">
              <div className="bg-white rounded-[16px] border border-[#e2ceae] p-6 md:p-8">
                <h2 className="text-[#2c1a10] text-[20px] font-bold mb-6" style={{ fontFamily: 'Playfair Display' }}>
                  Choose Payment Method
                </h2>

                {/* Method Tabs */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
                  {[
                    { id: 'upi', icon: '⚡', label: 'UPI ID' },
                    { id: 'upi-qr', icon: '📷', label: 'UPI QR' },
                    { id: 'card', icon: '💳', label: 'Card' },
                    { id: 'netbanking', icon: '🏦', label: 'Net Banking' },
                    { id: 'wallet', icon: '👛', label: 'Wallets' },
                    { id: 'cod', icon: '📦', label: 'COD' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id as PayMethod)}
                      className={`px-3 py-2.5 rounded-[10px] text-[13px] font-bold border-2 transition-all flex flex-col items-center gap-1 ${method === m.id ? 'border-[#d97706] bg-[#fef8f0] text-[#2c1a10]' : 'border-[#e2ceae] text-[#7a5c44] hover:border-[#d97706]/40 bg-white'}`}
                      style={{ fontFamily: 'Manrope' }}
                    >
                      <span className="text-[18px] leading-none">{m.icon}</span>
                      <span className="text-[11px] leading-tight text-center">{m.label}</span>
                    </button>
                  ))}
                </div>

                {/* UPI */}
                {method === 'upi' && (
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {WALLETS.map((w) => (
                        <button key={w.name} type="button"
                          onClick={() => setUpiId(`${w.name.toLowerCase().replace(' ', '')}@upi`)}
                          className="border border-[#e2ceae] rounded-[10px] p-3 flex flex-col items-center gap-1 hover:border-[#d97706] transition-colors"
                        >
                          <span className="text-[24px]">{w.emoji}</span>
                          <span className="text-[11px] font-semibold text-[#2c1a10]" style={{ fontFamily: 'Manrope' }}>{w.name}</span>
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <label className="block text-[#2c1a10] text-[13px] font-bold mb-1.5" style={{ fontFamily: 'Manrope' }}>UPI ID</label>
                      <input
                        value={upiId}
                        onChange={(e) => { setUpiId(e.target.value); setUpiError(''); }}
                        placeholder="yourname@upi or 9876543210@paytm"
                        className={`w-full border ${upiError ? 'border-red-400' : 'border-[#e2ceae]'} rounded-[10px] px-4 py-3 text-[14px] text-[#2c1a10] outline-none focus:border-[#d97706] bg-[#faf7f2]`}
                        style={{ fontFamily: 'Manrope' }}
                      />
                      {upiError && <p className="text-red-500 text-[11px] mt-1" style={{ fontFamily: 'Manrope' }}>{upiError}</p>}
                    </div>
                    <div className="bg-[#fef8f0] border border-[#e2ceae] rounded-[10px] p-4 text-[13px] text-[#7a5c44]" style={{ fontFamily: 'Manrope' }}>
                      💡 You'll receive a payment request on your UPI app. Approve it to complete the order.
                    </div>
                  </div>
                )}

                {/* UPI QR */}
                {method === 'upi-qr' && (
                  <div className="flex flex-col items-center gap-5">
                    <div className="bg-white border border-[#e2ceae] rounded-[16px] p-5 flex flex-col items-center gap-4">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`upi://pay?pa=meltculture@upi&pn=Melt%20Culture&am=${total}&cu=INR`)}`}
                        alt="UPI QR Code"
                        className="w-[220px] h-[220px] rounded-[8px]"
                      />
                      <p className="text-[#2c1a10] text-[14px] font-bold text-center" style={{ fontFamily: 'Manrope' }}>
                        Scan to pay ₹{total}
                      </p>
                      <p className="text-[#7a5c44] text-[13px] text-center max-w-[240px]" style={{ fontFamily: 'Manrope' }}>
                        Scan with Google Pay, PhonePe, Paytm, or BHIM to complete your order.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex-1 bg-[#faf7f2] border border-[#e2ceae] rounded-[10px] px-4 py-3">
                        <p className="text-[#7a5c44] text-[11px] uppercase font-bold tracking-[0.5px] mb-0.5" style={{ fontFamily: 'Manrope' }}>UPI ID</p>
                        <p className="text-[#2c1a10] text-[14px] font-bold" style={{ fontFamily: 'Manrope' }}>meltculture@upi</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { navigator.clipboard.writeText('meltculture@upi'); setUpiCopied(true); setTimeout(() => setUpiCopied(false), 2000); }}
                        className={`shrink-0 px-4 py-3 rounded-[10px] text-[12px] font-bold border-2 transition-all ${upiCopied ? 'border-[#218c21] bg-[#218c21] text-white' : 'border-[#e2ceae] text-[#2c1a10] hover:border-[#d97706]'}`}
                        style={{ fontFamily: 'Manrope' }}
                      >
                        {upiCopied ? '✓ Copied' : 'Copy ID'}
                      </button>
                    </div>
                    <div className="bg-[#fef8f0] border border-[#e2ceae] rounded-[10px] p-3 text-[13px] text-[#7a5c44] w-full" style={{ fontFamily: 'Manrope' }}>
                      💡 After paying, click <strong className="text-[#2c1a10]">"I Have Paid"</strong> below to confirm your order.
                    </div>
                  </div>
                )}

                {/* Card */}
                {method === 'card' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-3 mb-2">
                      {['VISA', 'MC', 'RuPay', 'Amex'].map((c) => (
                        <span key={c} className="border border-[#e2ceae] rounded px-3 py-1.5 text-[12px] font-bold text-[#7a5c44]" style={{ fontFamily: 'Manrope' }}>{c}</span>
                      ))}
                    </div>
                    <div>
                      <label className="block text-[#2c1a10] text-[13px] font-bold mb-1.5" style={{ fontFamily: 'Manrope' }}>Card Number</label>
                      <input value={card.number} onChange={(e) => setCard((c) => ({ ...c, number: formatCardNumber(e.target.value) }))}
                        placeholder="1234 5678 9012 3456" maxLength={19}
                        className={`w-full border ${cardErrors.number ? 'border-red-400' : 'border-[#e2ceae]'} rounded-[10px] px-4 py-3 text-[14px] text-[#2c1a10] outline-none focus:border-[#d97706] bg-[#faf7f2] tracking-widest`}
                        style={{ fontFamily: 'Manrope' }} />
                      {cardErrors.number && <p className="text-red-500 text-[11px] mt-1">{cardErrors.number}</p>}
                    </div>
                    <div>
                      <label className="block text-[#2c1a10] text-[13px] font-bold mb-1.5" style={{ fontFamily: 'Manrope' }}>Cardholder Name</label>
                      <input value={card.name} onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                        placeholder="PRIYA MEHTA"
                        className={`w-full border ${cardErrors.name ? 'border-red-400' : 'border-[#e2ceae]'} rounded-[10px] px-4 py-3 text-[14px] text-[#2c1a10] outline-none focus:border-[#d97706] bg-[#faf7f2] uppercase`}
                        style={{ fontFamily: 'Manrope' }} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#2c1a10] text-[13px] font-bold mb-1.5" style={{ fontFamily: 'Manrope' }}>Expiry</label>
                        <input value={card.expiry} onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                          placeholder="MM/YY" maxLength={5}
                          className={`w-full border ${cardErrors.expiry ? 'border-red-400' : 'border-[#e2ceae]'} rounded-[10px] px-4 py-3 text-[14px] text-[#2c1a10] outline-none focus:border-[#d97706] bg-[#faf7f2]`}
                          style={{ fontFamily: 'Manrope' }} />
                      </div>
                      <div>
                        <label className="block text-[#2c1a10] text-[13px] font-bold mb-1.5" style={{ fontFamily: 'Manrope' }}>CVV</label>
                        <input type="password" value={card.cvv} onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                          placeholder="•••"
                          className={`w-full border ${cardErrors.cvv ? 'border-red-400' : 'border-[#e2ceae]'} rounded-[10px] px-4 py-3 text-[14px] text-[#2c1a10] outline-none focus:border-[#d97706] bg-[#faf7f2]`}
                          style={{ fontFamily: 'Manrope' }} />
                      </div>
                    </div>
                    <p className="text-[#7a5c44] text-[12px]" style={{ fontFamily: 'Manrope' }}>
                      🔒 Your card details are encrypted with 256-bit SSL. We never store card numbers.
                    </p>
                  </div>
                )}

                {/* Net Banking */}
                {method === 'netbanking' && (
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      {BANKS.map((b) => (
                        <button key={b} type="button"
                          onClick={() => setBank(b)}
                          className={`border-2 rounded-[10px] p-3 text-left text-[13px] font-semibold transition-all ${bank === b ? 'border-[#d97706] bg-[#fef8f0] text-[#2c1a10]' : 'border-[#e2ceae] text-[#7a5c44] hover:border-[#d97706]/40'}`}
                          style={{ fontFamily: 'Manrope' }}
                        >
                          🏦 {b}
                        </button>
                      ))}
                    </div>
                    {bank && <p className="text-[#7a5c44] text-[13px]" style={{ fontFamily: 'Manrope' }}>
                      You'll be redirected to {bank}'s secure net banking portal.
                    </p>}
                  </div>
                )}

                {/* Wallets */}
                {method === 'wallet' && (
                  <div className="grid grid-cols-2 gap-4">
                    {WALLETS.map((w) => (
                      <button key={w.name} type="button"
                        onClick={() => setWallet(w.name)}
                        className={`border-2 rounded-[12px] p-4 flex items-center gap-3 transition-all ${wallet === w.name ? 'border-[#d97706] bg-[#fef8f0]' : 'border-[#e2ceae] hover:border-[#d97706]/40'}`}
                      >
                        <span className="text-[28px]">{w.emoji}</span>
                        <span className="text-[14px] font-bold text-[#2c1a10]" style={{ fontFamily: 'Manrope' }}>{w.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* COD */}
                {method === 'cod' && (
                  <div className="flex flex-col gap-4">
                    {/* How it works */}
                    <div className="bg-[#fef8f0] border border-[#e2ceae] rounded-[12px] p-5 flex flex-col gap-4">
                      <p className="text-[#2c1a10] text-[15px] font-bold" style={{ fontFamily: 'Manrope' }}>📦 How Cash on Delivery Works</p>
                      <div className="flex flex-col gap-3">
                        {[
                          { step: '1', icon: '🛒', title: 'Place Your Order', desc: 'Confirm your items and address. No online payment needed.' },
                          { step: '2', icon: '📲', title: 'WhatsApp Confirmation', desc: "You'll get an order confirmation on WhatsApp within 30 minutes." },
                          { step: '3', icon: '🚚', title: 'Dispatched from Studio', desc: 'We hand-pack your candle and dispatch within 24–48 hours.' },
                          { step: '4', icon: '💵', title: 'Pay at the Door', desc: `Hand ₹${total + 30} in cash to the delivery partner. Exact change appreciated!` },
                        ].map((s) => (
                          <div key={s.step} className="flex gap-3 items-start">
                            <div className="bg-[#d97706] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ fontFamily: 'Manrope' }}>{s.step}</div>
                            <div>
                              <p className="text-[#2c1a10] text-[13px] font-bold" style={{ fontFamily: 'Manrope' }}>{s.icon} {s.title}</p>
                              <p className="text-[#7a5c44] text-[12px] leading-snug" style={{ fontFamily: 'Manrope' }}>{s.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* COD fee note */}
                    <div className="bg-white border border-[#e2ceae] rounded-[10px] px-4 py-3 flex items-start gap-3">
                      <span className="text-[18px] shrink-0">ℹ️</span>
                      <p className="text-[#7a5c44] text-[13px] leading-relaxed" style={{ fontFamily: 'Manrope' }}>
                        COD is available across India on orders up to ₹5,000. A <span className="font-bold text-[#2c1a10]">₹30 COD handling fee</span> is added to your order total. Available in 500+ cities.
                      </p>
                    </div>
                    {/* Online payment nudge */}
                    <div className="bg-[#fff9ed] border border-[#d97706]/30 rounded-[10px] px-4 py-3">
                      <p className="text-[#d97706] text-[12px] font-semibold" style={{ fontFamily: 'Manrope' }}>
                        💡 Pay online (UPI/Card) to get priority dispatch and save the ₹30 COD fee.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="bg-[#d97706] text-white text-[15px] font-bold uppercase py-4 rounded-full hover:bg-[#b86000] transition-colors tracking-[0.5px] flex items-center justify-center gap-2" style={{ fontFamily: 'Manrope' }}>
                {method === 'cod'
                  ? `📦 Place COD Order — ₹${total + 30}`
                  : method === 'upi-qr'
                  ? `✅ I Have Paid — Verify Order`
                  : `🔒 Pay ₹${total} Securely`}
              </button>

              <p className="text-[#7a5c44] text-[12px] text-center" style={{ fontFamily: 'Manrope' }}>
                By placing this order, you agree to Melt Culture's Terms of Service and Privacy Policy.
              </p>
            </form>
          )}

          {/* Processing Animation */}
          {step === 'processing' && (
            <div className="bg-white rounded-[16px] border border-[#e2ceae] p-10 flex flex-col items-center gap-6 text-center">
              <div className="w-14 h-14 border-4 border-[#e2ceae] border-t-[#d97706] rounded-full animate-spin" />
              <div>
                <p className="text-[#2c1a10] text-[20px] font-bold italic mb-2" style={{ fontFamily: 'Playfair Display' }}>
                  Initiating payment…
                </p>
                <p className="text-[#7a5c44] text-[14px]" style={{ fontFamily: 'Manrope' }}>
                  {method === 'upi-qr' ? 'Verifying payment with bank…' : method === 'upi' ? `A payment request has been sent to ${upiId}` : 'Connecting to your bank…'}
                </p>
              </div>
            </div>
          )}

          {/* OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={verifyOtp} className="bg-white rounded-[16px] border border-[#e2ceae] p-8 flex flex-col gap-6">
              <div className="text-center">
                <p className="text-[48px] mb-3">🔐</p>
                <h2 className="text-[#2c1a10] text-[22px] font-bold italic mb-2" style={{ fontFamily: 'Playfair Display' }}>
                  Enter OTP
                </h2>
                <p className="text-[#7a5c44] text-[14px]" style={{ fontFamily: 'Manrope' }}>
                  {method === 'upi' ? `Approve request on your UPI app or enter the OTP sent to your registered mobile.` : `OTP sent to your registered mobile number.`}
                </p>
                <p className="text-[#d97706] text-[12px] mt-1 font-bold" style={{ fontFamily: 'Manrope' }}>
                  (Demo OTP: 123456)
                </p>
              </div>
              <div className="flex justify-center">
                <input
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setOtpError(''); }}
                  placeholder="• • • • • •"
                  maxLength={6}
                  className={`border-2 ${otpError ? 'border-red-400' : 'border-[#e2ceae] focus:border-[#d97706]'} rounded-[12px] px-6 py-4 text-[24px] text-[#2c1a10] text-center tracking-[10px] outline-none w-48`}
                  style={{ fontFamily: 'Manrope' }}
                />
              </div>
              {otpError && <p className="text-red-500 text-[13px] text-center" style={{ fontFamily: 'Manrope' }}>{otpError}</p>}
              <button type="submit" className="bg-[#d97706] text-white text-[15px] font-bold uppercase py-4 rounded-full hover:bg-[#b86000] transition-colors" style={{ fontFamily: 'Manrope' }}>
                Verify & Place Order
              </button>
            </form>
          )}
        </div>

        {/* Order Summary */}
        <aside className="w-full lg:w-[360px] shrink-0">
          <div className="bg-white rounded-[16px] border border-[#e2ceae] p-6 sticky top-24">
            <h3 className="text-[#2c1a10] text-[18px] font-bold mb-5" style={{ fontFamily: 'Playfair Display' }}>Order Total</h3>
            <div className="flex flex-col gap-3 mb-5">
              {items.map((item) => (
                <div key={item.slug} className="flex gap-3 items-center">
                  <div className="relative w-12 h-12 rounded-[8px] overflow-hidden shrink-0 bg-[#f0e8d8]">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-1 -right-1 bg-[#d97706] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{item.qty}</span>
                  </div>
                  <p className="flex-1 text-[#2c1a10] text-[13px] font-bold truncate" style={{ fontFamily: 'Manrope' }}>{item.name}</p>
                  <p className="text-[#2c1a10] text-[13px] font-bold shrink-0" style={{ fontFamily: 'Manrope' }}>₹{item.price * item.qty}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-[#e2ceae] pt-4 flex flex-col gap-2">
              <div className="flex justify-between text-[13px]" style={{ fontFamily: 'Manrope' }}>
                <span className="text-[#7a5c44]">Subtotal</span>
                <span className="text-[#2c1a10] font-bold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-[13px]" style={{ fontFamily: 'Manrope' }}>
                <span className="text-[#7a5c44]">Shipping</span>
                <span className={checkout?.shipping === 0 ? 'text-[#218c21] font-bold' : 'text-[#2c1a10] font-bold'}>
                  {checkout?.shipping === 0 ? 'FREE' : `₹${checkout?.shipping ?? 79}`}
                </span>
              </div>
              {method === 'cod' && (
                <div className="flex justify-between text-[13px]" style={{ fontFamily: 'Manrope' }}>
                  <span className="text-[#7a5c44]">COD Fee</span>
                  <span className="text-[#2c1a10] font-bold">₹30</span>
                </div>
              )}
              <div className="flex justify-between text-[16px] border-t border-[#e2ceae] pt-3 mt-1" style={{ fontFamily: 'Manrope' }}>
                <span className="text-[#2c1a10] font-bold">Total</span>
                <span className="text-[#d97706] font-bold text-[18px]">₹{method === 'cod' ? total + 30 : total}</span>
              </div>
            </div>
            <div className="mt-5 bg-[#fef8f0] rounded-[10px] p-3 text-[12px] text-[#7a5c44] flex gap-2" style={{ fontFamily: 'Manrope' }}>
              🔒 Your payment is secured by Razorpay. Melt Culture never stores card details.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
