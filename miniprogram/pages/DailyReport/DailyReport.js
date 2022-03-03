// pages/DailyReport/DailyReport.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenHeight: 0,
    screenWidth: 0,
    name:"寅畅",
    date: "2022-03-01",
    week:"周二",
    staffId:0,
    dailyReportsArray:[],
    // shouldAttandence:应出勤;actualAttandence:实际出勤;leavewithpayTime:有薪假;leavenopayTime:无薪假;usuallyOverTimes:平常加班;restOverTimes:休日加班;holidayOverTimes:假日加班;absentTimes:缺勤时长;lateTime:迟到时长;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let dailyReportsArray = wx.getStorageSync('dailyReportsArray')
    dailyReportsArray = dailyReportsArray?JSON.parse(dailyReportsArray):[]
    dailyReportsArray = dailyReportsArray.filter((val) => {return val.staffId == options.staffId & val.reportTime == options.date})
    that.setData({
      screenHeight: app.globalData.screenHeight,
      screenWidth: app.globalData.screenWidth,
      name:options.name,
      date:options.date,
      week:options.week,
      staffId:options.staffId,
      dailyReportsArray:dailyReportsArray
    })
    console.log(this.data.dailyReportsArray[0])

  },
})