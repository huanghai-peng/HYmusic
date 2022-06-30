// components/nav-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多 slot 支持
  },
  properties: {
    content:{
      type: String,
      value: '我是默认文字'
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
    handleLeftClick(){
      this.triggerEvent('leftClick')
    }
  }
})
