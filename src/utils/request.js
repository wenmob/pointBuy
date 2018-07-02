import axios from 'axios'
import $ from '../../static/jquery.min.js'
import layer from '../../static/layer/layer.js'
import qs from 'qs'
import router from '@/router'
import {
  getToken
} from '@/utils/auth'

let statuc = 0
let comfit = 0
// 获取statuc值
export function getStatuc () {
  return statuc
}
export function getComfit () {
  return comfit
}
// 改变statuc值
export function setStatuc (val) {
  statuc = val
}
export function setComfit (val) {
  comfit = val
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (getToken()) {
    config.headers['X-Token'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  }
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    layer.closeAll('loading') // 每个接口得到数据后，关闭load效果
    const res = response.data
    if (res.code === 100000) {
      if (statuc === 0) {
        statuc = 1
        if (comfit === 0) {
          layer.open({
            content: '未登录请重新登录',
            btn: ['确认'],
            yes: function (index) {
              layer.close(index)
              router.push('/login')
              return Promise.reject(res.msg)
            }
          })
        } else {
          layer.open({
            content: '未登录请重新登录',
            btn: ['确认', '取消'],
            yes: function (index) {
              layer.close(index)
              router.push('/login')
              return Promise.reject(res.msg)
            }
          })
        }
      }
    } else if (res.code === 100001) {
      if (statuc === 0) {
        statuc = 1
        if (comfit === 0) {
          layer.open({
            content: '未登录请重新登录',
            btn: ['确认'],
            yes: function (index) {
              layer.close(index)
              router.push('/login')
              return Promise.reject(res.msg)
            }
          })
        } else {
          layer.open({
            content: '未登录请重新登录',
            btn: ['确认', '取消'],
            yes: function (index) {
              layer.close(index)
              router.push('/login')
              return Promise.reject(res.msg)
            }
          })
        }
      }
    } else if (res.code === 100002) {
      if (statuc === 0) {
        statuc = 1
        if (comfit === 0) {
          layer.open({
            content: '未登录请重新登录',
            btn: ['确认'],
            yes: function (index) {
              layer.close(index)
              router.push('/login')
              return Promise.reject(res.msg)
            }
          })
        } else {
          layer.open({
            content: '未登录请重新登录',
            btn: ['确认', '取消'],
            yes: function (index) {
              layer.close(index)
              router.push('/login')
              return Promise.reject(res.msg)
            }
          })
        }
      }
    } else {
      return response.data
    }
  }, error => {
    console.log('err' + error) // for debug
    layer.open({
      content: error.message,
      skin: 'msg',
      time: 2 // 2秒后自动关闭
    })
    return Promise.reject(error)
  })

export default service
