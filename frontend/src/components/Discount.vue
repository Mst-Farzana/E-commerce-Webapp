<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { refreshTrigger } from '../stores/discountDelete';
import { useDiscountStore } from '../stores/discountStore';

const discountStore = useDiscountStore();

// Load data on mount
onMounted(() => {
  discountStore.fetchDiscounts();
});

// Watch for refresh from outside (e.g. delete)
watch(refreshTrigger, () => {
  discountStore.fetchDiscounts();
  console.log('repeatedProducts: ', repeatedProducts.length);
});

// Use data from store
const repeatedProducts = computed(() => {
  const list = discountStore.discounts;
  return [...list, ...list];
});
</script>

<template>
  <div
    class="overflow-hidden bg-blue-200 border-y-2 border-green-700"
    style="height: 25px"
  >
    <div
      class="flex animate-scroll whitespace-nowrap items-center space-x-6 px-4 py-2"
      style="height: 25px"
    >
      <div
        v-for="(item, index) in repeatedProducts"
        :key="item._id ? item._id + '-' + index : index"
        class="flex items-center cursor-pointer min-w-max"
        style="height: 20px"
      >
        <img
          :src="item.img"
          alt="product image"
          class="w-4 h-4 object-cover rounded"
          style="height: 16px"
        />
        <div
          class="text-red-600 font-light"
          style="font-size: 10px; line-height: 1"
        >
          {{ item.offer }}%
        </div>
        <div
          class="text-gray-700 font-thin"
          style="font-size: 10px; line-height: 1"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
.animate-scroll {
  animation: scroll 15s linear infinite;
}
</style>
