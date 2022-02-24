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
    psContent: ''
    // imgBH: '',
    // imgBW: '',
    // imgPH: '',
    // imgPW: ''
  },

  bindInputChange(e) {
    this.setData({
      psContent: e.detail.value
    })
  },

  redo () {
    wx.redirectTo({
      url: '../checkIn/checkIn?directlyCheck=true',
    })
  },

  complete() {
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
    fs.renameSync(this.data.backgroundImg, fileB)
    app.postRecord(1, item, fileF, fileB, this.data.locationName)
  },

  // drawImg() {
  //   const that = this
  //   wx.createSelectorQuery()
  //   .select('#canvas')
  //   .fields({
  //     node: true,
  //     size: true,
  //   }).exec((res) => {
  //     const canvas = res[0].node
  //     const height = res[0].height
  //     const width = res[0].width
  //     const ctx = canvas.getContext('2d')
      
  //     const imgB = canvas.createImage()
  //     imgB.src = this.data.backgroundImg
  //     imgB.onload = function () {
  //       console.log(width, height)
  //       console.log(that.data.imgBW, that.data.imgBH)
  //       console.log(width / that.data.imgBW, height / that.data.imgBH)
  //       // ctx.scale(height / that.data.imgBH, width / that.data.imgBW)
  //       // ctx.scale(width / that.data.imgBW, height / that.data.imgBH)
  //       // ctx.scale(height / that.data.imgBH, height / that.data.imgBH)
  //       // ctx.scale(1, 1/app.globalData.pixelRatio)
  //       // ctx.drawImage(imgB, 0, 0, that.data.imgBW, that.data.imgBH)
  //       // ctx.drawImage(imgB, 0, 0, that.data.imgBW, that.data.imgBH, 0, 0, width, height)
  //       ctx.drawImage(imgB, 0, 0, width, height)
  //       // ctx.scale(that.data.imgBH / height, that.data.imgBW / width)
  //       // ctx.scale(that.data.imgBW / width, that.data.imgBH / height)
  //       that.drawImgP(res)
  //     }
      
  //   })
  // },

  // drawImgP(res) {
  //   const that = this
  //   const canvas = res[0].node
  //   const height = res[0].height
  //   const width = res[0].width
  //   const ctx = canvas.getContext('2d')

  //   const imgP = canvas.createImage()
  //   imgP.src = this.data.personImg
  //   imgP.onload = function () {
  //     const heightP = height * 0.25
  //     const widthP = width * 0.25
  //     // ctx.scale(heightP / that.data.imgPH, widthP / that.data.imgPW)
  //     // ctx.scale(widthP / that.data.imgPW, heightP / that.data.imgPH)
  //     // ctx.scale(heightP / that.data.imgPH, heightP / that.data.imgPH)
  //     // ctx.scale(1, app.globalData.pixelRatio)
  //     // ctx.clearRect(0, 0, that.data.imgPW + 10, that.data.imgPH + 10)
  //     // ctx.drawImage(imgP, 0, 0,that.data.imgPW, that.data.imgPH)
  //       ctx.drawImage(imgP, 0, 0, widthP, heightP)
  //     // ctx.drawImage(imgP, 0, 0, that.data.imgPW, that.data.imgPH, 0, 0, widthP, heightP)
  //     // ctx.scale(that.data.imgPH / heightP, that.data.imgPW / widthP)
  //   }
  // },

  // getImgP(e) {
  //   this.setData({
  //     imgPH: e.detail.height,
  //     imgPW: e.detail.width
  //   })
  //   console.log('P', e.detail.height, e.detail.width)
  // },

  // getImgB(e) {
  //   this.setData({
  //     imgBH: e.detail.height,
  //     imgBW: e.detail.width
  //   })
  //   console.log('B', e.detail.height, e.detail.width)
  // },

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

    // const that = this
    // var interval = setInterval(() => {
    //   if (that.data.imgBH && that.data.imgPH) {
    //     clearInterval(interval)
    //     that.drawImg()
    //   }
    // }, 500)
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