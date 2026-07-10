<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { getFallbackItemsByCategory } from '../../data/fallbackData';
import emitter from '../../eventBus';
import { api } from '../../utils/api';
import { getCategoryImageUrl } from '../../utils/categoryImages';
import { resolveImageUrl } from '../../utils/imageUrl';
import AddProduct from '../menu/Add.vue';
import OrderForm from '../order/OrderForm.vue';

const selectedCategory = ref(null);
const selectedProduct = ref(null);
const items = ref([]);
const loading = ref(false);
const error = ref('');
const showForm = ref(false);

const showEditForm = ref(false);
const editProduct = ref({
  _id: '',
  name: '',
  details: '',
  price: 0,
  img: '',
  category: '',
});

const categories = ['Dress', 'Cosmetics', 'Jewelry', 'Bag', 'Watch', 'Phone', 'Kids Item', 'Shoe'];

const getImageUrl = img => {
  const resolved = resolveImageUrl(img);
  return resolved || 'https://via.placeholder.com/400x300?text=No+Image';
};

const selectCategory = category => {
  selectedProduct.value = null;
  selectedCategory.value = category;
};

const refreshItems = async () => {
  if (!selectedCategory.value) return;
  loading.value = true;
  error.value = '';
  try {
    const res = await api.get(`/api/categoryItems/${encodeURIComponent(selectedCategory.value)}`);
    items.value =
      Array.isArray(res.data) && res.data.length
        ? res.data
        : getFallbackItemsByCategory(selectedCategory.value);
  } catch (err) {
    error.value = 'Failed to fetch items, using fallback data';
    items.value = getFallbackItemsByCategory(selectedCategory.value);
    console.error(err);
  } finally {
    loading.value = false;
  }
};

watch(selectedCategory, () => {
  refreshItems();
});

const onAddProductSubmitted = category => {
  if (selectedCategory.value !== category) {
    selectedCategory.value = category;
  } else {
    refreshItems();
  }
  showForm.value = false;
  emitter.emit('productsUpdated');
};

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

const editItem = item => {
  editProduct.value = { ...item };
  showEditForm.value = true;
};

const submitEdit = async () => {
  try {
    await api.put(`/api/categoryItems/${editProduct.value._id}`, editProduct.value);

    showEditForm.value = false;

    if (selectedCategory.value !== editProduct.value.category) {
      selectedCategory.value = editProduct.value.category;
    } else {
      refreshItems();
    }

    emitter.emit('productsUpdated');
  } catch (err) {
    alert('Failed to update item');
    console.error(err);
  }
};

const closeEditForm = () => {
  showEditForm.value = false;
};

const containerRef = ref(null);
const onClickOutside = event => {
  if (selectedProduct.value && containerRef.value && !containerRef.value.contains(event.target)) {
    selectedProduct.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', onClickOutside);
  emitter.on('productsUpdated', refreshItems);

  if (!selectedCategory.value && categories.length > 0) {
    selectedCategory.value = categories[0];
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside);
  emitter.off('productsUpdated', refreshItems);
});
</script>

<template>
  <div ref="containerRef" class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Product Management</h2>
      <button
        @click="
          showForm = !showForm;
          openNewTab();
        "
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {{ showForm ? 'Close' : '➕ New Product' }}
      </button>
    </div>

    <!-- ✅ Add Product Form -->
    <AddProduct v-if="showForm" @submitted="onAddProductSubmitted" @close="showForm = false" />

    <!-- ✅ Main Layout: Left Sidebar + Right Content -->
    <div class="flex gap-6">
      <!-- Left: Category Sidebar -->
      <div class="w-64 flex-shrink-0">
        <h3 class="text-lg font-semibold mb-3 text-gray-700">Categories</h3>
        <div class="flex flex-col gap-2">
          <button
            v-for="(category, index) in categories"
            :key="index"
            @click="selectCategory(category)"
            :class="[
              'px-4 py-3 rounded-lg shadow text-left transition-all',
              selectedCategory === category
                ? 'bg-blue-700 text-white shadow-lg'
                : 'bg-blue-500 text-white hover:bg-blue-600',
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Right: Products Grid -->
      <div class="flex-1">
        <div v-if="loading" class="text-gray-700 py-8 text-center">Loading items...</div>
        <div v-if="error" class="text-red-600 py-8 text-center">{{ error }}</div>

        <!-- Product Cards - 2 Columns -->
        <div v-if="items.length" class="grid grid-cols-2 gap-6">
          <div
            v-for="item in items"
            :key="item._id"
            class="border p-4 rounded shadow hover:shadow-lg transition bg-white"
          >
            <img
              :src="getImageUrl(item.img) || getCategoryImageUrl(item.category)"
              :alt="item.name"
              class="w-full h-64 object-cover rounded mb-3"
            />
            <h3 class="text-lg font-semibold">{{ item.name }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ item.details }}</p>
            <p class="mt-2 text-xl font-bold text-blue-600">৳{{ item.price }}</p>

            <div class="flex gap-2 mt-3">
              <button
                @click.stop="selectedProduct = item"
                class="flex-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
              >
                Order Now
              </button>
            </div>

            <div class="flex gap-2 mt-2">
              <button
                @click="editItem(item)"
                class="flex-1 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
              >
                ✏️ Edit
              </button>
              <button
                @click="deleteItem(item._id)"
                class="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
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

        <div
          v-if="!items.length && !loading && selectedCategory"
          class="text-gray-500 py-8 text-center"
        >
          No items found for "{{ selectedCategory }}"
        </div>
      </div>
    </div>

    <!-- ✅ Edit Modal -->
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
            <option v-for="cat in categories" :key="cat" :value="cat">
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
