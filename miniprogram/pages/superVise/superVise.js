// pages/superVise/superVise.js
var util = require('../../utils/util.js');
const app = getApp();
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
    date: "",
    week:"",
    month: "",
    timer: null,
  },

  handleItemChange(e){
    const {index} = e.detail;
    let {tabs} = this.data;
    tabs.forEach((v,i) => i === index ? v.isActive = true : v.isActive = false);
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
    that.setData({
      timer: _timer
    })
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
  },

  onLoad: function (options) {
    // var dateTime=new Date();
    // var TIME = util.formatMonthLine(dateTime);
    // console.log(TIME)
    // dateTime=dateTime.setMonth(dateTime.getMonth()-2);
    // dateTime=new Date(dateTime);
    // TIME = util.formatMonthLine(dateTime);
    // console.log(TIME)
    var that = this;
    that.setCurrentDate();
  },

})