<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { API_BASE } from '../../utils/api';

const emit = defineEmits(['logged-in']);

const email = ref('');
const password = ref('');
const errors = ref({});
const successMsg = ref('');
const loading = ref(false);
const router = useRouter();

const baseURL = API_BASE;

const handleLogin = async () => {
  errors.value = {};
  successMsg.value = '';
  loading.value = true;

  if (!email.value) errors.value.email = 'Email or Contact is required';
  else if (!/^\S+@\S+\.\S+$/.test(email.value) && !/^\d{7,15}$/.test(email.value))
    errors.value.email = 'Enter a valid email or contact number';
  if (!password.value) errors.value.password = 'Password is required';

  if (Object.keys(errors.value).length) {
    loading.value = false;
    return;
  }

  try {
    const { data } = await axios.post(`${baseURL}/api/users/login`, {
      identifier: email.value,
      password: password.value,
    });

    localStorage.setItem('user', JSON.stringify(data.user));
    emit('logged-in', data.user);

    successMsg.value = `Login successful! Welcome ${data.user.firstName}`;
  } catch (err) {
    errors.value.general = err.response?.data?.message ?? 'Login failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-bold mb-4 text-center">Login</h2>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <!-- identifier -->
      <input v-model="email" type="text" placeholder="Email or Contact No" class="input-field" />
      <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>

      <!-- password -->
      <input v-model="password" type="password" placeholder="Password" class="input-field" />
      <p v-if="errors.password" class="text-red-500 text-sm">
        {{ errors.password }}
      </p>

      <!-- submit -->
      <button
        type="submit"
        class="py-3 px-10 bg-blue-600 font-semibold text-white rounded-full hover:border-2 hover:bg-white hover:text-blue-600 disabled:opacity-50 block mx-auto"
        :disabled="loading"
      >
        {{ loading ? 'Logging in…' : 'Login' }}
      </button>

      <!-- feedback -->
      <p v-if="successMsg" class="text-green-600 mt-3 text-center">
        {{ successMsg }}
      </p>
      <p v-if="errors.general" class="text-red-600 mt-3 text-center">
        {{ errors.general }}
      </p>
    </form>
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
