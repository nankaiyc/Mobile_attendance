//app.js
const CryptoJS = require('./utils/crypto.js')
const Util = require('./utils/util')
App({
  onLaunch: function () {
    this.globalData = {}
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        let clientHeight = res.windowHeight;
        let clientWidth = res.windowWidth;
        that.globalData.screenHeight = clientHeight;
        that.globalData.screenWidth = clientWidth;
        that.globalData.OS = res.system
        that.globalData.OSVersion = res.version
        that.globalData.MANU = res.brand
        that.globalData.MODEL = res.model
      }
    })
    let index = wx.getStorageSync('firstPageIndex');
    this.globalData.firstPage = index ? index : 0;
    this.globalData.baseUrl = 'https://www.kaoqintong.net/api2/app/api'

    // this.crypto_example()

    var clid = wx.getStorageSync('unionId')
    if (!clid) {
      this.login()
    } else {
      this.globalData.clid = clid
    }

    this.getInfo();
    // let dateTime = Util.formatDateLine(new Date()) + Util.formatTime(new Date())
    // const mac = '00:00:00:00:00:00'
    // const pid = '6Z0XY7CB0435O'
    // const item = '1' + '\t' + dateTime + '\t' + mac + '\t' + pid
    // this.postRecord(1, item)
  },

  login() {
    const that = this;
    wx.login({
      timeout: 3000,
      success: (e) => {
        wx.request({
          url: 'https://www.kaoqintong.net/api2/wx/user/login',
          data: {
            'code': e.code
          },
          header: {
            'content-type': 'application/json'
          },
          method: 'POST',
          success: (e) => {
            wx.setStorageSync('unionId', e.data[0])
            wx.setStorageSync('sessionKey', e.data[1])
            that.globalData.clid = e.data[0]
          }
        })
      }
    })
  },


  getInfo() {
      const that = this
      var clid = this.globalData.clid
  
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
  
      var _p = {
        '_s': clid + timestamp,
        'OS': this.globalData.system,
        'OSVersion': this.globalData.version,
        'MANU': this.globalData.brand,
        'MODEL': this.globalData.model
      }
  
      _p = JSON.stringify(_p)
      var _p_base64 = CryptoJS.Base64Encode(_p)
  
      wx.request({
        url: that.globalData.baseUrl,
        method: 'GET',
        data: {
          'CLID': clid,
          'CMD': 'GETINFO',
          '_p': _p_base64,
          '_en': 'app2'
        },
      success: (e) => {
          console.log('success get info')
          var res = JSON.parse(CryptoJS.Base64Decode(e.data))
          that.globalData.username = res.STAFFINFO.Name
          that.globalData.apartment = res.STAFFINFO.Company
          that.globalData.GPSplace = res.GPS
  //         console.log(res.GPS)
          // console.log(res.GPS[1].name)
        }
      })
    },
    

  register(code) {
    const that = this
    var clid = this.globalData.clid

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var _p = {
      '_s': clid + timestamp,
      'CLID': clid,
      'CODE': code,
      'OS': this.globalData.system,
      'OSVersion': this.globalData.version,
      'MANU': this.globalData.brand,
      'MODEL': this.globalData.model,
      'APPID': 'RY00000002'
    }

    _p = JSON.stringify(_p)
    var _p_base64 = CryptoJS.Base64Encode(_p)

    wx.request({
      url: that.globalData.baseUrl,
      method: 'GET',
      data: {
        'CLID': clid,
        'CMD': 'CLAK',
        '_p': _p_base64,
        '_en': 'app2'
      },
      success: (e) => {
        console.log('success')
        var res = JSON.parse(CryptoJS.Base64Decode(e.data))
        console.log(res)
        that.globalData.RegisterResult = res.RESULT
      }
    })
  },

  postRecord(Count, items) {
      const that = this
      var clid = this.globalData.clid
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
  
      var _p = {
        '_s': clid + timestamp,
        'COUNT': Count,
        'DATATYPE': 'Att',
      }
      _p = JSON.stringify(_p)
      var _p_base64 = CryptoJS.Base64Encode(_p)
  
      wx.request({
        url: that.globalData.baseUrl + '?CLID=' + clid + '&CMD=CDATA&_p=' + _p_base64 + '&_en=app2',
        method: 'POST',
        data: CryptoJS.Base64Encode(items),
        success: (e) => {
          console.log('success')
          var res = JSON.parse(CryptoJS.Base64Decode(e.data))
          console.log(res)
        }
      })
    },  
})

