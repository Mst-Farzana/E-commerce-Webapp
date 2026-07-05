<script setup>
import { ref, onMounted, watch } from 'vue';
import { api } from '../../../utils/api';
import { refreshTrigger } from '../../../stores/discountDelete';

const products = ref([]);
const loading = ref(false);
const error = ref('');

// Fetch all products
const fetchProducts = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await api.get('/api/discounts');
    products.value = res.data;
  } catch (err) {
    error.value = 'Failed to fetch discounts';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Delete a product
const deleteProduct = async id => {
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    await api.delete(`/api/discounts/${id}`);
    products.value = products.value.filter(p => p._id !== id);
    refreshTrigger.value++;
  } catch (err) {
    console.error('Delete failed:', err?.response || err);
    alert(
      `Failed to delete product: ${
        err.response?.data?.message || err.message || 'Unknown error'
      }`
    );
  }
};

onMounted(fetchProducts);
watch(refreshTrigger, fetchProducts);
</script>

<template>
  <div class="text-sm font-sans">
    <h3 class="mb-5 underline underline-offset-1">Product List</h3>

    <div v-if="loading">Loading products...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <ul v-if="products.length > 0" class="product-list">
      <li v-for="product in products" :key="product._id" class="product-item">
        {{ product.name || 'No name found' }}
        <button @click="deleteProduct(product._id)">Delete</button>
      </li>
    </ul>

    <div v-if="products.length === 0 && !loading">No products found.</div>
  </div>
</template>

<style scoped>
.product-list {
  list-style: none;
  padding-left: 0;
}
.product-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
button {
  cursor: pointer;
  background-color: #e53e3e;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
}
button:hover {
  background-color: #9b2c2c;
}
.error {
  color: red;
  margin-bottom: 1rem;
}
</style>
