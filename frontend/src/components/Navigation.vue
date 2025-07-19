<template>
  <nav class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <span class="text-2xl">📷</span>
          <span class="ml-2 text-xl font-semibold text-gray-900">Selfie Check-in</span>
        </div>

        <div class="flex items-center space-x-4">
          <!-- User Info -->
          <div class="text-sm text-gray-700">
            สวัสดี, {{ user?.name }}
            <span v-if="user?.role === 'admin'" class="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              Admin
            </span>
          </div>

          <!-- Logout Button -->
          <button
            @click="handleLogout"
            class="text-gray-500 hover:text-gray-700 p-2"
            title="ออกจากระบบ"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Bottom Navigation for Mobile -->
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
    <div class="grid grid-cols-4 h-16">
      <router-link
        to="/dashboard"
        class="flex flex-col items-center justify-center text-xs"
        :class="isActive('/dashboard') ? 'text-primary-600' : 'text-gray-500'"
      >
        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span>หน้าหลัก</span>
      </router-link>

      <router-link
        to="/checkin"
        class="flex flex-col items-center justify-center text-xs"
        :class="isActive('/checkin') ? 'text-primary-600' : 'text-gray-500'"
      >
        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>เช็คอิน</span>
      </router-link>

      <router-link
        to="/history"
        class="flex flex-col items-center justify-center text-xs"
        :class="isActive('/history') ? 'text-primary-600' : 'text-gray-500'"
      >
        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span>ประวัติ</span>
      </router-link>

      <router-link
        v-if="user?.role === 'admin'"
        to="/admin"
        class="flex flex-col items-center justify-center text-xs"
        :class="isActive('/admin') ? 'text-primary-600' : 'text-gray-500'"
      >
        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>จัดการ</span>
      </router-link>
    </div>
  </div>

  <!-- Desktop Sidebar Navigation -->
  <div class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 pt-16">
    <div class="flex-1 flex flex-col min-h-0 bg-gray-50 border-r border-gray-200">
      <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav class="mt-5 flex-1 px-2 space-y-1">
          <router-link
            to="/dashboard"
            class="nav-link"
            :class="isActive('/dashboard') ? 'nav-link-active' : 'nav-link-inactive'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            แดชบอร์ด
          </router-link>

          <router-link
            to="/checkin"
            class="nav-link"
            :class="isActive('/checkin') ? 'nav-link-active' : 'nav-link-inactive'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            เช็คอิน/เช็คเอาท์
          </router-link>

          <router-link
            to="/history"
            class="nav-link"
            :class="isActive('/history') ? 'nav-link-active' : 'nav-link-inactive'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            ประวัติการเข้างาน
          </router-link>

          <router-link
            v-if="user?.role === 'admin'"
            to="/admin"
            class="nav-link"
            :class="isActive('/admin') ? 'nav-link-active' : 'nav-link-inactive'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            จัดการระบบ
          </router-link>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Navigation',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()

    const user = computed(() => authStore.user)

    const isActive = (path) => {
      return route.path === path
    }

    const handleLogout = async () => {
      await authStore.logout()
      router.push('/login')
    }

    return {
      user,
      isActive,
      handleLogout
    }
  }
}
</script>

<style scoped>
.nav-link {
  @apply flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200;
}

.nav-link-active {
  @apply bg-primary-100 text-primary-900;
}

.nav-link-inactive {
  @apply text-gray-600 hover:bg-gray-50 hover:text-gray-900;
}
</style>