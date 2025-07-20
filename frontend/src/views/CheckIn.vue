<template>
  <div class="min-h-screen bg-gray-50">
    <Navigation />
    
    <div class="md:pl-64 pt-16">
      <div class="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900">
            {{ getPageTitle() }}
          </h1>
          <p class="mt-1 text-sm text-gray-600">
            ถ่ายเซลฟี่เพื่อยืนยันตัตน และตรวจสอบตำแหน่ง GPS
          </p>
        </div>

        <!-- Status Check -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="loading-spinner"></div>
        </div>

        <!-- Main Content -->
        <div v-else class="space-y-6">
          <!-- Camera Section -->
          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">ถ่ายเซลฟี่</h2>
            
            <!-- Camera Preview -->
            <div v-if="!capturedPhoto" class="camera-preview bg-gray-100 rounded-lg overflow-hidden mb-4">
              <video
                ref="videoRef"
                autoplay
                playsinline
                muted
                class="w-full h-64 object-cover"
                :class="{ 'hidden': !cameraActive }"
              ></video>
              
              <div v-if="!cameraActive" class="h-64 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-4xl mb-2">📷</div>
                  <p class="text-gray-600">กดปุ่มเพื่อเปิดกล้อง</p>
                </div>
              </div>
              
              <!-- Camera Overlay -->
              <div v-if="cameraActive" class="camera-overlay"></div>
            </div>

            <!-- Captured Photo Preview -->
            <div v-if="capturedPhoto" class="mb-4">
              <img 
                :src="capturedPhoto" 
                alt="Captured selfie" 
                class="w-full h-64 object-cover rounded-lg"
              />
            </div>

            <!-- Camera Controls -->
            <div class="flex justify-center space-x-4">
              <button
                v-if="!cameraActive && !capturedPhoto"
                @click="startCamera"
                class="btn-primary"
                :disabled="processing"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                เปิดกล้อง
              </button>

              <button
                v-if="cameraActive && !capturedPhoto"
                @click="capturePhoto"
                class="btn-primary"
                :disabled="processing"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                ถ่ายรูป
              </button>

              <button
                v-if="capturedPhoto"
                @click="retakePhoto"
                class="btn-secondary"
                :disabled="processing"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                ถ่ายใหม่
              </button>
            </div>
          </div>

          <!-- Location Section -->
          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">ตำแหน่งปัจจุบัน</h2>
            
            <div v-if="!location && !locationError" class="text-center py-4">
              <div class="loading-spinner mx-auto mb-2"></div>
              <p class="text-gray-600">กำลังตรวจสอบตำแหน่ง...</p>
            </div>

            <div v-if="locationError" class="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {{ locationError }}
              </div>
              <button
                @click="getCurrentLocation"
                class="mt-2 btn-secondary text-sm"
              >
                ลองใหม่
              </button>
            </div>

            <div v-if="location" class="space-y-3">
              <div class="flex items-center text-green-600">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                ตำแหน่งตรวจพบแล้ว
              </div>
              <div class="text-sm text-gray-600">
                <p>ละติจูด: {{ location.latitude.toFixed(6) }}</p>
                <p>ลองจิจูด: {{ location.longitude.toFixed(6) }}</p>
                <p>ความแม่นยำ: {{ Math.round(location.accuracy) }} เมตร</p>
              </div>
            </div>
          </div>

          <!-- Submit Section -->
          <div class="card">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-medium text-gray-900">พร้อม{{ getActionText() }}แล้วหรือไม่?</h3>
                <p class="text-sm text-gray-600 mt-1">
                  ตรวจสอบรูปถ่ายและตำแหน่งก่อนยืนยัน
                </p>
              </div>
              <button
                @click="submitAttendance"
                :disabled="!canSubmit || processing"
                class="btn-primary"
                :class="{ 'opacity-50 cursor-not-allowed': !canSubmit || processing }"
              >
                <div v-if="processing" class="loading-spinner mr-2"></div>
                {{ processing ? 'กำลังบันทึก...' : `ยืนยัน${getActionText()}` }}
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="card bg-red-50 border border-red-200">
            <div class="flex items-center text-red-700">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {{ error }}
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="success" class="card bg-green-50 border border-green-200">
            <div class="flex items-center text-green-700">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ success }}
            </div>
            <router-link to="/dashboard" class="mt-3 btn-primary text-sm">
              กลับหน้าหลัก
            </router-link>
          </div>
        </div>
      </div>

      <!-- Mobile Bottom Padding -->
      <div class="h-20 md:hidden"></div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAttendanceStore } from '../stores/attendance'
import Navigation from '../components/Navigation.vue'

export default {
  name: 'CheckIn',
  components: {
    Navigation
  },
  setup() {
    const attendanceStore = useAttendanceStore()
    
    const loading = ref(true)
    const processing = ref(false)
    const cameraActive = ref(false)
    const capturedPhoto = ref(null)
    const photoBlob = ref(null)
    const location = ref(null)
    const locationError = ref('')
    const error = ref('')
    const success = ref('')
    const videoRef = ref(null)
    const stream = ref(null)

    const todayStatus = computed(() => attendanceStore.todayStatus)
    
    const isCheckOut = computed(() => {
      return todayStatus.value.hasCheckedIn && !todayStatus.value.hasCheckedOut
    })

    const canSubmit = computed(() => {
      return capturedPhoto.value && location.value && !processing.value
    })

    const getPageTitle = () => {
      return isCheckOut.value ? 'เช็คเอาท์' : 'เช็คอิน'
    }

    const getActionText = () => {
      return isCheckOut.value ? 'เช็คเอาท์' : 'เช็คอิน'
    }

    const startCamera = async () => {
      try {
        error.value = ''
        
        const constraints = {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          }
        }

        stream.value = await navigator.mediaDevices.getUserMedia(constraints)
        
        if (videoRef.value) {
          videoRef.value.srcObject = stream.value
          cameraActive.value = true
        }
      } catch (err) {
        console.error('Camera error:', err)
        error.value = 'ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตการใช้งานกล้อง'
      }
    }

    const capturePhoto = () => {
      try {
        const video = videoRef.value
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        context.drawImage(video, 0, 0)
        
        // Convert to blob for upload
        canvas.toBlob((blob) => {
          photoBlob.value = blob
          capturedPhoto.value = canvas.toDataURL('image/jpeg', 0.8)
        }, 'image/jpeg', 0.8)

        stopCamera()
      } catch (err) {
        console.error('Capture error:', err)
        error.value = 'ไม่สามารถถ่ายรูปได้'
      }
    }

    const retakePhoto = () => {
      capturedPhoto.value = null
      photoBlob.value = null
      error.value = ''
      success.value = ''
    }

    const stopCamera = () => {
      if (stream.value) {
        stream.value.getTracks().forEach(track => track.stop())
        stream.value = null
      }
      cameraActive.value = false
    }

    const getCurrentLocation = () => {
      if (!navigator.geolocation) {
        locationError.value = 'เบราว์เซอร์ไม่รองรับการตรวจสอบตำแหน่ง'
        return
      }

      locationError.value = ''
      
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          location.value = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString()
          }
        },
        (err) => {
          console.error('Location error:', err)
          locationError.value = 'ไม่สามารถตรวจสอบตำแหน่งได้ กรุณาอนุญาตการเข้าถึงตำแหน่ง'
        },
        options
      )
    }

    const submitAttendance = async () => {
      if (!canSubmit.value) return

      processing.value = true
      error.value = ''
      success.value = ''

      try {
        let result
        
        if (isCheckOut.value) {
          result = await attendanceStore.checkOut(photoBlob.value, location.value)
        } else {
          result = await attendanceStore.checkIn(photoBlob.value, location.value)
        }

        if (result.success) {
          success.value = result.message
          // Clear captured data
          capturedPhoto.value = null
          photoBlob.value = null
          location.value = null
        } else {
          error.value = result.error
        }
      } catch (err) {
        console.error('Submit error:', err)
        error.value = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
      } finally {
        processing.value = false
      }
    }

    const loadData = async () => {
      try {
        loading.value = true
        await attendanceStore.getTodayStatus()
      } catch (err) {
        console.error('Failed to load status:', err)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadData()
      getCurrentLocation()
    })

    onUnmounted(() => {
      stopCamera()
    })

    return {
      loading,
      processing,
      cameraActive,
      capturedPhoto,
      location,
      locationError,
      error,
      success,
      videoRef,
      todayStatus,
      isCheckOut,
      canSubmit,
      getPageTitle,
      getActionText,
      startCamera,
      capturePhoto,
      retakePhoto,
      getCurrentLocation,
      submitAttendance
    }
  }
}
</script>