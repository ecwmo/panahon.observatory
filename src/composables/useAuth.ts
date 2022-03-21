import { ref, computed } from 'vue'
import { useStore } from 'vuex'

import { User } from '@/services/auth.service'

const useAuth = () => {
  const store = useStore()

  const isLoggedIn = computed(() => store.state.auth.status.loggedIn)
  const loggedInUser = computed(() => (store.state.auth.user ? store.state.auth.user.username : null))

  const login = async (user: User) => {
    return await store.dispatch('auth/login', user)
  }

  const logout = async () => {
    return await store.dispatch('auth/logout')
  }

  return { isLoggedIn, loggedInUser, login, logout }
}

export default useAuth
