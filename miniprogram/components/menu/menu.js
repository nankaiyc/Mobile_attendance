// components/menu/menu.js
const app = getApp()
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    curIndex: {
      type: String,
      value: '0',
    },
    show: {
      type: Boolean,
      value: false,
    },
  },
  /**
   * 页面的初始数据
   */
  data: {
    itemArray: [
      {
        name: "考勤打卡",
        url: "../../pages/checkIn/checkIn",
        icon: "../../resource/menu_kq.png"
      },
      {
        name: "考勤监管",
        url: "../../pages/superVise/superVise",
        icon: "../../resource/menu_jg.png"
      },
      {
        name: "考勤OA",
        url: "../../pages/attendanceOA/attendanceOA",
        icon: "../../resource/menu_oa.png"
      },
      {
        name: "成员",
        url: "../../pages/member/member",
        icon: "../../resource/menu_cy.png"
      },
      {
        name: "split",
        url: ""
      },
      {
        name: "我的",
        url: "../../pages/person/person",
        icon: "../../resource/menu_me.png"
      },
      {
        name: "设置",
        url: "../../pages/setting/setting",
        icon: "../../resource/menu_setting.png"
      },
    ],
    permArray: []
  },

  methods: {
    close_overlay() {
    this.setData({
      show: false
    })
  },
  pop_left() {
    this.setData({
      show: true
    })
  },
  jump(e) {
    var index = e.currentTarget.dataset.index;
    if (index == parseInt(this.properties.curIndex) || index == 4 || (index < 3 && this.data.permArray[index] == 0)) {
      return
    }
    if (index < 4) {
      wx.redirectTo({
        url: this.data.itemArray[index].url,
      })
      this.close_overlay();
    } else {
      wx.navigateTo({
        url: this.data.itemArray[index].url,
      })
    }
  },
},

  lifetimes: {
    attached: function() {
      const tmp = app.globalData.PERMS
      let newPermArray = [tmp.ATT, tmp.MAN, tmp.OA]
      this.setData({
        permArray: newPermArray
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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