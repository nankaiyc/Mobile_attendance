// pages/checkInResult/checkInResult.js
var util = require('../../utils/util.js');
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSuccess:true,
    place:"PLACE",
    message:"",
    isQuit: ''
  },

  changeResult(){
    this.setData({
      isSuccess:!this.data.isSuccess
    })
  },
  
  onSuccess () {
    wx.redirectTo({
      url: '../checkIn/checkIn',
    })
  },

  onFail () {
    wx.redirectTo({
      url: '../checkIn/checkIn?directlyCheck=true',
    })
  },

  nonPositioned () {
    console.log(app.globalData.locallatitude, app.globalData.locallongitude)
    wx.chooseLocation({
      latitude: app.globalData.locallatitude,
      longitude: app.globalData.locallongitude,
      success: (e) => {
        console.log(e.name, e.latitude, e.longitude)
        wx.navigateTo({
          url: '../../pages/camera/camera?positioned=false&LocationName=' + e.name + '&latitude=' + e.latitude + '&longitude=' + e.longitude,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var DATE = util.formatDate(new Date());
    var TIME = util.formatTime(new Date());
    var PLACE = options.locationName
    this.setData({
      message : "您于" + DATE + TIME + "在" + PLACE + "打卡成功。",
      isSuccess:options.status == "success"?true:false,
      isQuit: options.isQuit=='true'?true:false
    })
    // console.log(this.data.message)
    // console.log(DATE)
    // console.log(this.data.isSuccess)
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