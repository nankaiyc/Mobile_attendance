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
    backgroundImg: '../../resource/background_image.png',
    personImg: '../../resource/person_image.jpeg',
    positioned: '',
    index: ''
  },

  bindInputChange(e) {
    const nameInput = e.detail.value.trim()
  },

  redo () {
    wx.redirectTo({
      url: '../checkIn/checkIn?directlyCheck=true',
    })
  },

  complete() {
    const dateTime = util.formatDateLine(new Date()) + util.formatTime(new Date())
    const mac = '00:00:00:00:00:00'
    const pid = app.globalData.GPSplace[this.data.index].pid
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
      locationName: app.globalData.GPSplace[parseInt(options.index)].name
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