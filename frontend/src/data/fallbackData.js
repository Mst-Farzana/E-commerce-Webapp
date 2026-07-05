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
    img: '/dress/1.jpg',
    price: 3200,
  },
  {
    _id: 'fallback-item-2',
    category: 'Cosmetics',
    name: 'Matte Lipstick',
    details: 'Long-lasting matte lipstick for everyday wear.',
    img: '/cosmetics/1.jpg',
    price: 600,
  },
  {
    _id: 'fallback-item-3',
    category: 'Jewelry',
    name: 'Gold Necklace',
    details: 'Elegant gold-plated necklace with fine details.',
    img: '/jewelary/1.jpg',
    price: 5800,
  },
  {
    _id: 'fallback-item-4',
    category: 'Bag',
    name: 'Leather Handbag',
    details: 'Premium leather handbag with multiple compartments.',
    img: '/bag/1.jpg',
    price: 4300,
  },
  {
    _id: 'fallback-item-5',
    category: 'Watch',
    name: 'Analog Watch',
    details: 'Classic analog watch with leather strap.',
    img: '/watch/1.jpg',
    price: 4900,
  },
  {
    _id: 'fallback-item-6',
    category: 'Phone',
    name: 'Smartphone A10',
    details: 'Entry-level smartphone with a crisp display.',
    img: '/phone/1.jpg',
    price: 12500,
  },
  {
    _id: 'fallback-item-7',
    category: 'Kids Item',
    name: 'Kids Toy Set',
    details: 'Fun toy set for children aged 4-8 years.',
    img: '/kids/1.jpg',
    price: 950,
  },
  {
    _id: 'fallback-item-8',
    category: 'Shoe',
    name: 'Running Shoes',
    details: 'Comfortable running shoes for daily workouts.',
    img: '/shoe/1.jpg',
    price: 2200,
  },
];

export const getFallbackItemsByCategory = category =>
  fallbackCategoryItems.filter(item => item.category === category);
