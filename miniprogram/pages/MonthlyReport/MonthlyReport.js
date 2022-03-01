// pages/MonthlyReport/MonthlyReport.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenHeight: 0,
    screenWidth: 0,
    name:"寅畅",
    month: "2022-03",
    rate:"0.0%",
    dailyDate:[
      {
        date:"2022-03-31",
        week:"周四",
        condition:"缺勤",
        classes:"无班次",
        record:"没有打卡记录"
      },
      {
        date:"2022-03-30",
        week:"周三",
        condition:"缺勤",
        classes:"无班次",
        record:"签到 14:43:18  签退 14:49:51"
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      screenHeight: app.globalData.screenHeight,
      screenWidth: app.globalData.screenWidth,
      name:options.name,
      month:options.month,
    })
  },

})