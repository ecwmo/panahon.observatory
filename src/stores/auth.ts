import { persistentMap } from '@nanostores/persistent'
import { z } from 'zod'

import { Auth as AuthSchema } from '@/schemas/auth'

interface UserData {
  username: string
  password: string
}

type Auth = z.infer<typeof AuthSchema>

const API_URL = '/api/auth'

export const $user = persistentMap<Auth>(
  'user:',
  {
    valid: false,
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
  },
)

export const login = async (userData: UserData) => {
  const formData = new FormData()

  formData.append('login', '1')
  Object.keys(userData).forEach((k) => {
    formData.append(k, `${userData[k]}`)
  })

  const res = await fetch(API_URL, { method: 'POST', body: formData })
  const data = AuthSchema.parse(await res.json())

  $user.set({ ...data, isLoggedIn: data.username.length > 0 })
}

export const logout = async () => {
  const formData = new FormData()
  formData.append('logout', '1')

  const res = await fetch(API_URL, { method: 'POST', body: formData })
  const data = AuthSchema.parse(await res.json())

  $user.set({ ...data, isLoggedIn: false })
}
