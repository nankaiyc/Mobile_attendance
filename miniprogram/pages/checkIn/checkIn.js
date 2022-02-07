// pages/checkIn/checkIn.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: [
      {
        index : 0,
        name : "WiFi考勤" 
      },
      {
        index : 1,
        name : "GPS考勤" 
      },
      {
        index : 2,
        name : "可考勤地点" 
      },
      {
        index : 3,
        name : "考勤提醒闹钟" 
      },
    ],
    Attendance_method:"WiFi考勤"
  },
  //自定义事件 用来接受子组件传递的数据
  handlemethodchange(e){
    var chosen = e.detail
    if(chosen == 0){
      this.setData({
        Attendance_method:"WiFi考勤"
      })
    }
    else if(chosen == 1){
      this.setData({
        Attendance_method:"GPS考勤"
      })
    }
  },

})