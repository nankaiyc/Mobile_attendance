// components/memberInfo/memberInfo.js
Component({

  /**
   * 页面的初始数据
   */
  properties: {
    isModifiable: {
      type: String,
      value: '0'
    }
  },

  data: {
    itemArray: [
      {
        'name': '开发测试',
        'type': 1,
        'selectStatus': 0
      },
      {
        'name': '监管人员',
        'type': 2,
        'selectStatus': 0
      },
      {
        'name': '在逃人员',
        'type': 1,
        'selectStatus': 2
      },
      {
        'name': '张三',
        'type': 0,
        'selectStatus': 2
      },
      {
        'name': '罗X',
        'type': 0,
        'selectStatus': 0
      },
    ],
    subordinationArray: [[], [2, 4], [3], [], []],
    childrenNum: [],
    firstShowItems: [],
    curShowItems: [],
    selectedNum: 0,
    navigationArray: [-1],
    allSelected: false
  },

  methods: {
    navigationTapped: function (e) {
      const viewIndex = e.currentTarget.dataset.index;
      const touchedIndex = this.data.navigationArray[viewIndex]

      let newCurShowItems = []
      if (viewIndex == 0) {
        newCurShowItems = this.data.firstShowItems
      } else {
        newCurShowItems = this.data.subordinationArray[touchedIndex]
      }

      let newNavigationArray = this.data.navigationArray
      newNavigationArray = newNavigationArray.slice(0, viewIndex + 1)

      this.setData({
        curShowItems: newCurShowItems,
        navigationArray: newNavigationArray
      })
    },

    itemTapped: function (e) {
      const touchedIndex = this.data.curShowItems[e.currentTarget.dataset.index]
      if (this.data.itemArray[touchedIndex].type == 0) {
        wx.navigateTo({
          url: '../../pages/personInfo/personInfo',
        })
      }

      let newNavigationArray = this.data.navigationArray
      newNavigationArray.push(touchedIndex)

      this.setData({
        curShowItems: this.data.subordinationArray[touchedIndex],
        navigationArray: newNavigationArray
      })
    },

    selectorTapped: function (e) {
      const touchedIndex = this.data.curShowItems[e.currentTarget.dataset.index]
      this.updateAll(touchedIndex)
    },

    updateAll: function (touchedIndex) {
      if (this.data.itemArray[touchedIndex].selectStatus == 2) {
        return
      } else {
        this.changeStatusUnder(touchedIndex, 1 - this.data.itemArray[touchedIndex].selectStatus)
        this.updateStatus()
      }
    },

    changeStatusUnder(index, value) {
      if (this.data.itemArray[index].selectStatus == 2) {
        return
      } else {
        if (this.data.itemArray[index].selectStatus != value) {
          let newItemArray = this.data.itemArray
          newItemArray[index].selectStatus = value
          this.setData({
            itemArray: newItemArray
          })
        }
      }

      if (this.data.childrenNum[index] == 0) {
        return
      }
      for (var item in this.data.subordinationArray[index]) {
        this.changeStatusUnder(this.data.subordinationArray[index][item], value)
      }
    },

    updateStatus() {
      for (var item in this.data.firstShowItems) {
        this.getStatus(this.data.firstShowItems[item])
      }
      this.updateSelectedNum()
    },

    getStatus(index) {
      if (this.data.childrenNum[index] == 0) {
        return this.data.itemArray[index].selectStatus
      }
      let sum = 1
      for (var item in this.data.subordinationArray[index]) {
        sum *= this.getStatus(this.data.subordinationArray[index][item])
      }
      sum = sum==0?0:1
      if (this.data.itemArray[index].selectStatus != sum && this.data.itemArray[index].selectStatus != 2) {
        let newItemArray = this.data.itemArray
        newItemArray[index].selectStatus = sum
        this.setData({
          itemArray: newItemArray
        })
      }
      return sum
    },

    updateSelectedNum: function () {
      let count = 0
      for (var item in this.data.itemArray) {
        if (this.data.itemArray[item].selectStatus > 0 && this.data.itemArray[item].type == 0) {
          count += 1
        }
      }
      this.setData({
        selectedNum: count
      })
    },

    selectAll: function () {
      for (var item in this.data.curShowItems) {
        this.updateAll(this.data.curShowItems[item])
      }
      this.setData({
        allSelected: !this.data.allSelected
      })
    }
  },

  lifetimes: {
    attached: function () {
      let newChildrenNum = []
      let newfirstShowItems = []
      let count = []
      let newSelectedNum = 0
      for (var item in this.data.subordinationArray) {
        newChildrenNum.push(this.data.subordinationArray[item].length)
        count.push(0)
      }
      for (var item in this.data.itemArray) {
        if (this.data.itemArray[item].selectStatus > 0 && this.data.itemArray[item].type == 0) {
          newSelectedNum += 1
        }
        if (newChildrenNum[item] == 0) {
          continue
        }
        for (var index in this.data.subordinationArray[item]) {
          count[this.data.subordinationArray[item][index]] += 1
        }
      }
      for (var item in count) {
        if (count[item] == 0) {
          newfirstShowItems.push(item)
        }
      }
      this.setData({
        childrenNum: newChildrenNum,
        firstShowItems: newfirstShowItems,
        curShowItems: newfirstShowItems,
        selectedNum: newSelectedNum
      })
      
    }
  }

})