export const formatTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleTimeString('th-TH', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

export const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('เบราว์เซอร์ไม่รองรับการตรวจสอบตำแหน่ง'))
      return
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        })
      },
      (error) => {
        reject(new Error('ไม่สามารถตรวจสอบตำแหน่งได้ กรุณาอนุญาตการเข้าถึงตำแหน่ง'))
      },
      options
    )
  })
}

export const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(',')[1])
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  
  return new Blob([ab], { type: mimeString })
}

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

export const showNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      ...options
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }

    return notification
  }
}

export const checkOnlineStatus = () => {
  return navigator.onLine
}

export const addOnlineStatusListener = (callback) => {
  window.addEventListener('online', () => callback(true))
  window.addEventListener('offline', () => callback(false))
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}