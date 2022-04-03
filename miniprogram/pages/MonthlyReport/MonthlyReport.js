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

  MovetoDailyReport(e){
    var index = e.currentTarget.dataset.index
    var chosendate = this.data.dailyArray[index]
    var name = chosendate.staffName
    var date = chosendate.reportTime 
    var week = "周" + chosendate.ondutyWeek
    var staffId = chosendate.staffId 
    var IsSignIn = chosendate.signinTime?true:false
    wx.navigateTo({
      url: '../../pages/DailyReport/DailyReport?name=' + name + '&date=' + date + '&week=' + week + '&staffId=' + staffId + '&IsSignIn=' + IsSignIn,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const monthItem = JSON.parse(options.monthItem)
    let dailyReportsArray = app.dailyReportsArray
    dailyReportsArray = dailyReportsArray.filter((val) => {
      return val.staffId == monthItem.staffId && val.reportTime.startsWith(monthItem.month)
    })
    for (var i in dailyReportsArray) {
      if (!dailyReportsArray[i].workTurnName) {
        dailyReportsArray[i].condition = '未指定班次'
      } else {
        dailyReportsArray[i].condition = ''
        dailyReportsArray[i].extraWorking = false
        if (!dailyReportsArray[i].signinTime) {
          // dailyReportsArray[i].condition += '缺勤 '
        } else {
          if (dailyReportsArray[i].signinTime > dailyReportsArray[i].workTurnNo.substring(dailyReportsArray[i].workTurnNo.indexOf('(') + 1, dailyReportsArray[i].workTurnNo.indexOf('-'))) {
            dailyReportsArray[i].condition += '迟到 '
          }
        }

        if (!dailyReportsArray[i].logoutTime) {
          dailyReportsArray[i].condition += '缺勤 '
        } else {
          if (dailyReportsArray[i].logoutTime < dailyReportsArray[i].workTurnNo.substring(dailyReportsArray[i].workTurnNo.indexOf('-') + 1, dailyReportsArray[i].workTurnNo.indexOf(')'))) {
            dailyReportsArray[i].condition += '早退 '
          } 
          if (dailyReportsArray[i].logoutTime.substring(0, 2) > dailyReportsArray[i].workTurnNo.substring(dailyReportsArray[i].workTurnNo.indexOf('-') + 1, dailyReportsArray[i].workTurnNo.indexOf(')') - 3)) {
            dailyReportsArray[i].extraWorking = true
          } 
        } 
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