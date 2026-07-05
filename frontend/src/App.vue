<script setup>
import { ref, computed, watch } from 'vue';
import topBar from './components/topBar.vue';
import AdminDashboard from './components/admin/AdminDashboard.vue';
import { useAdminAuthStore } from './stores/adminAuth'; // ✅ Correct store usage
import { useRouter } from 'vue-router';
import menuBar from './components/menuBar.vue';
import { useI18n } from 'vue-i18n';
import Footer from './components/Footer.vue';

const { locale } = useI18n();
const currentLang = ref('en');

const adminAuth = useAdminAuthStore(); // ✅

const router = useRouter();
const showAdminSidebar = ref(false);
const isAdmin = computed(() => adminAuth.isAdminLoggedIn); // ✅ use store state

function toggleAdminSidebar() {
  showAdminSidebar.value = !showAdminSidebar.value;
}

function handleLogout() {
  adminAuth.logoutAdmin(); // ✅ use store action
  showAdminSidebar.value = false;
  router.push('/useradminlogin');
}

// Load saved language
const savedLang = localStorage.getItem('lang');
if (savedLang) {
  currentLang.value = savedLang;
  locale.value = savedLang;
}

// Watch language and update direction
watch(
  currentLang,
  lang => {
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
  },
  { immediate: true }
);

// Update lang on change
const updateLang = lang => {
  currentLang.value = lang;
  locale.value = lang;
  localStorage.setItem('lang', lang);
};
</script>

<template>
  <div>
    <topBar :language="currentLang.value" @lang-change="updateLang" />

    <!-- Show hamburger button only if admin is logged in -->
    <button
      v-if="isAdmin"
      @click="toggleAdminSidebar"
      class="fixed top-3 right-3 z-50 text-3xl cursor-pointer"
      aria-label="Toggle Admin Sidebar"
    >
      &#9776;
    </button>

    <!-- Admin Sidebar, only visible on toggle -->
    <div
      v-if="showAdminSidebar"
      class="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-40 p-4"
    >
      <button @click="toggleAdminSidebar" class="text-xl font-bold mb-4">
        &times;
      </button>

      <AdminDashboard />

      <button
        @click="handleLogout"
        class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
    <menuBar />

    <!-- Main router-view shows all routes except AdminDashboard (which was removed) -->
    <router-view />
    <Footer />
  </div>
</template>
