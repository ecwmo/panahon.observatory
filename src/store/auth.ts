import { defineStore } from 'pinia'

interface User {
  username: string
  password: string
}

const API_URL = '/api/auth.php'

export const useAuthStore = defineStore(
  'user',
  () => {
    const user = ref({
      valid: false,
      timeout: -1,
      username: '',
    })

    const isLoggedIn = computed(() => user?.value?.username?.length > 0)

    const login = async (userData: User) => {
      const loginData: { [k: string]: string | number } = { ...userData, login: 1 }
      const formData = new FormData()
      Object.keys(loginData).forEach((k) => {
        formData.append(k, `${loginData[k]}`)
      })

      const { data } = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      user.value = data
    }

    const logout = async () => {
      const formData = new FormData()
      formData.append('logout', '1')
      const { data } = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (data?.message == 'success') {
        user.value = {
          valid: false,
          timeout: -1,
          username: '',
        }
      }
    }

    return { user, isLoggedIn, login, logout }
  },
  { persist: true }
)
