// stores/adminAuth.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import jwtDecode from 'jwt-decode';

export const useAdminAuthStore = defineStore('adminAuth', () => {
  const accessToken = ref(localStorage.getItem('accessToken') || null);
  const refreshToken = ref(localStorage.getItem('refreshToken') || null);
  const adminUser = ref(
    accessToken.value ? decodeToken(accessToken.value) : null
  );

  function decodeToken(token) {
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }

  function loginAdmin({ accessToken: at, refreshToken: rt, user }) {
    accessToken.value = at;
    refreshToken.value = rt;
    adminUser.value = user || decodeToken(at);

    localStorage.setItem('accessToken', at);
    localStorage.setItem('refreshToken', rt);
    localStorage.setItem('adminUser', JSON.stringify(adminUser.value));
  }

  function logoutAdmin() {
    accessToken.value = null;
    refreshToken.value = null;
    adminUser.value = null;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('adminUser');
  }

  const isAdminLoggedIn = computed(() => {
    if (!accessToken.value) return false;
    const decoded = decodeToken(accessToken.value);
    return decoded?.exp ? decoded.exp * 1000 > Date.now() : false;
  });

  return {
    accessToken,
    refreshToken,
    adminUser,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
  };
});
