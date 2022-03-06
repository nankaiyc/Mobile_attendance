// pages/MonthlyReport/MonthlyReport.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenHeight: 0,
    screenWidth: 0,
    monthItem: '',
    dailyArray:[
      {
        date:"2022-03-31",
        week:"周四",
        condition:"缺勤",
        classes:"无班次",
        record:"没有打卡记录"
      },
      {
        date:"2022-03-30",
        week:"周三",
        condition:"缺勤",
        classes:"无班次",
        record:"签到 14:43:18  签退 14:49:51"
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const monthItem = JSON.parse(options.monthItem)
    let dailyReportsArray = wx.getStorageSync('dailyReportsArray')
    dailyReportsArray = dailyReportsArray?JSON.parse(dailyReportsArray):[]
    dailyReportsArray = dailyReportsArray.filter((val) => {
      return val.staffId == monthItem.staffId && val.reportTime.startsWith(monthItem.month)
    })
    for (var i in dailyReportsArray) {
      if (!dailyReportsArray[i].workTurnName) {
        dailyReportsArray[i].condition = '未指定班次'
      } else if (!dailyReportsArray[i].signinTime) {
        dailyReportsArray[i].condition = '缺勤'
      } else if (dailyReportsArray[i].logoutTime < dailyReportsArray[i].workTurnNo.substring(dailyReportsArray[i].workTurnNo.indexOf('-') + 1, dailyReportsArray[i].workTurnNo.indexOf(')'))) {
        dailyReportsArray[i].condition = '早退'
      } else if (dailyReportsArray[i].signinTime > dailyReportsArray[i].workTurnNo.substring(dailyReportsArray[i].workTurnNo.indexOf('(') + 1, dailyReportsArray[i].workTurnNo.indexOf('-'))) {
        dailyReportsArray[i].condition = '迟到'
      }
    }
    console.log(monthItem, dailyReportsArray)
    that.setData({
      screenHeight: app.globalData.screenHeight,
      screenWidth: app.globalData.screenWidth,
      monthItem: monthItem,
      dailyArray: dailyReportsArray
    })
  },

})