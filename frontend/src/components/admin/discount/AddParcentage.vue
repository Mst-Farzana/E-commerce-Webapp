<script setup>
import { ref, onMounted } from 'vue';
import { useDiscountStore } from '../../../stores/discountStore';
import { api } from '../../../utils/api'; // ✅ use centralized api

const discountStore = useDiscountStore();

const products = ref([]);
const editingId = ref(null);
const loading = ref(false);
const error = ref('');

// Fetch all discounts
const fetchDiscounts = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await api.get('/api/discounts');
    products.value = data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to fetch discount items';
  } finally {
    loading.value = false;
  }
};

// Enable editing for a product
const enableEditing = id => {
  editingId.value = id;
};

// Save updated offer
const saveOffer = async product => {
  try {
    await api.put(`/api/discounts/${product._id}`, { offer: product.offer });
    editingId.value = null;
    await discountStore.fetchDiscounts();
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to update offer');
  }
};

onMounted(fetchDiscounts);
</script>

<template>
  <div>
    <h3 class="text-sm underline font-semibold mb-2 underline-offset-4">
      Update Percentage
    </h3>

    <div v-if="loading">Loading discounts...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <ul v-if="products.length && !loading" class="space-y-1">
      <li
        v-for="product in products"
        :key="product._id"
        class="flex items-center text-[15px] justify-between p-1 bg-white"
      >
        <div class="flex items-center">
          <span>{{ product.name }}</span>
        </div>

        <div>
          <template v-if="editingId === product._id">
            <input
              type="number"
              v-model.number="product.offer"
              min="0"
              max="100"
              class="w-16 text-center border rounded"
            />
            <button
              @click="saveOffer(product)"
              class="ml-2 text-green-600 hover:underline"
            >
              Save
            </button>
          </template>
          <template v-else>
            <span
              @click="enableEditing(product._id)"
              class="cursor-pointer text-blue-600 hover:underline"
            >
              {{ product.offer }}%
            </span>
          </template>
        </div>
      </li>
    </ul>

    <div v-if="!products.length && !loading">No discount items found.</div>
  </div>
</template>

<style scoped>
input:focus {
  outline: none;
  border-color: #3b82f6;
}
</style>
