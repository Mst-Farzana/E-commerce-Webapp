<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

import { fallbackCategoryItems } from '../../data/fallbackData';
import emitter from '../../eventBus';
import { api, API_BASE } from '../../utils/api';
import { getCategoryImageUrl } from '../../utils/categoryImages';
import AddProduct from '../menu/Add.vue';
import OrderForm from '../order/OrderForm.vue';

const selectedProduct = ref(null);
const items = ref([]);
const loading = ref(false);
const error = ref('');
const showForm = ref(false);
const isAdmin = ref(false);

const deleteItem = async id => {
  if (!confirm('Are you sure you want to delete this item?')) return;
  try {
    await api.delete(`/api/categoryItems/${id}`);
    refreshItems();
    emitter.emit('productsUpdated');
  } catch (err) {
    alert('Failed to delete item');
    console.error(err);
  }
};

const showEditForm = ref(false);
const editProduct = ref({
  _id: '',
  name: '',
  details: '',
  price: 0,
  img: '',
  category: '',
});

const editItem = item => {
  editProduct.value = { ...item };
  showEditForm.value = true;
};

const submitEdit = async () => {
  try {
    await api.put(`/api/categoryItems/${editProduct.value._id}`, editProduct.value);
    showEditForm.value = false;
    refreshItems();
    emitter.emit('productsUpdated');
  } catch (err) {
    alert('Failed to update item');
    console.error(err);
  }
};

const closeEditForm = () => {
  showEditForm.value = false;
};

const getImageUrl = img => {
  if (!img) return 'https://via.placeholder.com/400x300?text=No+Image';
  if (img.startsWith('http')) return img;
  if (img.startsWith('/uploads/')) return `${API_BASE}${img}`;
  return `${API_BASE}/images/${img.replace(/^\/+/, '')}`;
};

const handleOrder = product => {
  selectedProduct.value = product;
};

const refreshItems = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await api.get('/api/categoryItems');
    items.value = Array.isArray(res.data) && res.data.length ? res.data : fallbackCategoryItems;
  } catch (err) {
    error.value = 'Failed to fetch items, using fallback data';
    items.value = fallbackCategoryItems;
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const containerRef = ref(null);
const onClickOutside = event => {
  if (selectedProduct.value && containerRef.value && !containerRef.value.contains(event.target)) {
    selectedProduct.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', onClickOutside);
  refreshItems();
  emitter.on('productsUpdated', refreshItems);
  isAdmin.value = localStorage.getItem('isAdmin') === 'true'; // ✅ Check admin
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside);
  emitter.off('productsUpdated');
});
</script>

<template>
  <div ref="containerRef" class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">All Products</h2>
    </div>

    <AddProduct
      v-if="showForm"
      @submitted="
        () => {
          refreshItems();
          emitter.emit('productsUpdated');
        }
      "
      @close="showForm = false"
    />

    <div v-if="loading" class="mt-6 text-gray-700">Loading items...</div>

    <div v-if="error" class="mt-6 text-red-600">{{ error }}</div>

    <div v-if="items.length" class="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="item in items"
        :key="item._id"
        class="border p-4 rounded shadow hover:shadow-lg transition"
      >
        <img :src="getImageUrl(item.img) || getCategoryImageUrl(item.category)" alt="Product" />

        <h3 class="mt-2 font-semibold">{{ item.name }}</h3>
        <p class="text-sm text-gray-600">{{ item.details }}</p>
        <p class="mt-1 font-bold">Price: ৳{{ item.price }}</p>

        <button
          @click.stop="handleOrder(item)"
          class="bg-green-600 text-white px-3 py-1 mt-2 rounded hover:bg-green-400"
        >
          Order Now
        </button>

        <!-- Edit/Delete buttons -->
        <!-- Edit/Delete buttons -->
        <div v-if="isAdmin" class="flex space-x-2 mt-2">
          <button
            @click="editItem(item)"
            class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          >
            ✏️ Edit
          </button>
          <button
            @click="deleteItem(item._id)"
            class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            🗑️ Delete
          </button>
        </div>

        <OrderForm
          v-if="selectedProduct && selectedProduct._id === item._id"
          :product="selectedProduct"
          @close="selectedProduct = null"
        />
      </div>
    </div>

    <div v-if="!items.length && !loading" class="mt-6 text-gray-500">No products found.</div>

    <!-- Edit Modal -->
    <div
      v-if="showEditForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded shadow-lg w-96">
        <h3 class="text-xl font-semibold mb-4">Edit Product</h3>

        <label class="block mb-2">
          Name:
          <input v-model="editProduct.name" type="text" class="w-full border rounded px-2 py-1" />
        </label>

        <label class="block mb-2">
          Details:
          <textarea
            v-model="editProduct.details"
            class="w-full border rounded px-2 py-1"
          ></textarea>
        </label>

        <label class="block mb-2">
          Price:
          <input
            v-model.number="editProduct.price"
            type="number"
            min="0"
            class="w-full border rounded px-2 py-1"
          />
        </label>

        <label class="block mb-2">
          Image URL:
          <input v-model="editProduct.img" type="text" class="w-full border rounded px-2 py-1" />
        </label>

        <label class="block mb-4">
          Category:
          <select v-model="editProduct.category" class="w-full border rounded px-2 py-1">
            <option
              v-for="cat in [
                'Dress',
                'Cosmetics',
                'Jewelry',
                'Bag',
                'Watch',
                'Phone',
                'Kids Item',
                'Shoe',
              ]"
              :key="cat"
              :value="cat"
            >
              {{ cat }}
            </option>
          </select>
        </label>

        <div class="flex justify-end space-x-2">
          <button @click="closeEditForm" class="px-4 py-1 rounded bg-gray-300 hover:bg-gray-400">
            Cancel
          </button>
          <button
            @click="submitEdit"
            class="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
