<script setup>
import axios from 'axios';
import { onBeforeUnmount, ref, watch } from 'vue';

const emit = defineEmits(['submitted', 'close']);

const previewUrl = ref('');
const imageLoadError = ref(false);
const file = ref(null);

const categories = ['Dress', 'Cosmetics', 'Jewelry', 'Bag', 'Watch', 'Phone', 'Kids Item', 'Shoe'];

const form = ref({
  category: '',
  name: '',
  details: '',
  img: '',
  price: '',
});

const error = ref('');
const loading = ref(false);

// 🧠 Watch img URL changes → update preview
watch(
  () => form.value.img,
  newUrl => {
    if (newUrl) {
      file.value = null;
      previewUrl.value = newUrl;
      imageLoadError.value = false;
    }
  }
);

// 📁 Handle file selection
const handleFileUpload = event => {
  const uploaded = event.target.files[0];
  if (uploaded && uploaded.type.startsWith('image/')) {
    file.value = uploaded;
    previewUrl.value = URL.createObjectURL(uploaded);
    form.value.img = '';
    imageLoadError.value = false;
  } else {
    alert('Please select a valid image file.');
  }
};

// ✅ Validate form before submission
const validateForm = () => {
  if (
    !form.value.category ||
    !form.value.name ||
    !form.value.details ||
    (!file.value && !form.value.img) ||
    !form.value.price
  ) {
    error.value = 'All fields are required!';
    return false;
  }
  return true;
};

// 🚀 Submit form (file or URL)
import { API_BASE } from '../../utils/api';

const submitForm = async () => {
  error.value = '';
  if (!validateForm()) return;

  loading.value = true;

  try {
    if (file.value) {
      const formData = new FormData();
      formData.append('category', form.value.category);
      formData.append('name', form.value.name);
      formData.append('details', form.value.details);
      formData.append('img', file.value);
      formData.append('price', form.value.price);

      await axios.post(`${API_BASE}/api/categoryItems/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else {
      await axios.post(`${API_BASE}/api/categoryItems`, {
        category: form.value.category,
        name: form.value.name,
        details: form.value.details,
        img: form.value.img,
        price: Number(form.value.price),
      });
    }

    emit('submitted', form.value.category);
    resetForm();
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to add product';
  } finally {
    loading.value = false;
  }
};

// ♻️ Reset form
const resetForm = () => {
  form.value = {
    category: '',
    name: '',
    details: '',
    img: '',
    price: '',
  };
  previewUrl.value = '';
  file.value = null;
  imageLoadError.value = false;
};

// 🧼 Cleanup URL blob when unmounted
onBeforeUnmount(() => {
  if (previewUrl.value && file.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>

<template>
  <div class="max-w-md mx-auto p-6 border rounded shadow bg-white mt-10">
    <h3 class="text-xl font-bold mb-4">Add New Product</h3>

    <!-- Category -->
    <div class="mb-3">
      <label class="block mb-1 font-semibold">Select Category</label>
      <select v-model="form.category" class="w-full border rounded p-2">
        <option disabled value="">Select a category</option>
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>
    </div>

    <!-- Name -->
    <div class="mb-3">
      <label class="block mb-1 font-semibold">Product Name</label>
      <input
        v-model="form.name"
        type="text"
        class="w-full border rounded p-2"
        placeholder="Enter product name"
      />
    </div>

    <!-- Details -->
    <div class="mb-3">
      <label class="block mb-1 font-semibold">Product Details</label>
      <textarea
        v-model="form.details"
        class="w-full border rounded p-2"
        rows="3"
        placeholder="Write a short description"
      ></textarea>
    </div>

    <!-- File Upload -->
    <div class="mb-3">
      <label class="block mb-1 font-semibold">Upload Image (from device)</label>
      <input type="file" accept="image/*" @change="handleFileUpload" />
    </div>

    <!-- OR Image URL -->
    <div class="mb-3">
      <label class="block mb-1 font-semibold">Or Enter Image URL</label>
      <input
        v-model="form.img"
        type="url"
        class="w-full border rounded p-2"
        placeholder="https://example.com/image.jpg"
      />
    </div>

    <!-- Preview -->
    <div v-if="previewUrl" class="mb-3">
      <img :src="previewUrl" @error="imageLoadError = true" class="w-32 h-32 object-cover border" />
      <p v-if="imageLoadError" class="text-red-500 text-sm mt-1">
        ❌ Image failed to load. Please check the URL.
      </p>
    </div>

    <!-- Price -->
    <div class="mb-3">
      <label class="block mb-1 font-semibold">Price (৳)</label>
      <input v-model="form.price" type="number" class="w-full border rounded p-2" min="0" />
    </div>

    <!-- Error message -->
    <div v-if="error" class="mb-3 text-red-600 font-semibold">{{ error }}</div>

    <!-- Action Buttons -->
    <div class="flex justify-between items-center">
      <button
        @click="submitForm"
        :disabled="loading"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {{ loading ? 'Submitting...' : 'Submit' }}
      </button>

      <button @click="$emit('close')" class="text-gray-600 hover:text-gray-900">Cancel</button>
    </div>
  </div>
</template>
