<script setup>
import { ref, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminAuthStore } from '../../stores/adminAuth';
import { api } from '../../utils/api';

const router = useRouter();
const adminAuthStore = useAdminAuthStore();

// Form fields
const adminUserId = ref('');
const adminPassword = ref('');
const errors = ref({});
const successMsg = ref('');
const loading = ref(false);

// Dashboard data
const dashboardData = ref(null);

// Function to fetch dashboard data
const fetchDashboardData = async (token) => {
  try {
    const { data } = await api.get('/api/admin/dashboard-data', {
      headers: { Authorization: `Bearer ${token}` },
    });
    dashboardData.value = data;
    console.log('Dashboard data:', data);
  } catch (err) {
    console.error('Fetch dashboard error:', err);
  }
};

// Watch accessToken to auto-fetch dashboard if token changes
watch(
  () => adminAuthStore.accessToken,
  (newToken) => {
    if (newToken) fetchDashboardData(newToken);
    else dashboardData.value = null; // Clear if no token
  },
  { immediate: true } // Loads dashboard on page reload if token exists
);

// Admin login handler
const handleAdminLogin = async () => {
  errors.value = {};
  successMsg.value = '';
  loading.value = true;

  const trimmedUserId = adminUserId.value.trim().toLowerCase();
  const trimmedPassword = adminPassword.value.trim();

  if (!trimmedUserId) errors.value.adminUserId = 'User ID is required';
  if (!trimmedPassword) errors.value.adminPassword = 'Password is required';

  if (Object.keys(errors.value).length > 0) {
    loading.value = false;
    return;
  }

  try {
    const { data } = await api.post('/api/admin/login', {
      userId: trimmedUserId,
      password: trimmedPassword,
    });
console.log('Tokens from API:', data.accessToken, data.refreshToken);
    if (!data.accessToken || !data.refreshToken) {
      throw new Error('Tokens not returned from server');
    }

    
adminAuthStore.loginAdmin({
  accessToken: data.accessToken,
  refreshToken: data.refreshToken,
  user: data.user, 
});



    // Fetch dashboard immediately after login
    await fetchDashboardData(data.accessToken);

    successMsg.value = `Welcome ${adminAuthStore.adminUser.firstName}! Redirecting...`;

    // Wait for UI update before redirect
    await nextTick();
    router.push('/admin/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    adminPassword.value = '';
    document.querySelector('input[type="password"]')?.focus();

    errors.value.general =
      error.response?.data?.message || error.message || 'Login failed. Please try again.';
    dashboardData.value = null; // Clear dashboard on failed login
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded shadow mt-20">
    <h2 class="text-2xl font-bold mb-4 text-center text-blue-700">Admin Login</h2>
    <form class="space-y-4" @submit.prevent="handleAdminLogin">
      <input
        v-model="adminUserId"
        type="text"
        placeholder="Admin User ID"
        class="input-field"
        autocomplete="username"
      />
      <p v-if="errors.adminUserId" class="text-red-500 text-sm">{{ errors.adminUserId }}</p>

      <input
        v-model="adminPassword"
        type="password"
        placeholder="Password"
        class="input-field"
        autocomplete="current-password"
      />
      <p v-if="errors.adminPassword" class="text-red-500 text-sm">{{ errors.adminPassword }}</p>

      <button
        type="submit"
        class="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        :disabled="loading"
      >
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>

      <p v-if="successMsg" class="text-green-600 mt-3 text-center">{{ successMsg }}</p>
      <p v-if="errors.general" class="text-red-600 mt-3 text-center">{{ errors.general }}</p>
    </form>

    <!-- Dashboard Data Preview -->
    <div v-if="dashboardData" class="mt-6 p-4 bg-gray-100 rounded">
      <h3 class="font-bold text-lg mb-2">Dashboard Data</h3>
      <p>Total Users: {{ dashboardData.totalUsers }}</p>
      <p>Total Orders: {{ dashboardData.totalOrders }}</p>
      <p>Total Revenue: {{ dashboardData.totalRevenue }}</p>
    </div>
  </div>
</template>

<style scoped>
.input-field {
  width: 100%;
  border: 1px solid #ccc;
  padding: 0.5rem;
  border-radius: 0.25rem;
  outline: none;
}
.input-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}
</style>
