<script setup>
import { ref, watch, onMounted } from 'vue';
import { api } from '../../../utils/api';
import { refreshTrigger } from '../../../stores/discountDelete';

const products = ref([]);
const repeatedProducts = ref([]);

async function fetchProducts() {
  try {
    const res = await api.get('/api/discounts');
    products.value = res.data;
    repeatedProducts.value = [...products.value, ...products.value];
  } catch (err) {
    console.error('Failed to fetch discounts:', err);
  }
}

watch(refreshTrigger, () => {
  fetchProducts();
});

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <!-- Example design placeholder for the scrolling discount ticker -->
  <div class="overflow-hidden whitespace-nowrap bg-blue-100 py-2">
    <div
      class="inline-block animate-marquee space-x-8"
      v-if="repeatedProducts.length"
    >
      <span
        v-for="(item, index) in repeatedProducts"
        :key="index"
        class="inline-block text-blue-700 font-semibold"
      >
        {{ item.name }} - {{ item.offer }}%
      </span>
    </div>
    <div v-else class="text-center text-gray-500">No offers available</div>
  </div>
</template>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.animate-marquee {
  display: inline-block;
  white-space: nowrap;
  animation: marquee 25s linear infinite;
}
</style>
