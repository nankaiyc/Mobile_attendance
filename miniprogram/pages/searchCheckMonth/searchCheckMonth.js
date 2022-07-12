// pages/searchCheckMonth/searchCheckMonth.js
const app = getApp()
const util = require('../../utils/util.js');
const CryptoJS = require('../../utils/crypto.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    departmentIndex: 0,
    departmentArray: [],
    monthIndex: 0,
    monthArray: [],
    StaffList: [],
    screenHeight: 0,
    screenWidth: 0,
    departmentObjectArray: [],
    subordinationDict: '',
    tmpDeparts: '',
    isLoading: true,
    monthlyReportsArray: [],
    name_searched: ''
  },

  bindDepartmentPickerChange: function (e) {
    if (this.data.isLoading) {
      return
    }
    this.setData({
      departmentIndex: e.detail.value
    })
  },

  bindMonthPickerChange: function name(e) {
    if (this.data.isLoading) {
      return
    }
    this.setData({
      monthIndex: e.detail.value
    })
  },
  
  submit: function (e) {
    if (this.data.isLoading) {
      return
    }
    var name_searched = e.detail.value.name.trim()
    // console.log(name_searched)
    var that = this;
    that.setData({
      StaffList: [],
      name_searched: name_searched
    })
    // console.log(app.punchRecordsArray)

    that.getEmployees()
  },

  DailyReport_Detail(e){
    if (this.data.isLoading) {
      return
    }
    var name = e.currentTarget.dataset.name
    var staffId = e.currentTarget.dataset.staffid
    var date = e.currentTarget.dataset.date
    var week = util.getWeekByDate(date);
    wx.navigateTo({
      url: '../../pages/DailyReport/DailyReport?name=' + name + '&date=' + date + '&week=' + week + '&staffId=' + staffId,
    })
  },
  
  getDepart() {
    const that = this
    var clid = app.globalData.clid

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var _p = {
      '_s': clid + timestamp,
    }
    _p = JSON.stringify(_p)
    var _p_base64 = CryptoJS.Base64Encode(_p)
    
    this.data.isLoading = true
    wx.showLoading({
      title: '数据加载中···',
    })
    wx.request({
      url: app.globalData.baseUrl + '/staffdepts/',
      method: 'GET',
      data: {
        'CLID': clid,
        '_p': _p_base64,
        '_en': 'app2'
      },
      success: (e) => {
        console.log('success get' + 'staffdepts')
        var res = JSON.parse(CryptoJS.Base64Decode(e.data))

        let staffDepts = []
        staffDepts.push.apply(staffDepts, res.StaffqueryDepts?res.StaffqueryDepts:[])
        
        if (res.StaffDepts) {
            for (var i in res.StaffDepts) {
              const tmp = staffDepts.filter((val) => {return val.id == res.StaffDepts[i].id})
              if (tmp.length == 0) {
                staffDepts.push(res.StaffDepts[i])
              }
            }
          }
        
        let subordinationDict = {}
        let staffDeptNames = ['全部']
        for (var i in staffDepts) {
          staffDeptNames.push(staffDepts[i].name)
          const curPid = staffDepts[i].pid
          const curId = staffDepts[i].id
          if (subordinationDict[curPid]) {
            subordinationDict[curPid].push(curId)
          } else {
            subordinationDict[curPid] = [curId]
          }
        }
        var currentdate = util.formatDateLine(new Date())
        that.setData({
          dateStart: currentdate,
          dateEnd: currentdate,
          departmentArray: staffDeptNames,
          departmentObjectArray: staffDepts,
          subordinationDict: subordinationDict
        })
        that.data.isLoading = false
        wx.hideLoading({})
      }
    })
  },

  getAllDeparts(i) {
    this.data.tmpDeparts = []
    if (i == 0) {
      for (var j in this.data.departmentObjectArray) {
        this.data.tmpDeparts.push(this.data.departmentObjectArray[j].id)
      }
    } else {
      const curId = this.data.departmentObjectArray[i - 1].id
      this.getSubDeparts(curId)
    }
    return this.data.tmpDeparts
  },

  getSubDeparts(curId) {
    this.data.tmpDeparts.push(curId)
    if (this.data.subordinationDict[curId]) {
      for (var i in this.data.subordinationDict[curId]) {
        this.getSubDeparts(this.data.subordinationDict[curId][i])
      }
    }
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

  getMonthlyReports(month, staffIds) {
    this.data.isLoading = true
    wx.showLoading({
      title: '数据加载中···',
    })
    this.data.monthlyReportsArray = []
    this.getMonthlyReportsSinal(month, staffIds)
  },

  getMonthlyReportsSinal(month, staffIds) {
    const that = this
    var clid = app.globalData.clid

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    const maxResult = 99999999
    var _p = {
      '_s': clid + timestamp,
      'month': month,
      'maxResult': maxResult,
      'index': 0,
      'staffIds': staffIds
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
        console.log('success get' + 'monthlyReports ')
        var res = JSON.parse(CryptoJS.Base64Decode(e.data))
        that.data.monthlyReportsArray.push.apply(that.data.monthlyReportsArray, res.MonthlyReports)
        
        let newArray = that.data.monthlyReportsArray

        // console.log(month, util.formatMonthLine(new Date()), month == util.formatMonthLine(new Date()))
        if (month == util.formatMonthLine(new Date())) {
          let dailyReportsArrayForCurMonth = app.dailyReportsArray.filter((val) => {return val.reportTime.startsWith(month)})

        //   console.log(dailyReportsArrayForCurMonth)
          let monthlyReportsForCurMonth = []
          for (var i in dailyReportsArrayForCurMonth) {
            let curArray = monthlyReportsForCurMonth.filter((val) => {return val.staffId == dailyReportsArrayForCurMonth[i].staffId})
            if (curArray.length == 0) {
              const newItem = {
                'month': month,
                'staffId': dailyReportsArrayForCurMonth[i].staffId,
                'staffName': dailyReportsArrayForCurMonth[i].staffName,
                'deptName': dailyReportsArrayForCurMonth[i].deptName,
                'deptId': dailyReportsArrayForCurMonth[i].deptId,
                'attendanceDays': dailyReportsArrayForCurMonth[i].shouldAttandenceDay?dailyReportsArrayForCurMonth[i].shouldAttandenceDay:0,
                'actualAttendanceDays': dailyReportsArrayForCurMonth[i].ondutyDays,
                'withSalaryLeaveTimes': dailyReportsArrayForCurMonth[i].withSalaryLeaveTimes,
                'withSalaryLeave': dailyReportsArrayForCurMonth[i].leavewithpayTime,
                'withoutSalaryLeaveTimes': dailyReportsArrayForCurMonth[i].withoutSalaryLeaveTimes,
                'withoutSalaryLeave': dailyReportsArrayForCurMonth[i].leavenopayTime,
                'lateTimes': dailyReportsArrayForCurMonth[i].lateTime?1:0,
                'lateMinutes': dailyReportsArrayForCurMonth[i].lateTime,
                'usuallyOvertime': dailyReportsArrayForCurMonth[i].overtimeTime?dailyReportsArrayForCurMonth[i].overtimeTime:0,
                'restOvertime': dailyReportsArrayForCurMonth[i].restOverTimes?dailyReportsArrayForCurMonth[i].restOverTimes:0,
                'holidayOvertime': dailyReportsArrayForCurMonth[i].holidayOverTimes?dailyReportsArrayForCurMonth[i].holidayOverTimes:0,
                'leaveEarlyTimes': dailyReportsArrayForCurMonth[i].leaveearlyTime?1:0,
                'leaveEarlyMinutes': dailyReportsArrayForCurMonth[i].leaveearlyTime,
                // 'absentTimes': dailyReportsArrayForCurMonth[i].absentTimes,
                'absentTimes': dailyReportsArrayForCurMonth[i].actualNotduty>0?1:0,
                'absentMinutes': dailyReportsArrayForCurMonth[i].actualNotduty,
                // 'absenteeismTimes': dailyReportsArrayForCurMonth[i].absenteeismTimes,
                'absenteeismTimes': dailyReportsArrayForCurMonth[i].absenteeism>0?1:0,
                'absenteeismTime': dailyReportsArrayForCurMonth[i].absenteeism,
                'lackCheckCardTime': dailyReportsArrayForCurMonth[i].lackCheckCardTime,
                'addRestTimes': dailyReportsArrayForCurMonth[i].addRestTimes,
                'holidayotTime': dailyReportsArrayForCurMonth[i].holidayotTime,
              }
              monthlyReportsForCurMonth.push(newItem)
            } else {
              curArray[0].attendanceDays += dailyReportsArrayForCurMonth[i].shouldAttandenceDay?dailyReportsArrayForCurMonth[i].shouldAttandenceDay:0
              curArray[0].actualAttendanceDays += dailyReportsArrayForCurMonth[i].ondutyDays
              curArray[0].withSalaryLeaveTimes += dailyReportsArrayForCurMonth[i].withSalaryLeaveTimes
              curArray[0].withSalaryLeave += dailyReportsArrayForCurMonth[i].leavewithpayTime
              curArray[0].withoutSalaryLeaveTimes += dailyReportsArrayForCurMonth[i].withoutSalaryLeaveTimes
              curArray[0].withoutSalaryLeave += dailyReportsArrayForCurMonth[i].leavenopayTime
              curArray[0].lateTimes += dailyReportsArrayForCurMonth[i].lateTime?1:0
              curArray[0].lateMinutes += dailyReportsArrayForCurMonth[i].lateTime
              curArray[0].usuallyOvertime += dailyReportsArrayForCurMonth[i].overtimeTime?dailyReportsArrayForCurMonth[i].overtimeTime:0
              curArray[0].restOvertime += dailyReportsArrayForCurMonth[i].restOverTimes?dailyReportsArrayForCurMonth[i].restOverTimes:0
              curArray[0].holidayOvertime += dailyReportsArrayForCurMonth[i].holidayOverTimes?dailyReportsArrayForCurMonth[i].holidayOverTimes:0
              curArray[0].leaveEarlyTimes += dailyReportsArrayForCurMonth[i].leaveearlyTime?1:0
              curArray[0].leaveEarlyMinutes += dailyReportsArrayForCurMonth[i].leaveearlyTime
              curArray[0].absentTimes += dailyReportsArrayForCurMonth[i].actualNotduty>0?1:0
              curArray[0].absentMinutes += dailyReportsArrayForCurMonth[i].actualNotduty
              curArray[0].absenteeismTimes += dailyReportsArrayForCurMonth[i].absenteeism>0?1:0
              curArray[0].absenteeismTime += dailyReportsArrayForCurMonth[i].absenteeism
              curArray[0].lackCheckCardTime += dailyReportsArrayForCurMonth[i].lackCheckCardTime
              curArray[0].addRestTimes += dailyReportsArrayForCurMonth[i].addRestTimes
              curArray[0].holidayotTime += dailyReportsArrayForCurMonth[i].holidayotTime
            }
          }

          for (var i in monthlyReportsForCurMonth) {
            monthlyReportsForCurMonth[i].attendancePercent = monthlyReportsForCurMonth[i].actualAttendanceDays / monthlyReportsForCurMonth[i].attendanceDays * 100
          }

          newArray.push.apply(newArray, monthlyReportsForCurMonth)
        //   console.log(newArray)
        }
        
        for (var i in newArray) {
          newArray[i].absenteeismTime = (newArray[i].absenteeismTime / 60).toFixed(2)
          newArray[i].LeaveTime = newArray[i].withoutSalaryLeave && newArray[i].withSalaryLeave?((newArray[i].withoutSalaryLeave + newArray[i].withSalaryLeave) / 60).toFixed(2):'0.00'
          newArray[i].usuallyOvertime = (newArray[i].usuallyOvertime / 60).toFixed(2)
          newArray[i].holidayOvertime = (newArray[i].holidayOvertime / 60).toFixed(2)
          newArray[i].restOvertime = (newArray[i].restOvertime / 60).toFixed(2)
          newArray[i].lateMinutes = (newArray[i].lateMinutes / 60).toFixed(2)
          newArray[i].lateAndLEMinutes = ((newArray[i].lateMinutes + newArray[i].leaveEarlyMinutes) / 1).toFixed(1)
        }
        

        const departs = this.getAllDeparts(this.data.departmentIndex)
        var MonthReports = newArray.filter((val) => {return (val.staffName.indexOf(that.data.name_searched)>=0 || that.data.name_searched=="") && departs.includes(val.deptId)})

        if (MonthReports.length == 0) {
            wx.showToast({
            title: '无匹配出勤数据',
            icon: 'none',
            duration: 1500
            })
        }

        that.setData({
          monthlyReportsArray: MonthReports
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

        // if (res.RESULT < maxResult) {
        //   const newArray = that.data.monthlyReportsArray
        //   for (var i in newArray) {
        //     newArray[i].isShow = that.data.selectedArray.includes(newArray[i].staffId)
        //   }
        //   that.setData({
        //     monthlyReportsArray: newArray
        //   })
        //   wx.hideLoading({})
        //   that.data.isLoading = false
          
        //   if (that.data.isPullDown) {
        //     that.data.isPullDown = false
        //     wx.stopPullDownRefresh()
        //     wx.showToast({
        //       title: '刷新成功！同步时间：' + util.formatDateLine(new Date()) + util.formatTime(new Date()),
        //       icon: 'none',
        //       duration: 1500
        //     })
        //   }
        // } else {
        //   that.getMonthlyReportsSinal(month, index + maxResult)
        // }
      }
    })
  },
  
  getEmployees() {
    const that = this
    var clid = app.globalData.clid

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var _p = {
      '_s': clid + timestamp,
    }
    _p = JSON.stringify(_p)
    var _p_base64 = CryptoJS.Base64Encode(_p)
    
    this.data.isLoading = true
    wx.showLoading({
      title: '数据加载中···',
    })

    wx.request({
      url: app.globalData.baseUrl + '/employees/',
      method: 'GET',
      data: {
        'CLID': clid,
        '_p': _p_base64,
        '_en': 'app2'
      },
      success: (e) => {
        console.log('success get' + 'employees')
        var res = JSON.parse(CryptoJS.Base64Decode(e.data))

        console.log(res)
        let staffIds = ''
        for (var i in res.Employees) {
          staffIds += res.Employees[i].staffId
          if (i != res.Employees.length - 1) {
            staffIds += ','
          }
        }

        that.getMonthlyReports(that.data.monthArray[that.data.monthIndex], staffIds)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;

    date.setMonth(date.getMonth() - 1)
    
    var year_ = date.getFullYear();
    var month_ = date.getMonth() + 1;
    if (month_ >= 1 && month_ <= 9) {
        month_ = "0" + month_;
    }

    this.setData({
      dateStart: currentdate,
      dateEnd: currentdate,
      screenHeight: app.globalData.screenHeight,
      screenWidth: app.globalData.screenWidth,
      monthArray: [year_ + seperator1 + month_, year + seperator1 + month]
    })

    this.getDepart()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})