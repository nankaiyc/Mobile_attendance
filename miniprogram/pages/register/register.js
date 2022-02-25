// pages/register/register.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Identify_Code:"",
    IsSuccess:1,
  },

  GetCode(e){
    var that = this;
    that.setData({
      Identify_Code: e.detail.value
    })
    // console.log(this.data.Identify_Code)
  },

  Code_Vetify(){
    var that = this
    app.register(this.data.Identify_Code)
    var interval = setInterval(() => {
      if (app.globalData.RegisterResult) {
        that.setData({
          IsSuccess: app.globalData.RegisterResult,
        })
        clearInterval(interval)
      }
    }, 500)
    wx.navigateTo({
      url: '../../pages/registerResult/registerResult?IsSuccess='+ this.data.IsSuccess
    })    
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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