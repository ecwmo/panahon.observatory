import axios from 'axios'
const API_URL = '/api/auth.php'

export interface User {
  username: string
  password: string
}

const login = async (user: User) => {
  const loginData: { [k: string]: any } = { ...user, login: 1 }
  const formData = new FormData()
  Object.keys(loginData).forEach((k) => {
    formData.append(k, loginData[k])
  })

  await axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  const res = await axios.get(API_URL)

  if (res && res.data.hasOwnProperty('username')) {
    localStorage.setItem('user', JSON.stringify(res.data))
    return res.data
  }

  throw new Error('Login Error')
}

const logout = async () => {
  const formData = new FormData()
  formData.append('logout', '1')
  const res = await axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  if (res.data.message == 'success') {
    localStorage.removeItem('user')
  }
}

export default { login, logout }
