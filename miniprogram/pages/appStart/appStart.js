// pages/appStart/appStart.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenHeight: 0,
    screenWidth: 0,
    firstPage: 0,
    indexPages: ['../checkIn/checkIn', '../superVise/superVise', '../attendanceOA/attendanceOA', '../member/member']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      screenHeight: app.globalData.screenHeight,
      screenWidth: app.globalData.screenWidth,
      firstPage: app.globalData.firstPage
    })
    wx.showLoading({
      title: '数据同步中···',
    })
    var interval = setInterval(() => {
      if (app.globalData.clid) {
        app.getInfo()
        clearInterval(interval)
        setTimeout(() => {
          wx.redirectTo({
            url: this.data.indexPages[this.data.firstPage],
          })
          wx.hideLoading({
            title: '数据同步中···',
          })
        }, 1000)
      }
    }, 500)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})