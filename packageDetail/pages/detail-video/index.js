// packageDetail/pages/detail-video/index.js
import {getDetail,getMvUrl,getAllVideo} from '../../../serve/api_video'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvUrl: {},
    detailData:{},
    allVideo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取id
    const id = options.id
    this.getDetailData(id)
  },

  // 事件处理函数
  getDetailData(id){
    // 获取详情
    getDetail(id).then(res=>{
      this.setData({detailData:res.data})
    })

    // 获取视频url
    getMvUrl(id).then(res=>{
      this.setData({mvUrl:res.data})
    })

    // 获取所有相关视频
    getAllVideo(id).then(res=>{
      this.setData({allVideo:res.data})
    })
  }
})