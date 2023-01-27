// pages/extend-view1//successorder/successorder.js
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tuanflag: "attendgroup",
    modal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var repercent = wx.getStorageSync("RePecent")
    var ratepercent = wx.getStorageSync("RatePecent")
    var ordinaryrepercent = wx.getStorageSync("OrdinaryRePecent")
    console.log(repercent, ratepercent)
    this.setData({
      repercent,
      ratepercent,
      ordinaryrepercent
    })
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

    util.request("/WXHome/IndexCateMore", {
      cate: 3,
      page: 1
    }, "POST", false).then((res) => {
      console.log(res.data)
      this.setData({
        productList: res.data
      })
    })

    this.setData({
      extendmoney: options.extendmoney,
      returnmoney: options.returnmoney
    })
    console.log(options)
    this.setData({
      tuanflag: options.tuanflag,
      backflag: options.backflag,
      productid: options.productid
    })
    var memid = wx.getStorageSync("MemID")
    var otherphoto = wx.getStorageSync("otherphoto")
    var userimg = wx.getStorageSync("UserImg")
    if (this.data.tuanflag == "attendgroup") {
      this.setData({
        orderid: options.orderid,
        memid: memid,
        otherphoto,
        userimg,
        linkflag: options.linkflag
      })
    }
  },
  back: function() {
    if (this.data.backflag == 'barging'){
        wx.switchTab({
        url: '/pages/wujieindex/wujieindex'
      })
      return
    }
    var isshare = wx.getLaunchOptionsSync().scene
    if (isshare == 1007 || isshare == 1008) {
      wx.reLaunch({
        url: '/pages/wujieindex/wujieindex'
      })
    } else {
      wx.navigateBack()
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
    if (this.data.backflag == 'orderpay') {
      if (this.data.linkflag == 'true') {
        wx.reLaunch({
          url: '/pages/wujieindex/wujieindex'
        })
      } else {
        wx.navigateBack({
          delta: 1
        })
      }
    } else if (this.data.backflag == 'cartpay') {
      const pages = getCurrentPages()
      //声明一个pages使用getCurrentPages方法
      const perpage = pages[pages.length - 3]
      //声明一个当前页面
      perpage.setData({
        refreshflag: true
      })
      wx.navigateBack({
        delta: 1
      })
    } else if (this.data.backflag == 'waitpay') {
      // wx.navigateBack({

      // })
      console.log(111)
    } else if (this.data.backflag =='barging'){
      // wx.switchTab({
      //   url: '/pages/wujieindex/wujieindex'
      // })
    }else {
      wx.navigateBack({

      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  toshouye: function() {
    wx.switchTab({
      url: '../../wujieindex/wujieindex'
    })
  },
  toorderdetail: function() {
    if (this.data.backflag == 'waitpay') {
      wx.navigateBack({

      })
      return
    }
    wx.navigateTo({
      url: '../../mycenter-extend/myorder/myorder?cur=' + 0,
    })
  },
  closemodal: function() {
    this.setData({
      modal: false
    })
  },
  showmodal: function() {
    this.setData({
      modal: true
    })
  },
  // tocreateposter: function () {
  //   console.log(this.data.productid)
  //   util.request("/WxShare/GeneratePrice",{
  //     // productID: this.data.productid
  //     productID:"8af0a66b31314e9faf14bd190bc8e9f9"
  //   }, "GET", false).then((res) => {
  //     console.log(res)
  //     var img = res.Msg
  //     wx.navigateTo({
  //       url: '../createposter/createposter?img='+img,
  //     })
  //     this.setData({
  //       modal:false
  //     })
  //   })
  // },
  tocreateposter: function() {
    util.request("/WxShare/GeneratePrice", {
      productID: this.data.productid
    }, "GET", false).then((res) => {
      console.log(res)
      var img = res.Msg
      wx.navigateTo({
        url: '../createposter/createposter?img=' + img,
      })
      this.setData({
        modal:false
      })
    })
  },
  togoodsdetail: function(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `../../extend-view/proDetail/proDetail?id=${id}`,
    })
  },
  tocreateposter1: function (e) {
    var cur = e.currentTarget.dataset.current
    util.request("/WxShare/GeneratePrice", {
      productID: cur
    }, "GET", false).then((res) => {
      console.log(res)
      var img = res.Msg
      wx.navigateTo({
        url: '../createposter/createposter?img=' + img,
      })
    })
  }
})