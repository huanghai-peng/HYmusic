// pages/home-music/index.js
import { rankingStore, musicStore } from '../../store/index'

import { getBanners, getSongMenuData } from '../../serve/api_music'
import queryRect from '../../utils/query-rect'
import debounce from '../../utils/debounce'
const debocunceQueryRect = debounce(queryRect, 1000)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    swiperHeight: 0,
    hotMemu: [],
    recommendMenu: [],
    isPlay: false,
    id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取轮播图数据
    this._getBanners()

    // 获取资源共享数据
    rankingStore.dispatch('getRankingDataAction')

    // 获取热门歌单数据
    getSongMenuData().then(res => {
      this.setData({
        recommendMenu: res.playlists
      })
    })

    // 获取推荐歌单数据
    getSongMenuData('古风').then(res => {
      this.setData({
        hotMemu: res.playlists
      })
    })



    // 监听播放按钮的状态
    musicStore.onState("isPlay", (isPlay) => {
      if (isPlay !== undefined) {
        this.setData({ isPlay })
      }
    })

    // 返回当前播放的id
    musicStore.onState("id", (id) => {
      if(id != undefined){
        this.setData({id})
      }
    })

  },

  /* 
    * 事件处理函数
  */
  handleHomeSearchClick() {
    // 跳转到搜索页面
    wx.navigateTo({
      url: '/packageDetail/pages/detail-search/index',
    })
  },
  handleHomeImageLoad() {
    // 获取图片的高度--获取当前image组件的高度
    debocunceQueryRect('#swiperImages').then(res => {
      this.setData({ swiperHeight: res[0].height })
    })
  },
  handlePlayItem() {
    musicStore.dispatch("playingActions",{isPlay : !this.data.isPlay})
  },
  handleAvatarItem() {
    // 点击该头像，跳转到音乐页面
    wx.navigateTo({
      url: `/packagePlayer/pages/music-player/index?id=${this.data.id}`,
    })
  },

  /* 
   * 网络请求函数
  */
  async _getBanners() {
    const res = await getBanners()
    this.setData({
      banners: res.banners
    })
  }
})