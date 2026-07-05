<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAdminAuthStore } from '../stores/adminAuth'; // ✅ Correct store import
import Login from './logSign/Login.vue';
import Signup from './logSign/Signup.vue';

const props = defineProps({ language: String });
const emit = defineEmits(['lang-change']);

const { t } = useI18n();

// ✅ Auth Store
const adminAuth = useAdminAuthStore();
const isAdminLoggedInValue = computed(() => adminAuth.isAdminLoggedIn);

const searchQuery = ref('');
function handleSearch() {
  if (!searchQuery.value.trim()) {
    alert(t('please_enter_search_term') || 'Please enter a search term!');
    return;
  }
  console.log('Searching for:', searchQuery.value);
}

// User login/signup
const user = ref(null);
const showLogin = ref(false);
const showSignup = ref(false);

const openLogin = () => {
  if (!user.value) {
    showLogin.value = true;
    showSignup.value = false;
  }
};
const showSignupForm = () => {
  showSignup.value = true;
  showLogin.value = false;
};
const closeForm = () => {
  showLogin.value = false;
  showSignup.value = false;
};

const onLoggedIn = loggedUser => {
  user.value = loggedUser;
  localStorage.setItem('user', JSON.stringify(loggedUser));
  closeForm();
};

const handleLogout = () => {
  adminAuth.logoutAdmin(); // ✅ call logout from store
  localStorage.removeItem('user');
  user.value = null;
};

// Load user on mount
onMounted(() => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    user.value = JSON.parse(savedUser);
  }
});

// Date & Time
const now = new Date();
const weekdaysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthsEn = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const weekdaysBn = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
const banglaMonths = [
  'বৈশাখ',
  'জ্যৈষ্ঠ',
  'আষাঢ়',
  'শ্রাবণ',
  'ভাদ্র',
  'আশ্বিন',
  'কার্তিক',
  'অগ্রহায়ণ',
  'পৌষ',
  'মাঘ',
  'ফাল্গুন',
  'চৈত্র',
];
const weekdaysAr = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const monthsAr = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

const toBanglaDigit = n => n.toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);

const dateEn = `${weekdaysEn[now.getDay()]}, ${
  monthsEn[now.getMonth()]
} ${now.getDate()}, ${now.getFullYear()}`;
const banglaMonthIndex = (now.getMonth() + 11) % 12;
const banglaDay = ((now.getDate() + 13) % 30) + 1;
const banglaYear = now.getFullYear() - 593;
const dateBn = `${weekdaysBn[now.getDay()]}, ${toBanglaDigit(banglaDay)} ${
  banglaMonths[banglaMonthIndex]
}, ${toBanglaDigit(banglaYear)} বংগাব্দ`;
const dateAr = `${weekdaysAr[now.getDay()]}، ${now.getDate()} ${
  monthsAr[now.getMonth()]
}، ${now.getFullYear()}`;

const dateSlides = ref([dateEn, dateBn, dateAr]);
const activeIndex = ref(0);
const currentSlide = computed(() => dateSlides.value[activeIndex.value]);

const timeBn = ref('');
const updateTime = () => {
  const t = new Date();
  let hour = t.getHours();
  let min = t.getMinutes();
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  timeBn.value = `${toBanglaDigit(hour)}:${toBanglaDigit(min.toString().padStart(2, '0'))} ${ampm}`;
};

onMounted(() => {
  updateTime();
  setInterval(updateTime, 60000);
  setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % dateSlides.value.length;
  }, 3000);
});
</script>

<template>
  <div class="bg-blue-100 leading-tight relative">
    <div class="max-w-7xl mx-auto flex justify-between items-center gap-4 px-4 py-2 relative">
      <!-- Left -->
      <div class="flex items-center gap-4 w-1/3 font-sans">
        <router-link to="/" class="text-xl font-bold text-blue-600 whitespace-nowrap">
          🏭️ ShopEase
        </router-link>
        <div class="relative w-full">
          <input
            type="text"
            :placeholder="t('search_placeholder')"
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            class="w-full border border-gray-300 rounded-full px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-4 focus:ring-blue-400"
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
            @click="handleSearch"
            aria-label="Search"
          >
            🔍
          </button>
        </div>
      </div>

      <!-- Center -->
      <div class="flex flex-col items-center text-green-800 text-sm w-1/3 text-center">
        <div class="font-semibold tracking-widest mb-1 whitespace-nowrap">
          پسمِ پاللِٰهِ پالرَّحڸمَِنِ پالرَّحِيمِ
        </div>
        <transition name="slide-fade" mode="out-in">
          <div :key="activeIndex" class="text-[10px] whitespace-nowrap">🗕️ {{ currentSlide }}</div>
        </transition>
        <div class="text-gray-600 text-xs mt-0.5 whitespace-nowrap">🕒 {{ timeBn }}</div>
      </div>

      <!-- Right -->
      <div class="flex items-center justify-end gap-4 w-1/3">
        <template v-if="user">
          <span class="text-sm text-gray-700 whitespace-nowrap">
            👋 {{ t('welcome') }}, {{ user.firstName }}
          </span>
          <button @click="handleLogout" class="text-red-600 hover:text-red-800 text-sm font-medium">
            {{ t('logout') }}
          </button>
        </template>
        <template v-else>
          <button
            @click="openLogin"
            class="text-gray-700 btn-open-login hover:text-blue-600 text-sm font-medium"
          >
            {{ t('login') }}
          </button>
          <button
            @click="showSignupForm"
            class="btn-open-signup text-sm font-medium hover:text-blue-800"
          >
            {{ t('signup') }}
          </button>
        </template>

        <select
          :value="props.language"
          @change="e => emit('lang-change', e.target.value)"
          class="text-[10px] border border-gray-300 rounded px-2 py-1 me-8 focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          <option value="en">EN</option>
          <option value="bn">বাংলা</option>
          <option value="ar">عربى</option>
        </select>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showSignup || showLogin"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      @click.self="closeForm"
    >
      <div class="bg-white p-6 rounded shadow-md w-full max-w-md relative" @click.stop>
        <button @click="closeForm" class="absolute top-2 right-2 text-xl font-bold">&times;</button>
        <Signup v-if="showSignup" @close="closeForm" />
        <Login v-if="showLogin" @logged-in="onLoggedIn" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.6s ease;
}
.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
