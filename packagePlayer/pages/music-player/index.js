// packagePlayer/pages/music-player/index.js
import { innerAudioContext, musicStore } from '../../../store/index'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    statusBarHeight: app.globalData.statusBarHeight,
    isActive: 0,
    swiperHeight: 0,
    playModeName: 'order',
    playingName: 'pause',
    lyricShow: false,

    // 总时长
    duration: 0,
    // 播放进度
    currentTime: 0,
    // 进度条
    sliderValue: 0,
    // 控制滑动进度条时，时间是否更新
    isSliderUpdate: false,
    // 控制滑动进度条时，时间因为缓存没有更新
    waitFlag: false,
    // 保存切换歌词
    lyricInfo: [],
    // 保存显示当前切换的歌词文本
    lyricText: '',
    // 保存切换到哪一条歌词
    currentIndex: 0,
    isPlay: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id

    // 获取swiper的高度
    const globalData = app.globalData
    const swiperHeight = globalData.screenHeight - globalData.statusBarHeight - 44
    this.setData({
      swiperHeight
    })

    // 控制不同屏幕下歌词的显示或者隐藏
    this.setData({
      lyricShow: globalData.screenHeight / globalData.screenWidth >= 2
    })


    //  获取歌曲信息
    // this.setUpSongsListener(id)
    this.setUpSongsListener()



  },
  // ------------ 歌曲事件 ---------------------------
  setUpSongsListener(id) {
    // 歌词数据改变触发
    musicStore.onStates(["lyricInfo"], ({ lyricInfo }) => {
      if (lyricInfo) {
        this.setData({ lyricInfo })
      }
    })

    // 总时长，播放进度
    musicStore.onStates(["duration", "currentTime"], ({ duration, currentTime }) => {
      if (duration) {
        this.setData({ duration })
      }
      if (currentTime && !this.data.isSliderUpdate) {
        // 设置进度条进度-> 播放进度 / 总时长 * 100
        let sliderValue = currentTime / this.data.duration * 100
        this.setData({ currentTime, sliderValue })
      }
    })

    // 歌词切换
    musicStore.onStates(["lyricText", "currentIndex"], ({ lyricText, currentIndex }) => {
      if (lyricText != undefined) {
        this.setData({ lyricText })
      }
      if (currentIndex != undefined) {
        this.setData({ currentIndex })
      }
    })

    // 初始化播放模式
    musicStore.onStates(["playModeName", "playingName", "isPlay"], ({ playModeName, playingName, isPlay }) => {
      if (playModeName) {
        this.setData({ playModeName })
      }
      if (playingName) {
        this.setData({ playingName })
      }
      if (isPlay != undefined) {
        this.setData({ isPlay })
      }
    })
  },
  // 处理函数
  handleActiveClick(event) {
    const index = event.currentTarget.dataset.index
    this.setData({ isActive: index })
  },
  handleSwiperChange(event) {
    const index = event.detail.current
    this.setData({ isActive: index })
  },
  handleLeftClick() {
    // 返回上一层
    wx.navigateBack({
      delta: 1,
    })
  },
  handleSlideChange(event) {
    // 将进度条定到该位置，并且时间也一同改变 进度值 * 总时长 / 100
    // 
    // 音频由于网络等原因等待中的回调
    /* innerAudioContext.onWaiting(() => {
      innerAudioContext.pause() // 等待网络的时候音频暂停
      this.setData({
        waitFlag: true // 标明是onWaiting触发的暂停
      })
    }) */

    const sliderValue = event.detail.value
    const currentTime = sliderValue * this.data.duration / 100

    // 跳转到指定位置
    if (this.data.playingName == 'pause') {
      innerAudioContext.seek(currentTime / 1000)
    } else { // 如果是暂停模式下，歌词位置和歌词时间和播放时间需要变化
      // 歌词位置发生变化
      let currentIndex = 0
      let lyricText = ''
      for (let i = 0; i < this.data.lyricInfo.length; i++) {
        if (currentTime < this.data.lyricInfo[i].time) {
          // 如果和data中的currentIndex一样，则直接退出
          if (this.data.currentIndex == i - 1) {
            break
          }

          lyricText = this.data.lyricInfo[i - 1].text
          currentIndex = i - 1


          break
        }
      }
      musicStore.setState("currentTime", currentTime)
      musicStore.setState("currentIndex", currentIndex)
      musicStore.setState("lyricText", lyricText)
    }


    this.setData({
      sliderValue,
      currentTime,
      isSliderUpdate: false
    })


    // 音频准备就绪的回调
    /* innerAudioContext.onCanplay(() => {
      if (this.data.waitFlag) { // 如果是onWaiting触发的暂停，就立即播放
        innerAudioContext.play() // play()方法看上去能重新触发onTimeUpdate()回调
        this.setData({
          waitFlag: false // 取消相应的flag标志位
        })
      }
    }) */

  },
  handleSlideChanging(event) {
    // 滑动进度条，进度条发生变化，时间也发生变化
    const sliderValue = event.detail.value
    const currentTime = sliderValue * this.data.duration / 100
    console.log(currentTime)

    this.setData({
      // sliderValue,
      currentTime,
      isSliderUpdate: true
    })
  },
  // 监听播放模式
  handlePlayModelClick() {
    musicStore.dispatch("playModelActions")
  },
  // 监听播放或者暂停
  handlePlayingNameClick() {
    musicStore.dispatch("playingActions", { isPlay: !this.data.isPlay })
  },
  // 监听歌曲下一首
  handleNextMusic() {
    musicStore.dispatch("musicPlayActions")
  },
  // 监听歌曲上一首
  handlePrevMusic() {
    musicStore.dispatch("musicPlayActions", false)
  }
})