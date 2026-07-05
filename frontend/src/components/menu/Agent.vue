<script setup>
import { ref } from 'vue';

const isOpen = ref(false);

const districts = [
  'Bagerhat',
  'Bandarban',
  'Barguna',
  'Barisal',
  'Bhola',
  'Brahmanbaria',
  'Chandpur',
  'Chattogram',
  'Chuadanga',
  'Comilla',
  "Cox's Bazar",
  'Dhaka',
  'Dinajpur',
  'Faridpur',
  'Feni',
  'Gaibandha',
  'Gazipur',
  'Gopalganj',
  'Habiganj',
  'Jamalpur',
  'Jashore',
  'Jhalokati',
  'Jhenaidah',
  'Joypurhat',
  'Kishoreganj',
  'Kurigram',
  'Kushtia',
  'Lakshmipur',
  'Lalmonirhat',
  'Madaripur',
  'Magura',
  'Manikganj',
  'Meherpur',
  'Moulvibazar',
  'Munshiganj',
  'Mymensingh',
  'Naogaon',
  'Narail',
  'Narayanganj',
  'Narsingdi',
  'Natore',
  'Nawabganj',
  'Netrakona',
  'Nilphamari',
  'Noakhali',
  'Pabna',
  'Panchagarh',
  'Patuakhali',
  'Pirojpur',
  'Rajbari',
  'Rajshahi',
  'Rangamati',
  'Rangpur',
  'Satkhira',
  'Shariatpur',
  'Sherpur',
  'Sirajganj',
  'Sunamganj',
  'Sylhet',
  'Tangail',
  'Thakurgaon',
];

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div class="relative inline-block text-left">
    <!-- Button -->
    <button
      @click="toggleDropdown"
      class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
      type="button"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      Agent
      <svg
        class="-mr-1 ml-2 h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- Dropdown menu -->
    <div
      v-if="isOpen"
      class="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none max-h-64 overflow-y-auto z-50"
    >
      <ul class="py-1 text-gray-700 text-sm">
        <li
          v-for="(district, index) in districts"
          :key="index"
          class="px-4 py-2 hover:bg-blue-100 cursor-pointer"
        >
          {{ district }}
        </li>
      </ul>
    </div>
  </div>
</template>
