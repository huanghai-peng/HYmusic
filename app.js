// app.js
import { getCode, getToken, checkToken,checkSession } from './serve/api_login'
App({
  async onLaunch() {
    // 获取手机信息
    const res = wx.getSystemInfoSync()
    // 保存状态栏高度
    this.globalData.statusBarHeight = res.statusBarHeight
    // 保存屏幕的总高度
    this.globalData.screenHeight = res.screenHeight
    // 保存屏幕的总宽度
    this.globalData.screenWidth = res.screenWidth

    // 默认登录
    this.handleLogin()
  },
  globalData: {
    statusBarHeight: 0,
    screenHeight: 0,
    screenWidth: 0
  },
  async handleLogin() {
    const token = wx.getStorageSync('token')
    const result = await checkToken()
    const sessionResult = await checkSession()
    if(!token || result.errorCode || !sessionResult ){
      this.getLogin()
    }
    console.log(result)
  },
  async getLogin() {
    // 获取code
    const { code } = await getCode()

    // 获取token,并且保存token
    const { token } = await getToken(code)
    wx.setStorageSync('token', token)
  }
})
