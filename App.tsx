import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ShopAllPage from './pages/ShopAllPage';
import FestivePage from './pages/FestivePage';
import CustomPourPage from './pages/CustomPourPage';
import ProductPage from './pages/ProductPage';
import OurStoryPage from './pages/OurStoryPage';
import GiftingGuidePage from './pages/GiftingGuidePage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import CategoryPage from './pages/CategoryPage';

export default function App() {
  useEffect(() => {
    document.title = 'Melt Culture | Handcrafted Artisan & Custom Pour Candles';
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = 'Discover hyper-realistic, hand-poured candles inspired by Indian nostalgia. Personalize your custom pour with bespoke shapes, wax colors, and gift packaging.';
  }, []);

  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <CartDrawer />
        <WhatsAppButton />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopAllPage />} />
          <Route path="/ready-to-shop" element={<Navigate to="/shop" replace />} />
          <Route path="/festive-drops" element={<FestivePage />} />
          <Route path="/custom-pour" element={<CustomPourPage />} />
          <Route path="/custom-pour/:productId" element={<CustomPourPage />} />
          <Route path="/customize/:productId" element={<CustomPourPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/our-story" element={<OurStoryPage />} />
          <Route path="/gifting-guide" element={<GiftingGuidePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
