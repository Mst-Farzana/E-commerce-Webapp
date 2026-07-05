<script setup>
import { ref, watch } from 'vue';
import { api } from '../../utils/api'; // use centralized api

defineProps({
  discountToEdit: Object,
});

const emit = defineEmits(['saved', 'cancel']);

const name = ref('');
const offer = ref(0);
const img = ref('');
const loading = ref(false);
const error = ref(null);

// Watch for edit mode
watch(
  () => discountToEdit,
  (newVal) => {
    if (newVal) {
      name.value = newVal.name;
      offer.value = newVal.offer;
      img.value = newVal.img;
    } else {
      name.value = '';
      offer.value = 0;
      img.value = '';
    }
  },
  { immediate: true }
);

async function submitForm() {
  if (!name.value || offer.value === null || !img.value) {
    error.value = 'Please fill all fields';
    return;
  }
  if (offer.value < 0 || offer.value > 100) {
    error.value = 'Offer must be between 0 and 100';
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    if (discountToEdit && discountToEdit._id) {
      // Update
      await api.put(`/api/discounts/${discountToEdit._id}`, {
        name: name.value,
        offer: offer.value,
        img: img.value,
      });
    } else {
      // Create
      await api.post('/api/discounts', {
        name: name.value,
        offer: offer.value,
        img: img.value,
      });
      // Reset form after create
      name.value = '';
      offer.value = 0;
      img.value = '';
    }
    emit('saved');
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to save discount';
  } finally {
    loading.value = false;
  }
}

function cancel() {
  emit('cancel');
}
</script>

<template>
  <div class="max-w-md p-4 border rounded shadow bg-white">
    <h3 class="text-lg font-semibold mb-4">
      {{ discountToEdit ? 'Edit Discount' : 'Add New Discount' }}
    </h3>

    <div class="mb-3">
      <label class="block mb-1 font-medium">Product Name</label>
      <input
        type="text"
        v-model="name"
        class="w-full border px-3 py-2 rounded"
        placeholder="e.g. T-shirt"
      />
    </div>

    <div class="mb-3">
      <label class="block mb-1 font-medium">Offer (%)</label>
      <input
        type="number"
        v-model.number="offer"
        class="w-full border px-3 py-2 rounded"
        min="0"
        max="100"
      />
    </div>

    <div class="mb-3">
      <label class="block mb-1 font-medium">Image URL</label>
      <input
        type="text"
        v-model="img"
        class="w-full border px-3 py-2 rounded"
        placeholder="https://example.com/image.png"
      />
    </div>

    <div v-if="error" class="mb-3 text-red-600">{{ error }}</div>

    <div class="flex justify-between">
      <button
        @click="cancel"
        type="button"
        class="px-4 py-2 border rounded hover:bg-gray-100"
      >
        Cancel
      </button>
      <button
        @click="submitForm"
        type="button"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        :disabled="loading"
      >
        {{ loading ? 'Saving...' : 'Save' }}
      </button>
    </div>
  </div>
</template>
