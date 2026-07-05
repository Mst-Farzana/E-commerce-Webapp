<script setup>
defineProps({ product: Object });
</script>

<template>
  <router-link :to="`/product/${product.id}`">
    <div class="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <img
        :src="product.image"
        alt="Product"
        class="w-full h-40 object-cover mb-4"
      />
      <h2 class="text-lg font-semibold">{{ product.name }}</h2>
      <p class="text-gray-500">${{ product.price }}</p>
    </div>
  </router-link>
</template>
