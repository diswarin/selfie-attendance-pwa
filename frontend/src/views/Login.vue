<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 px-4">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="mx-auto h-24 w-24 bg-white rounded-full flex items-center justify-center mb-4">
          <span class="text-4xl">📷</span>
        </div>
        <h2 class="text-3xl font-bold text-white">
          Selfie Check-in
        </h2>
        <p class="mt-2 text-primary-100">
          ระบบเช็คอินด้วยเซลฟี่
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div class="card">
          <div class="space-y-4">
            <div>
              <label for="employee_id" class="block text-sm font-medium text-gray-700 mb-1">
                รหัสพนักงาน
              </label>
              <input
                id="employee_id"
                v-model="form.employee_id"
                type="text"
                required
                class="input-field"
                placeholder="กรอกรหัสพนักงาน"
                :disabled="loading"
              />
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                รหัสผ่าน
              </label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                class="input-field"
                placeholder="กรอกรหัสผ่าน"
                :disabled="loading"
              />
            </div>
          </div>

          <div class="mt-6">
            <button
              type="submit"
              :disabled="loading"
              class="w-full btn-primary flex justify-center items-center"
            >
              <div v-if="loading" class="loading-spinner mr-2"></div>
              {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
            </button>
          </div>

          <div v-if="error" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {{ error }}
          </div>
        </div>
      </form>

      <!-- Demo Accounts -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">บัญชีทดสอบ</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="font-medium">ผู้ดูแลระบบ:</span>
            <span class="text-gray-600">admin / admin123</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">พนักงาน:</span>
            <span class="text-gray-600">emp001 / 123456</span>
          </div>
        </div>
        <div class="mt-3 flex gap-2">
          <button
            @click="fillDemo('admin')"
            class="btn-secondary text-xs flex-1"
            :disabled="loading"
          >
            ใช้บัญชี Admin
          </button>
          <button
            @click="fillDemo('employee')"
            class="btn-secondary text-xs flex-1"
            :disabled="loading"
          >
            ใช้บัญชีพนักงาน
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const form = ref({
      employee_id: '',
      password: ''
    })
    
    const loading = ref(false)
    const error = ref('')

    const handleLogin = async () => {
      if (!form.value.employee_id || !form.value.password) {
        error.value = 'กรุณากรอกข้อมูลให้ครบถ้วน'
        return
      }

      loading.value = true
      error.value = ''

      try {
        const result = await authStore.login(form.value)
        
        if (result.success) {
          router.push('/dashboard')
        } else {
          error.value = result.error
        }
      } catch (err) {
        error.value = 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
      } finally {
        loading.value = false
      }
    }

    const fillDemo = (type) => {
      if (type === 'admin') {
        form.value.employee_id = 'admin'
        form.value.password = 'admin123'
      } else {
        form.value.employee_id = 'emp001'
        form.value.password = '123456'
      }
      error.value = ''
    }

    return {
      form,
      loading,
      error,
      handleLogin,
      fillDemo
    }
  }
}
</script>