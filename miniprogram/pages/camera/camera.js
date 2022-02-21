// pages/camera/camera.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isfront:true,
    frontsrc:"",
    backsrc:""
  },

  takePhoto() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        if(this.data.isfront){
          this.setData({
            frontsrc: res.tempImagePath,
            isfront:!this.data.isfront
          })
          console.log(this.data.isfront)
          console.log(this.data.frontsrc)
        }
        else{
          this.setData({
            backsrc: res.tempImagePath,
            isfront:!this.data.isfront
          })
          console.log(this.data.isfront)
          console.log(this.data.backsrc)
        }
      }
    })

  },
  error(e) {
    console.log(e.detail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ctx = wx.createCameraContext();
    this.setData({
      screenHeight: app.globalData.screenHeight,
      screenWidth: app.globalData.screenWidth,
      firstPage: app.globalData.firstPage
    })
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