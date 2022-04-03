// pages/camera/camera.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isfront:true,
    frontsrc:"",
    backsrc:"",
    positioned: '',
    index: '',
    LocationName: '',
    latitude: '',
    longitude: '',
    photomode:0,
    showPhoto:true,
  },

  takePhoto() {
    var position_check = '&positioned=' + this.data.positioned + '&index=' + this.data.index
    var nonposition_check = '&positioned=' + this.data.positioned + '&LocationName=' + this.data.LocationName + '&latitude=' + this.data.latitude + '&longitude=' + this.data.longitude
    var position_status = this.data.positioned == 'true'?position_check:nonposition_check
    console.log(position_status)
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        if(this.data.isfront){
          this.setData({
            frontsrc: res.tempImagePath,
            isfront:!this.data.isfront
          })
          if(this.data.photomode == 1){
            wx.navigateTo({
              url: '../../pages/preview/preview?frontsrc='+ this.data.frontsrc + position_status
            })  
          }
          // console.log(this.data.isfront)
          // console.log(this.data.frontsrc)
        }
        else{
          this.setData({
            backsrc: res.tempImagePath,
          })
          if (this.data.photomode == 2) {
            wx.navigateTo({
              url: '../../pages/preview/preview?backsrc=' + this.data.backsrc + position_status,
            })  
          } else if(this.data.photomode == 3){
            wx.navigateTo({
              url: '../../pages/preview/preview?frontsrc='+ this.data.frontsrc + '&backsrc=' + this.data.backsrc + position_status,
            })  
          }
        }
      }
    })

  },
  error(e) {
    this.setData({
      showPhoto:false
    })
    wx.getSetting({
      success: res => {
        if (typeof(res.authSetting['scope.camera']) != 'undefined' && !res.authSetting['scope.camera']) {
          // 用户拒绝了授权
          wx.showModal({
            title: '提示',
            content: '您拒绝了摄像头权限，将无法使用摄像头功能',
            success: res => {
              if (res.confirm) {
                // 跳转设置页面
                wx.openSetting({
                  success: res => {
                    if (res.authSetting['scope.camera']) {
                      // 授权成功，重新定位
                      this.setData({
                        showPhoto:true
                      })
                    } else {
                      // 没有允许定位权限
                      wx.showToast({
                        title: '您拒绝了摄像头权限，将无法使用摄像头功能',
                        icon: 'none'
                      });
                    }
                  }
                });
              }
            }
          });
        }
      }
    });
  },

  handleBackToFront(e){
    this.setData({
      isfront: !this.data.infront,
    })
  },

  onLoad: function (options) {
    this.ctx = wx.createCameraContext();
    this.setData({
      screenHeight: app.globalData.screenHeight,
      screenWidth: app.globalData.screenWidth,
      positioned: options.positioned,
      index: options.index,
      LocationName: options.LocationName,
      latitude: options.latitude,
      longitude: options.longitude,
      photomode: app.globalData.AppPhoto % 10,
      isfront: app.globalData.AppPhoto % 10 == 2?false:true,
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
    app.globalData.flagOfQuitCamera = true
    wx.reLaunch({
      url: '../transfer/transfer',
    })
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