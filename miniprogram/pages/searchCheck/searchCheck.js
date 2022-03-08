// pages/searchCheck/searchCheck.js
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
    dateStart: '',
    dateEnd: '',
    StaffList: [],
    screenHeight: 0,
    screenWidth: 0,

    departmentObjectArray: [],
    subordinationDict: '',
    tmpDeparts: ''
  },

  bindDepartmentPickerChange: function (e) {
    this.setData({
      departmentIndex: e.detail.value
    })
  },
  bindDateStartPickerChange: function name(e) {
    this.setData({
      dateStart: e.detail.value
    })
  },
  bindDateEndPickerChange: function name(e) {
    this.setData({
      dateEnd: e.detail.value
    })
  },
  submit: function (e) {
    var name_searched = e.detail.value.name.trim()
    // console.log(name_searched)
    var that = this;
    that.setData({
      StaffList: [],
    })
    const departs = this.getAllDeparts(this.data.departmentIndex)
    var DailyReports = app.punchRecordsArray.filter((val) => {return val.staffName.indexOf(name_searched)>=0 && val.date >= this.data.dateStart && val.date <= this.data.dateEnd && name_searched!="" && departs.includes(val.deptId)})
    console.log(DailyReports)
    for(var i in DailyReports) {
      var tempdic = {}
//       console.log(DailyReports[i])
      var flag = 0  
      for(var j in this.data.StaffList){      
        if(this.data.StaffList[j].name == DailyReports[i].staffName){
          var MSG = DailyReports[i].date +' '+ DailyReports[i].time+' '+DailyReports[i].deviceLocation
          for(var k in this.data.StaffList[j].messageList){
            if(this.data.StaffList[j].messageList[k].date == DailyReports[i].date){
              this.data.StaffList[j].messageList[k].message.push(MSG)
              // console.log(MSG)
              flag = 1
            }
          }
          if(flag == 0){
            var messageListdic = {}
            messageListdic.date = DailyReports[i].date
            messageListdic.message = []
            messageListdic.message.push(MSG)
            // console.log(MSG)
            this.data.StaffList[j].messageList.push(messageListdic)
            flag = 1
          }
        }
      }
      if(flag == 0){
        var MSG = DailyReports[i].date +' '+ DailyReports[i].time+' '+DailyReports[i].deviceLocation
        // console.log(MSG)
        tempdic.name = DailyReports[i].staffName
        tempdic.staffId = DailyReports[i].staffId
        tempdic.company = DailyReports[i].deptName
        tempdic.messageList = []
        var messageListdic = {}
        messageListdic.date = DailyReports[i].date
        messageListdic.message = []
        messageListdic.message.push(MSG)
        tempdic.messageList.push(messageListdic)
        this.data.StaffList.push(tempdic)
      }    
    }
    that.setData({
      StaffList: this.data.StaffList,
    })
    if (this.data.dateStart > this.data.dateEnd) {
      wx.showToast({
        title: '李在干神魔',
        icon: 'error',
        duration: 1500
      })
    }
  },

  DailyReport_Detail(e){
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
        console.log(res)
        let staffDepts = res.StaffDepts
        staffDepts.push.apply(staffDepts, res.StaffqueryDeptds?res.StaffqueryDeptds:[])
        
        let subordinationDict = {}
        let staffDeptNames = []
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
        wx.hideLoading({})
      }
    })
  },

  getAllDeparts(i) {
    this.data.tmpDeparts = []
    const curId = this.data.departmentObjectArray[i].id
    this.getSubDeparts(curId)

    // let departs = this.data.departmentObjectArray.filter((val) => {return this.data.tmpDeparts.includes(val.id)})
    // let departNames = []
    // for (var i in departs) {
    //   departNames.push(departs[i].name)
    // }
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
    this.setData({
      dateStart: currentdate,
      dateEnd: currentdate,
      screenHeight: app.globalData.screenHeight,
      screenWidth: app.globalData.screenWidth,
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