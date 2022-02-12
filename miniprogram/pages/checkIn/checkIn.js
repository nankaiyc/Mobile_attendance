// pages/checkIn/checkIn.js

//获取应用实例
const app = getApp();
var startX, endX;
var moveFlag = true;// 判断执行滑动事件
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: [
      {
        index : 0,
        name : "WiFi考勤" 
      },
      {
        index : 1,
        name : "GPS考勤" 
      },
      {
        index : 2,
        name : "可考勤地点" 
      },
      {
        index : 3,
        name : "考勤提醒闹钟" 
      },
    ],
    Attendance_method:"GPS考勤",
    record:"历史记录",
    interface1:true,
    name:"寅畅",
    apartment:"平台演示1",
    timer: null,
    currentDate: "",
    imgUrl:"",
  },
  //自定义事件 用来接受子组件传递的数据
  handlemethodchange(e){
    var chosen = e.detail
    if(chosen == 0){
      this.setData({
        Attendance_method:"WiFi考勤"
      })
    }
    else if(chosen == 1){
      this.setData({
        Attendance_method:"GPS考勤"
      })
    }
  },

  touchStart: function (e) {
    startX = e.touches[0].pageX; // 获取触摸时的原点
    moveFlag = true;
  },
  // 触摸移动事件
  touchMove: function (e) {
    endX = e.touches[0].pageX; // 获取触摸时的原点
    if (moveFlag) {
      if (endX - startX > 50) {
        console.log("move right");
        this.move2right();
        moveFlag = false;
      }
      if (startX - endX > 50) {
        console.log("move left");
        this.move2left();
        moveFlag = false;
      }
    }

  },
  // 触摸结束事件
  touchEnd: function (e) {
    moveFlag = true; // 回复滑动事件
  },
  move2left() {
    var that = this;
    that.setData({
      interface1:false,
    });
  },
  move2right() {
    var that = this;
    that.setData({
      interface1:true,
    });
  },

  getPhoneNumber (e) {
    console.log(e)
    this.getAccess()
  },
  getAccess() {
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token',
      data: {
        'grant_type': 'client_credential',
        'appid': 'wx11db962f0c4cffe2',
        'secret': '54157cb4b6842656e5276092fc93325c'
      }, 
      success: (e) => {
        console.log(e)
      }
    })
  },

  setCurrentDate() {
    const that = this
    //setInterval是根据设置的时间来回调的，比如每秒回调一次
    let _timer = setInterval(() => {
      var TIME = util.formatTime(new Date());
      that.setData({
        currentDate: TIME 
      })
    }, 1000)
    that.setData({
      timer: _timer
    })
  },

  setPhotoInfo(){
    var that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      success(res) {
        console.log(res.tempFiles[0].tempFilePath),
        that.setData({
          imgUrl:res.tempFiles[0].tempFilePath,
        })
      }
    })
  },


  onLoad: function () {
    this.setCurrentDate()
  },
    
})