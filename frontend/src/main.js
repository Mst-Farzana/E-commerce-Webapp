import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import './main.css';
import router from './router';
import en from './components/i18n/en.json';
import bn from './components/i18n/bn.json';
import ar from './components/i18n/ar.json';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
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
