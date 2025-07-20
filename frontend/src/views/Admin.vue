<template>
  <div class="min-h-screen bg-gray-50">
    <Navigation />
    
    <div class="md:pl-64 pt-16">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900">จัดการระบบ</h1>
          <p class="mt-1 text-sm text-gray-600">
            จัดการพนักงาน ดูรายงานการเข้างาน และสถิติระบบ
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="loading-spinner"></div>
        </div>

        <!-- Content -->
        <div v-else class="space-y-6">
          <!-- Stats Overview -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="card">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">พนักงานทั้งหมด</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats.totalEmployees || 0 }}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">เข้างานวันนี้</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats.presentToday || 0 }}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">เช็คเอาท์แล้ว</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats.checkedOutToday || 0 }}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">ขาดงานวันนี้</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats.absentToday || 0 }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabs -->
          <div class="card">
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="[
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
                  ]"
                >
                  {{ tab.name }}
                </button>
              </nav>
            </div>

            <!-- Tab Content -->
            <div class="mt-6">
              <!-- Employees Tab -->
              <div v-if="activeTab === 'employees'" class="space-y-4">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-medium text-gray-900">รายชื่อพนักงาน</h3>
                  <button
                    @click="showAddEmployee = true"
                    class="btn-primary"
                  >
                    เพิ่มพนักงาน
                  </button>
                </div>

                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table class="min-w-full divide-y divide-gray-300">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          รหัส/ชื่อ
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          อีเมล
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ตำแหน่ง
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          วันที่สร้าง
                        </th>
                        <th class="relative px-6 py-3">
                          <span class="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="employee in employees" :key="employee.id">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div class="text-sm font-medium text-gray-900">{{ employee.name }}</div>
                            <div class="text-sm text-gray-500">{{ employee.employee_id }}</div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ employee.email || '-' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span
                            class="status-badge"
                            :class="employee.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'"
                          >
                            {{ employee.role === 'admin' ? 'ผู้ดูแล' : 'พนักงาน' }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ formatDate(employee.created_at) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            @click="editEmployee(employee)"
                            class="text-primary-600 hover:text-primary-900 mr-3"
                          >
                            แก้ไข
                          </button>
                          <button
                            @click="deleteEmployee(employee)"
                            class="text-red-600 hover:text-red-900"
                            :disabled="employee.employee_id === 'admin'"
                          >
                            ลบ
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Attendance Tab -->
              <div v-if="activeTab === 'attendance'" class="space-y-4">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-medium text-gray-900">รายงานการเข้างาน</h3>
                  <div class="flex items-center space-x-2">
                    <input
                      v-model="selectedDate"
                      type="date"
                      class="input-field text-sm"
                    />
                    <button
                      @click="loadAttendanceRecords"
                      class="btn-secondary text-sm"
                    >
                      ค้นหา
                    </button>
                  </div>
                </div>

                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table class="min-w-full divide-y divide-gray-300">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          พนักงาน
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          วันที่
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          เช็คอิน
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          เช็คเอาท์
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          สถานะ
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="record in attendanceRecords" :key="record.id">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium text-gray-900">{{ record.name }}</div>
                          <div class="text-sm text-gray-500">{{ record.emp_id }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ formatDate(record.date) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ record.check_in_time ? formatTime(record.check_in_time) : '-' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ record.check_out_time ? formatTime(record.check_out_time) : '-' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span
                            class="status-badge"
                            :class="getAttendanceStatusClass(record)"
                          >
                            {{ getAttendanceStatusText(record) }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Employee Modal -->
      <div
        v-if="showAddEmployee || editingEmployee"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        @click="closeModal"
      >
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              {{ editingEmployee ? 'แก้ไขพนักงาน' : 'เพิ่มพนักงาน' }}
            </h3>
            
            <form @submit.prevent="saveEmployee" class="space-y-4">
              <div v-if="!editingEmployee">
                <label class="block text-sm font-medium text-gray-700 mb-1">รหัสพนักงาน</label>
                <input
                  v-model="employeeForm.employee_id"
                  type="text"
                  required
                  class="input-field"
                  placeholder="รหัสพนักงาน"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                <input
                  v-model="employeeForm.name"
                  type="text"
                  required
                  class="input-field"
                  placeholder="ชื่อ-นามสกุล"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                <input
                  v-model="employeeForm.email"
                  type="email"
                  class="input-field"
                  placeholder="อีเมล"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
                <input
                  v-model="employeeForm.password"
                  type="password"
                  :required="!editingEmployee"
                  class="input-field"
                  :placeholder="editingEmployee ? 'เว้นว่างหากไม่ต้องการเปลี่ยน' : 'รหัสผ่าน'"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ตำแหน่ง</label>
                <select v-model="employeeForm.role" class="input-field">
                  <option value="employee">พนักงาน</option>
                  <option value="admin">ผู้ดูแลระบบ</option>
                </select>
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="closeModal"
                  class="btn-secondary"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  class="btn-primary"
                  :disabled="submitting"
                >
                  {{ submitting ? 'กำลังบันทึก...' : 'บันทึก' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Mobile Bottom Padding -->
      <div class="h-20 md:hidden"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAttendanceStore } from '../stores/attendance'
import Navigation from '../components/Navigation.vue'
import axios from 'axios'

export default {
  name: 'Admin',
  components: {
    Navigation
  },
  setup() {
    const attendanceStore = useAttendanceStore()
    
    const loading = ref(true)
    const submitting = ref(false)
    const activeTab = ref('employees')
    const stats = ref({})
    const employees = ref([])
    const attendanceRecords = ref([])
    const selectedDate = ref(new Date().toISOString().split('T')[0])
    
    const showAddEmployee = ref(false)
    const editingEmployee = ref(null)
    const employeeForm = ref({
      employee_id: '',
      name: '',
      email: '',
      password: '',
      role: 'employee'
    })

    const tabs = [
      { id: 'employees', name: 'พนักงาน' },
      { id: 'attendance', name: 'การเข้างาน' }
    ]

    const formatTime = (dateString) => {
      return attendanceStore.formatTime(dateString)
    }

    const formatDate = (dateString) => {
      return attendanceStore.formatDate(dateString)
    }

    const getAttendanceStatusClass = (record) => {
      if (!record.check_in_time) return 'status-absent'
      
      const checkInHour = new Date(record.check_in_time).getHours()
      if (checkInHour > 9) return 'status-late'
      
      return 'status-present'
    }

    const getAttendanceStatusText = (record) => {
      if (!record.check_in_time) return 'ขาดงาน'
      
      const checkInHour = new Date(record.check_in_time).getHours()
      if (checkInHour > 9) return 'เข้าสาย'
      
      return 'ปกติ'
    }

    const loadStats = async () => {
      try {
        const response = await axios.get('/api/admin/stats')
        if (response.data.success) {
          stats.value = response.data.stats
        }
      } catch (error) {
        console.error('Failed to load stats:', error)
      }
    }

    const loadEmployees = async () => {
      try {
        const response = await axios.get('/api/admin/employees')
        if (response.data.success) {
          employees.value = response.data.employees
        }
      } catch (error) {
        console.error('Failed to load employees:', error)
      }
    }

    const loadAttendanceRecords = async () => {
      try {
        const params = new URLSearchParams()
        if (selectedDate.value) {
          params.append('date', selectedDate.value)
        }
        
        const response = await axios.get(`/api/admin/attendance?${params}`)
        if (response.data.success) {
          attendanceRecords.value = response.data.records
        }
      } catch (error) {
        console.error('Failed to load attendance records:', error)
      }
    }

    const editEmployee = (employee) => {
      editingEmployee.value = employee
      employeeForm.value = {
        employee_id: employee.employee_id,
        name: employee.name,
        email: employee.email || '',
        password: '',
        role: employee.role
      }
    }

    const deleteEmployee = async (employee) => {
      if (employee.employee_id === 'admin') {
        alert('ไม่สามารถลบบัญชี admin ได้')
        return
      }

      if (confirm(`ต้องการลบพนักงาน ${employee.name} หรือไม่?`)) {
        try {
          await axios.delete(`/api/admin/employees/${employee.id}`)
          await loadEmployees()
          await loadStats()
        } catch (error) {
          console.error('Failed to delete employee:', error)
          alert('เกิดข้อผิดพลาดในการลบพนักงาน')
        }
      }
    }

    const saveEmployee = async () => {
      try {
        submitting.value = true
        
        if (editingEmployee.value) {
          // Update employee
          const updateData = {
            name: employeeForm.value.name,
            email: employeeForm.value.email,
            role: employeeForm.value.role
          }
          
          if (employeeForm.value.password) {
            updateData.password = employeeForm.value.password
          }
          
          await axios.put(`/api/admin/employees/${editingEmployee.value.id}`, updateData)
        } else {
          // Create new employee
          await axios.post('/api/admin/employees', employeeForm.value)
        }
        
        await loadEmployees()
        await loadStats()
        closeModal()
      } catch (error) {
        console.error('Failed to save employee:', error)
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
      } finally {
        submitting.value = false
      }
    }

    const closeModal = () => {
      showAddEmployee.value = false
      editingEmployee.value = null
      employeeForm.value = {
        employee_id: '',
        name: '',
        email: '',
        password: '',
        role: 'employee'
      }
    }

    const loadData = async () => {
      try {
        loading.value = true
        await Promise.all([
          loadStats(),
          loadEmployees(),
          loadAttendanceRecords()
        ])
      } catch (error) {
        console.error('Failed to load admin data:', error)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadData()
    })

    return {
      loading,
      submitting,
      activeTab,
      stats,
      employees,
      attendanceRecords,
      selectedDate,
      showAddEmployee,
      editingEmployee,
      employeeForm,
      tabs,
      formatTime,
      formatDate,
      getAttendanceStatusClass,
      getAttendanceStatusText,
      loadAttendanceRecords,
      editEmployee,
      deleteEmployee,
      saveEmployee,
      closeModal
    }
  }
}
</script>