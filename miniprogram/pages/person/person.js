// pages/person/person.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  JumpToInfo(){
    wx.navigateTo({
      url: '../../pages/personInfo/personInfo?StaffID=' + app.globalData.StaffID,
    })
  }
})