// pages/checkIn/checkIn.js

//获取应用实例
const app = getApp();
var startX,startY,endX,endY;
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
    name:"yc",
    apartment:"1",
    timer: null,
    currentDate: "",
    imgurl:"",
    checkin_button:"../../resource/checkin_button1.png",
  },
  //自定义事件 用来接受子组件传递的数据
  handlemethodchange(e){
    var chosen = e.detail
    if(chosen == "WiFi考勤"){
      this.setData({
        Attendance_method:"WiFi考勤"
      })
    }
    else if(chosen == "GPS考勤"){
      this.setData({
        Attendance_method:"GPS考勤"
      })
    }
    else if(chosen == "可考勤地点"){
      wx.navigateTo({
        url: '../../pages/attendanceAddress/attendanceAddress',
      })
    }
    else{
      console.log("考勤提醒闹钟")
    }

  },

  touchStartALL: function (e) {
    startX = e.touches[0].pageX; // 获取触摸时的原点
    startY = e.touches[0].pageY;
    // console.log(startX,startY)
    moveFlag = true;
  },
  // 触摸移动事件
  touchMoveALL: function (e) {
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
  touchEndALL: function (e) {
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
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          imgurl: res.tempFilePaths
        });
      wx.setStorageSync('ImagURL', res.tempFilePaths[0])
        // console.log(res.tempFilePaths)
      }
    })
  },

  touchStartButton(e){
    startX = e.touches[0].pageX; // 获取触摸时的原点
    startY = e.touches[0].pageY;
    this.button_selected();
    moveFlag = true;
  },

  touchMoveButton(e){
    endX = e.touches[0].pageX; // 获取触摸时的原点
    endY = e.touches[0].pageY;
    // console.log(endX,endY)
    if (moveFlag) {
      // if (endX - startX < 20 || startX - endX < 20 || endY - startY < 20 || startY - endY < 20) {
      //   this.button_selected();
      //   moveFlag = false;
      // }
      if (endX < 127.5 || endX > 191.5 || endY < 418.5 || endY > 482.5) {
        this.button_unselected();
        moveFlag = false;
      }
    }
  },

  touchEndButton(e){
    if(this.data.checkin_button == "../../resource/checkin_button1.png"){
      this.checkin_Failure();
      this.button_unselected();
    }
    else{
      this.take_photo();
      this.button_unselected();
    }
    moveFlag = true; // 回复滑动事件
  },

  button_unselected(){
    var that = this;
    that.setData({
      checkin_button: "../../resource/checkin_button1.png"
    });
  },
  button_selected(){
    var that = this;
    that.setData({
      checkin_button: "../../resource/checkin_button2.png"
    });
  },

  take_photo(){
    wx.navigateTo({
      url: '../../pages/camera/camera',
    })
  },

  checkin_Success(){
    wx.navigateTo({
      url: '../../pages/checkInResult/checkInResult?status=success',
    })
  },
  checkin_Failure(){
    wx.navigateTo({
      url: '../../pages/checkInResult/checkInResult?status=failure',
    })
  },

  onLoad: function () {
    this.setCurrentDate();
    let photo = wx.getStorageSync('ImagURL');
    
    this.setData({
      imgurl: photo ? photo : "../../resource/default_user_icon.png",
      name: app.globalData.username,
      apartment:app.globalData.apartment,
    })
    var utilMd5 = require('../../utils/md5.js');  
    // var gg = utilMd5.hexMD5(this.data.Attendance_method); 
    // console.log(gg)
  },
    
})