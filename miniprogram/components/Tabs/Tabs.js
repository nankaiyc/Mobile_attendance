// components/Tabs/Tabs.js
Component({

  properties: {
    tabs:{
      type:Array,
      value:[]
    }
  },

  /**
   * 页面的初始数据
   */
  data: {

  },

  methods:{
    handleItemTap(e){
      const {index} = e.currentTarget.dataset;
      this.triggerEvent("itemChange",{index})
    }
  }
})