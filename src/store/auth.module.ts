import AuthService, { User } from '@/services/auth.service'

//@ts-ignore
const user = JSON.parse(localStorage.getItem('user'))

const initialState = user ? { status: { loggedIn: true }, user } : { status: { loggedIn: false }, user: null }

interface Context {
  commit: Function
}

interface State {
  status: {
    loggedIn: boolean
  }
  user: User | null
}

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }: Context, user: User) {
      return AuthService.login(user).then(
        (user) => {
          commit('loginSuccess', user)
          return Promise.resolve(user)
        },
        (error) => {
          commit('loginFailure')
          return Promise.reject(error)
        }
      )
    },
    logout({ commit }: Context) {
      AuthService.logout()
      commit('logout')
    },
  },
  mutations: {
    loginSuccess(state: State, user: User) {
      state.status.loggedIn = true
      state.user = user
    },
    loginFailure(state: State) {
      state.status.loggedIn = false
      state.user = null
    },
    logout(state: State) {
      state.status.loggedIn = false
      state.user = null
    },
  },
}
