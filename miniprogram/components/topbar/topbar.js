// components/topbar/topbar.js
const app = getApp()
Component({

  properties: {
    curIndex: {
      type: String,
      value: '0',
    },
    content: {
      type: Array,
      value: [1,2,3],
    },
  },
  /**
   * 页面的初始数据
   */
  data: {
    itemArray: ["考勤打卡", "考勤监管", "成员", "split", "我的", "设置", "搜索每日出勤", "搜索成员", "可考勤地点", "设置监管范围", "考勤OA", "员工详情", "关于", "消息列表", "打卡结果", "请对准自己拍照", "请拍照周围场景", "预览", "注册", "日报详情", "月报详情", "通知详情", "搜素考勤统计"],
    safeTop: ''
  },
  
  methods:{
    handleBack(e) {
      if(this.data.curIndex == 16){
        console.log(this.data.itemArray[16])
        this.triggerEvent("BackToFront",this.data.curIndex)
      }
      else{
        wx.navigateBack()
      }
    },

    handlemethodchange(e){
      var chosen = e.detail
      this.triggerEvent("methodchange",chosen)
    },
    toMsgList() {
      wx.navigateTo({
        url: '../../pages/messageList/messageList',
      })
    },
    check() {
      this.triggerEvent("checkchange")
    }
  },
  
  lifetimes: {
    attached: function () {
      this.setData({
        safeTop: app.globalData.safeArea.top
      })
    }
  }
})