<template>
  <div class="min-h-screen bg-gray-50">
    <Navigation />
    
    <div class="md:pl-64 pt-16">
      <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900">ประวัติการเข้างาน</h1>
          <p class="mt-1 text-sm text-gray-600">
            ดูประวัติการเช็คอิน/เช็คเอาท์และสถิติการทำงาน
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="loading-spinner"></div>
        </div>

        <!-- Content -->
        <div v-else class="space-y-6">
          <!-- Monthly Stats -->
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900">สถิติประจำเดือน</h2>
              <div class="flex items-center space-x-2">
                <select
                  v-model="selectedMonth"
                  @change="loadMonthlyStats"
                  class="input-field text-sm"
                >
                  <option v-for="month in months" :key="month.value" :value="month.value">
                    {{ month.label }}
                  </option>
                </select>
                <select
                  v-model="selectedYear"
                  @change="loadMonthlyStats"
                  class="input-field text-sm"
                >
                  <option v-for="year in years" :key="year" :value="year">
                    {{ year }}
                  </option>
                </select>
              </div>
            </div>

            <div v-if="monthlyStats" class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="text-center p-4 bg-blue-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">{{ monthlyStats.totalDays }}</div>
                <div class="text-sm text-blue-600">วันทำงาน</div>
              </div>
              <div class="text-center p-4 bg-green-50 rounded-lg">
                <div class="text-2xl font-bold text-green-600">{{ monthlyStats.presentDays }}</div>
                <div class="text-sm text-green-600">วันที่เข้างาน</div>
              </div>
              <div class="text-center p-4 bg-yellow-50 rounded-lg">
                <div class="text-2xl font-bold text-yellow-600">{{ monthlyStats.lateDays }}</div>
                <div class="text-sm text-yellow-600">วันที่เข้าสาย</div>
              </div>
              <div class="text-center p-4 bg-green-50 rounded-lg">
                <div class="text-2xl font-bold text-green-600">{{ monthlyStats.onTimeDays }}</div>
                <div class="text-sm text-green-600">วันที่เข้าตรงเวลา</div>
              </div>
            </div>
          </div>

          <!-- History List -->
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900">ประวัติการเข้างาน</h2>
              <button
                @click="refreshHistory"
                class="btn-secondary text-sm"
                :disabled="loading"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                รีเฟรช
              </button>
            </div>

            <div v-if="history.length === 0" class="text-center py-12">
              <div class="text-4xl mb-4">📋</div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">ไม่มีข้อมูลการเข้างาน</h3>
              <p class="text-gray-600">เริ่มต้นเช็คอินเพื่อดูประวัติการทำงาน</p>
              <router-link to="/checkin" class="btn-primary mt-4">
                เช็คอินตอนนี้
              </router-link>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="record in history"
                :key="record.id"
                class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <h3 class="font-medium text-gray-900">
                      {{ formatDate(record.date) }}
                    </h3>
                    <p class="text-sm text-gray-600">
                      {{ formatDateWithDay(record.date) }}
                    </p>
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

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Check-in -->
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                      <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">เช็คอิน</p>
                      <p class="text-sm text-gray-600">
                        {{ record.check_in_time ? formatTime(record.check_in_time) : 'ไม่มีข้อมูล' }}
                      </p>
                    </div>
                    <div v-if="record.check_in_photo" class="flex-shrink-0">
                      <img
                        :src="`/uploads/${record.check_in_photo}`"
                        alt="Check-in photo"
                        class="w-12 h-12 rounded-full object-cover cursor-pointer"
                        @click="showPhoto(`/uploads/${record.check_in_photo}`)"
                      />
                    </div>
                  </div>

                  <!-- Check-out -->
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                      <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">เช็คเอาท์</p>
                      <p class="text-sm text-gray-600">
                        {{ record.check_out_time ? formatTime(record.check_out_time) : 'ยังไม่ได้เช็คเอาท์' }}
                      </p>
                    </div>
                    <div v-if="record.check_out_photo" class="flex-shrink-0">
                      <img
                        :src="`/uploads/${record.check_out_photo}`"
                        alt="Check-out photo"
                        class="w-12 h-12 rounded-full object-cover cursor-pointer"
                        @click="showPhoto(`/uploads/${record.check_out_photo}`)"
                      />
                    </div>
                  </div>
                </div>

                <!-- Working Hours -->
                <div v-if="record.check_in_time && record.check_out_time" class="mt-3 pt-3 border-t border-gray-100">
                  <div class="flex items-center text-sm text-gray-600">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ชั่วโมงทำงาน: {{ calculateWorkingHours(record.check_in_time, record.check_out_time) }} ชั่วโมง
                  </div>
                </div>
              </div>
            </div>

            <!-- Load More Button -->
            <div v-if="history.length >= 30" class="text-center mt-6">
              <button
                @click="loadMoreHistory"
                class="btn-secondary"
                :disabled="loading"
              >
                โหลดเพิ่มเติม
              </button>
            </div>
          </div>
        </div>

        <!-- Photo Modal -->
        <div
          v-if="selectedPhoto"
          class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          @click="closePhoto"
        >
          <div class="max-w-2xl max-h-full">
            <img
              :src="selectedPhoto"
              alt="Attendance photo"
              class="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              @click="closePhoto"
              class="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
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
import { useAttendanceStore } from '../stores/attendance'
import Navigation from '../components/Navigation.vue'

export default {
  name: 'History',
  components: {
    Navigation
  },
  setup() {
    const attendanceStore = useAttendanceStore()
    
    const loading = ref(true)
    const selectedPhoto = ref(null)
    const monthlyStats = ref(null)
    const selectedMonth = ref(new Date().getMonth() + 1)
    const selectedYear = ref(new Date().getFullYear())

    const history = computed(() => attendanceStore.history)

    // Generate month options
    const months = [
      { value: 1, label: 'มกราคม' },
      { value: 2, label: 'กุมภาพันธ์' },
      { value: 3, label: 'มีนาคม' },
      { value: 4, label: 'เมษายน' },
      { value: 5, label: 'พฤษภาคม' },
      { value: 6, label: 'มิถุนายน' },
      { value: 7, label: 'กรกฎาคม' },
      { value: 8, label: 'สิงหาคม' },
      { value: 9, label: 'กันยายน' },
      { value: 10, label: 'ตุลาคม' },
      { value: 11, label: 'พฤศจิกายน' },
      { value: 12, label: 'ธันวาคม' }
    ]

    // Generate year options (current year and past 2 years)
    const currentYear = new Date().getFullYear()
    const years = [currentYear, currentYear - 1, currentYear - 2]

    const formatTime = (dateString) => {
      return attendanceStore.formatTime(dateString)
    }

    const formatDate = (dateString) => {
      return attendanceStore.formatDate(dateString)
    }

    const formatDateWithDay = (dateString) => {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('th-TH', {
        weekday: 'long'
      })
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
      if (checkInHour > 9) return 'เข้าสาย'
      
      return 'ปกติ'
    }

    const calculateWorkingHours = (checkIn, checkOut) => {
      if (!checkIn || !checkOut) return '0'
      
      const startTime = new Date(checkIn)
      const endTime = new Date(checkOut)
      const diffMs = endTime - startTime
      const diffHours = diffMs / (1000 * 60 * 60)
      
      return diffHours.toFixed(1)
    }

    const showPhoto = (photoUrl) => {
      selectedPhoto.value = photoUrl
    }

    const closePhoto = () => {
      selectedPhoto.value = null
    }

    const loadHistory = async () => {
      try {
        loading.value = true
        await attendanceStore.getHistory(30)
      } catch (error) {
        console.error('Failed to load history:', error)
      } finally {
        loading.value = false
      }
    }

    const loadMoreHistory = async () => {
      try {
        loading.value = true
        const currentLength = history.value.length
        await attendanceStore.getHistory(currentLength + 30)
      } catch (error) {
        console.error('Failed to load more history:', error)
      } finally {
        loading.value = false
      }
    }

    const refreshHistory = () => {
      loadHistory()
    }

    const loadMonthlyStats = async () => {
      try {
        monthlyStats.value = await attendanceStore.getMonthlyStats(
          selectedYear.value,
          selectedMonth.value
        )
      } catch (error) {
        console.error('Failed to load monthly stats:', error)
      }
    }

    onMounted(async () => {
      await loadHistory()
      await loadMonthlyStats()
    })

    return {
      loading,
      history,
      selectedPhoto,
      monthlyStats,
      selectedMonth,
      selectedYear,
      months,
      years,
      formatTime,
      formatDate,
      formatDateWithDay,
      getStatusClass,
      getStatusText,
      calculateWorkingHours,
      showPhoto,
      closePhoto,
      loadMoreHistory,
      refreshHistory,
      loadMonthlyStats
    }
  }
}
</script>