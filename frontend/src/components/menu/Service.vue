<!-- components/menu/Service.vue -->

<script setup>
import { ref } from 'vue';

const services = ref([
  {
    title: 'Fast Delivery',
    description: 'Get your products delivered in under 24 hours in major cities.',
    img: 'https://img.icons8.com/pulsar-gradient/48/fast-delivery.png',
  },
  {
    title: '24/7 Support',
    description: 'We provide round-the-clock customer support for all your needs.',
    img: 'https://img.icons8.com/pulsar-gradient/48/hotline.png',
  },
  {
    title: 'Easy Returns',
    description: 'Hassle-free returns within 7 days of delivery.',
    img: 'https://img.icons8.com/nolan/50/take-it-easy.png',
  },
  {
    title: 'Secure Payment',
    description: 'All your payments are processed through a secure gateway.',
    img: 'https://img.icons8.com/nolan/50/card-security.png',
  },
  {
    title: 'Quality Products',
    description: 'All items are checked and verified for top quality.',
    img: 'https://img.icons8.com/nolan/50/good-quality.png',
  },
  {
    title: 'Membership Offers',
    description: 'Join our premium club for exclusive deals and early access.',
    img: 'https://img.icons8.com/nolan/50/membership-card.png',
  },
]);
</script>

<template>
  <div class="p-6 min-h-screen">
    <h2 class="text-3xl font-bold mb-8">Our Services</h2>

    <div class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 gap-2">
      <div
        v-for="(service, index) in services"
        :key="index"
        class="bg-blue-200 shadow-md rounded-xl p-4 hover:shadow-lg transition"
      >
        <img :src="service.img" alt="Service Icon" class="w-16 h-16 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-center mb-2">
          {{ service.title }}
        </h3>
        <p class="text-gray-600 text-center text-sm">
          {{ service.description }}
        </p>
      </div>
    </div>
  </div>
</template>
