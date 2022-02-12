//app.js
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
  }
})
