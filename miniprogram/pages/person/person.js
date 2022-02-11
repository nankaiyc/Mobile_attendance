// pages/person/person.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  JumpToInfo(){
    wx.navigateTo({
      url: '../../pages/personInfo/personInfo',
    })
  }
})