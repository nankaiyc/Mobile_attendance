// pages/checkInResult/checkInResult.js
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSuccess:true,
    place:"解放村",
    message:"",
  },

  changeResult(){
    this.setData({
      isSuccess:!this.data.isSuccess
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var DATE = util.formatDate(new Date());
    var TIME = util.formatTime(new Date());
    var PLACE = this.data.place
    this.setData({
      message : "您与" + DATE + TIME + "在" + PLACE + "打卡成功。"
    })
    // console.log(this.data.message)
    // console.log(DATE)
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