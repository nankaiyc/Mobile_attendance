//app.js
const CryptoJS = require('./utils/crypto.js')
const util = require('./utils/util')
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
      this.punchRecordsArray = []
      this.getPunchRecords()
    }

    // this.getMsg('staffdepts')
    // this.getPersonInfo('1651306')
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
            that.punchRecordsArray = []
            that.getPunchRecords()
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
          that.globalData.StaffID = res.STAFFINFO.StaffID
          that.globalData.GPSplace = res.GPS
          that.globalData.PERMS = res.PERMS
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
        console.log('success register')
        var res = JSON.parse(CryptoJS.Base64Decode(e.data))
        wx.navigateTo({
          url: '../registerResult/registerResult?IsSuccess='+ res.RESULT
        })
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
      },
      complete: (e) => {
        console.log(e)
        var res = JSON.parse(CryptoJS.Base64Decode(e.data))
        console.log(res)
      }
    })
  },

  getPunchRecords() {
    let punchRecordsArray = wx.getStorageSync('punchRecordsArray')
    punchRecordsArray = punchRecordsArray?JSON.parse(punchRecordsArray):[]
    let lastSyncTime = wx.getStorageSync('PunchRecordsLastSyncTime')
    lastSyncTime = lastSyncTime?lastSyncTime:'2022-01-01 00:00:00'
    var dateTime = new Date()
    dateTime = dateTime.setDate(dateTime.getDate()-31)
    dateTime = new Date(dateTime)
    const beginDate = util.formatDateLine(dateTime)
    const endDate = util.formatDateLine(new Date())
    this.punchRecordsArray = punchRecordsArray
    wx.showLoading({
      title: '数据加载中···',
    })
    this.getPunchRecordsSinal(lastSyncTime, beginDate, endDate, 0)
  },

  getPunchRecordsSinal(lastSyncTime, beginDate, endDate, index) {
    const that = this
    var clid = this.globalData.clid

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    const maxResult = 5
    var _p = {
      '_s': clid + timestamp,
      'lastSyncTime': lastSyncTime,
      'maxResult': maxResult,
      'index': index,
      'beginDate': beginDate,
      'endDate': endDate
    }
    _p = JSON.stringify(_p)
    var _p_base64 = CryptoJS.Base64Encode(_p)
    
    wx.request({
      url: that.globalData.baseUrl + '/punchRecords/',
      method: 'GET',
      data: {
        'CLID': clid,
        '_p': _p_base64,
        '_en': 'app2'
      },
      success: (e) => {
        console.log('success get' + 'punchRecords ' + index)
        var res = JSON.parse(CryptoJS.Base64Decode(e.data))
        
        that.punchRecordsArray.push.apply(that.punchRecordsArray, res.AttRecords)
        if (res.RESULT < maxResult) {
          const newArray = that.punchRecordsArray
          wx.setStorageSync('PunchRecordsLastSyncTime', endDate + util.formatTime(new Date()))
          wx.setStorageSync('punchRecordsArray', JSON.stringify(newArray))
          wx.hideLoading({})
        } else {
          that.getPunchRecordsSinal(lastSyncTime, beginDate, endDate, index + maxResult)
        }
      }
    })
  },

  getMsg(type) {
    const that = this
    var clid = this.globalData.clid

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    
    var _p = {
      '_s': clid + timestamp,
      // 'OS': this.globalData.system,
      // 'OSVersion': this.globalData.version,
      // 'MANU': this.globalData.brand,
      // 'MODEL': this.globalData.model
    }
    switch(type) {
      case 'appPushReports':
        //nothing
        break
      case 'staffdepts':
        //employees
        // break
      case 'employees':
        //nothing
        break
      case 'punchRecords':
        //{"_s":"xxxxxxxxxxxxxxxx","lastSyncTime":"2016-04-25 00:00:00","maxResult":5,"index":0,"beginDate":"2016-04-25","endDate":"2016-04-25"}
        // break
      case 'dailyReports':
        //punchRecords
        _p.lastSyncTime = '2022-01-01 00:00:00'
        _p.maxResult = 5
        _p.index = 0
        _p.beginDate = '2022-02-20'
        _p.endDate = '2020-02-26'
        break
      case 'monthlyReports':
        //除了上面的如果月报，不需要beiginDate和endDate，需要month，如果查询个别员工用staffIds，多个id之间用英文逗号隔开即可
        _p.lastSyncTime = '2022-01-01 00:00:00'
        _p.maxResult = 5
        _p.index = 0
        _p.month = '2022-02'
        break
      default:
        console.log(type)
    }

    _p = JSON.stringify(_p)
    var _p_base64 = CryptoJS.Base64Encode(_p)

    wx.request({
      url: that.globalData.baseUrl + '/' + type + '/',
      method: 'GET',
      data: {
        'CLID': clid,
        '_p': _p_base64,
        '_en': 'app2'
      },
      success: (e) => {
        console.log('success get' + type)
        var res = JSON.parse(CryptoJS.Base64Decode(e.data))
        console.log(res)
      }
    })
  },
  
  getPersonInfo(StaffID) {
    const that = this
    var clid = this.globalData.clid

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    
    var _p = {
      '_s': clid + timestamp,
      'staffIds': StaffID
    }

    _p = JSON.stringify(_p)
    var _p_base64 = CryptoJS.Base64Encode(_p)

    wx.request({
      url: that.globalData.baseUrl + '/employees/',
      method: 'GET',
      data: {
        'CLID': clid,
        '_p': _p_base64,
        '_en': 'app2'
      },
      success: (e) => {
        console.log('success get person info ' + StaffID)
        var res = JSON.parse(CryptoJS.Base64Decode(e.data))
        console.log(res)
      }
    })
  }
})