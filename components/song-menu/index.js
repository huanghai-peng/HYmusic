// components/song-menu/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type: String,
      value: '默认标题'
    },
    menuList:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemClick(event){
      // 获取id
      const id = event.currentTarget.dataset.item.id
      // 跳转页面
      wx.navigateTo({
        url: `/packageDetail/pages/detail-song/index?id=${id}`,
      })
    }
  }
})
