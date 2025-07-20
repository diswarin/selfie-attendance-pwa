<template>
  <div class="min-h-screen bg-gray-50">
    <Navigation />
    
    <div class="md:pl-64 pt-16">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900">แดชบอร์ด</h1>
          <p class="mt-1 text-sm text-gray-600">
            {{ getCurrentDate() }}
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="loading-spinner"></div>
        </div>

        <!-- Dashboard Content -->
        <div v-else class="space-y-6">
          <!-- Today's Status -->
          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">สถานะวันนี้</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Check-in Status -->
              <div class="border rounded-lg p-4" :class="todayStatus.hasCheckedIn ? 'border-green-200 bg-green-50' : 'border-gray-200'">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900">เช็คอิน</h3>
                    <p class="text-sm text-gray-600">
                      {{ todayStatus.hasCheckedIn ? formatTime(todayStatus.checkInTime) : 'ยังไม่ได้เช็คอิน' }}
                    </p>
                  </div>
                  <div class="text-2xl">
                    {{ todayStatus.hasCheckedIn ? '✅' : '⏰' }}
                  </div>
                </div>
              </div>

              <!-- Check-out Status -->
              <div class="border rounded-lg p-4" :class="todayStatus.hasCheckedOut ? 'border-green-200 bg-green-50' : 'border-gray-200'">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-gray-900">เช็คเอาท์</h3>
                    <p class="text-sm text-gray-600">
                      {{ todayStatus.hasCheckedOut ? formatTime(todayStatus.checkOutTime) : 'ยังไม่ได้เช็คเอาท์' }}
                    </p>
                  </div>
                  <div class="text-2xl">
                    {{ todayStatus.hasCheckedOut ? '✅' : '⏰' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">การดำเนินการ</h2>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <router-link
                to="/checkin"
                class="block p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200"
              >
                <div class="text-center">
                  <div class="text-4xl mb-2">📷</div>
                  <h3 class="text-lg font-medium text-gray-900">
                    {{ getCheckInButtonText() }}
                  </h3>
                  <p class="text-sm text-gray-600 mt-1">
                    ถ่ายเซลฟี่เพื่อเช็คอิน/เช็คเอาท์
                  </p>
                </div>
              </router-link>

              <router-link
                to="/history"
                class="block p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200"
              >
                <div class="text-center">
                  <div class="text-4xl mb-2">📋</div>
                  <h3 class="text-lg font-medium text-gray-900">ประวัติการเข้างาน</h3>
                  <p class="text-sm text-gray-600 mt-1">
                    ดูประวัติการเช็คอิน/เช็คเอาท์
                  </p>
                </div>
              </router-link>
            </div>
          </div>

          <!-- Recent Attendance -->
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900">การเข้างานล่าสุด</h2>
              <router-link
                to="/history"
                class="text-sm text-primary-600 hover:text-primary-700"
              >
                ดูทั้งหมด
              </router-link>
            </div>

            <div v-if="recentHistory.length === 0" class="text-center py-8 text-gray-500">
              ไม่มีข้อมูลการเข้างาน
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="record in recentHistory"
                :key="record.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatDate(record.date) }}
                  </div>
                  <div class="text-xs text-gray-600">
                    เช็คอิน: {{ formatTime(record.check_in_time) }}
                    <span v-if="record.check_out_time" class="ml-3">
                      เช็คเอาท์: {{ formatTime(record.check_out_time) }}
                    </span>
                  </div>
                </div>
                <div class="text-right">
                  <span
                    class="status-badge"
                    :class="getStatusClass(record)"
                  >
                    {{ getStatusText(record) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Admin Dashboard -->
          <div v-if="user?.role === 'admin'" class="card">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900">สำหรับผู้ดูแล</h2>
              <router-link
                to="/admin"
                class="text-sm text-primary-600 hover:text-primary-700"
              >
                ไปยังหน้าจัดการ
              </router-link>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="text-center p-4 bg-blue-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">{{ adminStats.totalEmployees || 0 }}</div>
                <div class="text-sm text-blue-600">พนักงานทั้งหมด</div>
              </div>
              <div class="text-center p-4 bg-green-50 rounded-lg">
                <div class="text-2xl font-bold text-green-600">{{ adminStats.presentToday || 0 }}</div>
                <div class="text-sm text-green-600">เข้างานวันนี้</div>
              </div>
              <div class="text-center p-4 bg-yellow-50 rounded-lg">
                <div class="text-2xl font-bold text-yellow-600">{{ adminStats.checkedOutToday || 0 }}</div>
                <div class="text-sm text-yellow-600">เช็คเอาท์แล้ว</div>
              </div>
              <div class="text-center p-4 bg-red-50 rounded-lg">
                <div class="text-2xl font-bold text-red-600">{{ adminStats.absentToday || 0 }}</div>
                <div class="text-sm text-red-600">ขาดงานวันนี้</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Bottom Padding -->
      <div class="h-20 md:hidden"></div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useAttendanceStore } from '../stores/attendance'
import Navigation from '../components/Navigation.vue'
import axios from 'axios'

export default {
  name: 'Dashboard',
  components: {
    Navigation
  },
  setup() {
    const authStore = useAuthStore()
    const attendanceStore = useAttendanceStore()
    
    const loading = ref(true)
    const recentHistory = ref([])
    const adminStats = ref({})

    const user = computed(() => authStore.user)
    const todayStatus = computed(() => attendanceStore.todayStatus)

    const getCurrentDate = () => {
      return new Date().toLocaleDateString('th-TH', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const getCheckInButtonText = () => {
      if (!todayStatus.value.hasCheckedIn) {
        return 'เช็คอิน'
      } else if (!todayStatus.value.hasCheckedOut) {
        return 'เช็คเอาท์'
      } else {
        return 'เช็คอิน/เช็คเอาท์'
      }
    }

    const formatTime = (dateString) => {
      return attendanceStore.formatTime(dateString)
    }

    const formatDate = (dateString) => {
      return attendanceStore.formatDate(dateString)
    }

    const getStatusClass = (record) => {
      if (!record.check_in_time) return 'status-absent'
      
      const checkInHour = new Date(record.check_in_time).getHours()
      if (checkInHour > 9) return 'status-late'
      
      return 'status-present'
    }

    const getStatusText = (record) => {
      if (!record.check_in_time) return 'ขาดงาน'
      
      const checkInHour = new Date(record.check_in_time).getHours()
      if (checkInHour > 9) return 'สาย'
      
      return 'ปกติ'
    }

    const loadData = async () => {
      try {
        loading.value = true
        
        // Load today's status
        await attendanceStore.getTodayStatus()
        
        // Load recent history (last 5 records)
        await attendanceStore.getHistory(5)
        recentHistory.value = attendanceStore.history
        
        // Load admin stats if user is admin
        if (user.value?.role === 'admin') {
          try {
            const response = await axios.get('/api/admin/stats')
            if (response.data.success) {
              adminStats.value = response.data.stats
            }
          } catch (error) {
            console.error('Failed to load admin stats:', error)
          }
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadData()
    })

    return {
      user,
      loading,
      todayStatus,
      recentHistory,
      adminStats,
      getCurrentDate,
      getCheckInButtonText,
      formatTime,
      formatDate,
      getStatusClass,
      getStatusText
    }
  }
}
</script>