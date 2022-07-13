// pages/attendanceOA/attendanceOA.js
const app = getApp()
const CryptoJS = require('../../utils/crypto.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: [
      {
        index : 0,
        name : "批量处理" 
      },
      {
        index : 1,
        name : "搜索" 
      },
      {
        index : 2,
        name : "起草" 
      },
    ],
    tabs:[
      {
        id:0,
        name:"代办",
        isActive:true
      },
      {
        id:1,
        name:"已办",
        isActive:false
      },
      {
        id:2,
        name:"历史",
        isActive:false
      },
      {
        id:3,
        name:"草稿",
        isActive:false
      },
      {
        id:4,
        name:"转办",
        isActive:false
      },
    ],
    Url:"",
  },

  generateurl(){
    var CLID = app.globalData.clid
    var NAME = CryptoJS.Base64Encode(app.globalData.username)
    var STAFFID = app.globalData.StaffID
    // var CLID = 'CBDD81AC0F5C4FC49DCF0D7F27C43DA7'
    // var NAME = '5p2O5bm%2F5rW3'
    // var STAFFID = '30004'
    var url = 'https://chinark.kaoqintong.net/oa/m/?CLID=' + CLID + '&NAME=' + NAME + '&STAFFID=' + STAFFID
    this.setData({
      Url:url
    })
  },

  handleItemChange(e){
    const {index} = e.detail;
    let {tabs} = this.data;
    tabs.forEach((v,i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },

  onLoad: function () {
    this.generateurl()
  },

})