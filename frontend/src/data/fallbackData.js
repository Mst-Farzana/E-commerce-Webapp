export const fallbackDiscounts = [
  {
    _id: 'fallback-discount-1',
    name: 'T-shirt',
    offer: 2,
    img: 'https://img.icons8.com/arcade/64/t-shirt.png',
  },
  {
    _id: 'fallback-discount-2',
    name: 'Shoes',
    offer: 3,
    img: 'https://img.icons8.com/color-glass/48/women-shoe-diagonal-view.png',
  },
  {
    _id: 'fallback-discount-3',
    name: 'Jewelry',
    offer: 5,
    img: 'https://img.icons8.com/color/48/jewelry.png',
  },
  {
    _id: 'fallback-discount-4',
    name: 'Watch',
    offer: 4,
    img: 'https://img.icons8.com/3d-fluency/50/watches-front-view.png',
  },
  {
    _id: 'fallback-discount-5',
    name: 'Bag',
    offer: 1,
    img: 'https://img.icons8.com/3d-fluency/50/bag-front-view.png',
  },
];

export const fallbackCategoryItems = [
  {
    _id: 'fallback-item-1',
    category: 'Dress',
    name: 'Floral Summer Dress',
    details: 'Lightweight floral dress perfect for summer outings.',
    img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=600&fit=crop',
    price: 3200,
  },
  {
    _id: 'fallback-item-2',
    category: 'Cosmetics',
    name: 'Matte Lipstick',
    details: 'Long-lasting matte lipstick for everyday wear.',
    img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=600&fit=crop',
    price: 600,
  },
  {
    _id: 'fallback-item-3',
    category: 'Jewelry',
    name: 'Gold Necklace',
    details: 'Elegant gold-plated necklace with fine details.',
    img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=600&fit=crop',
    price: 5800,
  },
  {
    _id: 'fallback-item-4',
    category: 'Bag',
    name: 'Leather Handbag',
    details: 'Premium leather handbag with multiple compartments.',
    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=600&fit=crop',
    price: 4300,
  },
  {
    _id: 'fallback-item-5',
    category: 'Watch',
    name: 'Analog Watch',
    details: 'Classic analog watch with leather strap.',
    img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=600&fit=crop',
    price: 4900,
  },
  {
    _id: 'fallback-item-6',
    category: 'Phone',
    name: 'Smartphone A10',
    details: 'Entry-level smartphone with a crisp display.',
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=600&fit=crop',
    price: 12500,
  },
  {
    _id: 'fallback-item-7',
    category: 'Kids Item',
    name: 'Kids Toy Set',
    details: 'Fun toy set for children aged 4-8 years.',
    img: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=600&fit=crop',
    price: 950,
  },
  {
    _id: 'fallback-item-8',
    category: 'Shoe',
    name: 'Running Shoes',
    details: 'Comfortable running shoes for daily workouts.',
    img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=600&fit=crop',
    price: 2200,
  },
];

export const getFallbackItemsByCategory = category =>
  fallbackCategoryItems.filter(item => item.category === category);
