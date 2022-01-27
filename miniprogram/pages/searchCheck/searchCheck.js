// pages/searchCheck/searchCheck.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    departmentIndex: 0,
    departmentArray: ['测试', '开发', '产品'],
    dateStart: '',
    dateEnd: ''
  },

  bindDepartmentPickerChange: function (e) {
    this.setData({
      departmentIndex: e.detail.value
    })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    this.setData({
      dateStart: currentdate,
      dateEnd: currentdate
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