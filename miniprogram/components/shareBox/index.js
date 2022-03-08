const app = getApp()
Component({
  properties: {
    // 是否开始绘图
    isCanDraw: {
      type: Boolean,
      value: false,
      observer(newVal) {
        newVal && this.handleStartDrawImg()
      }
    },
    backgroundImg: {
      type: String,
      value: ''
    },
    personImg: {
      type: String,
      value: ''
    },
    psContent: {
      type: String,
      value: ''
    },
  },
  data: {
    imgDraw: {},
    sharePath: '',
    screenHeight: 0,
    screenWidth: 0,
  },
  methods: {
    handleStartDrawImg() {
      wx.showLoading({
        title: '生成中'
      })
      this.setData({
        imgDraw: {
          width: this.data.screenWidth + 'px',
          height: this.data.screenHeight * 0.75 + 'px',
          background: this.properties.backgroundImg,
          views: [
            {
              type: 'text',
              text: this.properties.psContent,
              css: {
                bottom: '50rpx',
                left: '50rpx',
                maxLines: 1,
                fontWeight: 'normal',
                fontSize: '40rpx',
                color: 'white',
                background: 'blueviolet',
                height: '80rpx',
                padding: '10rpx'
              }
            },
            {
              type: 'image',
              url: this.properties.personImg,
              css: {
                top: '10rpx',
                left: '10rpx',
                width: this.data.screenWidth * 0.25 + 'px',
                height: this.data.screenHeight * 0.1875 + 'px',
              }
            }
          ]
        }
      })
    },
    onImgErr(e) {
      wx.hideLoading()
      wx.showToast({
        title: '生成分享图失败，请刷新页面重试'
      })
      //通知外部绘制完成，重置isCanDraw为false
      this.triggerEvent('initData') 
    },
    onImgOK(e) {
      wx.hideLoading()
      // 展示分享图
      //通知外部绘制完成，重置isCanDraw为false
      this.triggerEvent('initData', e.detail.path) 
    }
  },

  lifetimes: {
    attached: function() {
      this.setData({
        screenHeight: app.globalData.screenHeight,
        screenWidth: app.globalData.screenWidth,
      })
    }
  }
})
