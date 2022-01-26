// components/rightmenu/rightmenu.js
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    show: {
      type: Boolean,
      value: false,
    },
    content: {
      type: Array,
      value: [1,2,3],
    },
    Width: {
      type: Number,
      value: 40,
    },
  },
  /**
   * 页面的初始数据
   */
  data: {
  
  },

  methods:{
     close_overlay() {
      this.setData({
        show: false
      })
    },
    pop_right() {
      this.setData({
        show: true
      })
    },



    
  }

})