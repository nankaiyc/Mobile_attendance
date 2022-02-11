// pages/personInfo/personInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"寅畅",
    id:66688,
    entry_data:"2022-01-04",
    phone:18390217712,
  },
  launchPhoneCall(e){
    var tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel,
      success: function () {
        console.log("拨号成功！")
      },
      fail: function () {
        console.log("拨号失败！")
      }
    })
  }
})