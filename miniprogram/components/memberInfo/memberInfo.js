// components/memberInfo/memberInfo.js
const app = getApp()
const CryptoJS = require('../../utils/crypto.js')
Component({

  /**
   * 页面的初始数据
   */
  properties: {
    isModifiable: {
      type: String,
      value: '0'
    },
    needSave: {
      type: String,
      value: '0'
    }
  },

  data: {
    itemArray: [],
    subordinationArray: [],
    childrenNum: [],
    firstShowItems: [],
    curShowItems: [],
    selectedNum: 0,
    navigationArray: [-1],
    allSelected: false,
    staffqueryGroups: '',
    selectedArray: '',
    isLoading: true
  },

  methods: {
    navigationTapped: function (e) {
      if (this.data.isLoading) {
        return
      }
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
      if (this.data.isLoading) {
        return
      }
      const touchedIndex = this.data.curShowItems[e.currentTarget.dataset.index]
      if (this.data.itemArray[touchedIndex].type == 0) {
        wx.navigateTo({
          url: '../../pages/personInfo/personInfo?StaffID=' + this.data.itemArray[touchedIndex].staffId,
        })
      } else {
        let newNavigationArray = this.data.navigationArray
        newNavigationArray.push(touchedIndex)
        this.setData({
          curShowItems: this.data.subordinationArray[touchedIndex],
          navigationArray: newNavigationArray
        })
      }


    },

    selectorTapped: function (e) {
      const touchedIndex = this.data.curShowItems[e.currentTarget.dataset.index]
      this.updateAll(touchedIndex)
    },

    updateAll: function (touchedIndex, pointed = false, val = 0) {
      if (this.data.itemArray[touchedIndex].selectStatus == 2) {
        return
      } else {
        let targetVal = ''
        if (pointed) {
          targetVal = val
        } else {
          targetVal = 1 - this.data.itemArray[touchedIndex].selectStatus
        }
        this.changeStatusUnder(touchedIndex, targetVal)
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
      if (this.data.isLoading) {
        return
      }
      for (var item in this.data.curShowItems) {
        this.updateAll(this.data.curShowItems[item], true, this.data.allSelected?0:1)
      }
      this.setData({
        allSelected: !this.data.allSelected
      })
    },
    
    getDepartAndGroup() {
      const that = this
      var clid = app.globalData.clid

      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;

      var _p = {
        '_s': clid + timestamp,
      }
      _p = JSON.stringify(_p)
      var _p_base64 = CryptoJS.Base64Encode(_p)
      
      this.data.isLoading = true
      wx.showLoading({
        title: '数据加载中···',
      })
      wx.request({
        url: app.globalData.baseUrl + '/staffdepts/',
        method: 'GET',
        data: {
          'CLID': clid,
          '_p': _p_base64,
          '_en': 'app2'
        },
        success: (e) => {
          console.log('success get' + 'staffdepts')
          var res = JSON.parse(CryptoJS.Base64Decode(e.data))
          console.log(res)
          let staffDepts = []
          staffDepts.push.apply(staffDepts, res.StaffDepts?res.StaffDepts:[])
          staffDepts.push.apply(staffDepts, res.StaffqueryDeptds?res.StaffqueryDeptds:[])
          let staffqueryGroups = res.StaffqueryGroups
          that.getEmployees(staffDepts, staffqueryGroups)
        }
      })
    },

    getEmployees(staffDepts, staffqueryGroups) {
      const that = this
      var clid = app.globalData.clid

      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;

      var _p = {
        '_s': clid + timestamp,
      }
      _p = JSON.stringify(_p)
      var _p_base64 = CryptoJS.Base64Encode(_p)
      
      wx.request({
        url: app.globalData.baseUrl + '/employees/',
        method: 'GET',
        data: {
          'CLID': clid,
          '_p': _p_base64,
          '_en': 'app2'
        },
        success: (e) => {
          console.log('success get' + 'employees')
          var res = JSON.parse(CryptoJS.Base64Decode(e.data))
          console.log(res.Employees)
          for (var i in staffDepts) {
            let personArray = res.Employees.filter((val) => {return val.deptId == staffDepts[i].id})
            const item = {
              'name': staffDepts[i].name,
              'type': 1,
              'selectStatus': 0
            }
            that.data.itemArray.push(item)
            let tmp = []
            for (var j in personArray) {
              tmp.push(parseInt(that.data.itemArray.length) + parseInt(j))
            }
            that.data.subordinationArray.push(tmp)

            for (var j in personArray) {
              const itemP = {
                'name': personArray[j].Name,
                'type': 0,
                'selectStatus': 0,
                'staffId': personArray[j].staffId
              }
              that.data.itemArray.push(itemP)
              that.data.subordinationArray.push([])
            }
          }

          if (staffqueryGroups) {
            that.data.staffqueryGroups = staffqueryGroups
            that.getEmployeesByGroup(0)
          } else {
            that.initParms()
          }
        }
      })
    },

    getEmployeesByGroup(index) {
      if (index >= this.data.staffqueryGroups.length) {
        this.initParms()
        return
      }
      const that = this
      var clid = app.globalData.clid

      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;

      var _p = {
        '_s': clid + timestamp,
        'staffGroupId': that.data.staffqueryGroups[index].id
      }
      _p = JSON.stringify(_p)
      var _p_base64 = CryptoJS.Base64Encode(_p)
      
      wx.request({
        url: app.globalData.baseUrl + '/employeesByGroup/',
        method: 'GET',
        data: {
          'CLID': clid,
          '_p': _p_base64,
          '_en': 'app2'
        },
        success: (e) => {
          console.log('success get' + 'employees')
          var res = JSON.parse(CryptoJS.Base64Decode(e.data))
          console.log(res)
          
          let personArray = res.Employees
          const item = {
            'name': that.data.staffqueryGroups[index].name,
            'type': 2,
            'selectStatus': 0
          }
          that.data.itemArray.push(item)
          let tmp = []
          for (var j in personArray) {
            tmp.push(parseInt(that.data.itemArray.length) + parseInt(j))
          }
          that.data.subordinationArray.push(tmp)

          for (var j in personArray) {
            const itemP = {
              'name': personArray[j].Name,
              'type': 0,
              'selectStatus': 0,
              'staffId': personArray[j].staffId
            }
            that.data.itemArray.push(itemP)
            that.data.subordinationArray.push([])
          }
          
          that.getEmployeesByGroup(index + 1)
        }
      })
    },

    initParms() {
      const newItemArray = this.data.itemArray
      for (var i in newItemArray) {
        if (newItemArray[i].selectStatus == 0 && this.data.selectedArray.includes(newItemArray[i].staffId)) {
          newItemArray[i].selectStatus = 1
        }
      }
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
      const newSubordinationArray = this.data.subordinationArray
      this.setData({
        itemArray: newItemArray,
        subordinationArray: newSubordinationArray,
        childrenNum: newChildrenNum,
        firstShowItems: newfirstShowItems,
        curShowItems: newfirstShowItems,
        selectedNum: newSelectedNum
      })
      this.updateStatus()
      this.data.isLoading = false
      wx.hideLoading({})
    },

    saveSelected() {
      if (this.data.isLoading) {
        return
      }
      let selectedArray = []
      for (var i in this.data.itemArray) {
        if (this.data.itemArray[i].selectStatus != 0) {
          selectedArray.push(this.data.itemArray[i].staffId)
        }
      }
      wx.setStorageSync('selectedArray', JSON.stringify(selectedArray))
      app.globalData.selectedArray = selectedArray
      wx.showModal({
        title: '保存成功！',
        success: (e) => {
          if (e.confirm) {
            wx.navigateBack({
              delta: 0,
            })
          }
        }
      })
    }
  },

  lifetimes: {
    attached: function () {
      this.setData({
        selectedArray: app.globalData.selectedArray
      })
      this.getDepartAndGroup()
    }
  }

})