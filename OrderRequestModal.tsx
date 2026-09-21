import { useState, useEffect, useRef } from 'react';

type LineItem = { label: string; price: number };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productImg: string;
  items: LineItem[];
  total: number;
};

function genRef() {
  return 'MC-REQ-' + Math.floor(10000 + Math.random() * 90000);
}

export default function OrderRequestModal({ isOpen, onClose, productName, productImg, items, total }: Props) {
  const [step, setStep] = useState<'form' | 'invoice'>('form');
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const refId = useRef(genRef());
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setStep('form');
      setErrors({});
    } else {
      refId.current = genRef();
    }
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Full name is required';
    if (!/^[6-9]\d{9}$/.test(whatsapp)) e.whatsapp = 'Enter a valid 10-digit Indian mobile number';
    if (address.trim().length < 10) e.address = 'Please enter your full shipping address';
    if (!/^\d{6}$/.test(pincode)) e.pincode = 'Enter a valid 6-digit pincode';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (validate()) setStep('invoice');
  }

  function sendWhatsApp() {
    const itemLines = items.map((it) => `  • ${it.label}: ₹${it.price}`).join('\n');
    const msg = encodeURIComponent(
      `🕯️ *Order Request — ${refId.current}*\n\n` +
      `*Product:* ${productName}\n\n` +
      `*Order Breakdown:*\n${itemLines}\n\n` +
      `*Total: ₹${total}*\n\n` +
      `*Customer Details:*\n` +
      `Name: ${name}\n` +
      `WhatsApp: ${whatsapp}\n` +
      (email ? `Email: ${email}\n` : '') +
      `Address: ${address}\n` +
      `Pincode: ${pincode}\n\n` +
      `Please confirm availability and share payment link. Thank you!`
    );
    window.open(`https://wa.me/917905758070?text=${msg}`, '_blank');
  }

  function printInvoice() {
    window.print();
  }

  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:max-w-[560px] rounded-t-[20px] sm:rounded-[20px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2ceae] shrink-0">
          <div>
            <p className="text-[#7a5c44] text-[11px] font-bold tracking-[2px] uppercase" style={{ fontFamily: 'Manrope' }}>Melt Culture Studio</p>
            <h2 className="text-[#2c1a10] text-[20px] font-bold leading-tight" style={{ fontFamily: 'Playfair Display' }}>
              {step === 'form' ? 'Request an Order' : 'Order Request Submitted'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#7a5c44] hover:bg-[#fdf6ed] transition-colors text-[20px]"
          >
            ×
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {step === 'form' ? (
            <div className="flex flex-col gap-5">
              {/* Product preview strip */}
              <div className="flex gap-4 items-center bg-[#fdf6ed] border border-[#e2ceae] rounded-[12px] p-4">
                <img src={productImg} alt={productName} className="w-16 h-16 rounded-[8px] object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[#2c1a10] text-[15px] font-bold truncate" style={{ fontFamily: 'Playfair Display' }}>{productName}</p>
                  <p className="text-[#7a5c44] text-[13px]" style={{ fontFamily: 'Manrope' }}>
                    {items.length} item{items.length > 1 ? 's' : ''} · ₹{total} total
                  </p>
                </div>
                <span className="text-[#d97706] text-[16px] font-bold shrink-0" style={{ fontFamily: 'Manrope' }}>₹{total}</span>
              </div>

              {/* Form fields */}
              {[
                { key: 'name', label: 'Full Name *', placeholder: 'Priya Sharma', value: name, onChange: setName, type: 'text' },
                { key: 'whatsapp', label: 'WhatsApp Number *', placeholder: '9876543210', value: whatsapp, onChange: setWhatsapp, type: 'tel' },
                { key: 'email', label: 'Email (optional)', placeholder: 'priya@email.com', value: email, onChange: setEmail, type: 'email' },
              ].map(({ key, label, placeholder, value, onChange, type }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-[#2c1a10] text-[13px] font-bold" style={{ fontFamily: 'Manrope' }}>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => { onChange(e.target.value); setErrors((prev) => ({ ...prev, [key]: '' })); }}
                    className="border border-[#e2ceae] rounded-[10px] px-4 py-3 text-[14px] text-[#2c1a10] outline-none focus:border-[#d97706] bg-[#faf7f2]"
                    style={{ fontFamily: 'Manrope' }}
                  />
                  {errors[key] && <p className="text-red-500 text-[12px]" style={{ fontFamily: 'Manrope' }}>{errors[key]}</p>}
                </div>
              ))}

              <div className="flex flex-col gap-1.5">
                <label className="text-[#2c1a10] text-[13px] font-bold" style={{ fontFamily: 'Manrope' }}>Shipping Address *</label>
                <textarea
                  placeholder="House/Flat, Street, City, State"
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); setErrors((prev) => ({ ...prev, address: '' })); }}
                  rows={3}
                  className="border border-[#e2ceae] rounded-[10px] px-4 py-3 text-[14px] text-[#2c1a10] outline-none focus:border-[#d97706] bg-[#faf7f2] resize-none"
                  style={{ fontFamily: 'Manrope' }}
                />
                {errors.address && <p className="text-red-500 text-[12px]" style={{ fontFamily: 'Manrope' }}>{errors.address}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#2c1a10] text-[13px] font-bold" style={{ fontFamily: 'Manrope' }}>6-Digit Pincode *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="400001"
                  value={pincode}
                  onChange={(e) => { setPincode(e.target.value.replace(/\D/g, '').slice(0, 6)); setErrors((prev) => ({ ...prev, pincode: '' })); }}
                  className="border border-[#e2ceae] rounded-[10px] px-4 py-3 text-[14px] text-[#2c1a10] outline-none focus:border-[#d97706] bg-[#faf7f2]"
                  style={{ fontFamily: 'Manrope' }}
                />
                {errors.pincode && <p className="text-red-500 text-[12px]" style={{ fontFamily: 'Manrope' }}>{errors.pincode}</p>}
              </div>

              <p className="text-[#7a5c44] text-[12px] leading-relaxed" style={{ fontFamily: 'Manrope' }}>
                No payment required now. Our studio team will confirm availability on WhatsApp and share a secure payment link.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5" ref={invoiceRef}>
              {/* Invoice card */}
              <div className="border border-[#e2ceae] rounded-[14px] overflow-hidden">
                {/* Invoice header */}
                <div className="bg-[#2c1a10] px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-[#c5a059] text-[10px] font-bold tracking-[2px] uppercase" style={{ fontFamily: 'Manrope' }}>Proforma Invoice</p>
                    <p className="text-white text-[15px] font-bold" style={{ fontFamily: 'Manrope' }}>{refId.current}</p>
                  </div>
                  <span className="bg-[#d97706] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.8px]" style={{ fontFamily: 'Manrope' }}>
                    Pending Confirmation
                  </span>
                </div>

                {/* Customer + date */}
                <div className="bg-[#fdf6ed] px-5 py-3 flex justify-between items-start gap-4 border-b border-[#e2ceae]">
                  <div>
                    <p className="text-[#7a5c44] text-[11px] font-bold uppercase tracking-[1px]" style={{ fontFamily: 'Manrope' }}>Bill To</p>
                    <p className="text-[#2c1a10] text-[14px] font-bold mt-0.5" style={{ fontFamily: 'Manrope' }}>{name}</p>
                    <p className="text-[#7a5c44] text-[12px]" style={{ fontFamily: 'Manrope' }}>+91 {whatsapp}</p>
                    <p className="text-[#7a5c44] text-[12px]" style={{ fontFamily: 'Manrope' }}>{pincode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#7a5c44] text-[11px] font-bold uppercase tracking-[1px]" style={{ fontFamily: 'Manrope' }}>Date</p>
                    <p className="text-[#2c1a10] text-[13px] font-semibold mt-0.5" style={{ fontFamily: 'Manrope' }}>{today}</p>
                  </div>
                </div>

                {/* Line items */}
                <div className="px-5 py-4 flex flex-col gap-3">
                  {items.map((it, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <p className="text-[#2c1a10] text-[13px]" style={{ fontFamily: 'Manrope' }}>{it.label}</p>
                      <p className="text-[#2c1a10] text-[13px] font-bold" style={{ fontFamily: 'Manrope' }}>₹{it.price}</p>
                    </div>
                  ))}
                  <div className="border-t border-[#e2ceae] pt-3 flex items-center justify-between">
                    <p className="text-[#2c1a10] text-[15px] font-bold" style={{ fontFamily: 'Manrope' }}>Total</p>
                    <p className="text-[#d97706] text-[18px] font-bold" style={{ fontFamily: 'Manrope' }}>₹{total}</p>
                  </div>
                </div>

                {/* Studio note */}
                <div className="bg-[#fef8f0] border-t border-[#e2ceae] px-5 py-3">
                  <p className="text-[#7a5c44] text-[12px] leading-relaxed italic" style={{ fontFamily: 'Playfair Display' }}>
                    Order request received! Our studio team will verify inventory and message you on WhatsApp with delivery details and a payment link within 24 hours.
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="bg-[#fdf6ed] border border-[#e2ceae] rounded-[10px] px-4 py-3">
                <p className="text-[#7a5c44] text-[11px] font-bold uppercase tracking-[1px] mb-1" style={{ fontFamily: 'Manrope' }}>Ship To</p>
                <p className="text-[#2c1a10] text-[13px]" style={{ fontFamily: 'Manrope' }}>{address}, {pincode}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-[#e2ceae] flex flex-col gap-3 shrink-0">
          {step === 'form' ? (
            <button
              onClick={handleSubmit}
              className="w-full bg-[#d97706] text-white py-4 rounded-full text-[15px] font-bold uppercase tracking-[0.8px] hover:bg-[#b86000] transition-colors"
              style={{ fontFamily: 'Manrope' }}
            >
              Review Order Request →
            </button>
          ) : (
            <>
              <button
                onClick={sendWhatsApp}
                className="w-full bg-[#25D366] text-white py-4 rounded-full text-[15px] font-bold uppercase tracking-[0.8px] hover:bg-[#1ebe5a] transition-colors flex items-center justify-center gap-2"
                style={{ fontFamily: 'Manrope' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Send Order via WhatsApp
              </button>
              <button
                onClick={printInvoice}
                className="w-full border border-[#2c1a10] text-[#2c1a10] py-3.5 rounded-full text-[14px] font-bold uppercase tracking-[0.8px] hover:bg-[#fdf6ed] transition-colors"
                style={{ fontFamily: 'Manrope' }}
              >
                🖨 Generate Digital Invoice
              </button>
            </>
          )}
          {step === 'invoice' && (
            <button
              onClick={() => setStep('form')}
              className="text-[#7a5c44] text-[13px] text-center hover:text-[#2c1a10] transition-colors"
              style={{ fontFamily: 'Manrope' }}
            >
              ← Edit details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
