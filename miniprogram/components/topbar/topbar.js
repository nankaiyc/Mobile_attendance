// components/topbar/topbar.js
Component({

  properties: {
    curIndex: {
      type: String,
      value: '0',
    },
    content: {
      type: Array,
      value: [1,2,3],
    },
  },
  /**
   * 页面的初始数据
   */
  data: {
    itemArray: ["考勤打卡", "考勤监管", "成员", "split", "我的", "设置", "搜索每日出勤", "搜索成员", "可考勤地点", "设置监管范围", "考勤OA"]
  },
  
  methods:{
    handlemethodchange(e){
      var chosen = e.detail
      this.triggerEvent("methodchange",chosen)
    },
  },

})