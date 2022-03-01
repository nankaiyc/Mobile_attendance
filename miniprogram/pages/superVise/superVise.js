// pages/superVise/superVise.js
const app = getApp()
const CryptoJS = require('../../utils/crypto.js')
var util = require('../../utils/util.js');
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
    monthlyReportsArray: [],
    dailyReportsArray: [],
    date: "",
    week:"",
    month: "",
    screenHeight: 0,
    screenWidth: 0,
    StaffList: [
      {
        name:"秦寅畅",
        company:"开发测试1",
        message:["2022-02-24 13:01:05 解放村","2022-02-24 13:01:05 中国农业银行(齐河县支行)","2022-02-24 13:01:05 仍里"],
      },
      {
        name:"王文鹏",
        company:"开发测试2",
        message:["2022-02-24 13:01:05 解放村","2022-02-24 13:01:05 中国农业银行(齐河县支行)","2022-02-24 13:01:05 仍里"],
      },
  ],
  },

  handleItemChange(e){
    const {index} = e.detail;
    let {tabs} = this.data;
    tabs.forEach((v,i) => i === index ? v.isActive = true : v.isActive = false);
    if (index == 2) {
      this.getMonthlyReports(this.data.month)
    }
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

  DailyReport_Detail(e){
    var name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../../pages/DailyReport/DailyReport?name=' + name + '&date=' + this.data.date + '&week=' + this.data.week,
    })
  },

  MonthlyReport_Detail(e){
    var name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../../pages/MonthlyReport/MonthlyReport?name=' + name + '&month=' + this.data.month,
    })
  },

  getDailyReportsByDate(date) {
    // case: '2022-01-01'
    var that = this;
    that.setData({
      StaffList: [],
    })
    var DailyReports = app.punchRecordsArray.filter((val) => {return val.date == date})

    for(var i in DailyReports) {
      var tempdic = {}
//       console.log(DailyReports[i])
      var flag = 0  
      for(var j in this.data.StaffList){      
        if(this.data.StaffList[j].name == DailyReports[i].staffName){
          var MSG = DailyReports[i].date +' '+ DailyReports[i].time+' '+DailyReports[i].deviceLocation
          // console.log(MSG)
          this.data.StaffList[j].message.push(MSG)
          flag = 1
        }
      }
      if(flag == 0){
        var MSG = DailyReports[i].date +' '+ DailyReports[i].time+' '+DailyReports[i].deviceLocation
        // console.log(MSG)
        tempdic.name = DailyReports[i].staffName
        tempdic.company = DailyReports[i].deptName
        tempdic.message = []
        tempdic.message.push(MSG)
        this.data.StaffList.push(tempdic)
      }    
    }
    that.setData({
      StaffList: this.data.StaffList,
    })
    // console.log(this.data.StaffList)
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
  
  getDailyReports() {
    let dailyReportsArray = wx.getStorageSync('dailyReportsArray')
    dailyReportsArray = dailyReportsArray?JSON.parse(dailyReportsArray):[]
    let lastSyncTime = wx.getStorageSync('dailyReportsLastSyncTime')
    lastSyncTime = lastSyncTime?lastSyncTime:'2022-01-01 00:00:00'
    var dateTime = new Date()
    dateTime = dateTime.setDate(dateTime.getDate()-31)
    dateTime = new Date(dateTime)
    const beginDate = util.formatDateLine(dateTime)
    const endDate = util.formatDateLine(new Date())
    this.data.dailyReportsArray = dailyReportsArray
    wx.showLoading({
      title: '数据加载中···',
    })
    this.getDailyReportsSinal(lastSyncTime, beginDate, endDate, 0)
  },

  getDailyReportsSinal(lastSyncTime, beginDate, endDate, index) {
    const that = this
    var clid = app.globalData.clid

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    const maxResult = 5
    var _p = {
      '_s': clid + timestamp,
      'lastSyncTime': lastSyncTime,
      'maxResult': maxResult,
      'index': index,
      'beginDate': beginDate,
      'endDate': endDate
    }
    _p = JSON.stringify(_p)
    var _p_base64 = CryptoJS.Base64Encode(_p)
    
    wx.request({
      url: app.globalData.baseUrl + '/dailyReports/',
      method: 'GET',
      data: {
        'CLID': clid,
        '_p': _p_base64,
        '_en': 'app2'
      },
      success: (e) => {
        console.log('success get' + 'dailyReports ' + index)
        var res = JSON.parse(CryptoJS.Base64Decode(e.data))
        that.data.dailyReportsArray.push.apply(that.data.dailyReportsArray, res.DailyReports)
        if (res.RESULT < maxResult) {
          const newArray = that.data.dailyReportsArray
          wx.setStorageSync('dailyReportsLastSyncTime', endDate + util.formatTime(new Date()))
          wx.setStorageSync('dailyReportsArray', JSON.stringify(newArray))
          that.setData({
            dailyReportsArray: newArray
          })
          wx.hideLoading({})
        } else {
          that.getDailyReportsSinal(lastSyncTime, beginDate, endDate, index + maxResult)
        }
      }
    })
  },

  setCurrentDate() {
    const that = this
    var dateTime=new Date();
    //setInterval是根据设置的时间来回调的，比如每秒回调一次
    var TIME = util.formatDateLine(dateTime);
    var WEEK = util.getWeekByDate(dateTime);
    var MONTH = util.formatMonthLine(dateTime);
    that.setData({
      date: TIME,
      week: WEEK,
      month: MONTH,
    })
    this.getDailyReports()
    this.getDailyReportsByDate(dateTime)
  },
  subDate(){
    const that = this
    var dateTime=new Date(that.data.date)
    dateTime=dateTime.setDate(dateTime.getDate()-1);
    dateTime=new Date(dateTime);
    var TIME = util.formatDateLine(dateTime);
    var WEEK = util.getWeekByDate(dateTime);
    that.setData({
      date: TIME,
      week: WEEK,
    })
    this.getDailyReportsByDate(this.data.date)
  },
  addDate(){
    const that = this
    var dateTime=new Date(that.data.date)
    dateTime=dateTime.setDate(dateTime.getDate()+1);
    dateTime=new Date(dateTime);
    var TIME = util.formatDateLine(dateTime);
    var WEEK = util.getWeekByDate(dateTime);
    that.setData({
      date: TIME,
      week: WEEK,
    })
    this.getDailyReportsByDate(this.data.date)
  },
  subMonth(){
    const that = this
    var dateTime=new Date(that.data.month)
    dateTime=dateTime.setMonth(dateTime.getMonth()-1);
    dateTime=new Date(dateTime);
    var MONTH = util.formatMonthLine(dateTime);
    that.setData({
      month: MONTH,
    })
    this.getMonthlyReports(MONTH)
  },
  addMonth(){
    const that = this
    var dateTime=new Date(that.data.month)
    dateTime=dateTime.setMonth(dateTime.getMonth()+1);
    dateTime=new Date(dateTime);
    var MONTH = util.formatMonthLine(dateTime);
    that.setData({
      month: MONTH,
    })
    this.getMonthlyReports(MONTH)
  },

  onLoad: function (options) {
    var that = this;
    that.setCurrentDate();
    that.setData({
      screenHeight: app.globalData.screenHeight,
      screenWidth: app.globalData.screenWidth,
    })
  },
})