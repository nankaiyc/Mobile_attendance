//app.js
const CryptoJS = require('./utils/crypto.js')
const MD5 = require('./utils/md5.js')
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
    }})
    let index = wx.getStorageSync('firstPageIndex');
    this.globalData.firstPage = index?index:0;
    this.globalData.baseUrl = 'https://www.kaoqintong.net/api2/app/api'

    var clid = wx.getStorageSync('unionId')
    if (!clid) {
      this.login()
    } else {
      this.globalData.clid = clid
    }
    
  },

  login () {
    let that = this;
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

  register() {
    var clid = this.globalData.clid

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var code = 'zkcw3i'

    var _p = {
      '_s': clid  + timestamp,
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

    const that = this
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
      }
    })
  },
})
