import { createRouter, createWebHashHistory } from 'vue-router';

// User/Auth Pages
import AdminLogin from '../components/admin/UseradminLogin.vue';
import Login from '../components/logSign/Login.vue';
import Signup from '../components/logSign/Signup.vue';
import Home from '../components/page/Home.vue';
import NotFound from '../components/routes-err/NotFound.vue';

// Admin Discount Pages
import DiscountManager from '../components/admin/DiscountManager.vue';
import AddParcentage from '../components/admin/discount/AddParcentage.vue';
import AddProductForm from '../components/admin/discount/AddProductForm.vue';
import ProductList from '../components/admin/discount/ProductList.vue';

// Other Menu Pages
import Add from '../components/menu/Add.vue';

import Category from '../components/menu/Category.vue';
import Contact from '../components/menu/Contact.vue';
import Product from '../components/menu/Product.vue';
import Service from '../components/menu/Service.vue';
const routes = [
  { path: '/', redirect: '/home' },

  { path: '/useradminlogin', name: 'AdminLogin', component: AdminLogin },
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'Signup', component: Signup },

  {
    path: '/home',
    name: 'Home',
    component: Home, // ✅ Public
  },

  {
    path: '/discounts',
    component: DiscountManager,
    children: [
      { path: '', redirect: 'items' },
      { path: 'items', component: ProductList },
      { path: 'add', component: AddProductForm },
      { path: 'parcentage', component: AddParcentage },
    ],
  },

  { path: '/category', component: Category },
  { path: '/contact', component: Contact },
  { path: '/product', component: Product },
  { path: '/service', component: Service },
  { path: '/add', component: Add },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
