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

  bindInputChange(e) {
    this.setData({
      psContent: e.detail.value
    })
  },

  bindChangePs(e) {
    this.setData({
      psContent: this.data.psArray[e.detail.value]
    })
  },

  redo () {
    wx.redirectTo({
      url: '../checkIn/checkIn?directlyCheck=true',
    })
  },

  share() {
    this.setData({
      isCanDraw: true
    })
    
    var interval = setInterval(() => {
      const that = this
      if (!that.data.isCanDraw) {
        clearInterval(interval)
        wx.showShareImageMenu({
          path:  that.data.canvasImg,
          fail: err => {
            console.log(err)
          }
        })
      }
    }, 500)
    
  },

  savePhotoAuto(isShowModal) {
    this.savePhoto(this.data.canvasImg, false)
  },

  complete() {
    const that = this
    if (this.data.photoMode == 3) {
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
    } else if (this.data.photoMode == 2) {
      that.completeUp(that.data.backgroundImg)
    } else if (this.data.photoMode == 1) {
      that.completeUp(that.data.personImg)
    } else {
      console.log(this.data.photoMode)
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
    if (app.globalData.autoSave == 1) {
      this.savePhotoAuto(false)
    }
    let punchRecordsArray = wx.getStorageSync('PunchRecordsArray');
    punchRecordsArray = punchRecordsArray?JSON.parse(punchRecordsArray):[]
    punchRecordsArray.push({
      'dateTime': dateTime,
      'location': this.data.locationName
    })
    wx.setStorageSync('PunchRecordsArray', JSON.stringify(punchRecordsArray))
    app.postRecord(item, this.data.personImg, finalImg, this.data.locationName, dateTimeP)
  },

  savePhoto(photoPath, isShowModal) {
    console.log(photoPath)
    wx.saveImageToPhotosAlbum({
      filePath: photoPath,
      success: (e) => {
        console.log('success save')
      },
      fail: (err) => {
        console.log(err)
        if (err.errMsg == "saveImageToPhotosAlbum:fail cancel") {
          //获取权限
          // if (settingdata.authSetting["scope.writePhotosAlbum"]) {
          // console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
          // }else {
          // console.log('获取权限失败，给出不给权限就无法正常使用的提示')
          // }
          // that.savePhoto(photoPath)
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
    var TIME = util.formatDateLine(new Date()) + util.formatTime(new Date());
    const tmp = app.globalData.AppPhoto % 10
    this.setData({
      screenHeight: app.globalData.screenHeight,
      screenWidth: app.globalData.screenWidth,
      dateTime: TIME,
      personImg:options.frontsrc,
      backgroundImg:options.backsrc,
      personName: app.globalData.username,
      positioned: options.positioned,
      index: options.index,
      locationName: options.LocationName,
      latitude: options.latitude,
      longitude: options.longitude,
      photoMode: tmp,
      psArray: app.globalData.REMARKS
    })
    if (tmp == 3) {
      // const that = this
      // var interval = setInterval(() => {
      //   if (that.data.imgBH && that.data.imgPH) {
      //     clearInterval(interval)
      //     that.drawImg()
      //   }
      // }, 500)
    } else if (tmp == 1) {
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