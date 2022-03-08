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
    let autoSave = wx.getStorageSync('autoSave');
    this.globalData.autoSave = autoSave ? autoSave : 0;
    let selectedArray = wx.getStorageSync('selectedArray')
    this.globalData.selectedArray = selectedArray?JSON.parse(selectedArray):[]
    this.globalData.baseUrl = 'https://www.kaoqintong.net/api2/app/api'
    this.globalData.ak = "UpSDf63rA5CQT3d5NmP0tGUyGjdv1AwL"

    that.punchRecordsArray = []
    that.PunchRecordsLastSyncTime = ''

    var clid = wx.getStorageSync('unionId')
    if (!clid) {
      this.login()
    } else {
      this.globalData.clid = clid
    }

    // this.getMsg('employees')
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
          that.globalData.Position = res.STAFFINFO.Position
          that.globalData.GPSplace = res.GPS
          that.globalData.PERMS = res.PERMS
          that.globalData.AppPhoto = res.AttPARAMS.AppPhoto          
          that.globalData.UploadPhoto = res.AttPARAMS.UploadPhoto
          that.globalData.UploadLoc = res.AttPARAMS.UploadLoc
          that.globalData.REMARKS = res.REMARKS

          wx.redirectTo({
            url: indexPages[this.globalData.firstPage],
          })
          wx.hideLoading({})
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
        if (res.RESULT == 0){
          that.globalData.username = res.STAFFINFO.Name
          that.globalData.AttNo = res.STAFFINFO.AttNo
        }
        wx.redirectTo({
          url: '../registerResult/registerResult?IsSuccess='+ res.RESULT
        })
      }
    })
  },

  postRecord(items, fileF, fileB, locationName, dateTimeP, punchRecord) {
    const that = this
    var clid = this.globalData.clid
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    const count = 1
    var _p = {
      '_s': clid + timestamp,
      'COUNT': count,
      'DATATYPE': 'Att',
    }
    _p = JSON.stringify(_p)
    var _p_base64 = CryptoJS.Base64Encode(_p)

    wx.request({
      url: that.globalData.baseUrl + '?CLID=' + clid + '&CMD=CDATA&_p=' + _p_base64 + '&_en=app2',
      method: 'POST',
      data: CryptoJS.Base64Encode(items),
      success: (e) => {
        console.log('success postRecord')
        var res = JSON.parse(CryptoJS.Base64Decode(e.data))
        console.log(res)
        if (res.RESULT == 0) {
          if (that.globalData.AppPhoto % 10 == 3) {
            that.postPhoto(fileF, dateTimeP + '_' + 'f' + fileF.substring(fileF.indexOf('.')),'')
            setTimeout( ()=> {
              that.postPhoto(fileB, dateTimeP + '_' + 'b' + fileB.substring(fileB.indexOf('.')), punchRecord)
            }, 1000)
          } else if (that.globalData.AppPhoto % 10 == 2) {
            that.postPhoto(fileB, dateTimeP + '_' + 'b' + fileB.substring(fileB.indexOf('.')), punchRecord)
          } else if (that.globalData.AppPhoto % 10 == 1) {
            that.postPhoto(fileB, dateTimeP + '_' + 'f' + fileB.substring(fileB.indexOf('.')), punchRecord)
          } else {
            console.log('that.globalData.AppPhoto % 10 == 0')
            let punchRecordsArray = wx.getStorageSync('PunchRecordsArray');
            punchRecordsArray = punchRecordsArray?JSON.parse(punchRecordsArray):[]
            punchRecordsArray.push(punchRecord)
            wx.setStorageSync('PunchRecordsArray', JSON.stringify(punchRecordsArray))
          }
          setTimeout(() => {
            wx.navigateTo({
              url: '../checkInResult/checkInResult?status=success&locationName=' + locationName,
            })
          }, 1000)
        }
      }
    })
  },

  postPhoto(filePath, fileName, punchRecord) {
    var clid = this.globalData.clid
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var _p = {
      '_s': clid + timestamp,
      'COUNT': 1,
      'PHOTONAME': fileName
    }
    _p = JSON.stringify(_p)
    var _p_base64 = CryptoJS.Base64Encode(_p)

    wx.uploadFile({
      filePath: filePath,
      name: 'photos',
      url: 'https://www.kaoqintong.net/api2/app/photos' + '?CLID=' + clid + '&&_p=' + _p_base64 + '&_en=app2',
      success: (e) => {
        const res = JSON.parse(CryptoJS.Base64Decode(e.data))
        console.log(res)
        if (punchRecord.dateTime) {
          wx.saveFile({
            tempFilePath: filePath,
            success: (e) => {
              punchRecord.filePath = e.savedFilePath
              console.log(punchRecord)
              let punchRecordsArray = wx.getStorageSync('PunchRecordsArray');
              punchRecordsArray = punchRecordsArray?JSON.parse(punchRecordsArray):[]
              punchRecordsArray.push(punchRecord)
              wx.setStorageSync('PunchRecordsArray', JSON.stringify(punchRecordsArray))
            }
          })
        }
      }
    })
  },

  getMsg(type) {
    const that = this
    var clid = this.globalData.clid
    // var clid = '/FdMiEaHinp8oESNSwoFgSUZY2kqL0razBxW9H1ipZo='

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
        // _p.lastSyncTime = '2022-01-01 00:00:00'
        _p.maxResult = 5
        _p.index = 0
        _p.month = '2022-01'
        break
      default:
        console.log(type)
    }

    console.log(_p)
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
  
})