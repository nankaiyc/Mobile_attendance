// pages/setting/setting.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switch1Checked: false,
    indexList: ['考勤打卡', '考勤监管', '考勤OA', '成员'],
    curIndexList: [],
    indexValue: 0
  },

  switch1Change(e) {
    this.setData({
      switch1Checked: e.detail.value
    })
    const tmp = e.detail.value?1:0
    app.globalData.autoSave = tmp
    wx.setStorageSync('autoSave', tmp)
  },

  pickerChange(e) {
    this.setData({
      indexValue: e.detail.value
    })
    wx.setStorageSync('firstPageIndex', this.data.indexList.indexOf(this.data.curIndexList[this.data.indexValue]))
    app.globalData.firstPage = this.data.indexList.indexOf(this.data.curIndexList[this.data.indexValue])
  },

  toAbout() {
    wx.navigateTo({
      url: '../about/about',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const tmp = app.globalData.PERMS
    let newPermArray = [tmp.ATT, tmp.MAN, tmp.OA]
    let newIndexList = []
    let count = 0
    for (var i in newPermArray) {
      if (newPermArray[i] == 1) {
        newIndexList.push(this.data.indexList[i])
        if (i < app.globalData.firstPage) {
          count += 1
        }
      }
    }
    newIndexList.push(this.data.indexList[3])
    this.setData({
      indexValue: count,
      curIndexList: newIndexList,
      switch1Checked: app.globalData.autoSave==1
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