// pages/mycenter-extend//extendorder/extendorder.js

const util = require('../../../utils/util.js')
// const date = new Date()
// const years = []
// const months = []
// const days = []

// for (let i = 1990; i <= date.getFullYear(); i++) {
//   years.push(i)
// }

// for (let i = 1; i <= 12; i++) {
//   months.push(i)
// }

// for (let i = 1; i <= 31; i++) {
//   days.push(i)
// }


Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    tabs: [{
        name: "全部"
      },
      {
        name: "已付款"
      },
      {
        name: "已完成"
      },
      {
        name: "无效"
      }
    ],
    selected: 0,
    popupShow: false,
    modal1: false,
    modal2: false,
    // years: years,
    // year: date.getFullYear(),
    // months: months,
    // month: 10,
    // days: days,
    // day: 9,
    // value: [9999, 9, 8]
    date: "开始时间",
    date1: '结束时间',
    pageindex: 1,
    flag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let obj = wx.getMenuButtonBoundingClientRect();
    this.setData({
      width: obj.left,
      height: obj.top + obj.height + 8,
      top: obj.top + (obj.height - 32) / 2
    }, () => {
      wx.getSystemInfo({
        success: (res) => {
          this.setData({
            scrollH: res.windowWidth
          })
        }
      })
    });
    
    var repercent = wx.getStorageSync("RePecent")
    var ratepercent = wx.getStorageSync("RatePecent")
    var ordinaryrepercent = wx.getStorageSync("OrdinaryRePecent")
    console.log(repercent, ratepercent)
    this.setData({
      repercent,
      ratepercent,
      ordinaryrepercent
    })
    util.request('/WXMyIndex/Orderdetails', {
      Type: 1,
      PageIndex: 1,
      PageSize: 10
    }, 'POST', false).then((res) => {
      if (res.data.length == 0) {
        this.setData({
          flag: true
        })
      } else {
        this.setData({
          flag: false
        })
      }
      console.log(res)
      var list = res.data
      for (var i = 0; i < list.length; i++) {
        if (list[i].IsaffirmTime) {
          var str = list[i].IsaffirmTime
          str = str.slice(6)
          str = str.substring(0, str.length - 2);
          list[i].IsaffirmTime = this.getTime(str * 1)
          // console.log(this.getTime(str * 1))
        }
        var str1 = list[i].OrderTime
        str1 = str1.slice(6)
        str1 = str1.substring(0, str1.length - 2);
        list[i].OrderTime = this.getTime(str1 * 1)
      }
      this.setData({
        list: res.data
      })
    })
  },
  back: function () {
    var isshare = wx.getLaunchOptionsSync().scene
    if (isshare == 1007 || isshare == 1008) {
      wx.reLaunch({
        url: '/pages/wujieindex/wujieindex'
      })
    } else {
      wx.navigateBack()
    }
  },
  getTime: function(data, type) {
    var _data = data;
    //如果是13位正常，如果是10位则需要转化为毫秒
    if (String(data).length == 13) {
      _data = data
    } else {
      _data = data * 1000
    }
    const time = new Date(_data);
    const Y = time.getFullYear();
    const Mon = time.getMonth() + 1;
    const Day = time.getDate();
    const H = time.getHours();
    const Min = time.getMinutes();
    const S = time.getSeconds();
    //自定义选择想要返回的类型
    if (type == "Y") {
      return `${Y}-${Mon}-${Day}`
    } else if (type == "H") {
      return `${H}:${Min}:${S}`
    } else {
      return `${Y}-${Mon}-${Day} ${H}:${Min}:${S}`
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var cur = this.data.selected
    if (this.data.date == '开始时间' || this.data.date1 == '结束时间') {
      util.request('/WXMyIndex/Orderdetails', {
        Type: cur + 1,
        PageIndex: 1,
        PageSize: 10
      }, 'POST', false).then((res) => {
        if (res.data.length == 0) {
          this.setData({
            flag: true
          })
        } else {
          this.setData({
            flag: false
          })
        }
        console.log(res)
        var list = res.data
        for (var i = 0; i < list.length; i++) {
          if (list[i].IsaffirmTime) {
            var str = list[i].IsaffirmTime
            str = str.slice(6)
            str = str.substring(0, str.length - 2);
            list[i].IsaffirmTime = this.getTime(str * 1)
            // console.log(this.getTime(str * 1))
          }
          var str1 = list[i].OrderTime
          str1 = str1.slice(6)
          str1 = str1.substring(0, str1.length - 2);
          list[i].OrderTime = this.getTime(str1 * 1)
        }
        this.setData({
          list: res.data,
          pageindex: 1
        })
        wx.stopPullDownRefresh()
      })
    } else {
      util.request('/WXMyIndex/Orderdetails', {
        Startime: this.data.date,
        Endtime: this.data.date1,
        Type: cur + 1,
        PageIndex: 1,
        PageSize: 10
      }, 'POST', false).then((res) => {
        if (res.data.length == 0) {
          this.setData({
            flag: true
          })
        } else {
          this.setData({
            flag: false
          })
        }
        console.log(res)
        var list = res.data
        for (var i = 0; i < list.length; i++) {
          if (list[i].IsaffirmTime) {
            var str = list[i].IsaffirmTime
            str = str.slice(6)
            str = str.substring(0, str.length - 2);
            list[i].IsaffirmTime = this.getTime(str * 1)
            // console.log(this.getTime(str * 1))
          }
          var str1 = list[i].OrderTime
          str1 = str1.slice(6)
          str1 = str1.substring(0, str1.length - 2);
          list[i].OrderTime = this.getTime(str1 * 1)
        }
        this.setData({
          list: res.data,
          pageindex: 1
        })
        wx.stopPullDownRefresh()
      })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var cur = this.data.selected
    if (this.data.date == '开始时间' || this.data.date1 == '结束时间') {
      util.request('/WXMyIndex/Orderdetails', {
        Type: cur + 1,
        PageIndex: this.data.pageindex + 1,
        PageSize: 10
      }, 'POST', false).then((res) => {
        if (res.data.length == 0) {
          util.toast("没有更多的数据了")
          return
        }
        console.log(res)
        var list = res.data
        for (var i = 0; i < list.length; i++) {
          if (list[i].IsaffirmTime) {
            var str = list[i].IsaffirmTime
            str = str.slice(6)
            str = str.substring(0, str.length - 2);
            list[i].IsaffirmTime = this.getTime(str * 1)
            // console.log(this.getTime(str * 1))
          }
          var str1 = list[i].OrderTime
          str1 = str1.slice(6)
          str1 = str1.substring(0, str1.length - 2);
          list[i].OrderTime = this.getTime(str1 * 1)
        }
        this.setData({
          list: this.data.list.concat(res.data),
          pageindex: this.data.pageindex + 1
        })
      })
    } else {
      util.request('/WXMyIndex/Orderdetails', {
        Startime: this.data.date,
        Endtime: this.data.date1,
        Type: cur + 1,
        PageIndex: this.data.pageindex + 1,
        PageSize: 10
      }, 'POST', false).then((res) => {
        if (res.data.length == 0) {
          util.toast("没有更多的数据了")
          return
        }
        var list = res.data
        for (var i = 0; i < list.length; i++) {
          if (list[i].IsaffirmTime) {
            var str = list[i].IsaffirmTime
            str = str.slice(6)
            str = str.substring(0, str.length - 2);
            list[i].IsaffirmTime = this.getTime(str * 1)
            // console.log(this.getTime(str * 1))
          }
          var str1 = list[i].OrderTime
          str1 = str1.slice(6)
          str1 = str1.substring(0, str1.length - 2);
          list[i].OrderTime = this.getTime(str1 * 1)
        }
        this.setData({
          list: this.data.list.concat(res.data),
          pageindex: this.data.pageindex + 1
        })
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  change: function(e) {
    const cur = e.currentTarget.dataset.index
    console.log(cur)
    this.setData({
      selected: cur
    })
    if (this.data.date == '开始时间' || this.data.date1 == '结束时间') {
      util.request('/WXMyIndex/Orderdetails', {
        Type: cur + 1,
        PageIndex: 1,
        PageSize: 10
      }, 'POST', false).then((res) => {
        if (res.data.length == 0) {
          this.setData({
            flag: true
          })
        } else {
          this.setData({
            flag: false
          })
        }
        var list = res.data
        for (var i = 0; i < list.length; i++) {
          if (list[i].IsaffirmTime) {
            var str = list[i].IsaffirmTime
            str = str.slice(6)
            str = str.substring(0, str.length - 2);
            list[i].IsaffirmTime = this.getTime(str * 1)
            // console.log(this.getTime(str * 1))
          }
          var str1 = list[i].OrderTime
          str1 = str1.slice(6)
          str1 = str1.substring(0, str1.length - 2);
          list[i].OrderTime = this.getTime(str1 * 1)
        }
        this.setData({
          list: res.data,
          pageindex: 1
        })
      })
    } else {
      util.request('/WXMyIndex/Orderdetails', {
        Startime: this.data.date,
        Endtime: this.data.date1,
        Type: cur + 1,
        PageIndex: 1,
        PageSize: 10
      }, 'POST', false).then((res) => {
        if (res.data.length == 0) {
          this.setData({
            flag: true
          })
        } else {
          this.setData({
            flag: false
          })
        }
        var list = res.data
        for (var i = 0; i < list.length; i++) {
          if (list[i].IsaffirmTime) {
            var str = list[i].IsaffirmTime
            str = str.slice(6)
            str = str.substring(0, str.length - 2);
            list[i].IsaffirmTime = this.getTime(str * 1)
            // console.log(this.getTime(str * 1))
          }
          var str1 = list[i].OrderTime
          str1 = str1.slice(6)
          str1 = str1.substring(0, str1.length - 2);
          list[i].OrderTime = this.getTime(str1 * 1)
        }
        this.setData({
          list: res.data,
          pageindex: 1
        })
      })
    }
  },
  cancle: function() {
    this.setData({
      popupShow: true
    })
  },
  hidePopup: function() {
    this.setData({
      popupShow: false
    })
  },
  // bindChange: function(e) {
  //   const val = e.detail.value
  //   this.setData({
  //     year: this.data.years[val[0]],
  //     month: this.data.months[val[1]],
  //     day: this.data.days[val[2]]
  //   })
  // },
  // showtime1: function() {
  //   this.setData({
  //     modal1: true
  //   })
  // },
  // showtime2: function() {
  //   this.setData({
  //     modal2: true
  //   })
  // },
  // hidetime1: function() {
  //   this.setData({
  //     modal1: false
  //   })
  // },
  // hidetime2: function() {
  //   this.setData({
  //     modal2: false
  //   })
  // }
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
    if (this.data.date == '开始时间' || this.data.date1 == '结束时间') {
      util.request('/WXMyIndex/Orderdetails', {
        Type: this.data.selected + 1,
        PageIndex: 1,
        PageSize: 10
      }, 'POST', false).then((res) => {
        if (res.data.length == 0) {
          this.setData({
            flag: true
          })
        } else {
          this.setData({
            flag: false
          })
        }
        console.log(res)
        var list = res.data
        for (var i = 0; i < list.length; i++) {
          if (list[i].IsaffirmTime) {
            var str = list[i].IsaffirmTime
            str = str.slice(6)
            str = str.substring(0, str.length - 2);
            list[i].IsaffirmTime = this.getTime(str * 1)
            // console.log(this.getTime(str * 1))
          }
          var str1 = list[i].OrderTime
          str1 = str1.slice(6)
          str1 = str1.substring(0, str1.length - 2);
          list[i].OrderTime = this.getTime(str1 * 1)
        }
        this.setData({
          list: res.data
        })
      })
    } else {
      util.request('/WXMyIndex/Orderdetails', {
        Startime: this.data.date,
        Endtime: this.data.date1,
        Type: this.data.selected + 1,
        PageIndex: 1,
        PageSize: 10
      }, 'POST', false).then((res) => {
        if (res.data.length == 0) {
          this.setData({
            flag: true
          })
        } else {
          this.setData({
            flag: false
          })
        }
        console.log(res)
        var list = res.data
        for (var i = 0; i < list.length; i++) {
          if (list[i].IsaffirmTime) {
            var str = list[i].IsaffirmTime
            str = str.slice(6)
            str = str.substring(0, str.length - 2);
            list[i].IsaffirmTime = this.getTime(str * 1)
            // console.log(this.getTime(str * 1))
          }
          var str1 = list[i].OrderTime
          str1 = str1.slice(6)
          str1 = str1.substring(0, str1.length - 2);
          list[i].OrderTime = this.getTime(str1 * 1)
        }
        this.setData({
          list: res.data
        })
      })
    }

  },
  bindDateChange1: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date1: e.detail.value
    })
    if (this.data.date == '开始时间' || this.data.date1 == '结束时间') {
      util.request('/WXMyIndex/Orderdetails', {
        Type: this.data.selected + 1,
        PageIndex: 1,
        PageSize: 10
      }, 'POST', false).then((res) => {
        if (res.data.length == 0) {
          this.setData({
            flag: true
          })
        } else {
          this.setData({
            flag: false
          })
        }
        console.log(res)
        var list = res.data
        for (var i = 0; i < list.length; i++) {
          if (list[i].IsaffirmTime) {
            var str = list[i].IsaffirmTime
            str = str.slice(6)
            str = str.substring(0, str.length - 2);
            list[i].IsaffirmTime = this.getTime(str * 1)
            // console.log(this.getTime(str * 1))
          }
          var str1 = list[i].OrderTime
          str1 = str1.slice(6)
          str1 = str1.substring(0, str1.length - 2);
          list[i].OrderTime = this.getTime(str1 * 1)
        }
        this.setData({
          list: res.data
        })
      })
    } else {
      util.request('/WXMyIndex/Orderdetails', {
        Startime: this.data.date,
        Endtime: this.data.date1,
        Type: this.data.selected + 1,
        PageIndex: 1,
        PageSize: 10
      }, 'POST', false).then((res) => {
        if (res.data.length == 0) {
          this.setData({
            flag: true
          })
        } else {
          this.setData({
            flag: false
          })
        }
        console.log(res)
        var list = res.data
        for (var i = 0; i < list.length; i++) {
          if (list[i].IsaffirmTime) {
            var str = list[i].IsaffirmTime
            str = str.slice(6)
            str = str.substring(0, str.length - 2);
            list[i].IsaffirmTime = this.getTime(str * 1)
            // console.log(this.getTime(str * 1))
          }
          var str1 = list[i].OrderTime
          str1 = str1.slice(6)
          str1 = str1.substring(0, str1.length - 2);
          list[i].OrderTime = this.getTime(str1 * 1)
        }
        this.setData({
          list: res.data
        })
      })
    }
  }
})