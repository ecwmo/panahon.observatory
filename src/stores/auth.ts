import { apiRoute } from '@/stores/routes'
import { persistentMap } from '@nanostores/persistent'
import { action } from 'nanostores'

interface UserData {
  username: string
  password: string
}

interface User {
  valid: boolean
  timeout: Date | number
  username: string
  isLogggedIn: boolean
}

const API_URL = apiRoute('auth')

export const user = persistentMap(
  'user:',
  {
    valid: false,
    timeout: -1,
    username: '',
    isLoggedIn: false,
  },
  {
    encode(value) {
      return JSON.stringify(value)
    },
    decode(value) {
      if (value !== '') return JSON.parse(value)
      return value
    },
  }
)

export const login = action(user, 'login', async (user, userData: UserData) => {
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

  user.set({ ...data, isLoggedIn: data.username.length > 0 })
})

export const logout = action(user, 'logout', async (user) => {
  const formData = new FormData()
  formData.append('logout', '1')

  const { data } = await axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  if (data?.message == 'success') {
    user.set({ valid: false, timeout: -1, username: '', isLoggedIn: false })
  }
})
