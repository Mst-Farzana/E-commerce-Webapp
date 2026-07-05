<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { api } from '../../utils/api'; // use centralized api

const emit = defineEmits(['edit-discount']);

const discounts = ref([]);
const loading = ref(false);
const error = ref(null);
const showDiscountTable = ref(false);
const tableRef = ref(null);

// Fetch all discounts
const fetchDiscounts = async () => {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await api.get('/api/discounts');
    discounts.value = data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to fetch discounts';
  } finally {
    loading.value = false;
  }
};

// Delete a discount
const deleteDiscount = async (id) => {
  if (!confirm('Are you sure you want to delete this discount?')) return;
  try {
    await api.delete(`/api/discounts/${id}`);
    discounts.value = discounts.value.filter(d => d._id !== id);
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to delete discount');
  }
};

// Toggle table view
function toggleTable(event) {
  event.stopPropagation();
  showDiscountTable.value = !showDiscountTable.value;
}

// Close table when clicked outside
function handleClickOutside(event) {
  if (tableRef.value && !tableRef.value.contains(event.target)) {
    showDiscountTable.value = false;
  }
}

onMounted(() => {
  fetchDiscounts();
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="relative">
    <!-- Toggle Button -->
    <button
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      @click="toggleTable"
    >
      Product List
    </button>

    <!-- Discount Table -->
    <div
      v-if="showDiscountTable"
      ref="tableRef"
      class="bg-white p-4 rounded shadow-md"
    >
      <h2 class="text-xl font-bold mb-4">Manage Discounts</h2>

      <div v-if="loading" class="text-center py-4 text-gray-500">
        Loading...
      </div>
      <div v-if="error" class="text-red-600 text-center">{{ error }}</div>

      <table
        v-if="!loading && !error && discounts.length"
        class="w-full border-collapse border border-gray-300"
      >
        <thead>
          <tr class="bg-gray-200">
            <th class="border border-gray-300 px-2 py-1">Name</th>
            <th class="border border-gray-300 px-2 py-1">Offer (%)</th>
            <th class="border border-gray-300 px-2 py-1">Image</th>
            <th class="border border-gray-300 px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="discount in discounts"
            :key="discount._id"
            class="hover:bg-gray-100"
          >
            <td class="border border-gray-300 px-2 py-1">{{ discount.name }}</td>
            <td class="border border-gray-300 px-2 py-1">{{ discount.offer }}%</td>
            <td class="border border-gray-300 px-2 py-1">
              <img
                :src="discount.img"
                alt="Image"
                class="w-16 h-auto rounded"
              />
            </td>
            <td class="border border-gray-300 px-2 py-1">
              <button
                class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                @click="$emit('edit-discount', discount)"
              >
                Edit
              </button>
              <button
                class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                @click="deleteDiscount(discount._id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-else-if="!loading && !error && !discounts.length"
        class="text-center py-4 text-gray-500"
      >
        No discounts found.
      </div>
    </div>
  </div>
</template>
