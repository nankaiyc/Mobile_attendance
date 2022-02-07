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
      value: [],
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
    button_choose(e) {
      // console.log(e.currentTarget.dataset.index)
      var chosen = e.currentTarget.dataset.index
      if(chosen == 0){
        this.setData({
          chosen_GPS: false,
          chosen_WiFi:true,
        })
        this.triggerEvent("methodchange",chosen)
      }
      else if(chosen == 1){
        this.setData({
          chosen_GPS: true,
          chosen_WiFi:false,
        })
        this.triggerEvent("methodchange",chosen)
      }
      else{
        console.log(chosen)
      }
    },



  }

})