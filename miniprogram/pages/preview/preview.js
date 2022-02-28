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
    canvas: '',
    psContent: '',
    imgBH: '',
    imgBW: '',
    imgPH: '',
    imgPW: '',
    photoMode: '',
    canvasImg: ''
  },

  bindInputChange(e) {
    this.setData({
      psContent: e.detail.value
    })
    if (this.data.photoMode == 3) {
      this.drawText()
    }
  },

  redo () {
    wx.redirectTo({
      url: '../checkIn/checkIn?directlyCheck=true',
    })
  },

  share() {
    this.savePhotoAuto(true)
  },

  savePhotoAuto(isShowModal) {
    const that = this
    if (this.data.photoMode == 3) {
      if (this.data.canvasImg == '') {
        wx.canvasToTempFilePath({
          canvas: that.data.canvas,
          complete: (e)=> {
            that.setData({
              canvasImg: e.tempFilePath
            })
            that.savePhoto(e.tempFilePath)
            that.savePhoto(that.data.personImg)
          }
        })
      } else {
        this.savePhoto(this.data.canvasImg, false)
        that.savePhoto(that.data.personImg, isShowModal)
      }
    } else if (this.data.photoMode == 2) {
      that.savePhoto(that.data.backgroundImg, isShowModal)
    } else if (this.data.photoMode == 1) {
      that.savePhoto(that.data.personImg, isShowModal)
    } else {
      console.log(this.data.photoMode)
    }
  },

  complete() {
    const that = this
    if (this.data.photoMode == 3) {
      if (this.data.canvasImg == '') {
        wx.canvasToTempFilePath({
          canvas: that.data.canvas,
          complete: (e)=> {
            that.setData({
              canvas: e.tempFilePath
            })
            that.completeUp(e.tempFilePath)
          }
        })
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
    console.log(finalImg)
    if (app.globalData.autoSave == 1) {
      this.savePhotoAuto(false)
    }
    // const fileF = wx.env.USER_DATA_PATH + '/' + dateTimeP + '_' + 'f.jpg'
    // const fileB = wx.env.USER_DATA_PATH + '/' + dateTimeP + '_' + 'b.jpg'
    // const fs = wx.getFileSystemManager()
    // fs.renameSync(this.data.personImg, fileF)
    // fs.renameSync(finalImg, fileB)
    // app.postRecord(1, item, fileF, fileB, this.data.locationName)
  },

  drawImg() {
    const that = this
    wx.createSelectorQuery()
    .select('#canvas')
    .fields({
      node: true,
      size: true,
    }).exec((res) => {
      const canvas = res[0].node
      const height = res[0].height
      const width = res[0].width
      const ctx = canvas.getContext('2d')
      that.setData({
        canvas: canvas
      })

      const imgB = canvas.createImage()
      imgB.src = this.data.backgroundImg
      imgB.onload = function () {
        const realRto = that.data.imgBW / that.data.imgBH
        const canRto = width / height
        ctx.drawImage(imgB, 0, 0, width * 0.8, width * 0.8 * realRto * canRto)
        that.drawImgP(res)
      }
      
    })
  },

  drawImgP(res) {
    const that = this
    const canvas = res[0].node
    const height = res[0].height
    const width = res[0].width
    const ctx = canvas.getContext('2d')

    const imgP = canvas.createImage()
    imgP.src = this.data.personImg
    imgP.onload = function () {
      const heightP = height * 0.25
      const widthP = width * 0.25
      const realRto = that.data.imgPW / that.data.imgPH
      const canRto = width / height
      // ctx.clearRect(0, 0, widthP+ 6, heightP + 6)
      ctx.drawImage(imgP, 3, 3, widthP * 0.8, widthP * 0.8 * realRto * canRto)
    }
  },

  drawText() {
    const psContent = this.data.psContent.split('').join(' ')
    const canvas = this.data.canvas
    const ctx = canvas.getContext('2d')
    const fontpx = 8
    ctx.font = 'common-ligatures small-caps ' + fontpx + 'px sans-serif'
    const realRtoB = this.data.imgBW / this.data.imgBH
    const realRtoP = this.data.imgPW / this.data.imgPH
    const height = fontpx * 2
    const width = fontpx * psContent.length / 1.2 + 10
    const rx = 10
    const ry = this.data.screenHeight * 0.6 * realRtoB * realRtoP / 1.5 + 20

    const fx = rx + 5
    const fy = ry + fontpx * 1.5

    ctx.fillStyle = 'blueviolet'
    ctx.fillRect(rx, ry, width, height)
    ctx.fillStyle = 'white'
    ctx.fillText(psContent, fx, fy)
  },

  getImgP(e) {
    this.setData({
      imgPH: e.detail.height,
      imgPW: e.detail.width
    })
    console.log('P', e.detail.height, e.detail.width)
  },

  getImgB(e) {
    this.setData({
      imgBH: e.detail.height,
      imgBW: e.detail.width
    })
    console.log('B', e.detail.height, e.detail.width)
  },

  savePhoto(photoPath, isShowModal) {
    const that = this
    wx.saveImageToPhotosAlbum({
      filePath: photoPath,
      success: (e) => {
        if (isShowModal) {
          wx.showModal({
            title: '提示',
            content: '图片已保存至本地，可自行分享'
          })
        }
      },
      fail: (err) => {
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
      photoMode: tmp
    })
    if (tmp == 3) {
      const that = this
      var interval = setInterval(() => {
        if (that.data.imgBH && that.data.imgPH) {
          clearInterval(interval)
          that.drawImg()
        }
      }, 500)
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