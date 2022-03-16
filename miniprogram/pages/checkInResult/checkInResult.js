// pages/checkInResult/checkInResult.js
var util = require('../../utils/util.js')
var bmap = require('../../utils/bmap-wx.js')
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSuccess:true,
    place:"PLACE",
    message:"",
    isQuit: '',
    photoMode: '',
    poiArray: [],
    nameArray: []
  },

  changeResult(){
    this.setData({
      isSuccess:!this.data.isSuccess
    })
  },
  
  onSuccess () {
    wx.redirectTo({
      url: '../checkIn/checkIn',
    })
  },

  onFail () {
    wx.navigateBack()
  },

  nonPositioned (e) {
    const item = this.data.poiArray[e.detail.value]
    if (this.data.photoMode == 0) {
      this.completeUp(item.address, item.latitude, item.longitude)
    } else {
      wx.navigateTo({
        url: '../../pages/camera/camera?positioned=false&LocationName=' + item.address + '&latitude=' + item.latitude + '&longitude=' + item.longitude + '&photomode=' + this.data.photoMode,
      })
    }
  },
  
  completeUp(locationName, latitude, longitude) {
    const dateTime = util.formatDateLine(new Date()) + util.formatTime(new Date())
    const mac = '00:00:00:00:00:00'
    let pid = '0' + '\t' + locationName + '@' + latitude + ',' + longitude
    const item = '1' + '\t' + dateTime + '\t' + mac + '\t' + pid
    let dateTimeP = dateTime.replace(/-/g, '')
    dateTimeP = dateTimeP.replace(/:/g, '')
    dateTimeP = dateTimeP.replace(/ /g, '')
    let punchRecord = {
      'dateTime': dateTime,
      'location': locationName
    }
    app.postRecord(item, '', '', locationName, dateTimeP, punchRecord)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var DATE = util.formatDate(new Date());
    var TIME = util.formatTime(new Date());
    var PLACE = options.locationName
    
    if (options.isQuit != 'true') {
      const that = this
      var BMap = new bmap.BMapWX({ 
        ak: app.globalData.ak 
      })
      BMap.search({
        success: (e) => {
          const res = e.wxMarkerData
          let nameArray = []
          for (var i in res) {
            nameArray.push(res[i].title)
            if (i >= 4) {
              break
            }
          }
          that.setData({
            nameArray: nameArray,
            poiArray: res
          })
        }
      })
    }

    this.setData({
      message : "您于" + DATE + TIME + "在" + PLACE + "打卡成功。",
      isSuccess:options.status == "success"?true:false,
      isQuit: options.isQuit=='true'?true:false,
      photoMode: app.globalData.AppPhoto % 10,
    })
    
    // console.log(this.data.message)
    // console.log(DATE)
    // console.log(this.data.isSuccess)
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