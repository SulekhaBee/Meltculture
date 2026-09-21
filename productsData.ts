const a = '/assets';

export type CategoryId = 'drinks' | 'halloween' | 'diwali';

export type Product = {
  slug: string;
  name: string;
  price: string;
  priceNum: number;
  badge: string;
  badgeColor: string;
  img: string;
  desc: string;
  category: CategoryId;
  rating: string;
};

export const productsData: Product[] = [
  // ── Drinks ──────────────────────────────────────────────────────────────────
  {
    slug: 'cutting-chai-candle',
    name: 'Cutting Chai Candle',
    price: '₹349', priceNum: 349,
    badge: 'Express 24h', badgeColor: '#218c21',
    img: `${a}/f2192.png`,
    desc: 'Masala chai soy wax with a dipped biscuit embed, cinnamon and whole-spice notes.',
    category: 'drinks',
    rating: '4.8 (94+)',
  },
  {
    slug: 'filter-coffee-candle',
    name: 'Filter Coffee Candle',
    price: '₹589', priceNum: 589,
    badge: 'Express 24h', badgeColor: '#218c21',
    img: `${a}/35c57.png`,
    desc: 'South Indian filter coffee in a brass tumbler vessel, dark roast and cardamom.',
    category: 'drinks',
    rating: '4.9 (67+)',
  },
  {
    slug: 'six-minis-tray',
    name: 'Six Minis Tray',
    price: '₹309', priceNum: 309,
    badge: 'Express 24h', badgeColor: '#218c21',
    img: `${a}/14781.png`,
    desc: 'Multi-scent assortment · 6 × 35g minis · Artisan tray.',
    category: 'diwali',
    rating: '4.9 (128+)',
  },

  // ── Halloween ────────────────────────────────────────────────────────────────
  {
    slug: 'pumpkin-patch-glass',
    name: 'Midnight Bat Glass Candle',
    price: '₹529', priceNum: 529,
    badge: 'Halloween', badgeColor: '#d97706',
    img: `${a}/694c4.png`,
    desc: 'Dark violet gel layer with a bat wax embed perched on top, spiced clove and smoky amber notes.',
    category: 'halloween',
    rating: '4.8 (31+)',
  },
  {
    slug: 'sorcerer-elixir-skull',
    name: 'Sorcerer Elixir Skull',
    price: '₹499', priceNum: 499,
    badge: 'Halloween', badgeColor: '#d97706',
    img: `${a}/f2ff6.png`,
    desc: 'Skull embed in midnight gel, night-blooming jasmine & cedar.',
    category: 'halloween',
    rating: '4.7 (19+)',
  },
  {
    slug: 'blueberry-gel-glass',
    name: 'Blueberry Gel Glass Candle',
    price: '₹449', priceNum: 449,
    badge: 'Express 24h', badgeColor: '#218c21',
    img: `${a}/da24a.png`,
    desc: 'Vibrant blueberry gel in a clear glass vessel, wild berry & violet.',
    category: 'drinks',
    rating: '4.6 (12+)',
  },
  {
    slug: 'halloween-electric-trio',
    name: 'Halloween Electric Trio',
    price: '₹1,389', priceNum: 1389,
    badge: 'Limited', badgeColor: '#4a1a5e',
    img: `${a}/13945.png`,
    desc: 'Limited gift set of three Halloween candles in collector packaging.',
    category: 'halloween',
    rating: '5.0 (8+)',
  },
  {
    slug: 'scorching-hope-mix',
    name: 'Scorching Hope Mix',
    price: '₹2,098', priceNum: 2098,
    badge: 'Limited', badgeColor: '#4a1a5e',
    img: `${a}/06769.png`,
    desc: 'Exclusive artisan mix of seven Halloween vessels, velvet gift box.',
    category: 'halloween',
    rating: '5.0 (4+)',
  },

  // ── Diwali ───────────────────────────────────────────────────────────────────
  {
    slug: 'ladoo-stack',
    name: 'Ladoo Stack',
    price: '₹249', priceNum: 249,
    badge: 'Pre-Order', badgeColor: '#d4871a',
    img: `${a}/d21c5.png`,
    desc: 'Golden besan ladoo with saffron strands, on brass thali.',
    category: 'diwali',
    rating: '4.9 (35+)',
  },
  {
    slug: 'kaju-katli-quartet',
    name: 'Kaju Katli Quartet',
    price: '₹299', priceNum: 299,
    badge: 'Pre-Order', badgeColor: '#d4871a',
    img: `${a}/ce96a.png`,
    desc: 'Diamond-shaped kaju katli with silver varq, rose-pistachio scent.',
    category: 'diwali',
    rating: '4.9 (41+)',
  },
  {
    slug: 'modak-quartet',
    name: 'Modak Quartet',
    price: '₹299', priceNum: 299,
    badge: 'Pre-Order', badgeColor: '#d4871a',
    img: `${a}/4bc1c.png`,
    desc: 'Hand-shaped coconut modak set with lotus-honey fragrance.',
    category: 'diwali',
    rating: '4.8 (22+)',
  },
  {
    slug: 'nankati-bharati',
    name: 'Nankati Bharati',
    price: '₹349', priceNum: 349,
    badge: 'Pre-Order', badgeColor: '#d4871a',
    img: `${a}/5aaec.png`,
    desc: 'Crispy Diwali swirls, rose-cardamom infused soy wax.',
    category: 'diwali',
    rating: '4.9 (18+)',
  },
  {
    slug: 'mithai-dabba-set',
    name: 'Mithai Dabba Set',
    price: '₹549', priceNum: 549,
    badge: 'Pre-Order', badgeColor: '#d4871a',
    img: `${a}/5a082.png`,
    desc: 'Curated assortment in a lacquer dabba, perfect Diwali gift.',
    category: 'diwali',
    rating: '5.0 (41+)',
  },
  {
    slug: 'serene-lotus-lake',
    name: 'Serene Lotus Lake',
    price: '₹799', priceNum: 799,
    badge: 'Pre-Order', badgeColor: '#d4871a',
    img: `${a}/0b246.png`,
    desc: 'Lotus blooms in clear gel · Serene Green & Cotton Phlox variants.',
    category: 'diwali',
    rating: '4.8 (9+)',
  },
  {
    slug: 'water-lily-lake',
    name: 'Water Lily Lake',
    price: '₹799', priceNum: 799,
    badge: 'Pre-Order', badgeColor: '#d4871a',
    img: `${a}/64561.png`,
    desc: 'Lotus blooms in clear gel vessel, aquatic-green fragrance.',
    category: 'diwali',
    rating: '4.8 (9+)',
  },
  {
    slug: 'lotus-dawn',
    name: 'Lotus Dawn',
    price: '₹749', priceNum: 749,
    badge: 'Pre-Order', badgeColor: '#d4871a',
    img: `${a}/73778.png`,
    desc: 'Sunrise lotus in cream soy wax, jasmine & sandalwood.',
    category: 'diwali',
    rating: '4.6 (7+)',
  },
  {
    slug: 'lotus-garden-montage',
    name: 'Lotus Garden Montage',
    price: '₹1,100', priceNum: 1100,
    badge: 'Pre-Order', badgeColor: '#d4871a',
    img: `${a}/960e1.png`,
    desc: 'Panoramic lotus garden, artisan-grade botanical embed.',
    category: 'diwali',
    rating: '5.0 (3+)',
  },
];

export const categoryMeta: Record<CategoryId, { title: string; subtitle: string; accentColor: string; bgColor: string }> = {
  drinks: {
    title: 'Handcrafted Drinks & Chai Collection',
    subtitle: 'Sensory candles inspired by cutting chai, filter coffee, and iconic Indian beverages.',
    accentColor: '#8B5E3C',
    bgColor: '#fdf6ed',
  },
  halloween: {
    title: 'Halloween & Spooky Limited Drops',
    subtitle: 'Ghoulish shapes, dark plum wax, and eerie autumn scents.',
    accentColor: '#d97706',
    bgColor: '#1a0f1e',
  },
  diwali: {
    title: 'Diwali & Festive Sweets Collection',
    subtitle: 'Authentic mithai and thali candles hand-poured for festive gifting.',
    accentColor: '#d4871a',
    bgColor: '#fef8f0',
  },
};
