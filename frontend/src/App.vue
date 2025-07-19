<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Offline Indicator -->
    <div v-if="!isOnline" class="offline-indicator">
      🔌 คุณอยู่ในโหมดออฟไลน์
    </div>
    
    <!-- PWA Install Prompt -->
    <div v-if="showInstallPrompt" class="install-prompt">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold">ติดตั้งแอปในเครื่อง</h3>
          <p class="text-sm opacity-90">เพื่อประสบการณ์ที่ดีขึ้น</p>
        </div>
        <div class="flex gap-2">
          <button @click="installPWA" class="bg-white text-black px-3 py-1 rounded text-sm">ติดตั้ง</button>
          <button @click="dismissInstall" class="bg-transparent border border-white px-3 py-1 rounded text-sm">ปิด</button>
        </div>
      </div>
    </div>

    <router-view />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'App',
  setup() {
    const isOnline = ref(navigator.onLine)
    const showInstallPrompt = ref(false)
    let deferredPrompt = null

    onMounted(() => {
      // Listen for online/offline events
      window.addEventListener('online', () => {
        isOnline.value = true
      })
      
      window.addEventListener('offline', () => {
        isOnline.value = false
      })

      // Listen for PWA install prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        deferredPrompt = e
        showInstallPrompt.value = true
      })

      // Listen for app installed
      window.addEventListener('appinstalled', () => {
        showInstallPrompt.value = false
        deferredPrompt = null
      })
    })

    const installPWA = async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        console.log(`User response to the install prompt: ${outcome}`)
        deferredPrompt = null
        showInstallPrompt.value = false
      }
    }

    const dismissInstall = () => {
      showInstallPrompt.value = false
      deferredPrompt = null
    }

    return {
      isOnline,
      showInstallPrompt,
      installPWA,
      dismissInstall
    }
  }
}
</script>