// pages/searchCheck/searchCheck.js
const app = getApp()
const util = require('../../utils/util.js');
const CryptoJS = require('../../utils/crypto.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    departmentIndex: 0,
    departmentArray: [],
    dateStart: '',
    dateEnd: '',
    departmentObjectArray: [],
    subordinationDict: '',
    tmpDeparts: ''
  },

  bindDepartmentPickerChange: function (e) {
    this.setData({
      departmentIndex: e.detail.value
    })
    console.log(this.getAllDeparts(e.detail.value))
  },
  bindDateStartPickerChange: function name(e) {
    this.setData({
      dateStart: e.detail.value
    })
  },
  bindDateEndPickerChange: function name(e) {
    this.setData({
      dateEnd: e.detail.value
    })
  },
  submit: function (e) {
    console.log(e.detail.value.name)
    if (this.data.dateStart > this.data.dateEnd) {
      wx.showToast({
        title: '李在干神魔',
        icon: 'error',
        duration: 1500
      })
    }
  },
  
  getDepart() {
    const that = this
    var clid = app.globalData.clid

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var _p = {
      '_s': clid + timestamp,
    }
    _p = JSON.stringify(_p)
    var _p_base64 = CryptoJS.Base64Encode(_p)
    
    wx.showLoading({
      title: '数据加载中···',
    })
    wx.request({
      url: app.globalData.baseUrl + '/staffdepts/',
      method: 'GET',
      data: {
        'CLID': clid,
        '_p': _p_base64,
        '_en': 'app2'
      },
      success: (e) => {
        console.log('success get' + 'staffdepts')
        var res = JSON.parse(CryptoJS.Base64Decode(e.data))
        console.log(res)
        let staffDepts = res.StaffDepts
        staffDepts.push.apply(staffDepts, res.StaffqueryDeptds?res.StaffqueryDeptds:[])
        
        let subordinationDict = {}
        let staffDeptNames = []
        for (var i in staffDepts) {
          staffDeptNames.push(staffDepts[i].name)
          const curPid = staffDepts[i].pid
          const curId = staffDepts[i].id
          if (subordinationDict[curPid]) {
            subordinationDict[curPid].push(curId)
          } else {
            subordinationDict[curPid] = [curId]
          }
        }
        var currentdate = util.formatDateLine(new Date())
        that.setData({
          dateStart: currentdate,
          dateEnd: currentdate,
          departmentArray: staffDeptNames,
          departmentObjectArray: staffDepts,
          subordinationDict: subordinationDict
        })
        wx.hideLoading({})
      }
    })
  },

  getAllDeparts(i) {
    this.data.tmpDeparts = []
    const curId = this.data.departmentObjectArray[i].id
    this.getSubDeparts(curId)

    let departs = this.data.departmentObjectArray.filter((val) => {return this.data.tmpDeparts.includes(val.id)})
    let departNames = []
    for (var i in departs) {
      departNames.push(departs[i].name)
    }
    return departNames
  },

  getSubDeparts(curId) {
    this.data.tmpDeparts.push(curId)
    if (this.data.subordinationDict[curId]) {
      for (var i in this.data.subordinationDict[curId]) {
        this.getSubDeparts(this.data.subordinationDict[curId][i])
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDepart()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})