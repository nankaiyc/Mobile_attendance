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
    chosen_GPS: {
      type: Boolean,
      value: false,
    },
    chosen_WiFi: {
      type: Boolean,
      value: true,
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
    button_choose_WiFi() {
      this.setData({
        chosen_GPS: false,
        chosen_WiFi:true,
      })
    },
    button_choose_GPS() {
      this.setData({
        chosen_GPS: true,
        chosen_WiFi:false,
      })
    },

    
  }

})