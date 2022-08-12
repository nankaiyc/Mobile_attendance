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
    dailyArray:[]
  },

  MovetoDailyReport(e){
    var index = e.currentTarget.dataset.index
    var chosendate = this.data.dailyArray[index]
    var name = chosendate.staffName
    var date = chosendate.reportTime 
    var week = "周" + chosendate.ondutyWeek
    var staffId = chosendate.staffId 
    var IsSignIn = chosendate.signinTime || chosendate.logoutTime?true:false
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
    monthItem.withSalaryLeave = (monthItem.withSalaryLeave / 60).toFixed(2)
    monthItem.withoutSalaryLeave = (monthItem.withoutSalaryLeave / 60).toFixed(2)
    monthItem.absentMinutes = (monthItem.absentMinutes / 60).toFixed(2)
    monthItem.absenteeismTime = (monthItem.absenteeismTime / 60).toFixed(2)
    monthItem.attendancePercent = monthItem.attendancePercent.toFixed(1)
    monthItem.absenteeismTime = (monthItem.absenteeismTime / 480).toFixed(2)
    monthItem.leaveWithPayDay = monthItem.leaveWithPayDay?(monthItem.leaveWithPayDay * 8).toFixed(2):0
    monthItem.leaveWithNoPayDay = monthItem.leaveWithNoPayDay?(monthItem.leaveWithNoPayDay * 8).toFixed(2):0

    // let dailyReportsArray = [].concat(app.dailyReportsArray)
    let dailyReportsArray = app.dailyReportsArray
    dailyReportsArray = dailyReportsArray.filter((val) => {
      return val.staffId == monthItem.staffId && val.reportTime.startsWith(monthItem.month)
    })

    console.log(dailyReportsArray)
    for (var i in dailyReportsArray) {
      if (dailyReportsArray[i].leaveTypeName) {
        dailyReportsArray[i].condition = dailyReportsArray[i].leaveTypeName
      } else {
        dailyReportsArray[i].condition = ''
        dailyReportsArray[i].extraWorking = false

        if (!(dailyReportsArray[i].workType && dailyReportsArray[i].workType.includes('休息'))) {
          if (!dailyReportsArray[i].signinTime || dailyReportsArray[i].signinTime == '缺卡') {
            if (dailyReportsArray[i].shouldAttandence) {
              dailyReportsArray[i].condition += '缺勤 '
            }
            if (dailyReportsArray[i].logoutTime) {
              dailyReportsArray[i].condition += '缺少打卡记录 '
            }
          } else {
            if (dailyReportsArray[i].workTurnNo && dailyReportsArray[i].signinTime > dailyReportsArray[i].workTurnNo.substring(dailyReportsArray[i].workTurnNo.indexOf('(') + 1, dailyReportsArray[i].workTurnNo.indexOf('-'))) {
              dailyReportsArray[i].condition += '迟到 '
            }
          }
        }

        if (!dailyReportsArray[i].logoutTime) {
          // dailyReportsArray[i].condition += '缺勤 '
        } else {
          if (dailyReportsArray[i].workTurnNo && dailyReportsArray[i].logoutTime < dailyReportsArray[i].workTurnNo.substring(dailyReportsArray[i].workTurnNo.indexOf('-') + 1, dailyReportsArray[i].workTurnNo.indexOf(')'))) {
            // dailyReportsArray[i].condition += '早退 '
          } 
          if (dailyReportsArray[i].workTurnNo && dailyReportsArray[i].logoutTime.substring(0, 2) > dailyReportsArray[i].workTurnNo.substring(dailyReportsArray[i].workTurnNo.indexOf('-') + 1, dailyReportsArray[i].workTurnNo.indexOf(')') - 3)) {
            dailyReportsArray[i].extraWorking = true
          } 
        } 
      }

      if (dailyReportsArray[i].condition == '') {
        dailyReportsArray[i].condition = '无异常'
      }

      dailyReportsArray[i].usuallyOvertime = (dailyReportsArray[i].usuallyOvertime / 60).toFixed(2)
      dailyReportsArray[i].restOvertime = (dailyReportsArray[i].restOvertime / 60).toFixed(2)
      dailyReportsArray[i].holidayOvertime = (dailyReportsArray[i].holidayOvertime / 60).toFixed(2)
      dailyReportsArray[i].logoutTime = dailyReportsArray[i].logoutTime?dailyReportsArray[i].logoutTime:'缺卡'
      dailyReportsArray[i].signinTime = dailyReportsArray[i].signinTime?dailyReportsArray[i].signinTime:'缺卡'
      }
    dailyReportsArray.reverse()
    
    console.log(monthItem, dailyReportsArray)
    that.setData({
      screenHeight: app.globalData.screenHeight,
      screenWidth: app.globalData.screenWidth,
      monthItem: monthItem,
      dailyArray: dailyReportsArray
    })
  },

})