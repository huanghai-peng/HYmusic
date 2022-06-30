// 封装网络请求
import {BASE_URL,LOGIN_BASE_URL} from './config'
const token = wx.getStorageSync('token')
class YHmusic {
  constructor(baseUrl,authHeader = {}){
    this.baseUrl = baseUrl
    this.authHeader = authHeader
  }
  request(url,method,params,isAuth=false,header={}){
    const finalHeader = isAuth ? {...this.authHeader,...header} : header
    return new Promise((resolve,reject)=>{
      wx.request({
        url: this.baseUrl + url,
        method:method,
        data:params,
        header:finalHeader,
        success:(res)=>{
         resolve(res.data)
        },
        fail:reject
      })
    })
  }

  get(url,params,isAuth,header){
    return this.request(url,'get',params,isAuth,header)
  }
  post(url,data,isAuth,header){
    return this.request(url,'post',data,isAuth,header)
  }
}

const yhmusic = new YHmusic(BASE_URL)
const yhmusiclogin = new YHmusic(LOGIN_BASE_URL,{token})

export default yhmusic
export {
  yhmusiclogin
}


