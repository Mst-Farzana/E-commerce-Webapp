import { defineStore } from 'pinia';
import { fallbackDiscounts } from '../data/fallbackData';
import { api } from '../utils/api'; // <-- use shared axios instance

export const useDiscountStore = defineStore('discountStore', {
  state: () => ({
    discounts: fallbackDiscounts,
  }),
  actions: {
    async fetchDiscounts() {
      try {
        const res = await api.get('/api/discounts'); // no hardcoded URL
        console.log('Fetched discounts:', res.data);
        this.discounts = res.data;
      } catch (error) {
        console.error('Error fetching discounts:', error?.response?.data || error.message);
        // keep static fallback data when backend is unavailable
        this.discounts = fallbackDiscounts;
      }
    },
  },
});
