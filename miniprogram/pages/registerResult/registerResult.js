// pages/registerResult/registerResult.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSuccess:false,
    name:"",
    Attno:0,
  },

  itemchange(){
    this.setData({
      IsSuccess: !this.data.IsSuccess,
    })
  },

  Result_Vetify(){
  wx.reLaunch({
    url: '../../pages/appStart/appStart'
  })  
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name: app.globalData.username,
      Attno:app.globalData.AttNo,
    })
    if(options.IsSuccess == 0){
      this.setData({
        IsSuccess: true,
      })
    }

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