// pages/home-profile/index.js
import {getUserProfile} from '../../serve/api_login'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  async handleGetUserProfile(){
    const res = await getUserProfile()
    console.log(res)
  },
  getPhoneNumber(e){
    console.log(e)
  }
})