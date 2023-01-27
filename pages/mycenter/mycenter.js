var app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    isVip: 0,
    height: 64, //header高度
    top: 0, //标题图标距离顶部距离
    scrollH: 0, //滚动总高度
    opcity: 0,
    iconOpcity: 0.5,
    productList: [],
    pageIndex: 1,
    loadding: false,
    pullUpOn: true,
    modal: false
  },
  onLoad: function(options) {
    // console.log("当前版本:1.5.2")

    // console.log(app.globalData.userInfo)
    // this.setData({
    //   userInfo: app.globalData.userInfo
    // })

    let obj = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          width: obj.left || res.windowWidth,
          height: obj.top ? (obj.top + obj.height + 8) : (res.statusBarHeight + 44),
          top: obj.top ? (obj.top + (obj.height - 32) / 2) : (res.statusBarHeight + 6),
          scrollH: res.windowWidth * 0.6
        })
      }
    })
    console.log(this.data.height)

    util.request("/WxMyIndex/GetMyIndex", {}, "GET", false).then((res) => {
      // if (res.Code == '401') {
      //   wx.navigateTo({
      //     url: '../login/login?backflag=true'
      //   })
      // }
      wx.setStorageSync('RePecent', res.data.RePecent);
      wx.setStorageSync('RatePecent', res.data.RatePecent);
      wx.setStorageSync('name', res.data.NickName);
      wx.setStorageSync('MemID', res.data.MemID);
      console.log(res)
      console.log(wx.getStorageSync('token'))
      this.setData({
        estimateprofit: res.data
      })
      if (res.data.PendingCount != 0) {
        this.setData({
          flag1: true
        })
      }
      if (res.data.ShareCount != 0) {
        this.setData({
          flag2: true
        })
      }
      if (res.data.DeliveryrCount != 0) {
        this.setData({
          flag3: true
        })
      }
      if (res.data.GoodsrCount != 0) {
        this.setData({
          flag4: true
        })
      }
      if (res.data.EvaluationCount != 0) {
        this.setData({
          flag5: true
        })
      }
      var active = res.data.ActiveValue
      // var active =2000
      if (active) {
        var activelength = 380 / 4000 * active
        console.log(activelength)
        this.setData({
          activevalue: active,
          activelength: activelength
        })
      } else {
        this.setData({
          activevalue: 0,
          activelength: 0
        })
      }
      this.setData({
        information: res.data
      })
    })
  },
  back: function() {
    wx.navigateBack()
  },
  onShow: function() {
    util.request("/WxMyIndex/GetMyIndex", {}, "GET", false, true).then((res) => {
      if (res.Code == '401') {
        wx.reLaunch({
          url: '../login/login?backflag=center'
        })
      }
      wx.setStorageSync('RePecent', res.data.RePecent);
      wx.setStorageSync('RatePecent', res.data.RatePecent);
      wx.setStorageSync('UserImg', res.data.Photo);
      console.log(res)
      this.setData({
        information: res.data,
        estimateprofit: res.data
      })
      if (res.data.PendingCount != 0) {
        this.setData({
          flag1: true
        })
      }
      if (res.data.ShareCount != 0) {
        this.setData({
          flag2: true
        })
      }
      if (res.data.DeliveryrCount != 0) {
        this.setData({
          flag3: true
        })
      }
      if (res.data.GoodsrCount != 0) {
        this.setData({
          flag4: true
        })
      }
      if (res.data.EvaluationCount != 0) {
        this.setData({
          flag5: true
        })
      }
      wx.setStorageSync('RePecent', res.data.RePecent);
      wx.setStorageSync('RatePecent', res.data.RatePecent);
    })
  },
  href(e) {
    // let page = Number(e.currentTarget.dataset.type)
    // let url = "";
    // switch (page) {
    //   case 1:
    //     break;
    //   case 2:
    //     url = "../set/set"
    //     break;
    //   case 3:
    //     url = "../userInfo/userInfo"
    //     break;
    //   case 4:
    //     url = "../myOrder/myOrder"
    //     break;
    //   default:
    //     break;
    // }
    // if (url) {
    //   wx.navigateTo({
    //     url: url
    //   })
    // } else {
    //   wx.showToast({
    //     title: "功能尚未完善~",
    //     icon: "none"
    //   })
    // }
  },
  detail: function() {
    wx.navigateTo({
      url: '../extend-view/productDetail/productDetail'
    })
  },
  onPageScroll(e) {
    let scroll = e.scrollTop <= 0 ? 0 : e.scrollTop;
    let opcity = scroll / this.data.scrollH;
    if (this.data.opcity >= 1 && opcity >= 1) {
      return;
    }
    this.setData({
      opcity: opcity,
      iconOpcity: 0.5 * (1 - opcity < 0 ? 0 : 1 - opcity)
    })
  },
  onPullDownRefresh() {
    util.request("/WxMyIndex/GetMyIndex", {}, "GET", false).then((res) => {
      if (res.Code == '401') {
        wx.stopPullDownRefresh()
        wx.reLaunch({
          url: '../login/login?backflag=center'
        })
      }
      wx.setStorageSync('RePecent', res.data.RePecent);
      wx.setStorageSync('RatePecent', res.data.RatePecent);
      console.log(res)
      this.setData({
        estimateprofit: res.data
      })
      if (res.data.PendingCount != 0) {
        this.setData({
          flag1: true
        })
      }
      if (res.data.ShareCount != 0) {
        this.setData({
          flag2: true
        })
      }
      if (res.data.DeliveryrCount != 0) {
        this.setData({
          flag3: true
        })
      }
      if (res.data.GoodsrCount != 0) {
        this.setData({
          flag4: true
        })
      }
      if (res.data.EvaluationCount != 0) {
        this.setData({
          flag5: true
        })
      }
      var active = res.data.ActiveValue
      // var active =2000
      if (active) {
        var activelength = 380 / 3500 * active
        console.log(activelength)
        this.setData({
          activevalue: active,
          activelength: activelength
        })
      } else {
        this.setData({
          activevalue: 0,
          activelength: 0
        })
      }
      this.setData({
        information: res.data
      })
      wx.stopPullDownRefresh()
    })

  },
  onReachBottom: function() {
    if (!this.data.pullUpOn) return;
    this.setData({
      loadding: true
    })
    if (this.data.pageIndex == 4) {
      this.setData({
        loadding: false,
        pullUpOn: false
      })
    } else {
      let loadData = JSON.parse(JSON.stringify(this.data.productList));
      loadData = loadData.splice(0, 10)
      if (this.data.pageIndex == 1) {
        loadData = loadData.reverse();
      }
      this.setData({
        loadding: false,
        pageIndex: this.data.pageIndex + 1,
        productList: this.data.productList.concat(loadData)
      })
    }
  },
  tomymember: function() {
    wx.navigateTo({
      url: '../extend-view1/mymember/mymember'
    })
  },
  tomyprofit: function() {
    wx.navigateTo({
      url: '../extend-view1/myprofit/myprofit'
    })
  },
  tomyorder: function(e) {
    var cur = e.currentTarget.dataset.current
    wx.navigateTo({
      url: '../mycenter-extend/myorder/myorder?cur=' + cur
    })
  },
  tocashout: function() {
    this.setData({
      modal: true
    })
  },
  tomyevaluation: function() {
    console.log(111)
    wx.navigateTo({
      url: '../mycenter-extend/myevaluation/myevaluation'
    })
  },
  toshopcart: function() {
    wx.navigateTo({
      url: '../extend-view/mall-extend/shopcart/shopcart'
    })
  },
  tomaillist: function() {
    wx.navigateTo({
      url: '../mycenter-extend/maillist/maillist'
    })
  },
  toextendorder: function() {
    wx.navigateTo({
      url: '../mycenter-extend/extendorder/extendorder'
    })
  },
  toaccountsettings: function() {
    wx.navigateTo({
      url: '../mycenter-extend/accountsettings/accountsettings'
    })
  },
  tocommonproblem: function() {
    wx.navigateTo({
      url: '../mycenter-extend/commonproblem/commonproblem'
    })
  },
  tofeedback: function() {
    wx.navigateTo({
      url: '../mycenter-extend/feedback/feedback'
    })
  },
  todrawback: function() {
    wx.navigateTo({
      url: '../mycenter-extend/drawback/drawback'
    })
  },
  collectshop: function() {
    wx.navigateTo({
      url: '../mycenter-extend/collectshop/collectshop'
    })
  },
  tobusinesscooperation: function() {
    wx.navigateTo({
      url: '../mycenter-extend/businesscooperation/businesscooperation',
    })
  },
  tonicknameinfo: function() {
    wx.navigateTo({
      url: '../mycenter-extend/nicknameinfo/nicknameinfo',
    })
  },
  assistant: function() {
    wx.navigateTo({
      url: '../mycenter-extend/assistant/assistant',
    })
  },
  mygroup: function() {
    wx.navigateTo({
      url: '../mycenter-extend/mygroup/mygroup',
    })
  },
  toaboutus: function() {
    wx.navigateTo({
      url: '../mycenter-extend/aboutus/aboutus',
    })
  },
  toactivevalue: function() {
    wx.navigateTo({
      url: `../extend-view1/activevalue/index/index?value=${this.data.activevalue}&num=${this.data.estimateprofit.activemember}`,
    })
  },
  tofootprint: function() {
    wx.navigateTo({
      url: '../mycenter-extend/footprint/footprint',
    })
  },
  tomygroup: function() {
    wx.navigateTo({
      url: '../mycenter-extend/mygroup/mygroup',
    })
  },
  hide: function() {
    this.setData({
      modal: false
    })
  },
  headoffice: function(e) {
    var cur = e.currentTarget.dataset.current
    console.log(e.currentTarget.dataset.current)
    if (cur == 0) {
      util.toast("你当前没有掌门人")
    } else {
      this.setData({
        modal: true
      })
    }

  },
  copy: function(e) {
    var that = this
    wx.setClipboardData({
      data: this.data.information.RecommonCode,
      success(res) {
        //粘贴到对应的位置
        wx.getClipboardData({
          success(res) {
            console.log(res)
          }
        })
      }
    })
  },
  copywx: function(e) {
    var that = this
    wx.setClipboardData({
      data: `http://shop.we-time.net/?invitenum=${this.data.information.RecommonCode}`,
      // data:" 1111",
      success(res) {
        //粘贴到对应的位置
        wx.getClipboardData({
          success(res) {
            console.log(res)
          }
        })
        that.setData({
          modal: false
        })
      }
    })
  },
  shareimg: function(e) {
    var cur = e.currentTarget.dataset.current;
    console.log(cur)
    util.request("/WxDocumenInfo/GetDocumenInfoByrandom", {}, "GET", false).then((res) => {
      var img = res.data.NewsPhote
      util.request("/WxShare/PostersImg", {
        img: img
      }, "GET", false).then((res) => {
        console.log(res)
        var img = res.Msg
        wx.navigateTo({
          url: '../extend-view1/createposter/createposter?img=' + img,
        })
      })
    })

  }
})