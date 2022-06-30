import { yhmusiclogin } from './index'

// 获取code
export function getCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 1000,
      success: function (res) {
        resolve(res)
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}

// 获取token
export function getToken(code) {
  return yhmusiclogin.post('/login', { code })
}

// 判断token是否过期
export function checkToken() {
  return yhmusiclogin.post('/auth', {}, true)
}

// 判断session_key是否过期
export function checkSession() {
  return new Promise((resolve) => {
    wx.checkSession({
      success: () => {
        resolve(true)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

// 获取用户信息
export function getUserProfile(){
  return new Promise((resolve,reject)=>{
    wx.getUserProfile({
      desc: '哈哈哈',
      success:(res)=>{
        resolve(res)
      },
      fail:(err)=>{
        reject(err)
      }
    })
  })
}