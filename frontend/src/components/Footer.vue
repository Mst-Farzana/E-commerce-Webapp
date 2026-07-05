<template>
  <footer class="bg-gray-900 text-gray-200 py-10 mt-12">
    <div
      class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm"
    >
      <!-- About -->
      <div>
        <h3 class="text-lg font-bold mb-4 text-white">🏬 ShopEase</h3>
        <p class="text-gray-400">
          Your trusted one-stop shop for quality products, great deals, and fast
          delivery.
        </p>
      </div>

      <!-- Quick Links -->
      <div>
        <h4 class="font-semibold text-white mb-4">Quick Links</h4>
        <ul class="space-y-2 text-gray-400">
          <li>
            <router-link to="/" class="hover:underline">Home</router-link>
          </li>
          <li>
            <router-link to="/products" class="hover:underline"
              >Products</router-link
            >
          </li>
          <li>
            <router-link to="/about" class="hover:underline"
              >About Us</router-link
            >
          </li>
          <li>
            <router-link to="/contact" class="hover:underline"
              >Contact</router-link
            >
          </li>
        </ul>
      </div>

      <!-- Support -->
      <div>
        <h4 class="font-semibold text-white mb-4">Customer Support</h4>
        <ul class="space-y-2 text-gray-400">
          <li>
            <router-link to="/faq" class="hover:underline">FAQ</router-link>
          </li>
          <li>
            <router-link to="/returns" class="hover:underline"
              >Return Policy</router-link
            >
          </li>
          <li>
            <router-link to="/terms" class="hover:underline"
              >Terms & Conditions</router-link
            >
          </li>
          <li>
            <router-link to="/privacy" class="hover:underline"
              >Privacy Policy</router-link
            >
          </li>
        </ul>
      </div>

      <!-- Contact -->
      <div>
        <h4 class="font-semibold text-white mb-4">Contact Us</h4>
        <p class="text-gray-400">
          📞 +880 1234 567890<br />
          ✉️ support@shopease.com<br />
          📍 Dhaka, Bangladesh
        </p>
        <div class="mt-4 flex gap-3">
          <a href="#" class="text-blue-400 hover:text-blue-600"
            ><i class="fab fa-facebook-f"></i
          ></a>
          <a href="#" class="text-blue-300 hover:text-blue-500"
            ><i class="fab fa-twitter"></i
          ></a>
          <a href="#" class="text-pink-500 hover:text-pink-600"
            ><i class="fab fa-instagram"></i
          ></a>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div
      class="mt-10 border-t border-gray-700 pt-4 text-center text-xs text-gray-500"
    >
      © {{ new Date().getFullYear() }} ShopEase. All rights reserved.
    </div>
  </footer>
</template>

<script setup>

</script>
