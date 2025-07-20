import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useAttendanceStore = defineStore('attendance', () => {
  const todayStatus = ref({
    hasCheckedIn: false,
    hasCheckedOut: false,
    checkInTime: null,
    checkOutTime: null
  })
  const history = ref([])
  const loading = ref(false)

  const getTodayStatus = async () => {
    try {
      loading.value = true
      const response = await axios.get('/api/attendance/status')
      
      if (response.data.success) {
        todayStatus.value = response.data.status
      }
    } catch (error) {
      console.error('Get status error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const checkIn = async (photoBlob, location) => {
    try {
      loading.value = true
      const formData = new FormData()
      formData.append('photo', photoBlob, 'checkin.jpg')
      formData.append('location', JSON.stringify(location))

      const response = await axios.post('/api/attendance/checkin', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        // Update today's status
        await getTodayStatus()
        return { success: true, message: response.data.message }
      }
    } catch (error) {
      console.error('Check-in error:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'เช็คอินไม่สำเร็จ' 
      }
    } finally {
      loading.value = false
    }
  }

  const checkOut = async (photoBlob, location) => {
    try {
      loading.value = true
      const formData = new FormData()
      formData.append('photo', photoBlob, 'checkout.jpg')
      formData.append('location', JSON.stringify(location))

      const response = await axios.post('/api/attendance/checkout', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        // Update today's status
        await getTodayStatus()
        return { success: true, message: response.data.message }
      }
    } catch (error) {
      console.error('Check-out error:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'เช็คเอาท์ไม่สำเร็จ' 
      }
    } finally {
      loading.value = false
    }
  }

  const getHistory = async (limit = 30) => {
    try {
      loading.value = true
      const response = await axios.get(`/api/attendance/history?limit=${limit}`)
      
      if (response.data.success) {
        history.value = response.data.history
      }
    } catch (error) {
      console.error('Get history error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const getMonthlyStats = async (year, month) => {
    try {
      const response = await axios.get(`/api/attendance/stats/${year}/${month}`)
      
      if (response.data.success) {
        return response.data.stats
      }
    } catch (error) {
      console.error('Get monthly stats error:', error)
      throw error
    }
  }

  // Utility function to format time
  const formatTime = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleTimeString('th-TH', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // Utility function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return {
    todayStatus,
    history,
    loading,
    getTodayStatus,
    checkIn,
    checkOut,
    getHistory,
    getMonthlyStats,
    formatTime,
    formatDate
  }
})