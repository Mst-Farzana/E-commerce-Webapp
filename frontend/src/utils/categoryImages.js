import { API_BASE } from './api';

const mapping = {
  Dress: '/dress/1.jpg',
  Cosmetics: '/cosmetics/1.jpg',
  Jewelry: '/jewelary/1.jpg',
  Bag: '/bag/1.jpg',
  Watch: '/watch/1.jpg',
  Phone: '/phone/1.jpg',
  'Kids Item': '/kids/1.jpg',
  Shoe: '/shoe/1.jpg',
};

export function getCategoryImageUrl(category) {
  if (!category) return `${API_BASE}/images/dress/1.jpg`;
  const path = mapping[category] || '/dress/1.jpg';
  return `${API_BASE}/images${path}`;
}

export default getCategoryImageUrl;
