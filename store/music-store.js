import { HYEventStore } from 'hy-event-store'
import { getLyric } from '../serve/api_music'
import { parseLyric } from '../utils/parse-lyric'

// const innerAudioContext = wx.createInnerAudioContext()
const innerAudioContext = wx.getBackgroundAudioManager()

const playModel = ['order', 'random', 'repeat']

const musicStore = new HYEventStore({
  state: {
    id: 0,
    lyricInfo: [],
    // 保存显示当前切换的歌词文本
    lyricText: '',
    // 保存切换到哪一条歌词
    currentIndex: 0,
    // 总时长
    duration: 0,
    // 播放进度
    currentTime: 0,
    // 进度条
    // sliderValue: 0,
    // 控制播放模式 0 -> 顺序播放order 1 -> 随机播放random 2 -> 单曲循环repeat
    playModelIndex: 0,
    playModeName: 'order',
    playingName: 'pause',
    musicSongsList: [],
    musicListIndex: 0,
    isPlay: true,
    title: '我的爱人'
  },
  actions: {
    playMusciWithId(ctx, { id, isRefresh = false }) {
      // 将播放按钮改为播放状态
      ctx.playingName = 'pause'
      // 如果别的情况下id一样的话,继续播放,如果在单曲循环的情况下，id一样，重新播放

      if (id == ctx.id && !isRefresh) {
        innerAudioContext.play()
        return
      }

      ctx.id = id

      ctx.lyricInfo = []
      ctx.lyricText = ''
      ctx.currentIndex = 0
      ctx.duration = 0
      ctx.currentTime = 0
      ctx.isPlay = true


      // 播放歌曲
      innerAudioContext.stop()
      innerAudioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      innerAudioContext.title = ctx.title
      innerAudioContext.autoplay = true

      innerAudioContext.onCanplay(() => {
        innerAudioContext.play()
      })

      // 请求数据,获取歌词
      getLyric(id).then(res => {
        const lyric = res.lrc.lyric
        const lyricInfo = parseLyric(lyric)

        ctx.lyricInfo = lyricInfo
      })

      // 设置歌曲总是时长和播放进度
      let duration = 0
      let currentTime = 0
      // let sliderValue = 0
      innerAudioContext.onTimeUpdate(() => {
        // 获取总时长
        duration = innerAudioContext.duration * 1000
        if (ctx.duration != duration) {
          ctx.duration = duration
        }

        // 获取播放进度
        currentTime = innerAudioContext.currentTime * 1000
        // 设置进度条进度-> 播放进度 / 总时长 * 100
        // sliderValue = currentTime / duration * 100

        ctx.currentTime = currentTime
        // ctx.sliderValue = sliderValue



        // 设置歌词
        if (!ctx.lyricInfo) return

        for (let i = 0; i < ctx.lyricInfo.length; i++) {
          if (currentTime < ctx.lyricInfo[i].time) {
            // 如果和data中的currentIndex一样，则直接退出
            if (ctx.currentIndex == i - 1) {
              break
            }
            // 获取前一个文本
            const lyricText = ctx.lyricInfo[i - 1].text
            const currentIndex = i - 1
            ctx.lyricText = lyricText
            ctx.currentIndex = currentIndex
            break
          }
        }

      })

      // 播放结束，播放下一首
      innerAudioContext.onEnded(() => {
        this.dispatch("musicPlayActions")
      })

      // 在后台点击了播放/暂停按钮/停止事件
      innerAudioContext.onPlay(() => {
        ctx.isPlay = true
        ctx.playingName = 'pause'
      })
      innerAudioContext.onPause(() => {
        ctx.isPlay = false
        ctx.playingName = 'resume'
      })
      innerAudioContext.onStop(()=>{
        ctx.isPlay = false
        ctx.playingName = 'resume'
        innerAudioContext.stop()
      })
      

    },
    // 播放模式 顺序播放 -》单曲循环 -》随机播放
    playModelActions(ctx) {
      // 第一次渲染时，用我已经准备好的，当用户点击时，才触发这个
      let playModelIndex = ctx.playModelIndex + 1


      if (playModelIndex == 3) {
        playModelIndex = 0
      }


      ctx.playModeName = playModel[playModelIndex]
      ctx.playModelIndex = playModelIndex
    },
    // 播放或者暂停音乐
    /* playingActions(ctx,isPlay) {
      let playingName = ctx.playingName
      // 如果是播放模式，则停止播放
      if (playingName == 'pause' && ctx.isPlay) {
        innerAudioContext.pause()
        playingName = 'resume'
        ctx.isPlay = false
      } else {
        console.log(ctx.currentTime)
        innerAudioContext.seek(ctx.currentTime / 1000)
        setTimeout(() => {
          innerAudioContext.play()

        }, 10)
        console.log(111)
        // innerAudioContext.play()
        playingName = 'pause'
        ctx.isPlay = true
      }

      console.log(222)
      ctx.playingName = playingName

    }, */
    playingActions(ctx,{isPlay = true}){
      ctx.isPlay = isPlay
      if(isPlay){
        innerAudioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
        innerAudioContext.title = '哈哈哈'
        innerAudioContext.startTime = ctx.currentTime / 1000
      }
      ctx.isPlay ? innerAudioContext.seek(ctx.currentTime / 1000): innerAudioContext.pause()
    },
    // 控制音乐播放的上一首或者下一首
    musicPlayActions(ctx, isNextPlay = true) {
      // 如果是0，则是顺序播放，1->随机播放，2->单曲循环
      let index = ctx.musicListIndex
      switch (ctx.playModelIndex) {
        case 0:
          if (isNextPlay) {
            index = index == ctx.musicSongsList.length - 1 ? 0 : index + 1
          } else {
            index = index == 0 ? ctx.musicSongsList.length - 1 : index - 1
          }
          break
        case 1:
          index = Math.floor(Math.random() * ctx.musicSongsList.length)
          break
        case 2:
          break
      }

      if (ctx.playModelIndex == 2) {
        ctx.isPlay = true
      }
      let musicSong = ctx.musicSongsList[index]
      ctx.musicListIndex = index


      // 播放歌曲
      musicStore.dispatch("playMusciWithId", { id: musicSong.id, isRefresh: true })
    }

  }
})



export {
  innerAudioContext,
  musicStore
}
