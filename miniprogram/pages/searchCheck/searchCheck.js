// pages/searchCheck/searchCheck.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    departmentIndex: 0,
    departmentArray: ['测试', '开发', '产品'],
    dateStart: '',
    dateEnd: '',
    StaffList: [
      {
        name:"秦寅畅",
        staffId:0,
        company:"开发测试1",
        messageList:[
          {
            date:"2022-02-24",
            message:["2022-02-24 13:01:05 解放村","2022-02-24 13:01:05 中国农业银行(齐河县支行)","2022-02-24 13:01:05 仍里"]
          },
          {
            date:"2022-02-25",
            message:["2022-02-25 13:01:05 解放村","2022-02-25 13:01:05 中国农业银行(齐河县支行)","2022-02-25 13:01:05 仍里"]
          },
        ],
      },
    ],
    screenHeight: 0,
    screenWidth: 0,
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
    var DailyReports = app.punchRecordsArray.filter((val) => {return val.staffName.indexOf(name_searched)>=0 && val.date >= this.data.dateStart && val.date <= this.data.dateEnd && name_searched!=""})
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