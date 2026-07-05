<script setup>
import Discount from '../components/Discount.vue';
import Menu from './menu.vue';
</script>

<template>
  <div class="flex w-full h-full">
    <div class="w-2/5">
      <Discount />
    </div>

    <div class="w-3/5 float-end -ms-1">
      <Menu />
    </div>
  </div>
</template>
