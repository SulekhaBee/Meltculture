import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import OrderRequestModal from '../components/OrderRequestModal';
import NavigationHeader from '../components/NavigationHeader';
import MediaGallery from '../components/MediaGallery';

const assetPrefix = '/assets';
const ellipseIcon = `${assetPrefix}/f7abf.svg`;
const starIcon = `${assetPrefix}/c4cb7.svg`;


type FragranceNotes = { top: string[]; heart: string[]; base: string[] };

type WaxColor = {
  id: string;
  label: string;
  hex: string;
  images: { cotton: string[]; wooden: string[] };
};

type PackagingOption = { id: string; label: string; price: number };

type Product = {
  name: string; price: number; rating: string; reviews: number;
  images: string[];
  desc: string; badge: string; badgeColor: string;
  cat: string; catLink: string;
  express?: boolean;
  details: { label: string; value: string }[];
  fragranceNotes?: FragranceNotes;
  waxColors?: WaxColor[];
  packagingOptions?: PackagingOption[];
  chocolateAddon?: boolean;
  giftNoteEnabled?: boolean;
  relatedProducts: { name: string; img: string; price: string; slug: string }[];
};

const products: Record<string, Product> = {
  'the-diwali-starter': {
    name: 'The Diwali Starter', price: 899, rating: '4.8', reviews: 52,
    images: [`${assetPrefix}/b6c4c.png`, `${assetPrefix}/e2356.png`, `${assetPrefix}/5a082.png`],
    desc: 'The perfect entry-level Diwali hamper — five hand-poured artisan candles in a premium kraft dabba with logo sticker and express shipping. Thoughtfully curated for gifting colleagues, friends, and family.',
    badge: 'Most Popular', badgeColor: '#d97706',
    cat: 'Gift Hampers', catLink: '/gifting-guide', express: true,
    details: [
      { label: "What's Inside", value: '5 Artisan Candles · Logo Sticker · Kraft Dabba' },
      { label: 'Shipping', value: 'Express 24h dispatch · Pan-India delivery' },
      { label: 'Packaging', value: 'Natural kraft finish · tissue wrap · satin ribbon' },
      { label: 'Wax Type', value: '100% soy wax across all pieces' },
      { label: 'Customization', value: 'Optional gift note · logo sticker' },
    ],
    fragranceNotes: {
      top: ['Kesar', 'Rose'],
      heart: ['Cardamom', 'Masala Chai'],
      base: ['Sandalwood', 'Amber Musk'],
    },
    relatedProducts: [
      { name: 'The Chai Lover Kit', img: `${assetPrefix}/e2356.png`, price: '₹799', slug: 'the-chai-lover-kit' },
      { name: 'The Festive Pour Studio', img: `${assetPrefix}/13945.png`, price: '₹1,199', slug: 'the-festive-pour-studio' },
      { name: 'The Halloween Special', img: `${assetPrefix}/0e412.png`, price: '₹1,389', slug: 'the-halloween-special' },
    ],
  },
  'the-chai-lover-kit': {
    name: 'The Chai Lover Kit', price: 799, rating: '4.9', reviews: 38,
    images: [`${assetPrefix}/e2356.png`, `${assetPrefix}/f2192.png`, `${assetPrefix}/35c57.png`],
    desc: 'A curated set for the chai and coffee obsessed. Includes our bestselling Cutting Chai and Filter Coffee candles plus a mini assortment tray, all nestled in a hand-finished kraft dabba.',
    badge: 'Gift of the Season', badgeColor: '#8B5E3C',
    cat: 'Gift Hampers', catLink: '/gifting-guide', express: true,
    details: [
      { label: "What's Inside", value: 'Cutting Chai Candle · Filter Coffee Candle · Mini Tray' },
      { label: 'Shipping', value: 'Express 24h dispatch · Pan-India delivery' },
      { label: 'Packaging', value: 'Natural kraft box · printed tissue · wax seal' },
      { label: 'Fragrance', value: 'Chai masala · dark roast · cardamom assortment' },
      { label: 'Customization', value: 'Optional gift note · custom ribbon colour' },
    ],
    fragranceNotes: {
      top: ['Cardamom', 'Cinnamon'],
      heart: ['Masala Chai', 'Dark Roast'],
      base: ['Warm Vanilla', 'Woodsmoke'],
    },
    relatedProducts: [
      { name: 'The Diwali Starter', img: `${assetPrefix}/b6c4c.png`, price: '₹899', slug: 'the-diwali-starter' },
      { name: 'The Festive Pour Studio', img: `${assetPrefix}/13945.png`, price: '₹1,199', slug: 'the-festive-pour-studio' },
      { name: 'Cutting Chai Candle', img: `${assetPrefix}/f2192.png`, price: '₹349', slug: 'cutting-chai-candle' },
    ],
  },
  'the-halloween-special': {
    name: 'The Halloween Special', price: 1389, rating: '5.0', reviews: 21,
    images: [`${assetPrefix}/0e412.png`, `${assetPrefix}/694c4.png`, `${assetPrefix}/f2ff6.png`],
    desc: 'Three limited Halloween candles in collector-grade gift packaging. Skull embeds, ember-orange gel, and dark plum wax layers — the most theatrical candle set we make. Ships in a sealed black gift box with ribbon.',
    badge: '🎃 Limited Edition', badgeColor: '#4a1a5e',
    cat: 'Gift Hampers', catLink: '/gifting-guide', express: false,
    details: [
      { label: "What's Inside", value: 'Midnight Bat Glass · Sorcerer Elixir Skull · Blueberry Gel Glass' },
      { label: 'Shipping', value: 'Dispatched within 48h · Pan-India' },
      { label: 'Packaging', value: 'Sealed black collector box · velvet ribbon' },
      { label: 'Fragrance', value: 'Warm spice · jasmine cedar · wild berry violet' },
      { label: 'Customization', value: 'Gift note included' },
    ],
    fragranceNotes: {
      top: ['Warm Spice', 'Wild Berry'],
      heart: ['Night Jasmine', 'Cedarwood'],
      base: ['Dark Amber', 'Vetiver'],
    },
    relatedProducts: [
      { name: 'The Diwali Starter', img: `${assetPrefix}/b6c4c.png`, price: '₹899', slug: 'the-diwali-starter' },
      { name: 'Midnight Bat Glass', img: `${assetPrefix}/694c4.png`, price: '₹529', slug: 'pumpkin-patch-glass' },
      { name: 'Sorcerer Elixir Skull', img: `${assetPrefix}/f2ff6.png`, price: '₹499', slug: 'sorcerer-elixir-skull' },
    ],
  },
  'the-festive-pour-studio': {
    name: 'The Festive Pour Studio', price: 1199, rating: '4.9', reviews: 17,
    images: [`${assetPrefix}/13945.png`, `${assetPrefix}/694c4.png`, `${assetPrefix}/f2ff6.png`],
    desc: 'Our most gifted custom-pour hamper. Includes a base candle, customization studio credit, your choice of embed shapes, premium magnetic gift box, and a handwritten studio card. The ultimate "make your own" Diwali experience.',
    badge: 'Gift of the Season', badgeColor: '#d4871a',
    cat: 'Gift Hampers', catLink: '/gifting-guide', express: false,
    details: [
      { label: "What's Inside", value: 'Custom Pour Candle · Studio Credit · Magnetic Box · Studio Card' },
      { label: 'Shipping', value: 'Made to order · ships within 48–72h' },
      { label: 'Packaging', value: 'Magnetic flip premium box · foil logo · tissue' },
      { label: 'Customization', value: 'Choose embeds, wax color, scent, and packaging' },
      { label: 'Personalization', value: 'Handwritten studio card included' },
    ],
    fragranceNotes: {
      top: ['Rose Attar', 'Kesar'],
      heart: ['Cardamom', 'Besan'],
      base: ['Warm Soy', 'Amber'],
    },
    relatedProducts: [
      { name: 'The Diwali Starter', img: `${assetPrefix}/b6c4c.png`, price: '₹899', slug: 'the-diwali-starter' },
      { name: 'The Chai Lover Kit', img: `${assetPrefix}/e2356.png`, price: '₹799', slug: 'the-chai-lover-kit' },
      { name: 'Mithai Dabba Set', img: `${assetPrefix}/5a082.png`, price: '₹549', slug: 'mithai-dabba-set' },
    ],
  },
  'six-minis-tray': {
    name: 'Six Minis Tray', price: 309, rating: '4.9', reviews: 128,
    images: [`${assetPrefix}/14781.png`, `${assetPrefix}/b5f8e.png`, `${assetPrefix}/8c703.png`],
    desc: 'A delightful assortment of six hand-poured sculptural mini candles. Presented on an elegant hand-finished tray, inspired by the sweetest sights and scents of Indian heritage.',
    badge: 'Ready to Shop', badgeColor: '#d97706',
    cat: 'Ready to Shop', catLink: '/shop', express: true,
    details: [
      { label: 'Wax Type', value: '100% soy wax · ivory soy base' },
      { label: 'Fragrance', value: 'Multi-scent assortment: chai, kewra, mogra, rose' },
      { label: 'Burn Time', value: '6–8 hours per mini' },
      { label: 'Size', value: '220g tray · 6 × 35g minis' },
      { label: 'Wick', value: 'Organic cotton, lead-free' },
    ],
    fragranceNotes: {
      top: ['Mogra', 'Kewra'],
      heart: ['Rose Attar', 'Masala Chai'],
      base: ['Warm Soy', 'Sandalwood'],
    },
    relatedProducts: [
      { name: 'Cutting Chai Candle', img: `${assetPrefix}/f2192.png`, price: '₹349', slug: 'cutting-chai-candle' },
      { name: 'Filter Coffee Candle', img: `${assetPrefix}/35c57.png`, price: '₹589', slug: 'filter-coffee-candle' },
      { name: 'Ladoo Stack', img: `${assetPrefix}/d21c5.png`, price: '₹249', slug: 'ladoo-stack' },
    ],
  },
  'cutting-chai-candle': {
    name: 'Cutting Chai Candle', price: 349, rating: '4.8', reviews: 94,
    images: [
      `${assetPrefix}/f2192.png`,
      `${assetPrefix}/f2192.png`,
      `${assetPrefix}/f2192.png`,
    ],
    desc: 'Masala chai soy wax with a dipped biscuit embed, cinnamon and whole-spice notes. Inspired by the roadside cutting chai that has fueled a million conversations across India.',
    badge: 'Express 24h', badgeColor: '#218c21',
    cat: 'Ready to Shop', catLink: '/shop', express: true,
    details: [
      { label: 'Wax Type', value: '100% soy wax · cream base' },
      { label: 'Fragrance', value: 'Chai masala · cinnamon · ginger · cardamom' },
      { label: 'Burn Time', value: '18–22 hours' },
      { label: 'Size', value: '180ml glass tumbler' },
      { label: 'Embed', value: 'Real-look biscuit embed' },
    ],
    fragranceNotes: {
      top: ['Cardamom', 'Cinnamon'],
      heart: ['Masala Chai', 'Ginger'],
      base: ['Warm Vanilla', 'Sandalwood'],
    },
    relatedProducts: [
      { name: 'Six Minis Tray', img: `${assetPrefix}/14781.png`, price: '₹309', slug: 'six-minis-tray' },
      { name: 'Filter Coffee Candle', img: `${assetPrefix}/35c57.png`, price: '₹589', slug: 'filter-coffee-candle' },
      { name: 'Ladoo Stack', img: `${assetPrefix}/d21c5.png`, price: '₹249', slug: 'ladoo-stack' },
    ],
  },
  'filter-coffee-candle': {
    name: 'Filter Coffee Candle', price: 589, rating: '4.9', reviews: 67,
    images: [
      `${assetPrefix}/35c57.png`,
      `${assetPrefix}/35c57.png`,
      `${assetPrefix}/35c57.png`,
    ],
    desc: 'South Indian filter coffee in a brass tumbler vessel, dark roast and cardamom. The comforting aroma of dabaras and steel tumblers, reimagined in artisan soy wax.',
    badge: 'Express 24h', badgeColor: '#218c21',
    cat: 'Ready to Shop', catLink: '/shop', express: true,
    details: [
      { label: 'Wax Type', value: '100% soy wax · dark base' },
      { label: 'Fragrance', value: 'Dark roast · chicory · cardamom' },
      { label: 'Burn Time', value: '20–24 hours' },
      { label: 'Size', value: 'Brass tumbler replica vessel' },
      { label: 'Wick', value: 'Organic cotton' },
    ],
    fragranceNotes: {
      top: ['Cardamom', 'Chicory Flower'],
      heart: ['Dark Roast', 'Coffee Bean'],
      base: ['Warm Vanilla', 'Woodsmoke'],
    },
    relatedProducts: [
      { name: 'Cutting Chai Candle', img: `${assetPrefix}/f2192.png`, price: '₹349', slug: 'cutting-chai-candle' },
      { name: 'Six Minis Tray', img: `${assetPrefix}/14781.png`, price: '₹309', slug: 'six-minis-tray' },
      { name: 'Kaju Katli Quartet', img: `${assetPrefix}/ce96a.png`, price: '₹299', slug: 'kaju-katli-quartet' },
    ],
  },
  'kaju-katli-quartet': {
    name: 'Kaju Katli Quartet', price: 299, rating: '4.9', reviews: 41,
    images: [
      `${assetPrefix}/ce96a.png`,
      `${assetPrefix}/ce96a.png`,
      `${assetPrefix}/ce96a.png`,
    ],
    desc: 'Diamond-shaped kaju katli with silver varq finish, cardamom and condensed milk attar on a brass thali. A collectible Diwali sculpture that feels too precious to burn.',
    badge: 'Pre-Order', badgeColor: '#d4871a',
    cat: 'Diwali Specials', catLink: '/festive-drops', express: false,
    details: [
      { label: 'Wax Type', value: '100% soy wax · silver-ivory base' },
      { label: 'Fragrance', value: 'Cardamom · condensed milk · kesar attar' },
      { label: 'Burn Time', value: '10–14 hours' },
      { label: 'Size', value: '4 diamond pieces on brass thali' },
      { label: 'Finish', value: 'Real silver varq pressed on surface' },
    ],
    fragranceNotes: {
      top: ['Cardamom', 'Saffron'],
      heart: ['Condensed Milk', 'Cashew Attar'],
      base: ['Warm Soy', 'Musk'],
    },
    relatedProducts: [
      { name: 'Ladoo Stack', img: `${assetPrefix}/d21c5.png`, price: '₹249', slug: 'ladoo-stack' },
      { name: 'Modak Quartet', img: `${assetPrefix}/4bc1c.png`, price: '₹299', slug: 'modak-quartet' },
      { name: 'Mithai Dabba Set', img: `${assetPrefix}/5a082.png`, price: '₹549', slug: 'mithai-dabba-set' },
    ],
  },
  'modak-quartet': {
    name: 'Modak Quartet', price: 299, rating: '4.8', reviews: 22,
    images: [`${assetPrefix}/4bc1c.png`, `${assetPrefix}/4bc1c.png`, `${assetPrefix}/4bc1c.png`],
    desc: 'Hand-shaped coconut modak set with lotus-honey fragrance. Each modak is individually sculpted in cream soy wax — a devotional offering reimagined as artisan home fragrance.',
    badge: 'Pre-Order', badgeColor: '#d4871a',
    cat: 'Diwali Specials', catLink: '/festive-drops', express: false,
    details: [
      { label: 'Wax Type', value: '100% soy wax · cream base' },
      { label: 'Fragrance', value: 'Coconut · honey · lotus blossom' },
      { label: 'Burn Time', value: '10–14 hours' },
      { label: 'Size', value: '4 modak pieces on brass tray' },
      { label: 'Wick', value: 'Organic cotton, lead-free' },
    ],
    fragranceNotes: {
      top: ['Lotus Blossom', 'Coconut'],
      heart: ['Honey', 'Jasmine'],
      base: ['Warm Soy', 'Sandalwood'],
    },
    relatedProducts: [
      { name: 'Ladoo Stack', img: `${assetPrefix}/d21c5.png`, price: '₹249', slug: 'ladoo-stack' },
      { name: 'Kaju Katli Quartet', img: `${assetPrefix}/ce96a.png`, price: '₹299', slug: 'kaju-katli-quartet' },
      { name: 'Mithai Dabba Set', img: `${assetPrefix}/5a082.png`, price: '₹549', slug: 'mithai-dabba-set' },
    ],
  },
  'nankati-bharati': {
    name: 'Nankati Bharati', price: 349, rating: '4.9', reviews: 18,
    images: [`${assetPrefix}/5aaec.png`, `${assetPrefix}/5aaec.png`, `${assetPrefix}/5aaec.png`],
    desc: 'Crispy Diwali nankhatai swirls in rose-cardamom infused soy wax. A fragrant tribute to the shortbread biscuits baked in every mithai shop across India.',
    badge: 'Pre-Order', badgeColor: '#d4871a',
    cat: 'Diwali Specials', catLink: '/festive-drops', express: false,
    details: [
      { label: 'Wax Type', value: '100% soy wax · golden base' },
      { label: 'Fragrance', value: 'Rose · cardamom · ghee · nutmeg' },
      { label: 'Burn Time', value: '12–16 hours' },
      { label: 'Size', value: '4-piece nankhatai set on tray' },
      { label: 'Wick', value: 'Organic cotton, lead-free' },
    ],
    fragranceNotes: {
      top: ['Rose', 'Cardamom'],
      heart: ['Ghee', 'Nutmeg'],
      base: ['Warm Soy', 'Amber Musk'],
    },
    relatedProducts: [
      { name: 'Ladoo Stack', img: `${assetPrefix}/d21c5.png`, price: '₹249', slug: 'ladoo-stack' },
      { name: 'Kaju Katli Quartet', img: `${assetPrefix}/ce96a.png`, price: '₹299', slug: 'kaju-katli-quartet' },
      { name: 'Mithai Dabba Set', img: `${assetPrefix}/5a082.png`, price: '₹549', slug: 'mithai-dabba-set' },
    ],
  },
  'peony-lake': {
    name: 'Peony Lake', price: 699, rating: '4.7', reviews: 14,
    images: [`${assetPrefix}/85d04.png`, `${assetPrefix}/ae62c.png`, `${assetPrefix}/e8086.png`, `${assetPrefix}/a3143.png`],
    desc: 'Floating peony and rose blooms suspended in aqua gel, scented with cedar and fresh peony. A living sculpture that transforms any room into a still-water garden.',
    badge: 'Pre-Order', badgeColor: '#d4871a',
    cat: 'Diwali Specials', catLink: '/festive-drops', express: false,
    details: [
      { label: 'Wax Type', value: 'Crystal gel wax · aqua base' },
      { label: 'Fragrance', value: 'Peony · rose · cedarwood' },
      { label: 'Burn Time', value: '16–20 hours' },
      { label: 'Size', value: '300ml wide-mouth glass jar' },
      { label: 'Embed', value: 'Peony & rose wax blooms' },
      { label: 'Wick', value: 'Organic cotton, lead-free' },
    ],
    fragranceNotes: {
      top: ['Fresh Peony', 'Rose'],
      heart: ['Cedarwood', 'Green Leaf'],
      base: ['Musk', 'White Amber'],
    },
    waxColors: [
      { id: 'blue', label: 'OG Blue', hex: '#6FBFBC', images: {
        cotton: [`${assetPrefix}/014d6.png`, `${assetPrefix}/291cd.png`, `${assetPrefix}/f3ebb.png`, `${assetPrefix}/1c4e3.png`],
        wooden: [`${assetPrefix}/014d6.png`, `${assetPrefix}/291cd.png`, `${assetPrefix}/f3ebb.png`, `${assetPrefix}/1c4e3.png`],
      }},
      { id: 'pink', label: 'Bubbly Pink', hex: '#D98BA0', images: {
        cotton: [`${assetPrefix}/3c0c5.png`, `${assetPrefix}/d457a.png`, `${assetPrefix}/c644d.png`, `${assetPrefix}/8951c.png`],
        wooden: [`${assetPrefix}/3c0c5.png`, `${assetPrefix}/d457a.png`, `${assetPrefix}/c644d.png`, `${assetPrefix}/8951c.png`],
      }},
      { id: 'white', label: 'Classic Ivory', hex: '#EDE0C8', images: {
        cotton: [`${assetPrefix}/85d04.png`, `${assetPrefix}/ae62c.png`, `${assetPrefix}/e8086.png`, `${assetPrefix}/a3143.png`],
        wooden: [`${assetPrefix}/85d04.png`, `${assetPrefix}/ae62c.png`, `${assetPrefix}/e8086.png`, `${assetPrefix}/a3143.png`],
      }},
    ],
    packagingOptions: [
      { id: 'standard', label: 'Standard Box included', price: 0 },
      { id: 'pale-blue', label: 'Premium Pale Blue Box', price: 129 },
      { id: 'ribbon-black', label: 'Premium With Ribbon Black Box', price: 339 },
    ],
    chocolateAddon: true,
    giftNoteEnabled: true,
    relatedProducts: [
      { name: 'Water Lily Lake', img: `${assetPrefix}/64561.png`, price: '₹799', slug: 'water-lily-lake' },
      { name: 'Lotus Dawn', img: `${assetPrefix}/73778.png`, price: '₹749', slug: 'lotus-dawn' },
      { name: 'Lotus Garden Montage', img: `${assetPrefix}/960e1.png`, price: '₹1,100', slug: 'lotus-garden-montage' },
    ],
  },
  'mithai-dabba-set': {
    name: 'Mithai Dabba Set', price: 549, rating: '5.0', reviews: 41,
    images: [`${assetPrefix}/5a082.png`, `${assetPrefix}/5a082.png`, `${assetPrefix}/5a082.png`],
    desc: 'A curated assortment of festive candles presented in a lacquer mithai dabba. The perfect Diwali gift — each piece a sculptural sweet, each scent a memory from childhood.',
    badge: 'Pre-Order', badgeColor: '#d4871a',
    cat: 'Diwali Specials', catLink: '/festive-drops', express: false,
    details: [
      { label: 'Contents', value: 'Ladoo, Kaju Katli, Modak, Nankhatai minis' },
      { label: 'Fragrance', value: 'Assorted — kesar, rose, cardamom, coconut' },
      { label: 'Burn Time', value: '6–10 hours per mini' },
      { label: 'Packaging', value: 'Hand-lacquered mithai dabba with ribbon' },
      { label: 'Wick', value: 'Organic cotton, lead-free' },
    ],
    fragranceNotes: {
      top: ['Kesar', 'Rose'],
      heart: ['Cardamom', 'Coconut'],
      base: ['Warm Soy', 'Amber Musk'],
    },
    relatedProducts: [
      { name: 'Ladoo Stack', img: `${assetPrefix}/d21c5.png`, price: '₹249', slug: 'ladoo-stack' },
      { name: 'Kaju Katli Quartet', img: `${assetPrefix}/ce96a.png`, price: '₹299', slug: 'kaju-katli-quartet' },
      { name: 'Modak Quartet', img: `${assetPrefix}/4bc1c.png`, price: '₹299', slug: 'modak-quartet' },
    ],
  },
  'water-lily-lake': {
    name: 'Water Lily Lake', price: 799, rating: '4.8', reviews: 9,
    images: [`${assetPrefix}/64561.png`, `${assetPrefix}/628bd.png`, `${assetPrefix}/08d31.png`, `${assetPrefix}/39a33.png`],
    desc: 'Lotus blooms suspended in a clear gel vessel with an aquatic-green fragrance. Inspired by monsoon ponds across Bengal — still water, lotus petals, morning fog.',
    badge: 'Pre-Order', badgeColor: '#d4871a',
    cat: 'Diwali Specials', catLink: '/festive-drops', express: false,
    details: [
      { label: 'Wax Type', value: 'Crystal gel wax · clear base' },
      { label: 'Fragrance', value: 'Aquatic green · lotus · fresh water' },
      { label: 'Burn Time', value: '18–22 hours' },
      { label: 'Size', value: '400ml wide-mouth glass vessel' },
      { label: 'Embed', value: 'Lotus wax blooms & lily pads' },
      { label: 'Wick', value: 'Organic cotton, lead-free' },
    ],
    fragranceNotes: {
      top: ['Aquatic Green', 'Lotus'],
      heart: ['Fresh Water', 'Lily'],
      base: ['White Musk', 'Cedarwood'],
    },
    waxColors: [
      { id: 'ivory-white', label: 'Ivory White', hex: '#ede0c8', images: {
        cotton: [`${assetPrefix}/64561.png`, `${assetPrefix}/628bd.png`, `${assetPrefix}/08d31.png`, `${assetPrefix}/39a33.png`],
        wooden: [`${assetPrefix}/64561.png`, `${assetPrefix}/628bd.png`, `${assetPrefix}/08d31.png`, `${assetPrefix}/39a33.png`],
      }},
      { id: 'intense-pink', label: 'Intense Pink', hex: '#d98ba0', images: {
        cotton: [`${assetPrefix}/13f35.png`, `${assetPrefix}/c10cb.png`, `${assetPrefix}/ad11e.png`, `${assetPrefix}/08e93.png`],
        wooden: [`${assetPrefix}/13f35.png`, `${assetPrefix}/c10cb.png`, `${assetPrefix}/ad11e.png`, `${assetPrefix}/08e93.png`],
      }},
      { id: 'serene-green', label: 'Serene Green', hex: '#a9b496', images: {
        cotton: [`${assetPrefix}/f553c.png`, `${assetPrefix}/d8cb1.png`, `${assetPrefix}/78a83.png`, `${assetPrefix}/74aad.png`],
        wooden: [`${assetPrefix}/f553c.png`, `${assetPrefix}/d8cb1.png`, `${assetPrefix}/78a83.png`, `${assetPrefix}/74aad.png`],
      }},
      { id: 'violet-bloom', label: 'Violet Bloom', hex: '#d2b9fa', images: {
        cotton: [`${assetPrefix}/aaada.png`, `${assetPrefix}/6ea63.png`, `${assetPrefix}/2dcd8.png`, `${assetPrefix}/b0e51.png`],
        wooden: [`${assetPrefix}/aaada.png`, `${assetPrefix}/6ea63.png`, `${assetPrefix}/2dcd8.png`, `${assetPrefix}/b0e51.png`],
      }},
    ],
    packagingOptions: [
      { id: 'standard', label: 'Standard Box included', price: 0 },
      { id: 'pale-blue', label: 'Premium Pale Blue Box', price: 129 },
      { id: 'ribbon-black', label: 'Premium With Ribbon Black Box', price: 339 },
    ],
    chocolateAddon: true,
    giftNoteEnabled: true,
    relatedProducts: [
      { name: 'Peony Lake', img: `${assetPrefix}/85d04.png`, price: '₹699', slug: 'peony-lake' },
      { name: 'Lotus Dawn', img: `${assetPrefix}/73778.png`, price: '₹749', slug: 'lotus-dawn' },
      { name: 'Lotus Garden Montage', img: `${assetPrefix}/960e1.png`, price: '₹1,100', slug: 'lotus-garden-montage' },
    ],
  },
  'serene-lotus-lake': {
    name: 'Serene Lotus Lake', price: 799, rating: '4.8', reviews: 9,
    images: [`${assetPrefix}/0b246.png`, `${assetPrefix}/a2ca2.png`, `${assetPrefix}/468ea.png`, `${assetPrefix}/f789c.png`],
    desc: 'Lotus blooms suspended in a clear gel vessel with an aquatic-green fragrance. Inspired by monsoon ponds across Bengal — still water, lotus petals, morning fog. Available in Serene Green and Cotton Phlox (blush pink).',
    badge: 'Pre-Order', badgeColor: '#d4871a',
    cat: 'Diwali Specials', catLink: '/festive-drops', express: false,
    details: [
      { label: 'Wax Type', value: 'Crystal gel wax · clear base' },
      { label: 'Fragrance', value: 'Aquatic green · lotus · fresh water' },
      { label: 'Burn Time', value: '18–22 hours' },
      { label: 'Size', value: '400ml wide-mouth glass vessel' },
      { label: 'Embed', value: 'Lotus wax blooms & lily pads' },
      { label: 'Wick', value: 'Organic cotton, lead-free' },
    ],
    fragranceNotes: {
      top: ['Aquatic Green', 'Lotus'],
      heart: ['Fresh Water', 'Lily'],
      base: ['White Musk', 'Cedarwood'],
    },
    waxColors: [
      { id: 'green', label: 'Serene Green', hex: '#a9b496', images: {
        cotton: [`${assetPrefix}/0b246.png`, `${assetPrefix}/a2ca2.png`, `${assetPrefix}/468ea.png`, `${assetPrefix}/f789c.png`],
        wooden: [`${assetPrefix}/0b246.png`, `${assetPrefix}/a2ca2.png`, `${assetPrefix}/468ea.png`, `${assetPrefix}/f789c.png`],
      }},
      { id: 'pink', label: 'Cotton Phlox', hex: '#e4b7c3', images: {
        cotton: [`${assetPrefix}/0b547.png`, `${assetPrefix}/c90ab.png`, `${assetPrefix}/b1168.png`, `${assetPrefix}/d9934.png`],
        wooden: [`${assetPrefix}/0b547.png`, `${assetPrefix}/c90ab.png`, `${assetPrefix}/b1168.png`, `${assetPrefix}/d9934.png`],
      }},
    ],
    packagingOptions: [
      { id: 'standard', label: 'Standard Box included', price: 0 },
      { id: 'pale-blue', label: 'Premium Pale Blue Box', price: 129 },
      { id: 'ribbon-black', label: 'Premium With Ribbon Black Box', price: 339 },
    ],
    chocolateAddon: true,
    giftNoteEnabled: true,
    relatedProducts: [
      { name: 'Lotus Dawn (Bubbly Pink)', img: `${assetPrefix}/b4ad9.png`, price: '₹749', slug: 'lotus-dawn' },
      { name: 'Lotus Dawn (OG Blue)', img: `${assetPrefix}/73778.png`, price: '₹749', slug: 'lotus-dawn' },
      { name: 'Lotus Garden Montage', img: `${assetPrefix}/960e1.png`, price: '₹1,100', slug: 'lotus-garden-montage' },
    ],
  },
  'lotus-dawn': {
    name: 'Lotus Dawn', price: 749, rating: '4.6', reviews: 7,
    images: [`${assetPrefix}/47c09.png`, `${assetPrefix}/85d03.png`, `${assetPrefix}/c94fc.png`, `${assetPrefix}/80e13.png`],
    desc: 'Sunrise lotus in cream soy wax, scented with jasmine and sandalwood. Hand-poured at dawn in small batches — the first light of morning captured in wax.',
    badge: 'Pre-Order', badgeColor: '#d4871a',
    cat: 'Diwali Specials', catLink: '/festive-drops', express: false,
    details: [
      { label: 'Wax Type', value: '100% soy wax · cream base' },
      { label: 'Fragrance', value: 'Jasmine · sandalwood · morning dew' },
      { label: 'Burn Time', value: '14–18 hours' },
      { label: 'Size', value: '220g lotus sculpture' },
      { label: 'Wick', value: 'Organic cotton, lead-free' },
    ],
    fragranceNotes: {
      top: ['Jasmine', 'Morning Dew'],
      heart: ['Lotus', 'Rose Water'],
      base: ['Sandalwood', 'Warm Soy'],
    },
    waxColors: [
      { id: 'blue', label: 'OG Blue', hex: '#6FBFBC', images: {
        cotton: [`${assetPrefix}/37b5d.png`, `${assetPrefix}/ee777.png`, `${assetPrefix}/2dbaf.png`, `${assetPrefix}/f2bc5.png`],
        wooden: [`${assetPrefix}/37b5d.png`, `${assetPrefix}/ee777.png`, `${assetPrefix}/2dbaf.png`, `${assetPrefix}/f2bc5.png`],
      }},
      { id: 'pink', label: 'Bubbly Pink', hex: '#D98BA0', images: {
        cotton: [`${assetPrefix}/47c09.png`, `${assetPrefix}/85d03.png`, `${assetPrefix}/c94fc.png`, `${assetPrefix}/80e13.png`],
        wooden: [`${assetPrefix}/47c09.png`, `${assetPrefix}/85d03.png`, `${assetPrefix}/c94fc.png`, `${assetPrefix}/80e13.png`],
      }},
      { id: 'white', label: 'Classic Ivory', hex: '#EDE0C8', images: {
        cotton: [`${assetPrefix}/2d03e.png`, `${assetPrefix}/88c13.png`, `${assetPrefix}/6d78b.png`, `${assetPrefix}/0046d.png`],
        wooden: [`${assetPrefix}/2d03e.png`, `${assetPrefix}/88c13.png`, `${assetPrefix}/6d78b.png`, `${assetPrefix}/0046d.png`],
      }},
    ],
    packagingOptions: [
      { id: 'standard', label: 'Standard Box included', price: 0 },
      { id: 'pale-blue', label: 'Premium Pale Blue Box', price: 129 },
      { id: 'ribbon-black', label: 'Premium With Ribbon Black Box', price: 339 },
    ],
    chocolateAddon: true,
    giftNoteEnabled: true,
    relatedProducts: [
      { name: 'Water Lily Lake', img: `${assetPrefix}/64561.png`, price: '₹799', slug: 'water-lily-lake' },
      { name: 'Peony Lake', img: `${assetPrefix}/85d04.png`, price: '₹699', slug: 'peony-lake' },
      { name: 'Lotus Garden Montage', img: `${assetPrefix}/960e1.png`, price: '₹1,100', slug: 'lotus-garden-montage' },
    ],
  },
  'lotus-garden-montage': {
    name: 'Lotus Garden Montage', price: 1100, rating: '5.0', reviews: 3,
    images: [`${assetPrefix}/73a26.png`, `${assetPrefix}/259cb.png`, `${assetPrefix}/2d14e.png`, `${assetPrefix}/a7b3f.png`],
    desc: 'A panoramic lotus garden rendered in artisan-grade botanical embeds. Hand-poured in strictly limited batches — each piece a collectible tableau of India\'s most sacred bloom.',
    badge: 'Pre-Order', badgeColor: '#d4871a',
    cat: 'Diwali Specials', catLink: '/festive-drops', express: false,
    details: [
      { label: 'Wax Type', value: '100% soy wax · ivory base' },
      { label: 'Fragrance', value: 'Lotus · jasmine · vetiver · sandalwood' },
      { label: 'Burn Time', value: '20–26 hours' },
      { label: 'Size', value: '480g panoramic tray · 28cm wide' },
      { label: 'Finish', value: 'Artisan botanical embeds, hand-placed' },
      { label: 'Wick', value: 'Organic cotton, lead-free' },
    ],
    fragranceNotes: {
      top: ['Lotus', 'Jasmine'],
      heart: ['Vetiver', 'Rose'],
      base: ['Sandalwood', 'Amber Musk'],
    },
    waxColors: [
      { id: 'blue', label: 'OG Blue', hex: '#6FBFBC', images: {
        cotton: [`${assetPrefix}/73a26.png`, `${assetPrefix}/259cb.png`, `${assetPrefix}/2d14e.png`, `${assetPrefix}/a7b3f.png`],
        wooden: [`${assetPrefix}/73a26.png`, `${assetPrefix}/259cb.png`, `${assetPrefix}/2d14e.png`, `${assetPrefix}/a7b3f.png`],
      }},
      { id: 'pink', label: 'Bubbly Pink', hex: '#D98BA0', images: {
        cotton: [`${assetPrefix}/e78b9.png`, `${assetPrefix}/8a02e.png`, `${assetPrefix}/7fabd.png`, `${assetPrefix}/72add.png`],
        wooden: [`${assetPrefix}/e78b9.png`, `${assetPrefix}/8a02e.png`, `${assetPrefix}/7fabd.png`, `${assetPrefix}/72add.png`],
      }},
      { id: 'golden', label: 'Golden Yellow', hex: '#D4A838', images: {
        cotton: [`${assetPrefix}/18f01.png`, `${assetPrefix}/144b2.png`, `${assetPrefix}/704d0.png`, `${assetPrefix}/f0caf.png`],
        wooden: [`${assetPrefix}/18f01.png`, `${assetPrefix}/144b2.png`, `${assetPrefix}/704d0.png`, `${assetPrefix}/f0caf.png`],
      }},
    ],
    packagingOptions: [
      { id: 'standard', label: 'Standard Box included', price: 0 },
      { id: 'pale-blue', label: 'Premium Pale Blue Box', price: 129 },
      { id: 'ribbon-black', label: 'Premium With Ribbon Black Box', price: 339 },
    ],
    chocolateAddon: true,
    giftNoteEnabled: true,
    relatedProducts: [
      { name: 'Lotus Dawn', img: `${assetPrefix}/73778.png`, price: '₹749', slug: 'lotus-dawn' },
      { name: 'Water Lily Lake', img: `${assetPrefix}/64561.png`, price: '₹799', slug: 'water-lily-lake' },
      { name: 'Peony Lake', img: `${assetPrefix}/85d04.png`, price: '₹699', slug: 'peony-lake' },
    ],
  },
  'pumpkin-patch-glass': {
    name: 'Midnight Bat Glass', price: 529, rating: '4.8', reviews: 12,
    images: [`${assetPrefix}/3b53d.png`, `${assetPrefix}/60b73.png`, `${assetPrefix}/1eec8.png`, `${assetPrefix}/ea5e9.png`],
    desc: 'Dark violet gel wax in a wide-mouth glass vessel with a bat wax embed perched dramatically on top. Scented with spiced clove, black plum, and smoky amber — midnight in a jar.',
    badge: 'Halloween', badgeColor: '#b85c00',
    cat: 'Halloween & Zodiac', catLink: '/category/halloween', express: false,
    details: [
      { label: 'Wax Type', value: 'Crystal gel wax · deep violet base' },
      { label: 'Fragrance', value: 'Spiced clove · black plum · smoky amber' },
      { label: 'Burn Time', value: '18–22 hours' },
      { label: 'Size', value: '280g wide-mouth glass vessel' },
      { label: 'Embed', value: 'Bat wax sculpture, hand-placed' },
      { label: 'Wick', value: 'Organic cotton, lead-free' },
    ],
    fragranceNotes: {
      top: ['Spiced Clove', 'Black Plum'],
      heart: ['Dark Berry', 'Night Jasmine'],
      base: ['Smoky Amber', 'Warm Musk'],
    },
    relatedProducts: [
      { name: 'Sorcerer Elixir Skull', img: `${assetPrefix}/f2ff6.png`, price: '₹499', slug: 'sorcerer-elixir-skull' },
      { name: 'Blueberry Gel Glass', img: `${assetPrefix}/da24a.png`, price: '₹449', slug: 'blueberry-gel-glass' },
      { name: 'Electric Trio Gift Set', img: `${assetPrefix}/13945.png`, price: '₹1,389', slug: 'halloween-electric-trio' },
    ],
  },
  'sorcerer-elixir-skull': {
    name: 'Sorcerer Elixir Skull', price: 499, rating: '4.9', reviews: 8,
    images: [`${assetPrefix}/f2ff6.png`, `${assetPrefix}/f2ff6.png`, `${assetPrefix}/f2ff6.png`, `${assetPrefix}/f2ff6.png`],
    desc: 'A skull-shaped soy wax candle filled with black-cherry elixir. Dark and theatrical — scented with black rose, vetiver, and a trace of smoked oud.',
    badge: 'Halloween', badgeColor: '#b85c00',
    cat: 'Halloween & Zodiac', catLink: '/category/halloween', express: false,
    details: [
      { label: 'Wax Type', value: '100% soy wax · obsidian matte finish' },
      { label: 'Fragrance', value: 'Black rose · vetiver · smoked oud' },
      { label: 'Burn Time', value: '14–18 hours' },
      { label: 'Size', value: '180g skull-cast vessel' },
      { label: 'Embed', value: 'Crystal skull, hand-set' },
      { label: 'Wick', value: 'Wooden wick, lead-free' },
    ],
    fragranceNotes: {
      top: ['Black Rose', 'Dark Cherry'],
      heart: ['Vetiver', 'Leather'],
      base: ['Smoked Oud', 'Black Musk'],
    },
    relatedProducts: [
      { name: 'Midnight Bat Glass', img: `${assetPrefix}/694c4.png`, price: '₹529', slug: 'pumpkin-patch-glass' },
      { name: 'Blueberry Gel Glass', img: `${assetPrefix}/da24a.png`, price: '₹449', slug: 'blueberry-gel-glass' },
      { name: 'Electric Trio Gift Set', img: `${assetPrefix}/13945.png`, price: '₹1,389', slug: 'halloween-electric-trio' },
    ],
  },
  'blueberry-gel-glass': {
    name: 'Blueberry Gel Glass', price: 449, rating: '4.7', reviews: 19,
    images: [`${assetPrefix}/da24a.png`, `${assetPrefix}/da24a.png`, `${assetPrefix}/da24a.png`, `${assetPrefix}/da24a.png`],
    desc: 'Wild berry violet gel wax in a sleek glass vessel. Intensely pigmented indigo with floating berry embeds — scented with wild blueberry, violet leaf, and bergamot.',
    badge: 'Halloween', badgeColor: '#b85c00',
    cat: 'Halloween & Zodiac', catLink: '/category/halloween', express: false,
    details: [
      { label: 'Wax Type', value: 'Crystal gel wax · indigo-violet base' },
      { label: 'Fragrance', value: 'Wild blueberry · violet leaf · bergamot' },
      { label: 'Burn Time', value: '16–20 hours' },
      { label: 'Size', value: '240g cylindrical glass vessel' },
      { label: 'Embed', value: 'Dried berry botanicals, suspended' },
      { label: 'Wick', value: 'Organic cotton, lead-free' },
    ],
    fragranceNotes: {
      top: ['Wild Blueberry', 'Bergamot'],
      heart: ['Violet Leaf', 'Black Currant'],
      base: ['Musk', 'Cedarwood'],
    },
    relatedProducts: [
      { name: 'Midnight Bat Glass', img: `${assetPrefix}/694c4.png`, price: '₹529', slug: 'pumpkin-patch-glass' },
      { name: 'Sorcerer Elixir Skull', img: `${assetPrefix}/f2ff6.png`, price: '₹499', slug: 'sorcerer-elixir-skull' },
      { name: 'Electric Trio Gift Set', img: `${assetPrefix}/13945.png`, price: '₹1,389', slug: 'halloween-electric-trio' },
    ],
  },
  'halloween-electric-trio': {
    name: 'Electric Trio Gift Set', price: 1389, rating: '5.0', reviews: 4,
    images: [`${assetPrefix}/13945.png`, `${assetPrefix}/694c4.png`, `${assetPrefix}/f2ff6.png`, `${assetPrefix}/da24a.png`],
    desc: 'Collector\'s set of three Halloween gel vessels — Midnight Bat Glass, Sorcerer Skull, and Blueberry Gel — packaged in a velvet-lined gift box with a hand-stamped wax seal.',
    badge: 'Halloween', badgeColor: '#b85c00',
    cat: 'Halloween & Zodiac', catLink: '/category/halloween', express: false,
    details: [
      { label: 'Contents', value: 'Midnight Bat Glass · Sorcerer Skull · Blueberry Gel' },
      { label: 'Total Wax Weight', value: '700g across 3 vessels' },
      { label: 'Burn Time', value: '14–22 hours per vessel' },
      { label: 'Packaging', value: 'Velvet-lined gift box, hand-stamped wax seal' },
      { label: 'Edition', value: 'Limited Halloween collector set' },
      { label: 'Wick', value: 'Mixed: cotton + wooden' },
    ],
    fragranceNotes: {
      top: ['Spiced Apple', 'Black Cherry', 'Blueberry'],
      heart: ['Cinnamon', 'Dark Rose', 'Violet'],
      base: ['Smoked Amber', 'Black Musk', 'Cedar'],
    },
    relatedProducts: [
      { name: 'Midnight Bat Glass', img: `${assetPrefix}/694c4.png`, price: '₹529', slug: 'pumpkin-patch-glass' },
      { name: 'Sorcerer Elixir Skull', img: `${assetPrefix}/f2ff6.png`, price: '₹499', slug: 'sorcerer-elixir-skull' },
      { name: 'Blueberry Gel Glass', img: `${assetPrefix}/da24a.png`, price: '₹449', slug: 'blueberry-gel-glass' },
    ],
  },
  'ladoo-stack': {
    name: 'Ladoo Stack', price: 249, rating: '4.9', reviews: 35,
    images: [
      `${assetPrefix}/d21c5.png`,
      `${assetPrefix}/d21c5.png`,
      `${assetPrefix}/d21c5.png`,
    ],
    desc: 'Golden besan ladoo with saffron strands, artfully placed on a hand-finished brass thali. Scented with kesar and rose attar.',
    badge: 'Pre-Order', badgeColor: '#d4871a',
    cat: 'Diwali Specials', catLink: '/festive-drops', express: false,
    details: [
      { label: 'Wax Type', value: '100% soy wax · golden base' },
      { label: 'Fragrance', value: 'Kesar · rose attar · besan' },
      { label: 'Burn Time', value: '10–12 hours' },
      { label: 'Size', value: '120g ladoo × 3, on tray' },
      { label: 'Wick', value: 'Organic cotton, lead-free' },
    ],
    fragranceNotes: {
      top: ['Rose Attar', 'Kesar'],
      heart: ['Besan', 'Cardamom'],
      base: ['Warm Soy', 'Amber Musk'],
    },
    relatedProducts: [
      { name: 'Kaju Katli Quartet', img: `${assetPrefix}/ce96a.png`, price: '₹299', slug: 'kaju-katli-quartet' },
      { name: 'Modak Quartet', img: `${assetPrefix}/4bc1c.png`, price: '₹299', slug: 'modak-quartet' },
      { name: 'Mithai Dabba Set', img: `${assetPrefix}/5a082.png`, price: '₹549', slug: 'mithai-dabba-set' },
    ],
  },
};

const defaultProduct: Product = products['ladoo-stack'];

const TIER_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  top:   { bg: '#fef3c7', text: '#92400e', label: 'Top Notes' },
  heart: { bg: '#fce7f3', text: '#9d174d', label: 'Heart Notes' },
  base:  { bg: '#ede9fe', text: '#5b21b6', label: 'Base Notes' },
};

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = (slug && products[slug]) ? products[slug] : defaultProduct;
  const { addItem, openCart } = useCart(); // openCart used by handleQuickAdd
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState('');
  const [deliveryMsg, setDeliveryMsg] = useState<string | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Customization state
  const [selectedColor, setSelectedColor] = useState<string>(() => product.waxColors?.[0]?.id ?? '');
  const [selectedWick, setSelectedWick] = useState<'cotton' | 'wooden'>('cotton');
  const [selectedPackaging, setSelectedPackaging] = useState<string>(() => product.packagingOptions?.[0]?.id ?? '');
  const [chocolateQty, setChocolateQty] = useState(0);
  const [giftNote, setGiftNote] = useState('');

  // Derived values
  const activeColor = product.waxColors?.find(c => c.id === selectedColor);
  const activeImages = activeColor
    ? activeColor.images[selectedWick]
    : product.images;
  const displayName = activeColor ? `${product.name} (${activeColor.label})` : product.name;
  const packagingUpcharge = product.packagingOptions?.find(p => p.id === selectedPackaging)?.price ?? 0;
  const totalPrice = (product.price + packagingUpcharge) * qty + chocolateQty * 149;

  // Mithai-shaped and ready-to-ship products don't offer the custom pour CTA
  const NON_CUSTOMIZABLE = new Set([
    'kaju-katli-quartet', 'modak-quartet', 'nankati-bharati',
    'ladoo-stack', 'mithai-dabba-set', 'six-minis-tray',
    'cutting-chai-candle', 'filter-coffee-candle',
    'the-diwali-starter', 'the-chai-lover-kit',
  ]);
  const isCustomizable = !NON_CUSTOMIZABLE.has(slug ?? '') && product.cat !== 'Ready to Shop';

  // Reset state when product changes
  useEffect(() => {
    setDeliveryMsg(null);
    setPincode('');
    setSelectedColor(product.waxColors?.[0]?.id ?? '');
    setSelectedWick('cotton');
    setSelectedPackaging(product.packagingOptions?.[0]?.id ?? '');
    setChocolateQty(0);
    setGiftNote('');
  }, [slug]);

  // Show sticky bar once the desktop CTA scrolls out of view
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function handleAddToCart() {
    setOrderModalOpen(true);
  }

  function handleQuickAdd() {
    addItem({ slug: slug ?? product.name, name: displayName, price: totalPrice, img: activeImages[0] });
    openCart();
  }

  function checkPincode() {
    if (!/^\d{6}$/.test(pincode)) {
      setDeliveryMsg('Please enter a valid 6-digit pincode.');
      return;
    }
    const d = new Date();
    d.setDate(d.getDate() + 3);
    const day = d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
    if (product.express) {
      setDeliveryMsg(`⚡ Express Shipping Available — Estimated delivery by ${day}`);
    } else {
      d.setDate(d.getDate() + 2);
      const day2 = d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
      setDeliveryMsg(`📦 Standard Delivery Available — Estimated by ${day2}`);
    }
  }

  return (
    <div className="min-h-screen bg-[#faf6f0] pb-20 lg:pb-0">
      <Nav />
      <NavigationHeader
        crumbs={[
          { label: 'Home', to: '/' },
          { label: product.cat, to: product.catLink },
          { label: product.name },
        ]}
        backContext={product.cat}
      />

      {/* Hero */}
      <div className="py-0 md:py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-16 lg:px-20 items-start">

          {/* ── Gallery — full-bleed on mobile, contained on desktop ── */}
          <div className="w-full lg:flex-1 px-0 lg:px-0">
            <div className="px-4 sm:px-6 lg:px-0 pt-6 lg:pt-0 pb-4 lg:pb-0">
              <MediaGallery
                images={activeImages}
                alt={displayName}
                badge={product.badge}
                badgeColor={product.badgeColor}
              />
            </div>
          </div>

          {/* ── Details ── */}
          <div className="flex flex-col gap-6 w-full lg:w-[520px] shrink-0 px-4 sm:px-6 lg:px-0 pb-8 lg:pb-0 lg:pt-0 pt-2">
            <div className="flex flex-col gap-3">
              <span
                className="text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[1px] w-fit"
                style={{ backgroundColor: product.badgeColor, fontFamily: 'Manrope' }}
              >
                {product.badge}
              </span>
              <h1 className="text-[#2c1a10] text-[34px] md:text-[40px] font-bold leading-tight" style={{ fontFamily: 'Playfair Display' }}>{displayName}</h1>
              <p className="text-[#2c1810] text-[28px] font-bold" style={{ fontFamily: 'Playfair Display' }}>₹{product.price + packagingUpcharge}</p>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <img key={i} src={starIcon} alt="★" className="w-3.5 h-3.5" />
                  ))}
                </div>
                <p className="text-[#2c1a10] text-[13px] font-bold" style={{ fontFamily: 'Manrope' }}>{product.rating} ★ · {product.reviews} reviews</p>
              </div>
              <p className="text-[#7a5c44] text-[15px] leading-relaxed" style={{ fontFamily: 'Manrope' }}>{product.desc}</p>
            </div>

            {product.express && (
              <div className="flex items-center gap-2">
                <span className="bg-[#218c21] text-white text-[10px] font-bold px-2 py-1 rounded" style={{ fontFamily: 'Manrope' }}>⚡ Express 24h</span>
                <p className="text-[#2c1a10] text-[13px] font-semibold" style={{ fontFamily: 'Manrope' }}>In stock · Ships from Mumbai studio</p>
              </div>
            )}

            {/* ── WAX COLOR ── */}
            {product.waxColors && (
              <div className="flex flex-col gap-2.5">
                <p className="text-[#7a5c44] text-[11px] font-bold tracking-[1.5px] uppercase" style={{ fontFamily: 'Manrope' }}>Wax Color</p>
                <div className="flex gap-3">
                  {product.waxColors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c.id)}
                      title={c.label}
                      aria-label={c.label}
                      className={`w-9 h-9 rounded-full transition-all duration-200 shrink-0 ${selectedColor === c.id ? 'ring-2 ring-[#d97706] ring-offset-2' : 'ring-1 ring-[#e2ceae] hover:ring-[#d97706]'}`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── WICK BASE ── */}
            {product.waxColors && (
              <div className="flex flex-col gap-2.5">
                <p className="text-[#7a5c44] text-[11px] font-bold tracking-[1.5px] uppercase" style={{ fontFamily: 'Manrope' }}>Wick Base</p>
                <div className="flex gap-2">
                  {(['cotton', 'wooden'] as const).map((w) => (
                    <button
                      key={w}
                      onClick={() => setSelectedWick(w)}
                      className={`px-5 py-2.5 rounded-full text-[13px] font-bold transition-all ${selectedWick === w ? 'bg-[#d97706] text-white' : 'bg-white border border-[#e2ceae] text-[#2c1a10] hover:border-[#d97706]'}`}
                      style={{ fontFamily: 'Manrope' }}
                    >
                      {w === 'cotton' ? 'Cotton Wick' : 'Wooden Wick'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── CHOCOLATE ADD-ON ── */}
            {product.chocolateAddon && (
              <div className="flex flex-col gap-2.5">
                <p className="text-[#7a5c44] text-[11px] font-bold tracking-[1.5px] uppercase" style={{ fontFamily: 'Manrope' }}>Add Chocolate (Ferrero Rocher) <span className="text-[#d97706]">+₹149 each</span></p>
                <div className="flex items-center gap-3 border border-[#e2ceae] rounded-full px-4 py-2 w-fit">
                  <button onClick={() => setChocolateQty(Math.max(0, chocolateQty - 1))} className="text-[#2c1a10] text-[18px] font-bold w-6 text-center leading-none">−</button>
                  <span className="text-[#2c1a10] text-[15px] font-bold w-8 text-center" style={{ fontFamily: 'Manrope' }}>{chocolateQty}</span>
                  <button onClick={() => setChocolateQty(chocolateQty + 1)} className="text-[#2c1a10] text-[18px] font-bold w-6 text-center leading-none">+</button>
                </div>
              </div>
            )}

            {/* ── PACKAGING ── */}
            {product.packagingOptions && (
              <div className="flex flex-col gap-2.5">
                <p className="text-[#7a5c44] text-[11px] font-bold tracking-[1.5px] uppercase" style={{ fontFamily: 'Manrope' }}>Packaging</p>
                <div className="flex flex-wrap gap-2">
                  {product.packagingOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedPackaging(opt.id)}
                      className={`px-4 py-2.5 rounded-full text-[12px] font-semibold transition-all ${selectedPackaging === opt.id ? 'bg-[#d97706] text-white' : 'bg-white border border-[#e2ceae] text-[#2c1a10] hover:border-[#d97706]'}`}
                      style={{ fontFamily: 'Manrope' }}
                    >
                      {opt.label}{opt.price > 0 ? ` +₹${opt.price}` : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── GIFT NOTE ── */}
            {product.giftNoteEnabled && (
              <div className="flex flex-col gap-2.5">
                <p className="text-[#7a5c44] text-[11px] font-bold tracking-[1.5px] uppercase" style={{ fontFamily: 'Manrope' }}>Gift Note</p>
                <input
                  type="text"
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="Add a handwritten note for gifting"
                  className="border border-[#e2ceae] rounded-[10px] px-4 py-3 text-[13px] text-[#2c1a10] bg-white outline-none focus:border-[#d97706] placeholder:text-[#b9a08c] transition-colors"
                  style={{ fontFamily: 'Manrope' }}
                />
              </div>
            )}

            {/* ── QUANTITY ── */}
            <div className="flex flex-col gap-2.5">
              <p className="text-[#7a5c44] text-[11px] font-bold tracking-[1.5px] uppercase" style={{ fontFamily: 'Manrope' }}>Quantity</p>
              <div className="flex items-center gap-3 border border-[#e2ceae] rounded-full px-4 py-2 w-fit">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-[#2c1a10] text-[18px] font-bold w-6 text-center leading-none">−</button>
                <span className="text-[#2c1a10] text-[16px] font-bold w-8 text-center" style={{ fontFamily: 'Manrope' }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="text-[#2c1a10] text-[18px] font-bold w-6 text-center leading-none">+</button>
              </div>
            </div>

            {/* ── CTAs ── */}
            <div ref={ctaRef} className="flex flex-col gap-2.5">
              {/* 1. Add to Cart */}
              <button
                onClick={handleQuickAdd}
                className="py-4 rounded-full text-[15px] font-bold uppercase tracking-[1px] transition-all bg-[#d97706] text-white hover:bg-[#b86000]"
                style={{ fontFamily: 'Manrope' }}
              >
                ADD TO CART — ₹{totalPrice}
              </button>
              {/* 2. Customize — hidden for mithai / ready-to-ship */}
              {isCustomizable && (
                <button
                  onClick={() => navigate(`/customize/${slug ?? ''}`, { state: { product: { id: slug, name: displayName, price: product.price, img: activeImages[0] } } })}
                  className="py-3.5 rounded-full text-[13px] font-bold uppercase tracking-[0.5px] border border-[#2c1a10] text-[#2c1a10] hover:bg-[#2c1a10] hover:text-white transition-colors"
                  style={{ fontFamily: 'Manrope' }}
                >
                  🎁 CUSTOMIZE THIS CANDLE +₹99
                </button>
              )}
              {/* 3. Get a Quote */}
              <button
                onClick={handleAddToCart}
                className="py-3.5 rounded-full text-[13px] font-bold uppercase tracking-[0.5px] border border-[#e2ceae] text-[#7a5c44] hover:border-[#2c1a10] hover:text-[#2c1a10] transition-colors flex items-center justify-center gap-2"
                style={{ fontFamily: 'Manrope' }}
              >
                GET A QUOTE
                <span className="bg-[#25D366] text-white w-6 h-6 rounded-full flex items-center justify-center text-[12px] shrink-0">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.996 0C5.373 0 0 5.373 0 11.996c0 2.117.554 4.099 1.523 5.824L.048 23.952l6.278-1.451A11.96 11.96 0 0 0 11.996 24c6.623 0 12-5.373 12-12.004C23.996 5.373 18.62 0 11.996 0zm0 21.868a9.87 9.87 0 0 1-5.032-1.377l-.36-.214-3.733.863.933-3.614-.235-.372A9.862 9.862 0 0 1 2.13 12c0-5.45 4.434-9.884 9.866-9.884 5.44 0 9.875 4.434 9.875 9.884 0 5.44-4.435 9.868-9.875 9.868z"/></svg>
                </span>
              </button>
            </div>

            {/* ── Pincode Delivery Checker ── */}
            <div className="bg-[#fef8f0] border border-[#e2ceae] rounded-[12px] p-4">
              <p className="text-[#2c1a10] text-[13px] font-bold mb-3" style={{ fontFamily: 'Manrope' }}>📍 Check Delivery Date</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => { setPincode(e.target.value.replace(/\D/g, '').slice(0, 6)); setDeliveryMsg(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && checkPincode()}
                  placeholder="Enter 6-digit pincode"
                  className="flex-1 border border-[#e2ceae] rounded-full px-4 py-2 text-[14px] text-[#2c1a10] outline-none focus:border-[#d97706] bg-white"
                  style={{ fontFamily: 'Manrope' }}
                />
                <button
                  onClick={checkPincode}
                  className="bg-[#2c1a10] text-white text-[13px] font-bold px-5 py-2 rounded-full hover:bg-[#d97706] transition-colors"
                  style={{ fontFamily: 'Manrope' }}
                >
                  Check
                </button>
              </div>
              {deliveryMsg && (
                <p className={`text-[13px] font-semibold mt-2 ${deliveryMsg.startsWith('⚡') ? 'text-[#218c21]' : deliveryMsg.startsWith('📦') ? 'text-[#d97706]' : 'text-red-500'}`} style={{ fontFamily: 'Manrope' }}>
                  {deliveryMsg}
                </p>
              )}
            </div>

            {/* Product Details */}
            <div className="border-t border-[#e2ceae] pt-5">
              <h3 className="text-[#2c1a10] text-[16px] font-bold mb-4" style={{ fontFamily: 'Manrope' }}>Product Details</h3>
              <div className="flex flex-col gap-3">
                {product.details.map((d) => {
                  const value = d.label === 'Wick' && product.waxColors
                    ? (selectedWick === 'wooden' ? 'Natural wooden wick, clean crackling burn' : 'Organic cotton, lead-free')
                    : d.value;
                  return (
                    <div key={d.label} className="flex gap-3">
                      <p className="text-[#7a5c44] text-[13px] font-bold min-w-[120px]" style={{ fontFamily: 'Manrope' }}>{d.label}</p>
                      <p className="text-[#2c1a10] text-[13px]" style={{ fontFamily: 'Manrope' }}>{value}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Fragrance / Scent Pyramid ── */}
            {product.fragranceNotes && (
              <div className="border-t border-[#e2ceae] pt-5">
                <h3 className="text-[#2c1a10] text-[16px] font-bold mb-4" style={{ fontFamily: 'Manrope' }}>Fragrance Profile</h3>
                <div className="flex flex-col gap-4">
                  {(['top', 'heart', 'base'] as const).map((tier) => {
                    const { bg, text, label } = TIER_COLORS[tier];
                    const notes = product.fragranceNotes![tier];
                    return (
                      <div key={tier} className="flex items-start gap-3">
                        <div className="min-w-[90px]">
                          <span
                            className="text-[10px] font-bold uppercase tracking-[0.8px] px-2.5 py-1 rounded-full"
                            style={{ backgroundColor: bg, color: text, fontFamily: 'Manrope' }}
                          >
                            {label}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-0.5">
                          {notes.map((note) => (
                            <span
                              key={note}
                              className="text-[12px] font-semibold px-3 py-1 rounded-full border"
                              style={{
                                backgroundColor: `${bg}80`,
                                borderColor: `${text}30`,
                                color: text,
                                fontFamily: 'Manrope',
                              }}
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How Customization Works */}
      <section className="bg-[#fef8f0] py-16 px-6 md:px-20">
        <div className="flex items-center gap-2 mb-2">
          <img src={ellipseIcon} alt="" className="w-1.5 h-1.5" />
          <p className="text-[#2c1810] text-[11px] font-bold tracking-[3px] uppercase" style={{ fontFamily: 'Manrope' }}>Custom Pour Corner</p>
        </div>
        <h2 className="text-[#2c1a10] text-[30px] font-bold mb-10" style={{ fontFamily: 'Playfair Display' }}>How Customization Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Choose Your Shapes', desc: 'Select up to 3 embeds from our seasonal mould catalogue. New shapes unlock as new moulds enter the studio.' },
            { step: '2', title: 'Add Packaging', desc: 'Upgrade to premium packaging: letterpress labels, silk ribbon, or hand-dipped wax seal for a perfect unboxing moment.' },
            { step: '3', title: 'Review & Checkout', desc: 'Your custom configuration is summarized before payment. Personalized candles ship within 48h of order confirmation.' },
          ].map((step) => (
            <div key={step.step} className="flex gap-4 items-start">
              <div className="bg-[#d97706] text-white w-9 h-9 rounded-full flex items-center justify-center text-[16px] font-bold shrink-0" style={{ fontFamily: 'Manrope' }}>{step.step}</div>
              <div>
                <h4 className="text-[#2c1a10] text-[16px] font-bold mb-2" style={{ fontFamily: 'Manrope' }}>{step.title}</h4>
                <p className="text-[#7a5c44] text-[14px] leading-relaxed" style={{ fontFamily: 'Manrope' }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Related Products — matches Figma node 35:3662 ── */}
      <section className="py-[64px] px-6 md:px-[80px]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-[8px] mb-0">
            <img src={ellipseIcon} alt="" className="w-[6px] h-[6px] shrink-0" />
            <p className="text-[#2c1810] text-[11px] font-bold tracking-[3px] uppercase" style={{ fontFamily: 'Manrope' }}>
              You May Also Like
            </p>
          </div>
          <h2 className="text-[#2c1a10] text-[30px] font-bold leading-[45px] mt-[8px] mb-[32px]" style={{ fontFamily: 'Playfair Display' }}>
            Related Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
            {product.relatedProducts.map((rp, i) => (
              <Link
                key={`${rp.slug}-${i}`}
                to={`/product/${rp.slug}`}
                className="bg-[#fef8f0] border border-[#e2ceae] rounded-[12px] overflow-hidden hover:shadow-lg transition-all duration-300 block group"
              >
                <div className="h-[200px] overflow-hidden">
                  <img
                    src={rp.img}
                    alt={rp.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-[16px] flex items-center justify-between">
                  <p className="text-[#2c1a10] text-[16px] font-bold leading-[24px]" style={{ fontFamily: 'Playfair Display' }}>
                    {rp.name}
                  </p>
                  <p className="text-[#2b170f] text-[15px] font-bold leading-[22.5px] shrink-0 ml-3" style={{ fontFamily: 'Manrope' }}>
                    {rp.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* ── Sticky Mobile Action Bar ── */}
      {showStickyBar && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#fdf6ed] border-t border-[#e2ceae] shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="flex items-center gap-2 px-4 py-3 min-w-0">
            <div className="shrink-0 w-[64px]">
              <p className="text-[#2c1a10] text-[17px] font-bold leading-tight" style={{ fontFamily: 'Playfair Display' }}>₹{product.price + packagingUpcharge}</p>
              <p className="text-[#7a5c44] text-[10px] leading-tight" style={{ fontFamily: 'Manrope' }}>per piece</p>
            </div>
            <button
              onClick={handleQuickAdd}
              aria-label={`Add ${displayName} to cart — ₹${totalPrice}`}
              className="flex-1 min-w-0 py-3 rounded-full text-[13px] font-bold uppercase tracking-[0.5px] transition-colors bg-[#d97706] text-white hover:bg-[#b86000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d97706] focus-visible:ring-offset-2 whitespace-nowrap overflow-hidden text-ellipsis"
              style={{ fontFamily: 'Manrope' }}
            >
              ADD TO CART — ₹{totalPrice}
            </button>
            {isCustomizable && (
              <button
                onClick={() => navigate(`/customize/${slug ?? ''}`, { state: { product: { id: slug, name: displayName, price: product.price, img: activeImages[0] } } })}
                aria-label="Customize this candle (+₹99)"
                title="Customize +₹99"
                className="shrink-0 border border-[#2c1a10] text-[#2c1a10] w-11 h-11 rounded-full text-[18px] flex items-center justify-center hover:bg-[#2c1a10] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2c1a10] focus-visible:ring-offset-2"
              >
                🎁
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Order Request Modal ── */}
      <OrderRequestModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        productName={product.name}
        productImg={product.images[0]}
        items={[
          { label: product.name, price: product.price * qty },
          ...(qty > 1 ? [{ label: `Qty × ${qty}`, price: 0 }] : []),
        ]}
        total={product.price * qty}
      />
    </div>
  );
}
