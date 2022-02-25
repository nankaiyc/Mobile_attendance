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
    psContent: ''
  },

  bindInputChange(e) {
    this.setData({
      psContent: e.detail.value
    })
    // this.drawText(e.detail.value)
  },

  redo () {
    wx.redirectTo({
      url: '../checkIn/checkIn?directlyCheck=true',
    })
  },

  complete() {
    const that = this
    wx.canvasToTempFilePath({
      canvas: that.data.canvas,
      complete: (e)=> {
        that.completeUp(e.tempFilePath)
      }
    })
  },

  completeUp() {
    const finalImg = this.data.backgroundImg
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
    const fileF = wx.env.USER_DATA_PATH + '/' + dateTimeP + '_' + 'f.jpg'
    const fileB = wx.env.USER_DATA_PATH + '/' + dateTimeP + '_' + 'b.jpg'
    const fs = wx.getFileSystemManager()
    fs.renameSync(this.data.personImg, fileF)
    fs.renameSync(finalImg, fileB)
    app.postRecord(1, item, fileF, fileB, this.data.locationName)
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
        ctx.drawImage(imgB, 0, 0, width, height * 0.5)
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
      // ctx.clearRect(0, 0, widthP+ 6, heightP + 6)
      ctx.drawImage(imgP, 3, 3, widthP, heightP * 0.5)
    }
  },

  drawText(psContent) {
    const canvas = this.data.canvas
    const ctx = canvas.getContext('2d')
    ctx.font = '20px sans-serif'
    const fontpx = parseInt(ctx.font.substring(0, ctx.font.indexOf('px')))
    const height = fontpx * 2
    const width = fontpx * psContent.length + 10
    const rx = 10
    const ry = 450

    const fx = rx + 5
    const fy = ry + fontpx * 1.5

    ctx.fillStyle = 'blueviolet'
    ctx.fillRect(rx, ry, width, height)
    ctx.fillStyle = 'white'
    ctx.fillText(psContent, fx, fy)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var TIME = util.formatDateLine(new Date()) + util.formatTime(new Date());
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
      longitude: options.longitude
    })

    // this.drawImg()
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