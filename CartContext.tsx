import { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  slug: string;
  name: string;
  price: number;
  img: string;
  qty: number;
  customization?: string;
}

export type PackagingId = 'kraft' | 'pastel' | 'corporate';

export interface PackagingOption {
  id: PackagingId;
  label: string;
  desc: string;
  price: number;
  img: string;
  badge: string;
}

export const PACKAGING_OPTIONS: PackagingOption[] = [
  {
    id: 'kraft',
    label: 'Standard Kraft Box',
    desc: 'Natural kraft with tissue & satin ribbon. Eco-friendly.',
    price: 0,
    img: '/assets/e2356.png',
    badge: 'Included',
  },
  {
    id: 'pastel',
    label: 'Pastel Gift Box',
    desc: 'Premium rigid box with silk ribbon & letterpress label.',
    price: 129,
    img: '/assets/0e412.png',
    badge: '+₹129',
  },
  {
    id: 'corporate',
    label: 'Magnetic Hamper Box',
    desc: 'Executive magnetic flip box with gold foil logo spot.',
    price: 325,
    img: '/assets/b6c4c.png',
    badge: '+₹325',
  },
];

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>) => void;
  removeItem: (slug: string) => void;
  updateQty: (slug: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  packaging: PackagingOption;
  setPackaging: (p: PackagingOption) => void;
  packagingTotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [packaging, setPackaging] = useState<PackagingOption>(PACKAGING_OPTIONS[0]);

  function addItem(item: Omit<CartItem, 'qty'>) {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === item.slug);
      if (existing) {
        return prev.map((i) => i.slug === item.slug ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setIsOpen(true);
  }

  function removeItem(slug: string) {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }

  function updateQty(slug: string, qty: number) {
    if (qty <= 0) { removeItem(slug); return; }
    setItems((prev) => prev.map((i) => i.slug === slug ? { ...i, qty } : i));
  }

  function clearCart() {
    setItems([]);
    setPackaging(PACKAGING_OPTIONS[0]);
  }

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const packagingTotal = packaging.price;

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQty, clearCart,
      totalItems, subtotal,
      packaging, setPackaging, packagingTotal,
      isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) {
    return {
      items: [], addItem: () => {}, removeItem: () => {}, updateQty: () => {}, clearCart: () => {},
      totalItems: 0, subtotal: 0,
      packaging: PACKAGING_OPTIONS[0], setPackaging: () => {}, packagingTotal: 0,
      isOpen: false, openCart: () => {}, closeCart: () => {},
    };
  }
  return ctx;
}
