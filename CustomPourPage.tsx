import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useParams, useLocation } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import OrderRequestModal from '../components/OrderRequestModal';
import NavigationHeader from '../components/NavigationHeader';

const assetPrefix = '/assets';
const starIcon = `${assetPrefix}/c4cb7.svg`;

type Shape = { emoji: string; label: string; id: string; sub?: string };
type WaxColor = { id: string; label: string; color: string };
type Base = { id: string; label: string };
type Packaging = { id: string; label: string; price: number };
type WaxLayer = { color: string; border?: string; label: string };
type Fragrance = { id: string; emoji: string; label: string; notes: string };

type CombinationGallery = {
  triggerShapes: string[]; // gallery activates when ANY of these shapes is selected first
  images: [string, string, string, string];
};

type ProductCtx = {
  name: string;
  price: number;
  img: string;
  heroImage?: string;
  tagline: string;
  badge: string;
  shapes: Shape[];
  waxLayers: WaxLayer[];
  waxColors?: WaxColor[];
  fragrances?: Fragrance[];
  combinationGalleries?: CombinationGallery[];
  /** Maps a shape id to the main-canvas image shown when that topping is selected */
  toppingVariantImages?: Record<string, string>;
  /** Static gallery thumbnails used when toppingVariantImages is set (overrides combinationGalleries for the strip) */
  staticGallery?: [string, string, string, string];
  /** Pre-selected wax color id on page load (overrides first-item default) */
  defaultWaxColor?: string;
  /** Pre-selected fragrance id on page load (overrides first-item default) */
  defaultFragrance?: string;
};

// ── Studio-specific options (standalone /custom-pour) ─────────────────────────

const studioEmbeds: Shape[] = [
  { id: 'marigold', emoji: '🌼', label: 'Marigold Petals & Buds', sub: 'Dried whole marigold' },
  { id: 'rose-petals', emoji: '🌹', label: 'Dried Red Rose Petals', sub: 'Hand-dried artisan grade' },
  { id: 'star-anise', emoji: '✦', label: 'Star Anise & Cinnamon Bark', sub: 'Whole spice botanicals' },
  { id: 'gold-foil', emoji: '✨', label: 'Real Gold Foil / Shimmer', sub: 'Edible-grade gold leaf' },
];

const studioWaxColors: WaxColor[] = [
  { id: 'soy-cream', label: 'Pure Soy Cream', color: '#f5ede0' },
  { id: 'warm-amber', label: 'Warm Amber', color: '#d97706' },
  { id: 'midnight-charcoal', label: 'Midnight Charcoal', color: '#2a2a2a' },
  { id: 'matcha-green', label: 'Matcha Green', color: '#4a7c59' },
];

const studioFragrances: Fragrance[] = [
  { id: 'chai-spice', emoji: '🍵', label: 'Masala Chai Spice', notes: 'Cardamom · Cinnamon · Star Anise' },
  { id: 'filter-coffee', emoji: '☕', label: 'Filter Coffee', notes: 'Dark Roast · Chicory · Cardamom' },
  { id: 'coastal-rain', emoji: '🌊', label: 'Coastal Rain', notes: 'Petrichor · Sea Salt · White Musk' },
  { id: 'vanilla-bean', emoji: '🍦', label: 'Vanilla Bean', notes: 'Madagascar Vanilla · Warm Musk · Sandalwood' },
];

const studioGalleryImages = [
  `${assetPrefix}/47c09.png`,
  `${assetPrefix}/d21c5.png`,
  `${assetPrefix}/f2192.png`,
  `${assetPrefix}/35c57.png`,
];
const studioGalleryLabels = ['Brass Vessel', 'Dried Botanicals & Spices', 'Fragrance Oils', 'Wick Options'];

// ── Product-specific fragrance sets ──────────────────────────────────────────

const defaultFragrances: Fragrance[] = [
  { id: 'rose-attar',   emoji: '🌹', label: 'Rose Attar',      notes: 'Rose · Sandalwood · Warm Amber' },
  { id: 'diya-glow',    emoji: '🪔', label: 'Diya Glow',        notes: 'Jasmine · Mogra · Warm Wax' },
  { id: 'kesar-musk',   emoji: '🌾', label: 'Kesar Musk',       notes: 'Saffron · Cardamom · Musky Amber' },
  { id: 'citrus-zest',  emoji: '🍋', label: 'Citrus Zest',      notes: 'Lemon · Orange Peel · Green Tea' },
  { id: 'peony-cedar',  emoji: '🌸', label: 'Peony & Cedar',    notes: 'Peony · Rose · Cedarwood' },
  { id: 'vetiver-oud',  emoji: '🌿', label: 'Vetiver & Oud',    notes: 'Dark Oud · Vetiver · Sandalwood' },
];

const chaiFragrances: Fragrance[] = [
  { id: 'classic-chai', emoji: '🍃', label: 'Classic Chai Masala', notes: 'Cardamom · Cinnamon · Star Anise' },
  { id: 'rose-chai',    emoji: '🌹', label: 'Rose Chai',            notes: 'Rose Attar · Cardamom · Warm Soy' },
  { id: 'kesar-chai',   emoji: '🌾', label: 'Kesar Chai',           notes: 'Saffron · Cardamom · Vanilla Milk' },
  { id: 'mint-ginger',  emoji: '🌿', label: 'Mint & Ginger',        notes: 'Fresh Mint · Ginger · Masala Spice' },
];

const coffeeFragrances: Fragrance[] = [
  { id: 'dark-roast',    emoji: '☕', label: 'Dark Roast',      notes: 'Ethiopian Blend · Chicory · Cedar' },
  { id: 'cafe-au-lait',  emoji: '🥛', label: 'Café au Lait',    notes: 'Warm Milk · Dark Coffee · Caramel' },
  { id: 'cardamom-brew', emoji: '🫖', label: 'Cardamom Brew',   notes: 'Cardamom · Dark Roast · Amber Resin' },
  { id: 'mocha-silk',    emoji: '🍫', label: 'Mocha Silk',       notes: 'Chocolate · Espresso · Vanilla Bean' },
];

const halloweenFragrances: Fragrance[] = [
  { id: 'midnight-pumpkin', emoji: '🎃', label: 'Midnight Pumpkin', notes: 'Pumpkin Spice · Cinnamon · Clove Bud' },
  { id: 'dark-forest',      emoji: '🌙', label: 'Dark Forest',       notes: 'Black Pine · Cedarwood · Vetiver' },
  { id: 'autumn-harvest',   emoji: '🍂', label: 'Autumn Harvest',    notes: 'Apple · Cinnamon Stick · Amber Accord' },
  { id: 'jasmine-cedar',    emoji: '🕯️', label: 'Night Jasmine',     notes: 'Jasmine Absolue · Cedarwood · Dark Musk' },
];

const diwaliFragrances: Fragrance[] = [
  { id: 'mogra-sandalwood', emoji: '🌸', label: 'Mogra & Sandalwood', notes: 'Mogra · Sandalwood · Rose Attar' },
  { id: 'kesar-diya',       emoji: '🪔', label: 'Kesar Diya',          notes: 'Saffron · Warm Amber · White Musk' },
  { id: 'mithai-sweet',     emoji: '🍬', label: 'Mithai Accord',        notes: 'Besan · Rose Petal · Cardamom' },
  { id: 'gulab-oud',        emoji: '🌹', label: 'Gulab & Oud',          notes: 'Rose Attar · Oud · Warm Spice' },
];

// ── Product contexts ──────────────────────────────────────────────────────────

const productContexts: Record<string, ProductCtx> = {
  'cutting-chai-candle': {
    name: 'Cutting Chai Candle', price: 349,
    img: `${assetPrefix}/f2192.png`,
    tagline: 'Masala chai soy wax · Parle-G & spice embeds · Cutting glass',
    badge: '☕ SIGNATURE COLLECTION',
    fragrances: chaiFragrances,
    shapes: [
      { emoji: '🍪', label: 'Parle-G Biscuit', id: 'biscuit' },
      { emoji: '🪵', label: 'Cinnamon Stick', id: 'cinnamon' },
      { emoji: '🌱', label: 'Cardamom Pod', id: 'cardamom' },
      { emoji: '✦', label: 'Star Anise', id: 'anise' },
    ],
    waxLayers: [
      { color: '#f5e6cc', border: '#e2ceae', label: 'Cream Soy-Wax upper layer' },
      { color: '#8B5E3C', label: 'Chai Masala lower layer' },
    ],
    waxColors: [
      { id: 'chai-amber', label: 'Cutting Chai Amber', color: '#c17f40' },
      { id: 'milk-ivory', label: 'Creamy Milk Ivory', color: '#f5e6cc' },
      { id: 'spice-brown', label: 'Warm Spice Brown', color: '#7b3f00' },
    ],
  },
  'filter-coffee-candle': {
    name: 'Filter Coffee Candle', price: 589,
    img: `${assetPrefix}/35c57.png`,
    tagline: 'Dark roast soy wax · Brass tumbler vessel · Chicory blend',
    badge: '☕ Signature Collection',
    fragrances: coffeeFragrances,
    shapes: [
      { emoji: '☕', label: 'Coffee Bean', id: 'coffee-bean' },
      { emoji: '🥛', label: 'Mini Tumbler', id: 'mini-tumbler' },
      { emoji: '🌿', label: 'Cardamom Pod', id: 'cardamom' },
      { emoji: '🌸', label: 'Chicory Bloom', id: 'chicory' },
      { emoji: '🍪', label: 'Biscuit', id: 'biscuit' },
      { emoji: '🍃', label: 'Coffee Leaf', id: 'coffee-leaf' },
    ],
    waxLayers: [
      { color: '#f5f0e8', border: '#e2ceae', label: 'Ivory Soy-Wax upper layer' },
      { color: '#3b1e08', label: 'Dark Roast lower layer' },
    ],
  },
  'six-minis-tray': {
    name: 'Six Minis Tray', price: 309,
    img: `${assetPrefix}/14781.png`,
    tagline: 'Multi-scent assortment · 6 × 35g minis · Artisan tray',
    badge: '⚡ Express Ready-Stock',
    shapes: studioEmbeds,
    waxLayers: [
      { color: '#f5f0e8', border: '#e2ceae', label: 'Ivory Soy-Wax upper layer' },
      { color: '#d97706', label: 'Amber gel lower layer' },
    ],
  },
  'ladoo-stack': {
    name: 'Ladoo Stack', price: 249,
    img: `${assetPrefix}/d21c5.png`,
    tagline: 'Golden besan ladoo · Saffron & rose attar · Brass thali',
    badge: '🪔 FESTIVE EDITION',
    shapes: [
      { emoji: '🟡', label: 'Ladoo', id: 'ladoo' },
      { emoji: '🌼', label: 'Marigold', id: 'marigold' },
      { emoji: '🪔', label: 'Diya', id: 'diya' },
      { emoji: '🌸', label: 'Kesar Strand', id: 'kesar' },
      { emoji: '🪷', label: 'Lotus', id: 'lotus' },
      { emoji: '⭐', label: 'Star', id: 'star' },
    ],
    waxLayers: [
      { color: '#f5e6a0', border: '#e2c87a', label: 'Saffron-Gold upper layer' },
      { color: '#d97706', label: 'Kesar-Rose lower layer' },
    ],
  },
  'kaju-katli-quartet': {
    name: 'Kaju Katli Candle', price: 299,
    img: `${assetPrefix}/ce96a.png`,
    tagline: 'Pure silver vark finish · Cardamom & condensed milk attar · Brass thali',
    badge: '🪔 Festive Edition',
    shapes: [
      { emoji: '💎', label: 'Kaju Katli Diamond', id: 'diamond' },
      { emoji: '✨', label: 'Silver Vark Flake', id: 'silver-vark' },
      { emoji: '🪴', label: 'Almond Slices', id: 'almond' },
      { emoji: '🌿', label: 'Pistachio Granules', id: 'pistachio' },
      { emoji: '🌼', label: 'Marigold', id: 'marigold' },
      { emoji: '🪔', label: 'Diya', id: 'diya' },
    ],
    waxLayers: [
      { color: '#f5f0e8', border: '#e2ceae', label: 'Silver-Ivory upper layer' },
      { color: '#f5c542', label: 'Cardamom-Kesar lower layer' },
    ],
  },
  'modak-quartet': {
    name: 'Modak Quartet', price: 299,
    img: `${assetPrefix}/4bc1c.png`,
    tagline: 'Coconut modak set · Lotus-honey fragrance · Hand-shaped',
    badge: '🪔 Festive Edition',
    shapes: [
      { emoji: '🫘', label: 'Modak', id: 'modak' },
      { emoji: '🪷', label: 'Lotus', id: 'lotus' },
      { emoji: '🍯', label: 'Honey Drop', id: 'honey' },
      { emoji: '🌿', label: 'Coconut Leaf', id: 'coconut' },
      { emoji: '🌼', label: 'Marigold', id: 'marigold' },
      { emoji: '🪔', label: 'Diya', id: 'diya' },
    ],
    waxLayers: [
      { color: '#f5f0e8', border: '#e2ceae', label: 'Cream Soy-Wax upper layer' },
      { color: '#c8b560', label: 'Coconut-Honey lower layer' },
    ],
  },
  'ember-skull': {
    name: 'Ember Skull Candle', price: 349,
    img: `${assetPrefix}/694c4.png`,
    heroImage: `${assetPrefix}/694c4.png`,
    tagline: 'Halloween artisan candle · Pure soy wax · Seasonal embeds',
    badge: '🎃 HALLOWEEN EDITION',
    fragrances: halloweenFragrances,
    shapes: [
      { emoji: '💀', label: 'Skull', id: 'skull' },
      { emoji: '🦇', label: 'Bat', id: 'bat' },
      { emoji: '🌙', label: 'Crescent Moon', id: 'moon' },
      { emoji: '🕷', label: 'Spider', id: 'spider' },
    ],
    waxLayers: [
      { color: '#f5f0e8', border: '#e2ceae', label: 'Ivory Soy-Wax upper layer' },
      { color: '#d97706', label: 'Ember-Orange gel lower layer' },
    ],
  },
};

const diwaliShapes: Shape[] = [
  { emoji: '🪔', label: 'Diya', id: 'diya' },
  { emoji: '🌼', label: 'Marigold', id: 'marigold' },
  { emoji: '🍬', label: 'Mithai Piece', id: 'mithai' },
  { emoji: '✦', label: 'Gold Star', id: 'gold-star' },
];

const diwaliWaxLayers: WaxLayer[] = [
  { color: '#f5f0e8', border: '#e2ceae', label: 'Cream Soy-Wax upper layer' },
  { color: '#c8a030', label: 'Saffron-Gold lower layer' },
];

const extendedContexts: Record<string, ProductCtx> = {
  'kaju-katli-quartet': { name: 'Kaju Katli Quartet', price: 299, img: `${assetPrefix}/ce96a.png`, tagline: 'Diamond kaju katli · Silver varq finish · Rose-pistachio scent', badge: '🪔 DIWALI EDITION', fragrances: diwaliFragrances, shapes: diwaliShapes, waxLayers: diwaliWaxLayers },
  'modak-quartet': { name: 'Modak Quartet', price: 299, img: `${assetPrefix}/4bc1c.png`, tagline: 'Coconut modak · Lotus-honey fragrance · Hand-shaped', badge: '🪔 DIWALI EDITION', fragrances: diwaliFragrances, shapes: diwaliShapes, waxLayers: diwaliWaxLayers },
  'nankati-bharati': { name: 'Nankati Bharati', price: 349, img: `${assetPrefix}/5aaec.png`, tagline: 'Crispy Diwali swirls · Rose-cardamom soy wax', badge: '🪔 DIWALI EDITION', shapes: diwaliShapes, waxLayers: diwaliWaxLayers },
  'mithai-dabba-set': { name: 'Mithai Dabba Set', price: 549, img: `${assetPrefix}/5a082.png`, tagline: 'Assorted mithai · Lacquer dabba · Diwali gift set', badge: '🪔 DIWALI EDITION', shapes: diwaliShapes, waxLayers: diwaliWaxLayers },
  'water-lily-lake': {
    name: 'Water Lily Lake', price: 799, img: `${assetPrefix}/64561.png`, tagline: 'Lotus gel vessel · Aquatic-green fragrance', badge: '🪔 DIWALI EDITION',
    shapes: [{ emoji: '🌸', label: 'Lotus Bloom', id: 'lotus' }, { emoji: '🍃', label: 'Lily Pad', id: 'lily-pad' }, { emoji: '🪔', label: 'Diya', id: 'diya' }, { emoji: '✦', label: 'Gold Star', id: 'gold-star' }],
    waxLayers: [{ color: '#e8f4f8', border: '#b8d8e8', label: 'Aquatic Gel upper layer' }, { color: '#2d7a3a', label: 'Deep Aqua lower layer' }],
  },
  'lotus-dawn': {
    name: 'Lotus Dawn', price: 749, img: `${assetPrefix}/73778.png`, tagline: 'Sunrise lotus · Jasmine & sandalwood · Cream soy wax', badge: '🪔 DIWALI EDITION',
    shapes: [{ emoji: '🌸', label: 'Lotus Bloom', id: 'lotus' }, { emoji: '🌼', label: 'Marigold', id: 'marigold' }, { emoji: '🪔', label: 'Diya', id: 'diya' }, { emoji: '✦', label: 'Gold Star', id: 'gold-star' }],
    waxLayers: [{ color: '#f9f4ec', border: '#e2ceae', label: 'Ivory Cream upper layer' }, { color: '#e8b86d', label: 'Sunrise Gold lower layer' }],
  },
  'lotus-garden-montage': {
    name: 'Lotus Garden Montage', price: 1100, img: `${assetPrefix}/960e1.png`, tagline: 'Panoramic lotus garden · Artisan botanical embeds', badge: '🪔 COLLECTOR EDITION',
    shapes: [{ emoji: '🌸', label: 'Lotus Bloom', id: 'lotus' }, { emoji: '🌿', label: 'Botanical Leaf', id: 'leaf' }, { emoji: '🌼', label: 'Marigold', id: 'marigold' }, { emoji: '✦', label: 'Gold Star', id: 'gold-star' }],
    waxLayers: [{ color: '#f5f0e8', border: '#e2ceae', label: 'Ivory Soy-Wax upper layer' }, { color: '#c8a030', label: 'Amber-Gold lower layer' }],
  },
  'pumpkin-patch-glass': {
    name: 'Midnight Bat Glass Candle', price: 529,
    // b1295 = base bat glass (no toppings); variant images are in toppingVariantImages below
    img: `${assetPrefix}/b1295.png`, heroImage: `${assetPrefix}/b1295.png`,
    tagline: 'Dark violet gel · Bat wax embed · Spiced clove & smoky amber', badge: '🎃 HALLOWEEN EDITION',
    fragrances: halloweenFragrances,
    shapes: [
      { emoji: '💀', label: 'Skull', id: 'skull', sub: '4 free included' },
      { emoji: '🎃', label: 'Pumpkin', id: 'pumpkin', sub: '4 free included' },
      { emoji: '🌙', label: 'Crescent Moon', id: 'moon', sub: '4 free included' },
      { emoji: '🕷', label: 'Spider', id: 'spider', sub: '4 free included' },
    ],
    waxLayers: [{ color: '#f5f0e8', border: '#e2ceae', label: 'Ivory Soy-Wax upper layer' }, { color: '#d97706', label: 'Ember-Orange gel lower layer' }],
    // Static gallery thumbnails — never swapped by topping selection
    staticGallery: [
      `${assetPrefix}/b1295.png`,
      `${assetPrefix}/d228c.png`,
      `${assetPrefix}/804cb.png`,
      `${assetPrefix}/a6c04.png`,
    ],
    // Main canvas image keyed by activeToppings combination; empty array falls back to base img
    toppingVariantImages: {
      skull:   `${assetPrefix}/9551c.png`,
      pumpkin: `${assetPrefix}/a8b84.png`,
      spider:  `${assetPrefix}/3b53d.png`,
      moon:    `${assetPrefix}/image-26.png`,
    },
    defaultWaxColor: 'midnight-charcoal',
    defaultFragrance: 'dark-forest',
  },
  'peony-lake': {
    name: 'Peony Lake', price: 699, img: `${assetPrefix}/85d04.png`, tagline: 'Floating peony & rose blooms · Aqua gel vessel · Cedar-peony attar', badge: '🌸 BOTANICAL EDITION',
    fragrances: diwaliFragrances,
    shapes: [{ emoji: '🌸', label: 'Peony Bloom', id: 'peony' }, { emoji: '🌹', label: 'Rose Petal', id: 'rose' }, { emoji: '🍃', label: 'Lily Pad', id: 'lily-pad' }, { emoji: '✦', label: 'Gold Star', id: 'gold-star' }],
    waxLayers: [{ color: '#f8eaf0', border: '#e8c8d8', label: 'Blush Aqua Gel upper layer' }, { color: '#c8609a', label: 'Rose-Peony lower layer' }],
  },
  'serene-lotus-lake': {
    name: 'Serene Lotus Lake', price: 799, img: `${assetPrefix}/0b246.png`, tagline: 'Lotus blooms in clear gel · Serene green & cotton phlox · Pre-order', badge: '🌿 BOTANICAL EDITION',
    fragrances: diwaliFragrances,
    shapes: [{ emoji: '🌸', label: 'Lotus Bloom', id: 'lotus' }, { emoji: '🍃', label: 'Lily Pad', id: 'lily-pad' }, { emoji: '🪔', label: 'Diya', id: 'diya' }, { emoji: '✦', label: 'Gold Star', id: 'gold-star' }],
    waxLayers: [{ color: '#e8f4f0', border: '#b8ddd0', label: 'Serene Aqua Gel upper layer' }, { color: '#2d7a5a', label: 'Lotus Green lower layer' }],
  },
  'halloween-electric-trio': {
    name: 'Electric Trio Gift Set', price: 1389, img: `${assetPrefix}/13945.png`, tagline: 'Collector trio · Three Halloween gel candles · Collector gift box', badge: '🎃 HALLOWEEN EDITION',
    fragrances: halloweenFragrances,
    shapes: [{ emoji: '💀', label: 'Skull', id: 'skull' }, { emoji: '🦇', label: 'Bat', id: 'bat' }, { emoji: '🌙', label: 'Crescent Moon', id: 'moon' }, { emoji: '🕷', label: 'Spider', id: 'spider' }],
    waxLayers: [{ color: '#1a0a2e', label: 'Midnight Plum upper layer' }, { color: '#4a1a5e', label: 'Deep Violet lower layer' }],
  },
  'sorcerer-elixir-skull': {
    name: 'Sorcerer Elixir Skull', price: 499, img: `${assetPrefix}/f2ff6.png`, tagline: 'Skull embed · Midnight gel · Night-blooming jasmine & cedar', badge: '🎃 HALLOWEEN EDITION',
    fragrances: halloweenFragrances,
    shapes: [{ emoji: '💀', label: 'Skull', id: 'skull' }, { emoji: '🦇', label: 'Bat', id: 'bat' }, { emoji: '🌙', label: 'Crescent Moon', id: 'moon' }, { emoji: '🕷', label: 'Spider', id: 'spider' }],
    waxLayers: [{ color: '#1a0a2e', label: 'Midnight Plum upper layer' }, { color: '#4a1a5e', label: 'Deep Violet lower layer' }],
  },
  'blueberry-gel-glass': {
    name: 'Blueberry Gel Glass Candle', price: 449, img: `${assetPrefix}/da24a.png`, tagline: 'Vibrant blueberry gel · Wild berry & violet', badge: '☕ DRINKS COLLECTION',
    shapes: [{ emoji: '🫐', label: 'Blueberry', id: 'blueberry' }, { emoji: '🌿', label: 'Mint Leaf', id: 'mint' }, { emoji: '✦', label: 'Crystal', id: 'crystal' }, { emoji: '🫧', label: 'Bubble', id: 'bubble' }],
    waxLayers: [{ color: '#e8e0f8', border: '#c8b8f0', label: 'Lavender gel upper layer' }, { color: '#4a2a7a', label: 'Berry-Purple lower layer' }],
  },
  'filter-coffee-candle': {
    name: 'Filter Coffee Candle', price: 589, img: `${assetPrefix}/35c57.png`, tagline: 'South Indian filter coffee · Brass tumbler vessel · Dark roast & cardamom', badge: '☕ SIGNATURE COLLECTION',
    shapes: [{ emoji: '☕', label: 'Coffee Cup', id: 'coffee-cup' }, { emoji: '🍪', label: 'Biscuit', id: 'biscuit' }, { emoji: '🪵', label: 'Cinnamon Stick', id: 'cinnamon' }, { emoji: '✦', label: 'Star Anise', id: 'anise' }],
    waxLayers: [{ color: '#d4a96a', label: 'Coffee Cream upper layer' }, { color: '#3d1a0a', label: 'Dark Roast lower layer' }],
  },
};

const fallbackContext: ProductCtx = {
  name: 'Custom Hand-Poured Candle Studio',
  price: 699,
  img: `${assetPrefix}/47c09.png`,
  heroImage: `${assetPrefix}/47c09.png`,
  tagline: 'Hand-crafted solid brass tumbler · 100% soy wax · Choose botanicals, scent & wick',
  badge: '🎨 BESPOKE CUSTOMIZATION',
  fragrances: studioFragrances,
  shapes: studioEmbeds,
  waxColors: studioWaxColors,
  waxLayers: [
    { color: '#f5ede0', border: '#e2ceae', label: 'Pure Soy Cream upper layer' },
    { color: '#d97706', label: 'Warm Amber lower layer' },
  ],
};

const bases: Base[] = [
  { id: 'soy', label: 'Soy Wax' },
  { id: 'coconut', label: 'Coconut Blend' },
  { id: 'beeswax', label: 'Pure Beeswax' },
];

const packagings: Packaging[] = [
  { id: 'classic', label: 'Classic Kraft Box', price: 0 },
  { id: 'premium', label: 'Pastel Gift Box', price: 129 },
  { id: 'wooden', label: 'Magnetic Hamper Box', price: 325 },
];

const CUSTOMIZATION_FEE = 99;
const EXTRA_SHAPE_FEE = 49;
const MAX_FREE_SHAPES = 2;

const specs = [
  { label: 'Vessel', value: 'Hand-crafted Solid Brass Tumbler' },
  { label: 'Wax', value: '100% Eco-Friendly Soy Wax' },
  { label: 'Burn Time', value: '40–45 Hours' },
  { label: 'Crafting Time', value: 'Hand-poured in 24 hours' },
];

export default function CustomPourPage() {
  const { productId: routeProductId } = useParams<{ productId?: string }>();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const stateProductId = (location.state as { product?: { id?: string } } | null)?.product?.id;
  const productId = routeProductId ?? stateProductId ?? searchParams.get('product') ?? '';

  const baseCtx = productContexts[productId] ?? extendedContexts[productId] ?? fallbackContext;
  const stateProduct = (location.state as { product?: { name?: string; price?: number; img?: string } } | null)?.product;
  const productCtx: ProductCtx = {
    ...baseCtx,
    ...(stateProduct?.name ? { name: stateProduct.name } : {}),
    ...(stateProduct?.price ? { price: stateProduct.price } : {}),
    ...(stateProduct?.img ? { img: stateProduct.img } : {}),
  };

  const isStandalone = !productId || !(productContexts[productId] ?? extendedContexts[productId]);

  const activeWaxColorList = productCtx.waxColors ?? studioWaxColors;
  const activeFragrances = productCtx.fragrances ?? studioFragrances;

  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  // Multi-select topping state for products with toppingVariantImages (drives main canvas image)
  const [activeToppings, setActiveToppings] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>(productCtx.defaultWaxColor ?? activeWaxColorList[0]?.id ?? 'soy-cream');
  const [selectedBase, setSelectedBase] = useState<string>('soy');
  const [selectedPackaging, setSelectedPackaging] = useState<string>('classic');
  const [selectedFragrance, setSelectedFragrance] = useState<string>(productCtx.defaultFragrance ?? activeFragrances[0]?.id ?? '');
  const [selectedWick, setSelectedWick] = useState<'cotton' | 'wooden'>('cotton');
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [totalPulsing, setTotalPulsing] = useState(false);
  const prevTotal = useRef<number>(0);
  const studioHeadingRef = useRef<HTMLHeadingElement>(null);

  const packagingPrice = packagings.find((p) => p.id === selectedPackaging)?.price ?? 0;
  const extraShapeFee = selectedShapes.length > MAX_FREE_SHAPES ? EXTRA_SHAPE_FEE : 0;
  const total = productCtx.price + CUSTOMIZATION_FEE + extraShapeFee + packagingPrice;

  useEffect(() => {
    const frame = requestAnimationFrame(() => studioHeadingRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [productId]);

  useEffect(() => {
    setSelectedShapes([]);
    setActiveToppings([]);
    setSelectedColor(productCtx.defaultWaxColor ?? activeWaxColorList[0]?.id ?? 'soy-cream');
    setSelectedFragrance(productCtx.defaultFragrance ?? activeFragrances[0]?.id ?? '');
    setGalleryIdx(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  useEffect(() => {
    if (prevTotal.current !== 0 && prevTotal.current !== total) {
      setTotalPulsing(true);
      const t = setTimeout(() => setTotalPulsing(false), 400);
      return () => clearTimeout(t);
    }
    prevTotal.current = total;
  }, [total]);

  const activeWaxColor = activeWaxColorList.find((c) => c.id === selectedColor) ?? activeWaxColorList[0];
  const liveWaxLayers = productCtx.waxLayers.map((layer, i) =>
    i === productCtx.waxLayers.length - 1
      ? { ...layer, color: activeWaxColor.color, label: `${activeWaxColor.label} lower layer` }
      : layer
  );

  function toggleShape(id: string) {
    setSelectedShapes((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= MAX_FREE_SHAPES + 1) return prev;
      return [...prev, id];
    });
  }

  function shapeLabel(id: string) {
    const idx = selectedShapes.indexOf(id);
    if (idx === -1) return null;
    return idx < MAX_FREE_SHAPES ? 'Included' : `+₹${EXTRA_SHAPE_FEE}`;
  }

  function buildOrderItems() {
    const packagingLabel = packagings.find((p) => p.id === selectedPackaging)?.label ?? 'Kraft Box';
    const fragranceLabel = activeFragrances.find((f) => f.id === selectedFragrance)?.label ?? '';
    return [
      { label: `Base Candle — ${productCtx.name}`, price: productCtx.price },
      { label: `Personalization Fee (incl. ${MAX_FREE_SHAPES} embed shapes)`, price: CUSTOMIZATION_FEE },
      ...(fragranceLabel ? [{ label: `Fragrance — ${fragranceLabel}`, price: 0 }] : []),
      ...(extraShapeFee > 0 ? [{ label: '3rd Embed Shape Add-on', price: extraShapeFee }] : []),
      ...(packagingPrice > 0 ? [{ label: `Packaging Upgrade — ${packagingLabel}`, price: packagingPrice }] : []),
    ];
  }

  // Resolve per-combination gallery for products that have them (legacy path)
  const activeCombinationGallery = productCtx.combinationGalleries?.find(
    (c) => c.triggerShapes.some((s) => selectedShapes.includes(s))
  );

  const defaultProductGallery: [string, string, string, string] = [
    productCtx.heroImage ?? productCtx.img,
    productCtx.img,
    productCtx.img,
    productCtx.img,
  ];

  // Gallery thumbnails: always static when staticGallery is set — never driven by topping state
  const galleryImages: [string, string, string, string] = isStandalone
    ? studioGalleryImages as [string, string, string, string]
    : (productCtx.staticGallery ?? activeCombinationGallery?.images ?? defaultProductGallery);

  const galleryLabels = isStandalone ? studioGalleryLabels : ['Main', 'Side', 'Detail', 'Lifestyle'];

  const hasVariants = Boolean(productCtx.toppingVariantImages);
  // Only show toppings/embed step for Midnight Bat Glass — hide for all other products until data is ready
  const showToppings = productId === 'pumpkin-patch-glass';
  // Section numbering offset: when toppings are hidden, remaining steps start at 1
  const sn = (base: number) => showToppings ? base : base - 1;

  // Combination-aware image resolution (priority-ordered, most-specific first)
  function resolveVariantImage(): string {
    const v = productCtx.toppingVariantImages!;
    const has = (id: string) => activeToppings.includes(id);
    const base = productCtx.heroImage ?? productCtx.img;
    if (has('skull') && has('spider'))  return v['spider']  ?? base;
    if (has('skull') && has('pumpkin')) return v['pumpkin'] ?? base;
    if (has('skull'))                   return v['skull']   ?? base;
    if (has('moon'))                    return v['moon']    ?? base;
    if (has('pumpkin'))                 return v['pumpkin'] ?? base;
    if (has('spider'))                  return v['spider']  ?? base;
    return base;
  }

  const mainCanvasImg = hasVariants
    ? (activeToppings.length > 0 ? resolveVariantImage() : (productCtx.heroImage ?? productCtx.img))
    : galleryImages[galleryIdx];

  return (
    <div className="min-h-screen bg-[#faf6f0] pb-24 lg:pb-0">
      <Nav />
      <NavigationHeader
        crumbs={[
          { label: 'Home', to: '/' },
          ...(productId && (productContexts[productId] ?? extendedContexts[productId])
            ? [{ label: productCtx.name, to: `/product/${productId}` }]
            : []),
          { label: 'Custom Pour Studio' },
        ]}
        backContext={productId ? productCtx.name : undefined}
      />

      {/* ── PDP-style two-column layout ── */}
      <div className="py-0 md:py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-16 lg:px-20 items-start">

          {/* ══ LEFT: Interactive Canvas + Thumbnail Gallery ══ */}
          <div className="w-full lg:flex-1 px-4 sm:px-6 lg:px-0 pt-6 lg:pt-0 pb-4 lg:pb-0">

            {/* Main canvas */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#f4efe6] border border-[#e8e1d5]">
              <img
                src={mainCanvasImg}
                alt={productCtx.name}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
              />
              {/* Wax layer strip at bottom */}
              <div className="absolute bottom-0 left-0 right-0 flex h-3 overflow-hidden">
                {liveWaxLayers.map((layer, i) => (
                  <div key={i} className="flex-1 transition-colors duration-500" style={{ backgroundColor: layer.color, border: layer.border ? `1px solid ${layer.border}` : undefined }} />
                ))}
              </div>
              {/* Shape emoji overlays */}
              {selectedShapes.map((sid, idx) => {
                const shape = productCtx.shapes.find((s) => s.id === sid);
                if (!shape) return null;
                const positions = [{ top: '18%', left: '22%' }, { top: '52%', right: '18%' }, { top: '30%', right: '28%' }];
                const pos = positions[idx] ?? { top: `${20 + idx * 18}%`, left: `${30 + idx * 15}%` };
                return (
                  <div key={sid} className="absolute text-[28px] drop-shadow-lg transition-all duration-400" style={{ ...pos, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} title={shape.label}>
                    {shape.emoji}
                  </div>
                );
              })}
              {/* Badge + Live Preview */}
              <div className="absolute top-[11px] left-[11px] bg-[#e08a2e] px-[10px] py-[5px] rounded-[6px]">
                <p className="text-white text-[11px] font-bold uppercase whitespace-nowrap" style={{ fontFamily: 'Inter' }}>
                  {isStandalone ? 'BESPOKE STUDIO' : productCtx.badge}
                </p>
              </div>
              <div className="absolute top-[11px] right-[11px] bg-[#2c1a10]/80 backdrop-blur-sm text-white text-[9px] font-bold px-2.5 py-1 rounded-full tracking-[1px] uppercase" style={{ fontFamily: 'Manrope' }}>
                Live Preview
              </div>
              {/* Selected shapes pill strip */}
              {selectedShapes.length > 0 && (
                <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-center gap-2 flex-wrap">
                  {selectedShapes.map((sid, idx) => {
                    const shape = productCtx.shapes.find((s) => s.id === sid);
                    if (!shape) return null;
                    return (
                      <div key={sid} className="flex items-center gap-1.5 bg-[#2c1a10]/85 backdrop-blur-sm rounded-full px-3 py-1.5">
                        <span className="text-[15px]">{shape.emoji}</span>
                        <span className="text-white text-[11px] font-bold" style={{ fontFamily: 'Manrope' }}>{shape.label}</span>
                        <span className="text-[9px] font-bold ml-0.5" style={{ fontFamily: 'Manrope', color: idx < MAX_FREE_SHAPES ? '#c5a059' : '#d97706' }}>
                          {idx < MAX_FREE_SHAPES ? 'FREE' : `+₹${EXTRA_SHAPE_FEE}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4-slot thumbnail strip */}
            <div className="w-full flex justify-between gap-2 mt-3">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setGalleryIdx(i)}
                  aria-label={galleryLabels[i]}
                  title={galleryLabels[i]}
                  className={`flex-1 aspect-square overflow-hidden rounded-[10px] bg-[#f4efe6] transition-all duration-150 ${galleryIdx === i ? 'border-2 border-[#e08a2e]' : 'border border-[#e8e1d5] opacity-75 hover:opacity-100 hover:border-[#e08a2e]'}`}
                >
                  <img src={img} alt={galleryLabels[i]} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ══ RIGHT: PDP Header + Configurator — matches frame 60:98 ══ */}
          <div className="flex flex-col gap-[28px] w-full lg:w-[520px] shrink-0 px-4 sm:px-6 lg:px-0 pb-8 lg:pb-0 pt-2 lg:pt-0">

            {/* PDP Header */}
            <div className="flex flex-col gap-3">
              <span className="text-white text-[11px] font-bold px-[12px] py-[6px] rounded-full uppercase tracking-[1px] w-fit bg-[#d97706]" style={{ fontFamily: 'Manrope' }}>
                🎨 Bespoke Customization
              </span>
              <h1
                ref={studioHeadingRef}
                tabIndex={-1}
                className="text-[#2c1a10] text-[40px] font-bold leading-[50px] focus:outline-none"
                style={{ fontFamily: 'Playfair Display' }}
              >
                {isStandalone ? 'Custom Hand-Poured Candle Studio' : `Personalizing: ${productCtx.name}`}
              </h1>
              <div className="flex items-baseline gap-2 whitespace-nowrap">
                <span className="text-[#2c1810] text-[26px] font-bold leading-[39px]" style={{ fontFamily: 'Playfair Display' }}>₹{productCtx.price}</span>
                <span className="text-[#7a5c44] text-[16px] font-semibold leading-[24px]" style={{ fontFamily: 'Playfair Display' }}>+ ₹{CUSTOMIZATION_FEE} Personalization</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <img key={i} src={starIcon} alt="★" className="w-3.5 h-3.5" />
                  ))}
                </div>
                <p className="text-[#2c1a10] text-[13px] font-bold" style={{ fontFamily: 'Manrope' }}>4.9 ★ · 42 reviews</p>
              </div>
              <p className="text-[#7a5c44] text-[15px] font-normal leading-[24.375px]" style={{ fontFamily: 'Manrope' }}>
                {productCtx.tagline}. Choose up to 2 botanical embeds free — add a third for just ₹{EXTRA_SHAPE_FEE}.
              </p>
            </div>

            {/* ── Section 1: Toppings (Midnight Bat Glass only) ── */}
            {showToppings && <div className="flex flex-col gap-[12px]">
              <div className="flex items-center justify-between">
                <p className="text-[#2c1a10] text-[13px] font-bold tracking-[0.5px] uppercase" style={{ fontFamily: 'Manrope' }}>
                  1. Choose Embed {productCtx.badge.includes('HALLOWEEN') ? 'Spooky Toppings' : 'Botanicals & Toppings'}
                </p>
                <span className="text-[#7a5c44] text-[11px] font-semibold bg-[#faf7f2] border border-[#e2ceae] px-[8px] py-[2px] rounded-[4px]" style={{ fontFamily: 'Manrope' }}>
                  {hasVariants ? activeToppings.length : selectedShapes.length} / 3 max
                </span>
              </div>
              <p className="text-[#7a5c44] text-[12px] font-normal leading-[18px]" style={{ fontFamily: 'Manrope' }}>
                First 2 {productCtx.badge.includes('HALLOWEEN') ? 'spooky' : 'botanical'} included free. Third = +₹{EXTRA_SHAPE_FEE}.
              </p>
              <div className="grid grid-cols-2 gap-[10px]">
                {productCtx.shapes.map((s) => {
                  const isVariantProduct = hasVariants;
                  const isSelected = isVariantProduct ? activeToppings.includes(s.id) : selectedShapes.includes(s.id);
                  const isThird = !isVariantProduct && selectedShapes.indexOf(s.id) === MAX_FREE_SHAPES;

                  function handleToppingClick() {
                    if (isVariantProduct) {
                      // Multi-select toggle — add if absent, remove if present; cap at 3
                      setActiveToppings((prev) =>
                        prev.includes(s.id)
                          ? prev.filter((id) => id !== s.id)
                          : prev.length < MAX_FREE_SHAPES + 1 ? [...prev, s.id] : prev
                      );
                    } else {
                      toggleShape(s.id);
                    }
                  }

                  return (
                    <button
                      key={s.id}
                      onClick={handleToppingClick}
                      disabled={!isVariantProduct && !isSelected && selectedShapes.length >= MAX_FREE_SHAPES + 1}
                      className={`relative border-2 p-[12px] rounded-[12px] flex items-center gap-[12px] text-left transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed ${isSelected ? 'border-[#d97706] bg-[#fef8f0] drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)]' : 'border-[#c5a059] bg-white hover:border-[#d97706]'}`}
                    >
                      {!isVariantProduct && isThird && (
                        <div className="absolute -top-2 -right-2 text-white text-[8px] font-bold px-1.5 py-0.5 rounded z-10 bg-[#7a5c44]" style={{ fontFamily: 'Manrope' }}>
                          +₹{EXTRA_SHAPE_FEE}
                        </div>
                      )}
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[18px] shrink-0 bg-[#faf7f2]">
                        {s.emoji}
                      </div>
                      <div className="min-w-0 flex flex-col">
                        <p className="text-[#2c1a10] text-[12px] font-bold leading-[15px]" style={{ fontFamily: 'Manrope' }}>{s.label}</p>
                        <p className="text-[#7a5c44] text-[10px] font-semibold leading-[15px] mt-[2px]" style={{ fontFamily: 'Manrope' }}>
                          {isSelected && !isVariantProduct ? shapeLabel(s.id) : '✦ Free to include'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>}

            {/* ── Section 2: Wax Base & Color ── */}
            <div className="flex flex-col gap-[12px]">
              <p className="text-[#2c1a10] text-[13px] font-bold tracking-[0.5px] uppercase" style={{ fontFamily: 'Manrope' }}>
                {sn(2)}. Select Wax Base &amp; Color
              </p>
              <p className="text-[#7a5c44] text-[12px] font-normal leading-[18px]" style={{ fontFamily: 'Manrope' }}>All shades are included — no extra charge.</p>
              <div className="flex flex-wrap gap-x-[6px] gap-y-[8px]">
                {activeWaxColorList.map((c) => {
                  const isActive = selectedColor === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c.id)}
                      className={`flex items-center gap-[8px] px-[16px] py-[10px] rounded-full border-2 transition-all ${isActive ? 'border-[#d97706] bg-[#fef8f0] drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)]' : 'border-[#c5a059] bg-white hover:border-[#d97706]'}`}
                    >
                      <div className="w-4 h-4 rounded-full border border-[#e2ceae] shrink-0 shadow-sm" style={{ backgroundColor: c.color }} />
                      <span className="text-[#2c1a10] text-[12px] font-semibold" style={{ fontFamily: 'Manrope' }}>{c.label}</span>
                      {isActive
                        ? <span className="text-[#d97706] text-[11px] font-normal" style={{ fontFamily: 'Manrope' }}>✓</span>
                        : <div className="w-4 h-4 rounded-[8px] border-2 border-[#c5a059] bg-white shrink-0" />
                      }
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Section 3: Artisanal Fragrance ── */}
            <div className="flex flex-col gap-[12px]">
              <p className="text-[#2c1a10] text-[13px] font-bold tracking-[0.5px] uppercase" style={{ fontFamily: 'Manrope' }}>
                {sn(3)}. Choose Artisanal Fragrance
              </p>
              <p className="text-[#7a5c44] text-[12px] font-normal leading-[18px]" style={{ fontFamily: 'Manrope' }}>Natural, phthalate-free, long-burning. Included in the personalization fee.</p>
              <div className="flex flex-col gap-[8px]">
                {activeFragrances.map((f) => {
                  const isActive = selectedFragrance === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFragrance(f.id)}
                      className={`flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] border-2 text-left transition-all ${isActive ? 'border-[#d97706] bg-[#fef8f0] drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)]' : 'border-[#c5a059] bg-white hover:border-[#d97706]'}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[20px] shrink-0 ${isActive ? 'bg-[#d97706]' : 'bg-[#faf7f2]'}`}>
                        {f.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#2c1a10] text-[13px] font-bold leading-[16.25px]" style={{ fontFamily: 'Manrope' }}>{f.label}</p>
                        <p className="text-[#7a5c44] text-[11px] font-normal leading-[16.5px] mt-[2px] truncate" style={{ fontFamily: 'Manrope' }}>{f.notes}</p>
                      </div>
                      {isActive
                        ? <><span className="text-[#d97706] text-[13px] shrink-0" style={{ fontFamily: 'Manrope' }}>✓</span>
                            <img src={`${assetPrefix}/6994b.svg`} alt="" className="w-4 h-4 shrink-0" /></>
                        : <div className="w-4 h-4 rounded-[8px] border-2 border-[#c5a059] bg-white shrink-0" />
                      }
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Section 4: Wick Type ── */}
            <div className="flex flex-col gap-[12px]">
              <p className="text-[#2c1a10] text-[13px] font-bold tracking-[0.5px] uppercase" style={{ fontFamily: 'Manrope' }}>
                {sn(4)}. Wick Type
              </p>
              <div className="flex gap-[8px]">
                {([
                  { id: 'cotton', label: 'Natural Cotton Wick', sub: 'Clean, quiet burn', icon: '🕯️' },
                  { id: 'wooden', label: 'Crackling Wooden Wick', sub: 'Warm fireplace sound', icon: '🪵' },
                ] as const).map((w) => {
                  const isActive = selectedWick === w.id;
                  return (
                    <button
                      key={w.id}
                      onClick={() => setSelectedWick(w.id)}
                      className={`flex-1 flex flex-col items-center gap-[4px] p-[12px] rounded-[12px] border-2 text-center transition-all ${isActive ? 'border-[#d97706] bg-[#fef8f0] drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)]' : 'border-[#e5ddd0] bg-white hover:border-[#d97706]'}`}
                    >
                      <span className="text-[20px] leading-[30px]">{w.icon}</span>
                      <p className="text-[#2c1a10] text-[12px] font-bold leading-[15px]" style={{ fontFamily: 'Manrope' }}>{w.label}</p>
                      <p className="text-[#7a5c44] text-[10px] font-normal leading-[15px]" style={{ fontFamily: 'Manrope' }}>{w.sub}</p>
                      {isActive
                        ? <><p className="text-[#d97706] text-[11px] font-bold leading-[16.5px]" style={{ fontFamily: 'Manrope' }}>✓ Selected</p>
                            <img src={`${assetPrefix}/6994b.svg`} alt="" className="w-4 h-4" /></>
                        : <div className="w-4 h-4 rounded-[8px] border-2 border-[#c5a059] bg-white" />
                      }
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Packaging ── */}
            <div className="flex flex-col gap-[12px]">
              <p className="text-[#2c1a10] text-[13px] font-bold tracking-[0.5px] uppercase" style={{ fontFamily: 'Manrope' }}>
                {sn(5)}. Packaging
              </p>
              <div className="flex flex-col gap-[8px]">
                {packagings.map((p) => {
                  const isActive = selectedPackaging === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPackaging(p.id)}
                      className={`flex items-center justify-between px-[16px] py-[12px] rounded-[12px] border-2 text-left transition-all ${isActive ? 'border-[#d97706] bg-[#fef8f0] drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)]' : 'border-[#c5a059] bg-white hover:border-[#d97706]'}`}
                    >
                      <div className="flex items-center gap-[8px]">
                        {isActive
                          ? <span className="text-[#d97706] text-[13px] font-normal leading-[19.5px]" style={{ fontFamily: 'Manrope' }}>✓</span>
                          : <div className="w-[12px] h-[20px]" />
                        }
                        <span className="text-[#2c1a10] text-[13px] font-semibold leading-[19.5px]" style={{ fontFamily: 'Manrope' }}>{p.label}</span>
                      </div>
                      <span className={`text-[12px] font-bold leading-[18px] ${p.price === 0 ? 'text-[#218c21]' : 'text-[#d97706]'}`} style={{ fontFamily: 'Manrope' }}>
                        {p.price === 0 ? 'Included' : `+₹${p.price}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Price Breakdown ── */}
            <div className="bg-[#fef8f0] border border-[#e2ceae] rounded-[12px] p-[20px] flex flex-col gap-[10px]">
              <p className="text-[#7a5c44] text-[11px] font-bold tracking-[1.5px] uppercase pb-[4px]" style={{ fontFamily: 'Manrope' }}>Price Breakdown</p>
              <div className="flex items-center justify-between">
                <span className="text-[#7a5c44] text-[14px] font-normal leading-[21px]" style={{ fontFamily: 'Manrope' }}>Base Candle</span>
                <span className="text-[#2c1a10] text-[14px] font-semibold leading-[21px]" style={{ fontFamily: 'Manrope' }}>₹{productCtx.price}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7a5c44] text-[14px] font-normal leading-[21px]" style={{ fontFamily: 'Manrope' }}>Personalization Fee</span>
                <span className="text-[#2c1a10] text-[14px] font-semibold leading-[21px]" style={{ fontFamily: 'Manrope' }}>+₹{CUSTOMIZATION_FEE}</span>
              </div>
              {extraShapeFee > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-[#7a5c44] text-[14px] font-normal leading-[21px]" style={{ fontFamily: 'Manrope' }}>3rd Embed Shape</span>
                  <span className="text-[#d97706] text-[14px] font-semibold leading-[21px]" style={{ fontFamily: 'Manrope' }}>+₹{extraShapeFee}</span>
                </div>
              )}
              {packagingPrice > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-[#7a5c44] text-[14px] font-normal leading-[21px]" style={{ fontFamily: 'Manrope' }}>{packagings.find((p) => p.id === selectedPackaging)?.label}</span>
                  <span className="text-[#d97706] text-[14px] font-semibold leading-[21px]" style={{ fontFamily: 'Manrope' }}>+₹{packagingPrice}</span>
                </div>
              )}
              <div className="pt-[4px]">
                <div className="border-t border-[#e2ceae] pt-[12px] flex items-center justify-between">
                  <span className="text-[#2c1a10] text-[16px] font-bold leading-[24px]" style={{ fontFamily: 'Manrope' }}>Total</span>
                  <span
                    className="text-[18px] font-bold leading-[27px] transition-colors duration-300"
                    style={{ fontFamily: 'Manrope', color: totalPulsing ? '#b86000' : '#d97706' }}
                  >₹{total}</span>
                </div>
              </div>
            </div>

            {/* ── Primary CTA ── */}
            <button
              onClick={() => setOrderModalOpen(true)}
              className="w-full py-[16px] rounded-full text-[14px] font-bold uppercase tracking-[1px] text-center text-white bg-[#d97706] hover:bg-[#b86000] active:scale-[0.99] transition-all drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1),0px_2px_2px_rgba(0,0,0,0.1)]"
              style={{ fontFamily: 'Manrope' }}
            >
              🛒 Add Custom Candle to Cart — ₹{total}
            </button>

            <p className="text-[#7a5c44] text-[11px] italic text-center leading-[16.5px]" style={{ fontFamily: 'Playfair Display' }}>
              * Made to order · 100% soy wax · Ships in 48–72 hours
            </p>

            {/* ── Product & Craft Specifications ── */}
            <div className="border-t border-[#e2ceae] pt-[8px] flex flex-col gap-[16px]">
              <p className="text-[#2c1a10] text-[13px] font-bold tracking-[0.5px] uppercase" style={{ fontFamily: 'Manrope' }}>
                Product &amp; Craft Specifications
              </p>
              <div className="grid grid-cols-2 gap-[12px]">
                {specs.map((s) => (
                  <div key={s.label} className="bg-[#fef8f0] border border-[#e8e1d5] rounded-[12px] p-[16px] flex flex-col gap-[4px]">
                    <p className="text-[#7a5c44] text-[10px] font-bold tracking-[1px] uppercase leading-[15px]" style={{ fontFamily: 'Manrope' }}>{s.label}</p>
                    <p className="text-[#2c1a10] text-[13px] font-semibold leading-[17.875px]" style={{ fontFamily: 'Manrope' }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* ── Mobile Floating Bottom CTA ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#fdf6ed] border-t border-[#e2ceae] px-4 py-3 flex items-center gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.10)]">
        <div className="shrink-0">
          <p className="text-[17px] font-bold leading-tight transition-all duration-300" style={{ fontFamily: 'Manrope', color: totalPulsing ? '#b86000' : '#d97706' }}>₹{total}</p>
          <p className="text-[10px] text-[#7a5c44]" style={{ fontFamily: 'Manrope' }}>Live Total</p>
        </div>
        <button
          onClick={() => setOrderModalOpen(true)}
          className="flex-1 bg-[#d97706] text-white text-[13px] font-bold uppercase tracking-[0.6px] rounded-full hover:bg-[#b86000] active:scale-95 transition-all"
          style={{ minHeight: '44px', fontFamily: 'Manrope' }}
        >
          Add to Cart — ₹{total}
        </button>
      </div>

      <OrderRequestModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        productName={`Custom ${productCtx.name}`}
        productImg={productCtx.img}
        items={buildOrderItems()}
        total={total}
      />
    </div>
  );
}
