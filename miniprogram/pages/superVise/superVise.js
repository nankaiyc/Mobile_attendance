// pages/superVise/superVise.js
const app = getApp()
const CryptoJS = require('../../utils/crypto.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: [
      {
        index : 0,
        name : "设置监管范围"
      }
    ],
    tabs:[
      {
        id:0,
        name:"每日出勤",
        isActive:true
      },
      {
        id:1,
        name:"及时报告",
        isActive:false
      },
      {
        id:2,
        name:"考勤统计",
        isActive:false
      },
    ],
    monthlyReportsArray: []
  },

  handleItemChange(e){
    const {index} = e.detail;
    let {tabs} = this.data;
    tabs.forEach((v,i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },

  handlemethodchange(e){
    var chosen = e.detail
    if(chosen == "设置监管范围"){
      wx.navigateTo({
        url: '../../pages/attendancePersonSet/attendancePersonSet',
      })
    }
  },

  getDailyReportsByDate(date) {
    // case: '2022-01-01'
    console.log(app.dailyReportsArray.filter((val) => {return val.reportTime == date}))
  },
  
  getMonthlyReports(month) {
    wx.showLoading({
      title: '数据加载中···',
    })
    this.data.monthlyReportsArray = []
    this.getMonthlyReportsSinal(month, 0)
  },

  getMonthlyReportsSinal(month, index) {
    const that = this
    var clid = app.globalData.clid

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    const maxResult = 5
    var _p = {
      '_s': clid + timestamp,
      'month': month,
      'maxResult': maxResult,
      'index': index,
    }
    _p = JSON.stringify(_p)
    var _p_base64 = CryptoJS.Base64Encode(_p)
    
    wx.request({
      url: app.globalData.baseUrl + '/monthlyReports/',
      method: 'GET',
      data: {
        'CLID': clid,
        '_p': _p_base64,
        '_en': 'app2'
      },
      success: (e) => {
        console.log('success get' + 'monthlyReports ' + index)
        var res = JSON.parse(CryptoJS.Base64Decode(e.data))
        that.data.monthlyReportsArray.push.apply(that.data.monthlyReportsArray, res.MonthlyReports)
        if (res.RESULT < maxResult) {
          const newArray = that.data.monthlyReportsArray
          console.log(newArray)
          that.setData({
            monthlyReportsArray: newArray
          })
          wx.hideLoading({})
        } else {
          that.getMonthlyReportsSinal(month, index + maxResult)
        }
      }
    })
  },
  onLoad: function() {
    this.getMonthlyReports('2022-01')
  }
})