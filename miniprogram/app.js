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

    var clid = wx.getStorageSync('unionId')
    if (!clid) {
      this.login()
    } else {
      this.globalData.clid = clid
    }
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

  getInfo() {
    const that = this
    var clid = this.globalData.clid

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var _p = {
      '_s': clid + timestamp,
      'OS': this.globalData.system,
      'OSVersion': this.globalData.version,
      'MANU': this.globalData.brand,
      'MODEL': this.globalData.model
    }

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
        console.log('success get info')
        var res = JSON.parse(CryptoJS.Base64Decode(e.data))
        console.log(res)
        
        const indexPages = ['../checkIn/checkIn', '../superVise/superVise', '../attendanceOA/attendanceOA', '../member/member']
        if (res.RESULT == 0) {
          that.globalData.username = res.STAFFINFO.Name
          that.globalData.apartment = res.STAFFINFO.Company
          that.globalData.AttNo = res.STAFFINFO.AttNo
          that.globalData.GPSplace = res.GPS
          that.globalData.AppPhoto = res.AttPARAMS.AppPhoto
          that.globalData.UploadPhoto = res.AttPARAMS.UploadPhoto
          that.globalData.UploadLoc = res.AttPARAMS.UploadLoc
          wx.redirectTo({
            url: indexPages[this.globalData.firstPage],
          })
        } else {
          wx.redirectTo({
            url: '../register/register',
          })
        }
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
  
  postRecord(Count, items, fileF, fileB, locationName) {
    const that = this
    var clid = this.globalData.clid
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var _p = {
      '_s': clid + timestamp,
      'COUNT': Count,
      'DATATYPE': 'Att',
    }
    _p = JSON.stringify(_p)
    var _p_base64 = CryptoJS.Base64Encode(_p)

    wx.request({
      url: that.globalData.baseUrl + '?CLID=' + clid + '&CMD=CDATA&_p=' + _p_base64 + '&_en=app2',
      method: 'POST',
      data: CryptoJS.Base64Encode(items),
      success: (e) => {
        console.log('success')
        var res = JSON.parse(CryptoJS.Base64Decode(e.data))
        console.log(res)
        if (res.RESULT == 0) {
          that.postPhoto(fileF)
          that.postPhoto(fileB)
          setTimeout(() => {
            wx.navigateTo({
              url: '../checkInResult/checkInResult?status=success&locationName=' + locationName,
            })
          }, 1000)
        }
      }
    })
  },

  postPhoto(filePath) {
    var clid = this.globalData.clid
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var _p = {
      '_s': clid + timestamp,
      'COUNT': 1
    }
    _p = JSON.stringify(_p)
    var _p_base64 = CryptoJS.Base64Encode(_p)

    wx.uploadFile({
      filePath: filePath,
      name: 'photos',
      url: 'https://www.kaoqintong.net/api2/app/photos' + '?CLID=' + clid + '&&_p=' + _p_base64 + '&_en=app2',
      success: (e) => {
        console.log(CryptoJS.Base64Decode(e.data))
      }
    })
  }
})
