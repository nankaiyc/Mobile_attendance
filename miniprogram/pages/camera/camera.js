// pages/camera/camera.js
const app = getApp()
var startTime = 0
var endTime = 0
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
    stayTime:0,

  },

  takePhoto() {
    endTime = +new Date();
    var position_check = '&positioned=' + this.data.positioned + '&index=' + this.data.index
    var nonposition_check = '&positioned=' + this.data.positioned + '&LocationName=' + this.data.LocationName + '&latitude=' + this.data.latitude + '&longitude=' + this.data.longitude
    var position_status = this.data.positioned == 'true'?position_check:nonposition_check
    console.log(position_status)
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        if(this.data.isfront){
          var stayTime = endTime - startTime;
          this.setData({
            frontsrc: res.tempImagePath,
            isfront:!this.data.isfront,
            stayTime : stayTime
          })
          console.log(stayTime)
          if(this.data.photomode == 1 & this.data.stayTime/1000 < 120){
            wx.navigateTo({
              url: '../../pages/preview/preview?frontsrc='+ this.data.frontsrc + position_status
            })  
          }
          if(stayTime/1000 >= 120){
            wx.navigateTo({
              url: '../../pages/checkInResult/checkInResult?status=failure' + '&isOvertime=' + 'true',
            })
          }
          // console.log(this.data.isfront)
          // console.log(this.data.frontsrc)
        }
        else{
          var stayTime = endTime - startTime;
          this.setData({
            backsrc: res.tempImagePath,
            stayTime : stayTime
          })
          if (this.data.photomode == 2 & this.data.stayTime/1000 < 120) {
            wx.navigateTo({
              url: '../../pages/preview/preview?backsrc=' + this.data.backsrc + position_status,
            })  
          } else if(this.data.photomode == 3 & this.data.stayTime/1000 < 120){
            wx.navigateTo({
              url: '../../pages/preview/preview?frontsrc='+ this.data.frontsrc + '&backsrc=' + this.data.backsrc + position_status,
            })  
          }
          if(stayTime/1000 >= 120){
            wx.navigateTo({
              url: '../../pages/checkInResult/checkInResult?status=failure' + '&isOvertime=' + 'true',
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
      isfront: !this.data.isfront,
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

  onShow(){
    setTimeout(function () {
        if (app.globalData.onShow) {
            app.globalData.onShow = 0;
            console.log("demo前后台切换之切到前台")
        }
        else {
            console.log("demo页面被切换显示")
            startTime = +new Date();
        }
    }, 100)
  },

  onUnload: function () {
    app.globalData.flagOfQuitCamera = true
    wx.reLaunch({
      url: '../transfer/transfer',
    })
  },
  // onHide(){
  //   setTimeout(function () {
  //       if (app.globalData.onHide) {
  //           app.globalData.onHide = 0;
  //           console.log("还在当前页面活动")
  //       }
  //       else {
  //           endTime = +new Date();
  //           console.log("demo页面停留时间：" + (endTime - startTime))
  //           var stayTime = endTime - startTime;
  //           if(stayTime/1000 >= 10){
  //             wx.navigateTo({
  //               url: '../../pages/checkInResult/checkInResult?status=failure' + '&isOvertime=' + 'true',
  //             })
  //           }
            
  //          //这里获取到页面停留时间stayTime，然后了可以上报了
  //       }
  //   }, 100)
  // }
})