// pages/home-video/index.js
import {getTopMv} from '../../serve/api_video'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvTop:[],
    hasMore:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // 获取topMV数据
    this.getTopMvData(0)
  },

  /* 
    * 页面方法函数
  */
 handleVideoItemClick(event){
    // 获取id
   const id = event.currentTarget.dataset.id
  
    // 跳转页面
    wx.navigateTo({
      url: '/packageDetail/pages/detail-video/index?id='+id,
    })
 },

  // 网络请求函数
  async getTopMvData(offset){
    // 如果hasMore不为true，并且offset不等于0
    if(!this.data.hasMore && offset !== 0) return

    // 展示导航栏动画
    wx.showNavigationBarLoading()

    // 请求数据
    const res = await getTopMv(offset)
    let newData = []
    if(offset==0){
      newData = res.data
    }else{
      newData = this.data.mvTop.concat(res.data) 
    }
    this.setData({mvTop: newData })
    this.setData({hasMore:res.hasMore})

    // 关闭导航栏动画
    wx.hideNavigationBarLoading()

    // 请求数据完成,停止刷新
    wx.stopPullDownRefresh()
  },

  // 其他生命周期函数
 async onReachBottom(){
    this.getTopMvData(this.data.mvTop.length)
  },
  async onPullDownRefresh(){
    // 获取topMV数据
    this.getTopMvData(0)
  }
})