// pages/preview/preview.js
const app = getApp()
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenHeight: 0,
    screenWidth: 0,
    personName: 'User',
    locationName: 'Location',
    dateTime: '',
    backgroundImg: '../../resource/background_image.jpeg',
    personImg: '../../resource/person_image.png',
    positioned: '',
    index: '',
    latitude: '',
    longitude: '',
    psContent: '',
    photoMode: '',
    canvasImg: '',
    psArray: '',
    psIndex: '',
    isCanDraw: false
  },

  bindChangePs(e) {
    this.setData({
      psContent: this.data.psArray[e.detail.value]
    })
  },

  redo() {
    if (this.data.isCanDraw) {
      return
    }
    wx.redirectTo({
      url: '../checkIn/checkIn',
    })
  },

  share() {
    if (this.data.isCanDraw) {
      return
    }
    this.setData({
      isCanDraw: true
    })

    var interval = setInterval(() => {
      const that = this
      if (!that.data.isCanDraw) {
        clearInterval(interval)
        wx.showShareImageMenu({
          path: that.data.canvasImg,
          fail: err => {
            console.log(err)
          }
        })
      }
    }, 500)

  },

  complete() {
    if (this.data.isCanDraw) {
      return
    }
    // const that = this
    if (this.data.canvasImg == '') {
      this.setData({
        isCanDraw: true
      })
      var interval = setInterval(() => {
        if (!this.data.isCanDraw) {
          clearInterval(interval)
          this.completeUp(this.data.canvasImg)
        }
      }, 500)
    } else {
      this.completeUp(this.data.canvasImg)
    }
  },

  completeUp(finalImg) {
    // const finalImg = this.data.backgroundImg
    const dateTime = util.formatDateLine(new Date()) + util.formatTime(new Date())
    const mac = '00:00:00:00:00:00'
    let pid;
    if (this.data.positioned == 'true') {
      pid = app.globalData.GPSplace[this.data.index].pid
    } else {
      pid = '0' + '\t' + this.data.locationName + '@' + this.data.latitude + ',' + this.data.longitude
    }
    const item = '1' + '\t' + dateTime + '\t' + mac + '\t' + pid
    let dateTimeP = dateTime.replace(/-/g, '')
    dateTimeP = dateTimeP.replace(/:/g, '')
    dateTimeP = dateTimeP.replace(/ /g, '')

    let punchRecord = {
      'dateTime': dateTime,
      'location': this.data.locationName
    }

    if (app.globalData.autoSave == 1) {
      this.savePhoto(item, this.data.personImg, finalImg, this.data.locationName, dateTimeP, punchRecord, true)
    } else {
      app.postRecord(item, this.data.personImg, finalImg, this.data.locationName, dateTimeP, punchRecord)
    }

  },

  savePhoto(items, fileF, fileB, locationName, dateTimeP, punchRecord, needPost) {
    wx.saveImageToPhotosAlbum({
      filePath: fileB,
      success: (e) => {
        console.log('success save')
      },
      fail: (err) => {
        console.log(err)
        wx.getSetting({
          success: res => {
            if (typeof (res.authSetting['scope.writePhotosAlbum']) != 'undefined' && !res.authSetting['scope.writePhotosAlbum']) {
              // 用户拒绝了授权
              wx.showModal({
                title: '提示',
                content: '您拒绝了访问相册权限，将无法使用保存相片到相册功能',
                success: res => {
                  if (res.confirm) {
                    // 跳转设置页面
                    wx.openSetting({
                      success: res => {
                        if (res.authSetting['scope.writePhotosAlbum']) {
                          that.savePhoto(items, fileF, fileB, locationName, dateTimeP, punchRecord, false)
                        } else {
                          // 没有允许定位权限
                          wx.showToast({
                            title: '您拒绝了访问相册权限，将无法使用保存相片到相册功能',
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
      complete: (e) => {
        if (needPost) {
          app.postRecord(items, fileF, fileB, locationName, dateTimeP, punchRecord)
        }
      }
    })
  },

  handleClose(e) {
    console.log(e)
    this.setData({
      isCanDraw: !this.data.isCanDraw,
      canvasImg: e.detail
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var TIME = util.formatDateLine(new Date()) + util.formatTime(new Date());
    const tmp = app.globalData.AppPhoto % 10
    this.setData({
      screenHeight: app.globalData.screenHeight,
      screenWidth: app.globalData.screenWidth,
      dateTime: TIME,
      personImg: options.frontsrc,
      backgroundImg: options.backsrc,
      personName: app.globalData.username,
      positioned: options.positioned,
      index: options.index,
      locationName: options.LocationName,
      latitude: options.latitude,
      longitude: options.longitude,
      photoMode: tmp,
      psArray: app.globalData.REMARKS
    })
    if (tmp == 1) {
      this.setData({
        backgroundImg: options.frontsrc
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
    if (this.data.positioned == 'true') {
      this.setData({
        locationName: app.globalData.GPSplace[parseInt(this.data.index)].name
      })
    }
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