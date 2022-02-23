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
    }})
    let index = wx.getStorageSync('firstPageIndex');
    this.globalData.firstPage = index?index:0;

<<<<<<< Updated upstream
    // this.crypto_example()
=======
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
>>>>>>> Stashed changes
  },

  crypto_example() {
    
    let msg = {
      // 'CLID': '08E4049FF24E4DD8C0E345398ACFB9EE',
      // '_s': '08E4049FF24E4DD8C0E345398ACFB9EE1398902400',
      'OS': 'iOS'
    }
<<<<<<< Updated upstream
    msg = JSON.stringify(msg)
    console.log('msg', msg)
    let key = 'E7A45426AFF5D14E52897E134F5CC33'
    // console.log('key', key, key.length)
    const aes_msg = CryptoJS.AesEncrypt(msg, key)
    console.log('aes 加密', aes_msg)
    const base64_aes_msg = CryptoJS.Base64Encode(aes_msg)
    console.log('base64 加密', base64_aes_msg)
    const url_base64_aes_msg = encodeURIComponent(base64_aes_msg)
    console.log('url 编码', url_base64_aes_msg)
    
    const base64_aes_msg_d = decodeURIComponent(url_base64_aes_msg)
    console.log('url 解码', base64_aes_msg_d)
    const aes_msg_d = CryptoJS.Base64Decode(base64_aes_msg_d)
    console.log('base64 解密', aes_msg_d)
    const msg_d = CryptoJS.AesDecrypt(aes_msg_d, key)
    console.log('aes 解密', msg_d)

    // console.log(CryptoJS.Md5(key))
    // console.log(MD5.hexMD5(key))
  }
})
=======

    _p = JSON.stringify(_p)
    var _p_base64 = CryptoJS.Base64Encode(_p)

    wx.request({
      url: that.globalData.baseUrl,
      method: 'GET',
      data: {
        'CLID': clid,
        'CMD': 'GETINFO',
        '_p': _p_base64,
        '_en': 'app2'
      },
      success: (e) => {
        console.log('success get info')
        var res = JSON.parse(CryptoJS.Base64Decode(e.data))
        that.globalData.username = res.STAFFINFO.Name
        that.globalData.apartment = res.STAFFINFO.Company
        that.globalData.GPSplace = res.GPS
        // console.log(GPSplace)
        // console.log(res.GPS[1].name)
      }
    })
  },

  register() {
    const that = this
    var clid = this.globalData.clid

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var code = 'zkcw3i'

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
>>>>>>> Stashed changes
