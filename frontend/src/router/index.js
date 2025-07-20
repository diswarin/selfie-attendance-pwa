import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Import views
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import CheckIn from '../views/CheckIn.vue'
import History from '../views/History.vue'
import Admin from '../views/Admin.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/checkin',
    name: 'CheckIn',
    component: CheckIn,
    meta: { requiresAuth: true }
  },
  {
    path: '/history',
    name: 'History',
    component: History,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if user is authenticated
  if (!authStore.isAuthenticated && !authStore.isInitialized) {
    await authStore.checkAuth()
  }

  // Handle authentication requirements
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
  } else if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    next('/dashboard')
  } else {
    next()
  }
})

export default router