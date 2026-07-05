<script setup>
import axios from 'axios';
import { defineEmits, ref } from 'vue';
import { API_BASE } from '../../utils/api';

const emit = defineEmits(['close']);

const firstName = ref('');
const lastName = ref('');
const dob = ref('');
const gender = ref('');
const contactNo = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const errors = ref({});
const successMsg = ref('');
const loading = ref(false);

const baseURL = API_BASE;

const closeSignup = () => {
  errors.value = {};
  successMsg.value = '';
  clearFields();
  emit('close');
};

const clearFields = () => {
  firstName.value = '';
  lastName.value = '';
  dob.value = '';
  gender.value = '';
  contactNo.value = '';
  email.value = '';
  password.value = '';
  confirmPassword.value = '';
};

const handleSignup = async () => {
  errors.value = {};
  successMsg.value = '';

  if (!firstName.value) errors.value.firstName = 'First Name is required';
  if (!lastName.value) errors.value.lastName = 'Last Name is required';
  if (!dob.value) errors.value.dob = 'Date of Birth is required';
  if (!gender.value) errors.value.gender = 'Gender is required';
  if (!contactNo.value) errors.value.contactNo = 'Contact No is required';
  if (!email.value) errors.value.email = 'Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(email.value)) errors.value.email = 'Enter a valid email';
  if (!password.value) errors.value.password = 'Password is required';
  else if (password.value.length < 6)
    errors.value.password = 'Password must be at least 6 characters';
  if (password.value !== confirmPassword.value)
    errors.value.confirmPassword = 'Passwords do not match';

  if (Object.keys(errors.value).length > 0) return;

  loading.value = true;
  try {
    const { data } = await axios.post(`${baseURL}/api/users/signup`, {
      firstName: firstName.value,
      lastName: lastName.value,
      dob: dob.value,
      gender: gender.value,
      contactNo: contactNo.value,
      email: email.value,
      password: password.value,
    });

    successMsg.value = `Signup successful! Welcome ${data.user.firstName}`;
    clearFields();

    setTimeout(() => {
      closeSignup();
    }, 1500);
  } catch (error) {
    const resErr = error.response?.data;
    if (Array.isArray(resErr?.errors)) {
      resErr.errors.forEach(e => {
        errors.value[e.param] = e.msg;
      });
    } else if (resErr?.message) {
      errors.value.general = resErr.message;
    } else {
      errors.value.general = 'Signup failed. Please try again.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="relative overflow-y-auto max-h-[90vh]">
    <div class="bg-white p-6 rounded shadow-md w-full max-w-md mx-auto">
      <button
        @click="closeSignup"
        class="absolute top-2 right-2 text-xl font-bold"
        aria-label="Close"
      >
        &times;
      </button>

      <form @submit.prevent="handleSignup" class="space-y-4">
        <h2 class="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        <input v-model="firstName" placeholder="First Name" class="input-field" />
        <p v-if="errors.firstName" class="text-red-500 text-sm">
          {{ errors.firstName }}
        </p>

        <input v-model="lastName" placeholder="Last Name" class="input-field" />
        <p v-if="errors.lastName" class="text-red-500 text-sm">
          {{ errors.lastName }}
        </p>

        <input
          v-model="dob"
          type="date"
          placeholder="Date of Birth"
          class="input-field"
          max="9999-12-31"
        />
        <p v-if="errors.dob" class="text-red-500 text-sm">{{ errors.dob }}</p>

        <select v-model="gender" class="input-field">
          <option value="" disabled>Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <p v-if="errors.gender" class="text-red-500 text-sm">
          {{ errors.gender }}
        </p>

        <input v-model="contactNo" placeholder="Contact No" class="input-field" type="tel" />
        <p v-if="errors.contactNo" class="text-red-500 text-sm">
          {{ errors.contactNo }}
        </p>

        <input v-model="email" placeholder="Email" class="input-field" type="email" />
        <p v-if="errors.email" class="text-red-500 text-sm">
          {{ errors.email }}
        </p>

        <input v-model="password" type="password" placeholder="Password" class="input-field" />
        <p v-if="errors.password" class="text-red-500 text-sm">
          {{ errors.password }}
        </p>

        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          class="input-field"
        />
        <p v-if="errors.confirmPassword" class="text-red-500 text-sm">
          {{ errors.confirmPassword }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="py-3 px-10 bg-blue-600 font-semibold text-white rounded-full hover:border-2 hover:bg-white hover:text-blue-600 disabled:opacity-50 block mx-auto"
        >
          {{ loading ? 'Signing up...' : 'Sign Up' }}
        </button>

        <p v-if="successMsg" class="text-green-600 mt-3 text-center">
          {{ successMsg }}
        </p>
        <p v-if="errors.general" class="text-red-600 mt-3 text-center">
          {{ errors.general }}
        </p>
      </form>
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
