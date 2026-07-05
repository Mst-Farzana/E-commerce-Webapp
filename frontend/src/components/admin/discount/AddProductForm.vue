<script setup>
import { ref } from 'vue';
import { api } from '../../../utils/api';
import { refreshTrigger } from '../../../stores/discountDelete';

const name = ref('');
const offer = ref(0);
const img = ref('');

const loading = ref(false);
const error = ref('');
const success = ref('');

async function addProduct() {
  loading.value = true;
  error.value = '';
  success.value = '';

  try {
    await api.post('/api/discounts', {
      name: name.value,
      offer: offer.value,
      img: img.value,
    });

    success.value = 'Product added successfully!';
    name.value = '';
    offer.value = 0;
    img.value = '';

    // Trigger refresh for scroll & list to update
    refreshTrigger.value++;
  } catch (err) {
    console.error('Add product error:', err.response || err);
    error.value =
      err.response?.data?.message || err.message || 'Failed to add product.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <h3 class="underline underline-offset-auto">Add New</h3>
    <form @submit.prevent="addProduct" class="text-sm space-y-2">
      <label class="block">
        Item Name:
        <input v-model="name" required class="border p-1 rounded w-full" />
      </label>
      <label class="block">
        Offer %:
        <input
          type="number"
          v-model.number="offer"
          min="0"
          max="100"
          required
          class="border p-1 rounded w-full"
        />
      </label>
      <label class="block">
        Image URL:
        <input
          v-model="img"
          placeholder="url/link"
          required
          class="border p-1 rounded w-full"
        />
      </label>
      <button
        type="submit"
        :disabled="loading"
        class="font-semibold bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        Add
      </button>
    </form>

    <div v-if="success" class="success mt-2">{{ success }}</div>
    <div v-if="error" class="error mt-2">{{ error }}</div>
  </div>
</template>

<style scoped>
.error {
  color: red;
}
.success {
  color: green;
}
</style>
