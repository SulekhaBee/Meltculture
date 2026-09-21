import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, PACKAGING_OPTIONS } from '../context/CartContext';

const brandMark = '/assets/d764b.svg';

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh',
];

interface FormData {
  firstName: string; lastName: string; email: string; phone: string;
  address: string; apartment: string; city: string; state: string; pincode: string;
  giftNote: string; saveAddress: boolean;
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart, packaging, setPackaging, packagingTotal } = useCart();
  const navigate = useNavigate();

  const shipping = subtotal >= 499 ? 0 : 79;
  const total = subtotal + shipping + packagingTotal;

  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', apartment: '', city: '', state: 'Maharashtra', pincode: '',
    giftNote: '', saveAddress: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  function update(field: keyof FormData, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = 'Valid email required';
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = 'Valid 10-digit mobile required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.pincode.match(/^\d{6}$/)) e.pincode = '6-digit PIN required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    // Store checkout details for payment page
    sessionStorage.setItem('checkout', JSON.stringify({ ...form, subtotal, shipping, packagingTotal, packagingLabel: packaging.label, total }));
    navigate('/payment');
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fdf6ed] flex items-center justify-center flex-col gap-6">
        <p className="text-[48px]">🛒</p>
        <p className="text-[#2c1a10] text-[24px] font-bold italic" style={{ fontFamily: 'Playfair Display' }}>Your cart is empty</p>
        <Link to="/shop" className="bg-[#d97706] text-white font-bold uppercase px-8 py-3 rounded-full hover:bg-[#b86000] transition-colors" style={{ fontFamily: 'Manrope' }}>
          Continue Shopping
        </Link>
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
        {/* Steps */}
        <div className="hidden md:flex items-center gap-3 text-[13px]" style={{ fontFamily: 'Manrope' }}>
          {['Cart', 'Details', 'Payment', 'Confirm'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${i === 1 ? 'bg-[#d97706] text-white' : i < 1 ? 'bg-[#2c1a10] text-white' : 'bg-[#e2ceae] text-[#7a5c44]'}`}>
                {i < 1 ? '✓' : i + 1}
              </span>
              <span className={i === 1 ? 'text-[#2c1a10] font-bold' : 'text-[#7a5c44]'}>{step}</span>
              {i < 3 && <span className="text-[#e2ceae] mx-1">›</span>}
            </div>
          ))}
        </div>
        <Link to="/shop" className="text-[#7a5c44] text-[13px] hover:text-[#d97706]" style={{ fontFamily: 'Manrope' }}>
          ← Continue Shopping
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 flex flex-col lg:flex-row gap-10">
        {/* Form */}
        <form onSubmit={handleContinue} className="flex-1 flex flex-col gap-8">
          {/* Contact */}
          <section className="bg-white rounded-[16px] border border-[#e2ceae] p-6 md:p-8">
            <h2 className="text-[#2c1a10] text-[20px] font-bold mb-6" style={{ fontFamily: 'Playfair Display' }}>
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="First Name" error={errors.firstName}>
                <input value={form.firstName} onChange={(e) => update('firstName', e.target.value)}
                  className={inputCls(!!errors.firstName)} placeholder="Priya" />
              </Field>
              <Field label="Last Name" error={errors.lastName}>
                <input value={form.lastName} onChange={(e) => update('lastName', e.target.value)}
                  className={inputCls(!!errors.lastName)} placeholder="Mehta" />
              </Field>
              <Field label="Email" error={errors.email} className="md:col-span-2">
                <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
                  className={inputCls(!!errors.email)} placeholder="priya@example.com" />
              </Field>
              <Field label="Mobile Number" error={errors.phone} className="md:col-span-2">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a5c44] text-[14px] font-semibold border-r border-[#e2ceae] pr-3" style={{ fontFamily: 'Manrope' }}>+91</span>
                  <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)}
                    className={`${inputCls(!!errors.phone)} pl-16`} placeholder="9876543210" maxLength={10} />
                </div>
              </Field>
            </div>
          </section>

          {/* Delivery Address */}
          <section className="bg-white rounded-[16px] border border-[#e2ceae] p-6 md:p-8">
            <h2 className="text-[#2c1a10] text-[20px] font-bold mb-6" style={{ fontFamily: 'Playfair Display' }}>
              Delivery Address
            </h2>
            <div className="flex flex-col gap-4">
              <Field label="Address" error={errors.address}>
                <input value={form.address} onChange={(e) => update('address', e.target.value)}
                  className={inputCls(!!errors.address)} placeholder="House No., Street, Area" />
              </Field>
              <Field label="Apartment / Floor (optional)">
                <input value={form.apartment} onChange={(e) => update('apartment', e.target.value)}
                  className={inputCls(false)} placeholder="Flat 4B, Tower C" />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="City" error={errors.city}>
                  <input value={form.city} onChange={(e) => update('city', e.target.value)}
                    className={inputCls(!!errors.city)} placeholder="Mumbai" />
                </Field>
                <Field label="PIN Code" error={errors.pincode}>
                  <input value={form.pincode} onChange={(e) => update('pincode', e.target.value)}
                    className={inputCls(!!errors.pincode)} placeholder="400001" maxLength={6} />
                </Field>
              </div>
              <Field label="State">
                <select value={form.state} onChange={(e) => update('state', e.target.value)} className={inputCls(false)}>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
          </section>

          {/* Gift Packaging */}
          <section className="bg-white rounded-[16px] border border-[#e2ceae] p-6 md:p-8">
            <h2 className="text-[#2c1a10] text-[20px] font-bold mb-1" style={{ fontFamily: 'Playfair Display' }}>
              🎁 Gift Packaging
            </h2>
            <p className="text-[#7a5c44] text-[13px] mb-5" style={{ fontFamily: 'Manrope' }}>
              Every Melt Culture order ships beautifully. Choose your wrap:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PACKAGING_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPackaging(opt)}
                  className={`flex flex-col rounded-[12px] border-2 overflow-hidden text-left transition-all ${
                    packaging.id === opt.id ? 'border-[#d97706] shadow-md' : 'border-[#e2ceae] hover:border-[#d97706]/50'
                  }`}
                >
                  <div className="h-[120px] overflow-hidden relative">
                    <img src={opt.img} alt={opt.label} className="w-full h-full object-cover" />
                    <div className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      opt.price === 0 ? 'bg-[#218c21] text-white' : 'bg-[#2c1a10] text-white'
                    }`} style={{ fontFamily: 'Manrope' }}>
                      {opt.price === 0 ? 'Included' : `+₹${opt.price}`}
                    </div>
                    {packaging.id === opt.id && (
                      <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-[#d97706] flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[#2c1a10] text-[13px] font-bold" style={{ fontFamily: 'Manrope' }}>{opt.label}</p>
                    <p className="text-[#7a5c44] text-[11px] mt-0.5 leading-relaxed" style={{ fontFamily: 'Manrope' }}>{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Gift Note */}
          <section className="bg-white rounded-[16px] border border-[#e2ceae] p-6 md:p-8">
            <h2 className="text-[#2c1a10] text-[20px] font-bold mb-2" style={{ fontFamily: 'Playfair Display' }}>
              Gift Note <span className="text-[#7a5c44] text-[14px] font-normal italic">(optional)</span>
            </h2>
            <p className="text-[#7a5c44] text-[13px] mb-4" style={{ fontFamily: 'Manrope' }}>
              Handwritten on premium card stock and included in your package.
            </p>
            <textarea
              value={form.giftNote}
              onChange={(e) => update('giftNote', e.target.value)}
              rows={3}
              maxLength={200}
              className="w-full border border-[#e2ceae] rounded-[10px] px-4 py-3 text-[14px] text-[#2c1a10] outline-none focus:border-[#d97706] resize-none"
              style={{ fontFamily: 'Manrope' }}
              placeholder="Wishing you a luminous Diwali filled with warmth and joy! 🪔"
            />
            <p className="text-[#7a5c44] text-[11px] mt-1 text-right" style={{ fontFamily: 'Manrope' }}>
              {form.giftNote.length}/200
            </p>
          </section>

          <button type="submit" className="bg-[#d97706] text-white text-[15px] font-bold uppercase py-4 rounded-full hover:bg-[#b86000] transition-colors tracking-[0.5px]" style={{ fontFamily: 'Manrope' }}>
            Continue to Payment →
          </button>

          {/* WhatsApp alternative */}
          <a
            href={`https://wa.me/917905758070?text=${encodeURIComponent(`Hi Melt Culture! I'd like to place an order.\n\nItems:\n${items.map((i) => `• ${i.name} × ${i.qty} = ₹${i.price * i.qty}`).join('\n')}\n\nTotal: ₹${total}\n\nI'll share my delivery address on WhatsApp.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border-2 border-[#25D366] text-[#25D366] text-[14px] font-bold py-3.5 rounded-full hover:bg-[#25D366] hover:text-white transition-colors"
            style={{ fontFamily: 'Manrope' }}
          >
            <WhatsAppIcon />
            Or order directly via WhatsApp
          </a>
        </form>

        {/* Order Summary */}
        <aside className="w-full lg:w-[380px] shrink-0">
          <div className="bg-white rounded-[16px] border border-[#e2ceae] p-6 sticky top-24">
            <h3 className="text-[#2c1a10] text-[18px] font-bold mb-5" style={{ fontFamily: 'Playfair Display' }}>
              Order Summary
            </h3>
            <div className="flex flex-col gap-3 mb-5">
              {items.map((item) => (
                <div key={item.slug} className="flex gap-3 items-start">
                  <div className="relative w-16 h-16 rounded-[8px] overflow-hidden shrink-0 bg-[#f0e8d8]">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-1 -right-1 bg-[#d97706] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center" style={{ fontFamily: 'Manrope' }}>
                      {item.qty}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#2c1a10] text-[14px] font-bold truncate" style={{ fontFamily: 'Manrope' }}>{item.name}</p>
                    {item.customization && <p className="text-[#7a5c44] text-[11px] truncate" style={{ fontFamily: 'Manrope' }}>{item.customization}</p>}
                  </div>
                  <p className="text-[#2c1a10] text-[14px] font-bold shrink-0" style={{ fontFamily: 'Manrope' }}>₹{item.price * item.qty}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-[#e2ceae] pt-4 flex flex-col gap-2">
              <div className="flex justify-between text-[13px]" style={{ fontFamily: 'Manrope' }}>
                <span className="text-[#7a5c44]">Subtotal</span>
                <span className="text-[#2c1a10] font-bold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-[13px]" style={{ fontFamily: 'Manrope' }}>
                <span className="text-[#7a5c44]">Packaging</span>
                <span className="text-[#2c1a10] font-bold">
                  {packagingTotal === 0 ? 'Included' : `+₹${packagingTotal}`}
                </span>
              </div>
              <div className="flex justify-between text-[13px]" style={{ fontFamily: 'Manrope' }}>
                <span className="text-[#7a5c44]">Shipping</span>
                <span className={shipping === 0 ? 'text-[#218c21] font-bold' : 'text-[#2c1a10] font-bold'}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-[16px] border-t border-[#e2ceae] pt-3 mt-1" style={{ fontFamily: 'Manrope' }}>
                <span className="text-[#2c1a10] font-bold">Total</span>
                <span className="text-[#2c1a10] font-bold">₹{total}</span>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              {[
                { icon: '🔒', text: 'Secure 256-bit SSL checkout' },
                { icon: '⚡', text: 'Express dispatch in 24hrs' },
                { icon: '↩️', text: '7-day hassle-free returns' },
              ].map((b) => (
                <div key={b.text} className="flex gap-2 items-center">
                  <span className="text-[14px]">{b.icon}</span>
                  <span className="text-[#7a5c44] text-[12px]" style={{ fontFamily: 'Manrope' }}>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, error, children, className = '' }: {
  label: string; error?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[#2c1a10] text-[13px] font-bold" style={{ fontFamily: 'Manrope' }}>{label}</label>
      {children}
      {error && <p className="text-red-500 text-[11px]" style={{ fontFamily: 'Manrope' }}>{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full border ${hasError ? 'border-red-400' : 'border-[#e2ceae]'} rounded-[10px] px-4 py-3 text-[14px] text-[#2c1a10] outline-none focus:border-[#d97706] transition-colors bg-[#faf7f2]`;
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
