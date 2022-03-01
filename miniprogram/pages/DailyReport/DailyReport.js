// pages/DailyReport/DailyReport.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenHeight: 0,
    screenWidth: 0,
    name:"寅畅",
    date: "2022-03-01",
    week:"周二",
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
      date:options.date,
      week:options.week,
    })
  },
})