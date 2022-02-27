// pages/personInfo/personInfo.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    company:"",
    id:0,
    entry_data:"ed",
    phone:'phone',
  },
  launchPhoneCall(e){
    var tel = e.currentTarget.dataset.tel.toString();
    console.log(typeof(tel))
    wx.makePhoneCall({
      phoneNumber: tel,
      success: function () {
        console.log("拨号成功！")
      },
      fail: function () {
        console.log("拨号失败！")
      }
    })
  },

  onLoad: function (options) {
    
    this.setData({
      name: app.globalData.username,
      company: app.globalData.apartment,
      id: app.globalData.AttNo,     
    })
  },
})