// pages/attendanceOA/attendanceOA.js
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