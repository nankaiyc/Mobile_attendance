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
    //setInterval是根据设置的时间来回调的，比如每秒回调一次
    let _timer = setInterval(() => {
      var TIME = util.formatDateLine(new Date());
      var WEEK = util.getWeekByDate(new Date());
      var MONTH = util.formatMonthLine(new Date());
      that.setData({
        date: TIME,
        week: WEEK,
        month: MONTH,
      })
    }, 1000)
    that.setData({
      timer: _timer
    })
  },

  onLoad: function (options) {
    var that = this;
    this.setCurrentDate();
    that.setData({
      
    })
  },

})