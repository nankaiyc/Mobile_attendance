// pages/personInfo/personInfo.js
var app = getApp()
const CryptoJS = require('../../utils/crypto.js')
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
    personInfo: '',
    isLoading: true
  },
  launchPhoneCall(e){
    if (this.data.isLoading) {
      return
    }
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

  getPersonInfo(StaffID) {
    wx.showLoading({
      title: '数据加载中···',
    })
    this.data.isLoading = true
    const that = this
    var clid = app.globalData.clid

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    
    var _p = {
      '_s': clid + timestamp,
      'staffIds': StaffID
    }

    _p = JSON.stringify(_p)
    var _p_base64 = CryptoJS.Base64Encode(_p)

    wx.request({
      url: app.globalData.baseUrl + '/employees/',
      method: 'GET',
      data: {
        'CLID': clid,
        '_p': _p_base64,
        '_en': 'app2'
      },
      success: (e) => {
        console.log('success get person info ' + StaffID)
        var res = JSON.parse(CryptoJS.Base64Decode(e.data))
        that.setData({
          personInfo: res.Employees.filter((val) => {return val.staffId == StaffID})[0]
        })
        that.data.isLoading = false
        wx.hideLoading({})
      }
    })
  },
  
  onLoad: function (options) {
    this.getPersonInfo(options.StaffID)
    this.setData({
      name: app.globalData.username,
      company: app.globalData.apartment,
      id: app.globalData.AttNo,     
    })
  },
})