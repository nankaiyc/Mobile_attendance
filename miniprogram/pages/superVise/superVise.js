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
        name:"即时报告",
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
    StaffList: [],
    ReportList:[
      {
        time:"2021-12-07 09:00",
        content:"2021-12-07 09:00签到报告：办公室应到3人，已到2人，未到1人:xxx,出勤率：50%",
        Isread:false,
      },
      {
        time:"2021-12-08 09:00",
        content:"2021-12-08 09:00签到报告：办公室应到3人，已到2人，未到1人:yc,出勤率：60%",
        Isread:false,
      },
    ],
    selectedArray: [],
    punchRecordslastSyncTime: '',
    punchRecordsArray: [],
    dailyReportsLastSyncTime: '',
    isLoading: true,
    isPullDown: false
  },

  handleItemChange(e){
    if (this.data.isLoading) {
      return
    }
    const {index} = e.detail;
    let {tabs} = this.data;
    tabs.forEach((v,i) => i === index ? v.isActive = true : v.isActive = false);
    if (index == 1) {
      this.getInstantReport()
    }
    if (index == 2) {
      this.getMonthlyReports(this.data.month)
    }
    this.setData({
      tabs
    })
  },
  handlemethodchange(e){
    if (this.data.isLoading) {
      return
    }
    var chosen = e.detail
    if(chosen == "设置监管范围"){
      wx.navigateTo({
        url: '../../pages/attendancePersonSet/attendancePersonSet',
      })
    }
  },

  DailyReport_Detail(e){
    if (this.data.isLoading) {
      return
    }
    var name = e.currentTarget.dataset.name
    var staffId = e.currentTarget.dataset.staffid
    wx.navigateTo({
      url: '../../pages/DailyReport/DailyReport?name=' + name + '&date=' + this.data.date + '&week=' + this.data.week + '&staffId=' + staffId,
    })
  },

  MonthlyReport_Detail(e){
    if (this.data.isLoading) {
      return
    }
    const that = this
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../../pages/MonthlyReport/MonthlyReport?monthItem=' + JSON.stringify(that.data.monthlyReportsArray[index]),
    })
  },

  getDailyReportsByDate(date) {
    // case: '2022-01-01'
    var that = this;
    that.setData({
      StaffList: [],
    })
    var DailyReports = app.punchRecordsArray.filter((val) => {return val.date == date && that.data.selectedArray.includes(val.staffId)})

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
        tempdic.staffId = DailyReports[i].staffId
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
    this.data.isLoading = true
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
          for (var i in newArray) {
            newArray[i].isShow = that.data.selectedArray.includes(newArray[i].staffId)
          }
          that.setData({
            monthlyReportsArray: newArray
          })
          wx.hideLoading({})
          that.data.isLoading = false
          
          if (that.data.isPullDown) {
            that.data.isPullDown = false
            wx.stopPullDownRefresh()
            wx.showToast({
              title: '刷新成功！同步时间：' + util.formatDateLine(new Date()) + util.formatTime(new Date()),
              icon: 'none',
              duration: 1500
            })
          }
        } else {
          that.getMonthlyReportsSinal(month, index + maxResult)
        }
      }
    })
  },
  
  getDailyReports() {
    var dateTime = new Date()
    dateTime = dateTime.setDate(dateTime.getDate()-10)
    dateTime = new Date(dateTime)
    const beginDate = util.formatDateLine(dateTime)
    const endDate = util.formatDateLine(new Date())
    const lastSyncTime = this.data.dailyReportsLastSyncTime
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
          that.setData({
            dailyReportsArray: newArray,
            dailyReportsLastSyncTime: endDate + util.formatTime(new Date())
          })

          that.getPunchRecords()
        } else {
          that.getDailyReportsSinal(lastSyncTime, beginDate, endDate, index + maxResult)
        }
      }
    })
  },

  getPunchRecords() {
    var dateTime = new Date()
    dateTime = dateTime.setDate(dateTime.getDate()-10)
    dateTime = new Date(dateTime)
    const beginDate = util.formatDateLine(dateTime)
    const endDate = util.formatDateLine(new Date())
    const lastSyncTime = this.data.punchRecordslastSyncTime
    this.getPunchRecordsSinal(lastSyncTime, beginDate, endDate, 0)
  },

  getPunchRecordsSinal(lastSyncTime, beginDate, endDate, index) {
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
      url: app.globalData.baseUrl + '/punchRecords/',
      method: 'GET',
      data: {
        'CLID': clid,
        '_p': _p_base64,
        '_en': 'app2'
      },
      success: (e) => {
        console.log('success get' + 'punchRecords ' + index)
        var res = JSON.parse(CryptoJS.Base64Decode(e.data))
        
        that.data.punchRecordsArray.push.apply(that.data.punchRecordsArray, res.AttRecords)
        if (res.RESULT < maxResult) {
          const newArray = that.data.punchRecordsArray
          app.punchRecordsArray = newArray
          this.setData({
            punchRecordsArray: newArray,
            punchRecordslastSyncTime: endDate + util.formatTime(new Date())
          })
          
          this.getDailyReportsByDate(this.data.date)
          
          wx.hideLoading({})
          that.data.isLoading = false

          if (that.data.isPullDown) {
            that.data.isPullDown = false
            wx.stopPullDownRefresh()
            wx.showToast({
              title: '刷新成功！同步时间：' + that.data.punchRecordslastSyncTime,
              icon: 'none',
              duration: 1500
            })
          }
          if (that.data.selectedArray.length == 0) {
            wx.showModal({
              title: '初次使用该功能，请设置监管范围！',
              success: (res) => {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../../pages/attendancePersonSet/attendancePersonSet',
                  })
                }
              }
            })
          }
        } else {
          that.getPunchRecordsSinal(lastSyncTime, beginDate, endDate, index + maxResult)
        }
      }
    })
  },

  setCurrentDate() {
    const that = this
    var dateTime=new Date();
    var TIME = util.formatDateLine(dateTime);
    var WEEK = util.getWeekByDate(dateTime);
    dateTime=dateTime.setMonth(dateTime.getMonth()-1);
    dateTime=new Date(dateTime);
    var MONTH = util.formatMonthLine(dateTime);
    that.setData({
      date: TIME,
      week: WEEK,
      month: MONTH,
    })
    // var MonthTime=new Date(that.data.month)
    // var thisMonth = MonthTime.getMonth() + 1;
    // console.log(thisMonth)
    this.getDailyReports()
    this.getDailyReportsByDate(dateTime)
  },
  subDate(){
    if (this.data.isLoading) {
      return
    }
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
    if (this.data.isLoading) {
      return
    }
    const that = this
    var today=new Date();
    var dateTime=new Date(that.data.date)
    var dateTimeAdded=dateTime.setDate(dateTime.getDate()+1);
    if(today >= dateTimeAdded){
      dateTimeAdded=new Date(dateTimeAdded);
      var TIME = util.formatDateLine(dateTimeAdded);
      var WEEK = util.getWeekByDate(dateTimeAdded);
      that.setData({
        date: TIME,
        week: WEEK,
      })
      this.getDailyReportsByDate(this.data.date)
    }  
  },
  subMonth(){
    if (this.data.isLoading) {
      return
    }
    const that = this
    var today=new Date();
    var currentmonth = today.getMonth() + 1;
    var MonthTime=new Date(that.data.month)
    var thisMonth = MonthTime.getMonth() + 1;
    console.log(currentmonth,thisMonth)
    var MonthTimeSubed = MonthTime.setMonth(MonthTime.getMonth()-1);
    if(currentmonth >= thisMonth && thisMonth > currentmonth-1){
      MonthTimeSubed=new Date(MonthTimeSubed);
      var MONTH = util.formatMonthLine(MonthTimeSubed);
      that.setData({
        month: MONTH,
      })
      this.getMonthlyReports(MONTH)
    }
  },
  addMonth(){
    if (this.data.isLoading) {
      return
    }
    const that = this
    var today=new Date();
    var currentmonth = today.getMonth() + 1;
    var MonthTime=new Date(that.data.month)
    var thisMonth = MonthTime.getMonth() + 1;
    console.log(currentmonth,thisMonth)
    var MonthTimeAdded = MonthTime.setMonth(MonthTime.getMonth()+1);
    if(currentmonth > thisMonth && thisMonth >= currentmonth-1){
      MonthTimeAdded=new Date(MonthTimeAdded);
      var MONTH = util.formatMonthLine(MonthTimeAdded);
      that.setData({
        month: MONTH,
      })
      this.getMonthlyReports(MONTH)
    }
  },

  getInstantReport() {
    let instantReportArray = wx.getStorageSync('instantReportArray')
    instantReportArray = instantReportArray ? JSON.parse(instantReportArray) : []
    const that = this
    var clid = app.globalData.clid
    // var clid = '/FdMiEaHinp8oESNSwoFgSUZY2kqL0razBxW9H1ipZo='

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var _p = {
      '_s': clid + timestamp,
    }

    _p = JSON.stringify(_p)
    var _p_base64 = CryptoJS.Base64Encode(_p)
    wx.request({
      url: app.globalData.baseUrl + '/' + 'appPushReports' + '/',
      method: 'GET',
      data: {
        'CLID': clid,
        '_p': _p_base64,
        '_en': 'app2'
      },
      success: (e) => {
        console.log('success get appPushReports')
        var res = JSON.parse(CryptoJS.Base64Decode(e.data))
        console.log(res)
        instantReportArray.push.apply(instantReportArray, res.reports)
        wx.setStorageSync('instantReportArray', JSON.stringify(instantReportArray))
      }
    })
  },

  onLoad: function (options) {
    var that = this;
    that.setCurrentDate();
    that.setData({
      screenHeight: app.globalData.screenHeight,
      screenWidth: app.globalData.screenWidth,
    })
  },

  onPullDownRefresh: function (options) {
    this.data.isPullDown = true
    if (this.data.tabs[0].isActive) {
      this.getDailyReports()
    } else if (this.data.tabs[2].isActive) {
      this.getMonthlyReports(this.data.month)
    }
  },
  onShow: function (options) {
    this.setData({
      selectedArray: app.globalData.selectedArray
    })
  }
})