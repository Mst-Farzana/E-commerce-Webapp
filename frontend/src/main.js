import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import ar from './components/i18n/ar.json';
import bn from './components/i18n/bn.json';
import en from './components/i18n/en.json';
import './main.css';
import router from './router';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://ecommerce-backend-0kft.onrender.com';
export default API_BASE;

const messages = { en, bn, ar };

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: localStorage.getItem('lang') || 'en',
  fallbackLocale: 'en',
  messages, // use the variable here
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount('#app');
