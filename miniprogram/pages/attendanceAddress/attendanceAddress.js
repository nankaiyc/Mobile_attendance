// pages/attendanceAddress/attendanceAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        name:"Wifi",
        isActive:false
      },
      {
        id:1,
        name:"GPS",
        isActive:true
      },
    ]
  },

  handleItemChange(e){
    const {index} = e.detail;
    let {tabs} = this.data;
    tabs.forEach((v,i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  }
})