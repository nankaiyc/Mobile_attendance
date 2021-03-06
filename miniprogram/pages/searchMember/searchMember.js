// pages/searchMember/searchMember.js
const app = getApp()
const CryptoJS = require('../../utils/crypto.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenHeight: 0,
    screenWidth: 0,
    itemArray: [
      {
        'name': '张三' 
      },
      {
        'name': '李三'
      }
    ],
    showItems: []
  },

  bindInputChange(e) {
    const nameInput = e.detail.value.trim()
    let newShowItems = []
    if (nameInput != '') {
      for (var index in this.data.itemArray) {
        if (this.data.itemArray[index].Name.search(nameInput) > -1) {
          newShowItems.push(index)
        }
      }
    }
    this.setData({
      showItems: newShowItems
    })
  },

  itemTapped(e) {
    const index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../../pages/personInfo/personInfo?StaffID=' + this.data.itemArray[this.data.showItems[index]].staffId,
    })
  },

  getEmployees() {
    wx.showLoading({
      title: '数据加载中···',
    })
    const that = this
    var clid = app.globalData.clid

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var _p = {
      '_s': clid + timestamp,
    }
    _p = JSON.stringify(_p)
    var _p_base64 = CryptoJS.Base64Encode(_p)
    
    wx.request({
      url: app.globalData.baseUrl + '/employees/',
      method: 'GET',
      data: {
        'CLID': clid,
        '_p': _p_base64,
        '_en': 'app2'
      },
      success: (e) => {
        console.log('success get' + 'employees')
        var res = JSON.parse(CryptoJS.Base64Decode(e.data))
        that.setData({
          itemArray: res.Employees
        })
        wx.hideLoading({})
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getEmployees()
    this.setData({
      screenHeight: app.globalData.screenHeight,
      screenWidth: app.globalData.screenWidth
    })
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