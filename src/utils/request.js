import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 50000
})

const whiteList = ['/sys/login', '/sys/captcha']// 登录 / 验证码接口不带 token
// 添加请求拦截器
service.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  const token = store.getters.token

  // 登录 / 验证码接口不带 token
  if (token && !whiteList.some(url => config.url.includes(url))) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
service.interceptors.response.use(function(response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  if (response.data instanceof Blob) return response.data
  const { data, message, success } = response.data
  if (success) {
    return data
  } else {
    Message({ type: 'error', message: message })
    return Promise.reject(new Error(message))
  }
}, async function(error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  if (error.response && error.response.status === 401) {
    Message({ type: 'warning', message: 'token过期，请重新登录' })
    await store.dispatch('user/logout')
    router.push('/login')
    return Promise.reject(error)
  }
  Message({ type: 'error', message: error.message })
  return Promise.reject(error)
})

export default service
