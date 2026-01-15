import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
import { getUserInfo } from '@/api/user'
const state = {
  token: getToken(), // 从缓存中读取初始值
  userInfo: {}
}

const mutations = {
  setToken(state, newToken) {
    state.token = newToken
    setToken(newToken) // 同步到缓存
  },
  removeToken(state) {
    state.token = null
    removeToken() // 同步到缓存
  },
  setUserInfo(state, newUserInfo) {
    state.userInfo = newUserInfo
  }
}

const actions = {
  async login(context, data) {
    console.log(data)
    const token = await login(data)
    context.commit('setToken', token)
  },
  async getUserInfo(context) {
    const res = await getUserInfo()
    context.commit('setUserInfo', res)
    return res
  },
  logout(context) {
    context.commit('removeToken')
    context.commit('setUserInfo', {})
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
