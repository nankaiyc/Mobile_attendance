// pages/DailyReport/DailyReport.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenHeight: 0,
    screenWidth: 0,
    name:"",
    date: "",
    week:"",
    staffId:0,
    dailyReportsArray:[],
    IsSignIn:true,
    // shouldAttandence:应出勤;actualAttandence:实际出勤;leavewithpayTime:有薪假;leavenopayTime:无薪假;usuallyOverTimes:平常加班;restOverTimes:休日加班;holidayOverTimes:假日加班;absentTimes:缺勤时长;lateTime:迟到时长;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let dailyReportsArray = app.dailyReportsArray
    dailyReportsArray = dailyReportsArray.filter((val) => {return val.staffId == options.staffId && val.reportTime == options.date})
    
    dailyReportsArray[0].leavewithpayTime = (dailyReportsArray[0].leavewithpayTime / 60).toFixed(2)
    dailyReportsArray[0].leavenopayTime = (dailyReportsArray[0].leavenopayTime / 60).toFixed(2)
    dailyReportsArray[0].usuallyOverTimes = (dailyReportsArray[0].usuallyOverTimes / 60).toFixed(2)
    dailyReportsArray[0].restOverTimes = (dailyReportsArray[0].restOverTimes / 60).toFixed(2)
    dailyReportsArray[0].holidayOverTimes = (dailyReportsArray[0].holidayOverTimes / 60).toFixed(2)
    dailyReportsArray[0].actualNotduty = (dailyReportsArray[0].actualNotduty / 60).toFixed(2)
    dailyReportsArray[0].absenteeism = (dailyReportsArray[0].absenteeism / 60).toFixed(2)
    dailyReportsArray[0].leavewithpayTime = (dailyReportsArray[0].leavewithpayTime / 60).toFixed(2)
    dailyReportsArray[0].lateTime = (dailyReportsArray[0].lateTime / 60).toFixed(2)
    dailyReportsArray[0].overtimeTime = (dailyReportsArray[0].overtimeTime / 60).toFixed(2)
    dailyReportsArray[0].leaveearlyTime = (dailyReportsArray[0].leaveearlyTime / 60).toFixed(2)
    that.setData({
      screenHeight: app.globalData.screenHeight,
      screenWidth: app.globalData.screenWidth,
      name:options.name,
      date:options.date,
      week:options.week,
      staffId:options.staffId,
      IsSignIn:options.IsSignIn?JSON.parse(options.IsSignIn):true,
      dailyReportsArray:dailyReportsArray
    })
    console.log(dailyReportsArray)

  },
})