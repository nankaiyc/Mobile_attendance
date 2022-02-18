// pages/superVise/superVise.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: [
      {
        index : 0,
        name : "设置监管范围"
      }
    ],
    tabs:[
      {
        id:0,
        name:"每日出勤",
        isActive:true
      },
      {
        id:1,
        name:"及时报告",
        isActive:false
      },
      {
        id:2,
        name:"考勤统计",
        isActive:false
      },
    ]
  },

  handleItemChange(e){
    const {index} = e.detail;
    let {tabs} = this.data;
    tabs.forEach((v,i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },

  handlemethodchange(e){
    var chosen = e.detail
    if(chosen == "设置监管范围"){
      wx.navigateTo({
        url: '../../pages/attendancePersonSet/attendancePersonSet',
      })
    }
  },
})