<script setup>
import { ref, onMounted } from 'vue';
import { api } from '../../utils/api'; // centralized api with token and baseURL

const discounts = ref([]);
const form = ref({ name: '', offer: '', img: '', _id: null });
const isEditing = ref(false);
const loading = ref(false);

// ✅ Fetch all discounts
const fetchDiscounts = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/api/discounts');
    discounts.value = data;
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to fetch discounts');
  } finally {
    loading.value = false;
  }
};

// ✅ Create new discount
const createDiscount = async () => {
  if (!form.value.name || !form.value.offer) {
    alert('Please fill name and offer');
    return;
  }
  loading.value = true;
  try {
    await api.post('/api/discounts', {
      name: form.value.name,
      offer: form.value.offer,
      img: form.value.img,
    });
    resetForm();
    fetchDiscounts();
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to add discount');
  } finally {
    loading.value = false;
  }
};

// ✅ Update existing discount
const updateDiscount = async () => {
  if (!form.value._id) return;

  loading.value = true;
  try {
    await api.put(`/api/discounts/${form.value._id}`, {
      name: form.value.name,
      offer: form.value.offer,
      img: form.value.img,
    });
    resetForm();
    fetchDiscounts();
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to update discount');
  } finally {
    loading.value = false;
  }
};

// ✅ Delete a discount
const deleteDiscount = async (id) => {
  if (!confirm('Are you sure?')) return;
  loading.value = true;
  try {
    await api.delete(`/api/discounts/${id}`);
    fetchDiscounts();
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to delete discount');
  } finally {
    loading.value = false;
  }
};

// ✅ Load discount into form for editing
const editDiscount = (item) => {
  form.value = { ...item };
  isEditing.value = true;
};

// ✅ Reset form
const resetForm = () => {
  form.value = { name: '', offer: '', img: '', _id: null };
  isEditing.value = false;
};

// ✅ Initial load
onMounted(() => {
  fetchDiscounts();
});
</script>
