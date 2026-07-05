<script setup></script>

<template>
  <nav
    class="bg-blue-300 h-10 flex justify-around items-center text-end px-6 text-sm font-mono border-y-2 rounded-bl-4xl border-green-700"
  >
    <ul class="flex space-x-8 list-none">
      <li>
        <router-link
          to="/home"
          class="text-gray-700 hover:text-blue-700"
          active-class="font-bold text-blue-900"
        >
          Home
        </router-link>
      </li>
      <li>
        <router-link
          to="/category"
          class="text-gray-700 hover:text-blue-700"
          active-class="font-bold text-blue-900"
        >
          Category
        </router-link>
      </li>
      <li>
        <router-link
          to="/service"
          class="text-gray-700 hover:text-blue-700"
          active-class="font-bold text-blue-900"
        >
          Service
        </router-link>
      </li>
      <li>
        <router-link
          to="/product"
          class="text-gray-700 hover:text-blue-700"
          active-class="font-bold text-blue-900"
        >
          Product
        </router-link>
      </li>

      <li>
        <router-link
          to="/contact"
          class="text-gray-700 hover:text-blue-700"
          active-class="font-bold text-blue-900"
        >
          Contact
        </router-link>
      </li>
      <li>
        <router-link
          to="/add"
          class="text-gray-700 hover:text-blue-700"
          active-class="font-bold text-blue-900"
        >
          Add
        </router-link>
      </li>
    </ul>
  </nav>
</template>
