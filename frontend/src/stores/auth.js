import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const sessionToken = ref(localStorage.getItem('sessionToken'))
  const isInitialized = ref(false)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Set up axios defaults
  if (sessionToken.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${sessionToken.value}`
  }

  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials)
      
      if (response.data.success) {
        user.value = response.data.user
        sessionToken.value = response.data.sessionToken
        
        // Store token in localStorage and set axios header
        localStorage.setItem('sessionToken', sessionToken.value)
        axios.defaults.headers.common['Authorization'] = `Bearer ${sessionToken.value}`
        
        return { success: true }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'เข้าสู่ระบบไม่สำเร็จ' 
      }
    }
  }

  const logout = async () => {
    try {
      if (sessionToken.value) {
        await axios.post('/api/auth/logout')
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local state
      user.value = null
      sessionToken.value = null
      localStorage.removeItem('sessionToken')
      delete axios.defaults.headers.common['Authorization']
    }
  }

  const checkAuth = async () => {
    if (!sessionToken.value) {
      isInitialized.value = true
      return false
    }

    try {
      const response = await axios.get('/api/auth/verify')
      
      if (response.data.success) {
        user.value = response.data.user
        isInitialized.value = true
        return true
      }
    } catch (error) {
      console.error('Auth check error:', error)
      // Clear invalid token
      localStorage.removeItem('sessionToken')
      sessionToken.value = null
      delete axios.defaults.headers.common['Authorization']
    }
    
    isInitialized.value = true
    return false
  }

  return {
    user,
    sessionToken,
    isAuthenticated,
    isAdmin,
    isInitialized,
    login,
    logout,
    checkAuth
  }
})