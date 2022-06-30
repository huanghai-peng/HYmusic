// packageDetail/pages/detail-search/index.js
import { getHotSearchData, getSearchSuggest, getResultSearch } from '../../../serve/api_search'
import { musicStore } from '../../../store/index'
import debounce from '../../../utils/debounce'
import stringToNodes from '../../../utils/string2nodes'

const debounceGetSearchSuggest = debounce(getSearchSuggest,300)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotSearchList: [],
    searchValue: '',
    suggestData: [],
    resultSuggest: [],
    resultSongsData:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取热门搜索数据
    this._getHotSearchData()
  },

  /* ----- 事件函数 -------- */
  handleSearchChange(event) {
    const searchValue = event.detail
    this.setData({ searchValue })
    if (!searchValue.length) {
      console.log(searchValue)
      this.setData({
        suggestData: [],
        resultSongsData:[]
      })
      debounceGetSearchSuggest.cancel()
      return
    } 

    this._getSearchSuggest(searchValue)


  },
  handleResultSearch(event) {
      const keywords = event.currentTarget.dataset.keywords
      this.setData({
        searchValue:keywords
      })
      // 发送请求
      this._getResultSearch(keywords)
  },
  // 监听搜索回车按钮
  handleResultSearchClick(){
    // 发送请求
    this._getResultSearch(this.data.searchValue)
  },
  handleSongsItemClick(event){
    // 获取id
    const id = event.currentTarget.dataset.id
    // 跳转到歌曲播放页
    wx.navigateTo({
      url: `/packagePlayer/pages/music-player/index?id=${id}`,
    })
    // 播放音乐
    musicStore.dispatch("playMusciWithId",{id})

    // 获取index
    const index = event.currentTarget.dataset.index
    
    // 将当前数据保存到播放列表中
    musicStore.setState("musicSongsList",this.data.resultSongsData)
    musicStore.setState("musicListIndex",index)

  },

  /* -------网络请求------------- */
  _getHotSearchData() {
    getHotSearchData().then(res => {
      this.setData({
        hotSearchList: res.result.hots
      })
    })
  },
  _getSearchSuggest(keywords) {
    debounceGetSearchSuggest(keywords).then(res => {
      const suggestData = res.result.allMatch
      this.setData({
        suggestData
      })

      // 取出所有的keywords
      const suggestArr = suggestData.map(item => item.keyword)

      const nodes = stringToNodes(suggestArr, keywords)

      this.setData({
        resultSuggest: nodes
      })

    })
  },
  _getResultSearch(keywords) {
    getResultSearch(keywords).then(res=>{
      this.setData({
        resultSongsData:res.result.songs
      })
    })
  }
})