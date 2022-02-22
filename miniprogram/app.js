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

    // this.register()
    // this.login()
    // this.crypto_example()
  },

  register() {
    var clid = wx.getStorageSync('unionId')
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var code = 'zkcw3i'
    wx.getSystemInfo({
      success (res) {
        var _p = {
          '_s': clid  + timestamp,
          'CLID': clid,
          'CODE': code,
          'OS': res.system,
          'OSVersion': res.version,
          'MANU': res.brand,
          'MODEL': res.model,
          'APPID': 'RY00000002'
        }
        
        _p = JSON.stringify(_p)
        var _p_base64 = CryptoJS.Base64Encode(_p)

        wx.request({
          url: 'https://www.kaoqintong.net/api2/app/api',
          method: 'GET',
          data: {
            'CLID': clid,
            'CMD': 'CLAK',
            '_p': _p_base64
          },
          success: (e) => {
            console.log('success')
            console.log(e)
          },
          fail: (e) => {
            console.log('fail')
            console.log(e)
          }
        })
      }
    })
  },

  login () {
    wx.login({
      timeout: 3000,
      success: (e) => {
        console.log(e)
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
            
          },
          fail: (e) => {
            console.log('fail' + e)
          }
        })
      }
    })
  },
  crypto_example() {
    
    let msg = {
      // 'CLID': '08E4049FF24E4DD8C0E345398ACFB9EE',
      // '_s': '08E4049FF24E4DD8C0E345398ACFB9EE1398902400',
      'OS': 'iOS'
    }
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
