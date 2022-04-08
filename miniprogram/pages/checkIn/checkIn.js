// pages/checkIn/checkIn.js

//获取应用实例
const app = getApp();
var startX,startY,endX,endY;
var moveFlag = true;// 判断执行滑动事件
var util = require('../../utils/util.js')
const CryptoJS = require('../../utils/crypto.js')
var bmap = require('../../utils/bmap-wx.js')

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
    ],
    Attendance_method:"GPS考勤",
    record:"历史记录",
    interface1:true,
    name:"",
    apartment:"",
    Position:"董事长",
    id:0,
    timer: null,
    currentDate: "",
    imgurl:"",
    checkin_button:"../../resource/checkin_button1.png",
    GPSplace:[],
    photomode:0,
    latitude:0,
    longitude:0,
    HistoryRecord:[],
    markers: [],
    punchRecordsArray:[],
    modalHidden: true,
    modalShowItem: '',
    screenHeight: '',
    screenWidth: '',
    isLoading: false

  },
  //自定义事件 用来接受子组件传递的数据
  handlemethodchange(e){
    if (this.data.isLoading) {
      return
    }
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
    if (this.data.isLoading) {
      return
    }
    startX = e.touches[0].pageX; // 获取触摸时的原点
    startY = e.touches[0].pageY;
    // console.log(startX,startY)
    moveFlag = true;
  },
  // 触摸移动事件
  touchMoveALL: function (e) {
    if (this.data.isLoading) {
      return
    }
    endX = e.touches[0].pageX; // 获取触摸时的原点
    if (moveFlag) {
      if (endX - startX > 100) {
        // console.log("move right");
        this.move2right();
        moveFlag = false;
      }
      if (startX - endX > 100) {
        // console.log("move left");
        this.move2left();
        moveFlag = false;
      }
    }

  },
  // 触摸结束事件
  touchEndALL: function (e) {
    if (this.data.isLoading) {
      return
    }
    moveFlag = true; // 回复滑动事件
  },
  move2left() {
    if (this.data.isLoading) {
      return
    }
    var that = this;
    that.setData({
      interface1:false,
    });
  },
  move2right() {
    if (this.data.isLoading) {
      return
    }
    var that = this;
    that.setData({
      interface1:true,
    });
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
    if (this.data.isLoading) {
      return
    }
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        wx.saveFile({
          tempFilePath: res.tempFilePaths[0],
          success: (e) => {
            that.setData({
              imgurl: e.savedFilePath
            });
            wx.setStorageSync('ImagURL', e.savedFilePath)
          }
        })
      }
    })
  },

  touchStartButton(e){
    if (this.data.isLoading) {
      return
    }
    startX = e.touches[0].pageX; // 获取触摸时的原点
    startY = e.touches[0].pageY;
    this.button_selected();
    moveFlag = true;
  },
  touchMoveButton(e){
    if (this.data.isLoading) {
      return
    }
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
    if (this.data.isLoading) {
      return
    }
    if(this.data.checkin_button == "../../resource/checkin_button1.png"){
      // this.checkin_Failure();
      this.button_unselected();
    }
    else{
      this.button_unselected();
      this.popUp();
    }
    moveFlag = true; // 回复滑动事件
  },

  button_unselected(){
    if (this.data.isLoading) {
      return
    }
    var that = this;
    that.setData({
      checkin_button: "../../resource/checkin_button1.png"
    });
  },
  button_selected(){
    if (this.data.isLoading) {
      return
    }
    var that = this;
    that.setData({
      checkin_button: "../../resource/checkin_button2.png"
    });
  },

  popUp() {
    const that = this
    if (app.globalData.AppPhoto >= 10) {
      wx.showActionSheet({
        itemList: ['不拍照', '自拍', '拍场景', '自拍 + 拍场景'],
        success: (e) => {
          that.setData({
            photomode: e.tapIndex
          })
          app.globalData.AppPhoto = 10 + e.tapIndex
          that.get_location()
        }
      })
    } else {
      this.get_location()
    }
  },
  get_location() {
    var that = this;
    this.data.isLoading = true
    wx.showLoading({
      title: '正在获取位置···',
    })
    var BMap = new bmap.BMapWX({ 
      ak: app.globalData.ak 
    }); 
    var fail = function(data) {
      if (data.errMsg == 'getLocation:fail:auth denied' || data.errMsg == 'getLocation:fail auth deny' || data.errMsg == 'getLocation:fail authorize no response') {
        wx.hideLoading({})
        that.data.isLoading = false
      }
      console.log(data);
      wx.getSetting({
        success: res => {
          if (typeof(res.authSetting['scope.userLocation']) != 'undefined' && !res.authSetting['scope.userLocation']) {
            // 用户拒绝了授权
            wx.showModal({
              title: '提示',
              content: '您拒绝了定位权限，将无法使用考勤打卡功能',
              success: res => {
                if (res.confirm) {
                  // 跳转设置页面
                  wx.openSetting({
                    success: res => {
                      if (res.authSetting['scope.userLocation']) {
                        // 授权成功，重新定位
                      } else {
                        // 没有允许定位权限
                        wx.showToast({
                          title: '您拒绝了定位权限，将无法使用考勤打卡功能',
                          icon: 'none'
                        });
                      }
                    }
                  });
                }
              }
            });
          }
        }
      });
    }; 
    var success = function(data) { 
      //返回数据内，已经包含经纬度
      // console.log(data.wxMarkerData);
      const lati = data.wxMarkerData[0].latitude
      const longi = data.wxMarkerData[0].longitude
      console.log(lati.longi)
      //把所有数据放在初始化data内
      that.setData({ 
        latitude: lati,
        longitude: longi,
      })
      app.globalData.locallatitude = lati
      app.globalData.locallongitude = longi
      console.log(lati);
      console.log(longi);
      wx.hideLoading({})
      that.data.isLoading = false
      that.take_photo()
    } 
  // 发起regeocoding检索请求 
    BMap.regeocoding({ 
      fail: fail, 
      success: success
    });   
    // wx.getLocation({
    //   type: 'wgs84',
    //   isHighAccuracy:true,
    //   highAccuracyExpireTime:6000,
    //   success (res) {
    //     const latitude = res.latitude
    //     const longitude = res.longitude
    //     const accuracy = res.accuracy
    //     that.setData({
    //       locallatitude:latitude,
    //       locallongitude:longitude,      
    //     })
    //     app.globalData.locallatitude = latitude
    //     app.globalData.locallongitude = longitude
    //     wx.hideLoading({
    //       title: '正在获取位置···',
    //     })
    //     that.take_photo()
    //   }
    //  })  
  },
  take_photo(){
    var that = this;
    var CheckinPalces = that.data.GPSplace
    var flag = 1
    for (var i in CheckinPalces) {      
      if(flag == 1){
        const checkin_latitude = CheckinPalces[i].location.lat
        const checkin_longitude = CheckinPalces[i].location.lng
        const radius = CheckinPalces[i].radius / 1000
        const dis = util.getdistance(this.data.latitude,this.data.longitude,checkin_latitude,checkin_longitude)
        console.log(radius, dis)
        if(dis <= radius){
          flag = 0
          if(this.data.photomode == 0){
            that.completeUp(i)
          }
          else if(this.data.photomode == 1){
            wx.navigateTo({
              url: '../../pages/transferToCamera/transferToCamera?positioned=true&index=' + i 
            })
          }
          else if(this.data.photomode == 2){
            wx.navigateTo({
              url: '../../pages/transferToCamera/transferToCamera?positioned=true&index=' + i
            })
          }
          else if(this.data.photomode == 3){
            wx.navigateTo({
              url: '../../pages/transferToCamera/transferToCamera?positioned=true&index=' + i
            })
          }
          else{
            console.log("请选择拍照模式")
          }
        }        
      }      
    }
    if(flag == 1){
      this.checkin_Failure()
    }
  },

  completeUp(index) {
    const dateTime = util.formatDateLine(new Date()) + util.formatTime(new Date())
    const mac = '00:00:00:00:00:00'
    let pid = app.globalData.GPSplace[index].pid
    const item = '1' + '\t' + dateTime + '\t' + mac + '\t' + pid
    let dateTimeP = dateTime.replace(/-/g, '')
    dateTimeP = dateTimeP.replace(/:/g, '')
    dateTimeP = dateTimeP.replace(/ /g, '')
    let punchRecord = {
      'dateTime': dateTime,
      'location': app.globalData.GPSplace[index].name
    }
    app.postRecord(item, '', '', app.globalData.GPSplace[index].name, dateTimeP, punchRecord)
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

  showImg (e) {
    const that = this
    const modalShowItem = e.currentTarget.dataset.item
    if (modalShowItem.filePath) {
      wx.previewImage({
        urls: [modalShowItem.filePath, modalShowItem.filePathPerson],
        showmenu: true
      })
    } else {
      wx.showModal({
        title: '打卡详情',
        content: that.data.name + ' ' + modalShowItem.dateTime + ' ' + modalShowItem.location
      })
    }
  },

  onLoad: function (options) {
    var that = this;
    this.data.isLoading = true
    wx.showLoading({
      title: '时间同步中···',
    })
    setTimeout(() => {
      that.data.isLoading = false
      wx.hideLoading()
    }, 1000)
    this.setCurrentDate()
    let photo = wx.getStorageSync('ImagURL')
    let punchRecordsArray = wx.getStorageSync('PunchRecordsArray')
    punchRecordsArray = punchRecordsArray?JSON.parse(punchRecordsArray):[]
    punchRecordsArray.reverse()
    that.setData({
      imgurl: photo ? photo : '../../resource/default_user_icon.png',
      name: app.globalData.username,
      apartment:app.globalData.apartment,
      Position:app.globalData.Position,
      GPSplace:app.globalData.GPSplace, 
      id:app.globalData.AttNo,
      photomode:app.globalData.AppPhoto % 10,
      punchRecordsArray: punchRecordsArray,
      screenHeight: app.globalData.screenHeight,
      screenWidth: app.globalData.screenWidth,
    })
  },
})