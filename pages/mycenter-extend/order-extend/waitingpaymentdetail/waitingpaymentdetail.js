// pages/mycenter-extend//order-extend/waitingpaymentdetail/waitingpaymentdetail.js
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: 1,
    popupShow: false,
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

    this.setData({
      orderid: options.order
    })
    console.log(this.data.orderid)
    util.request("/WxProOrders/GetUserOrderInfo", {
      OrderID: this.data.orderid
    }, "GET", false).then((res) => {
      console.log(res.data)
      var order = res.data
      var str = order.OrderTime
      console.log(str)
      str = str.slice(6)
      str = str.substring(0, str.length - 2);
      var time = util.timestampToTime1(str)
      console.log(time)

      console.log(order, order.OrderProduct)
      this.setData({
        order: order,
        orderproduct: order.OrderProduct,
        time: time
      })
    })

    util.request("/WxRefundOrder/GetRefundRemark", {
      Type: 2
    }, "POST", false, true).then((res) => {
      console.log(res)
      this.setData({
        reason: res.data
      })
    })

    // 获取客服号
    util.request("/WxOpen/GetCustomerService ", {}, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        msg: res.Msg
      })
    })
  },
  back: function() {
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
  selectpay: function(e) {
    let cur = e.currentTarget.dataset.current;
    this.setData({
      selected: cur
    })
  },
  cancleorder: function() {
    this.setData({
      popupShow: true
    })
  },
  choosereason: function(e) {
    var cur = e.currentTarget.dataset.current;
    console.log(cur)
    this.setData({
      activeindex: cur
    })
  },
  submit: function() {
    util.request("/WxProOrders/CancelOrder", {
      OrderID: this.data.order.OrderID,
      Key: this.data.activeindex
    }, "GET", false).then((res) => {
      console.log(res)
      let pages = getCurrentPages(); // 当前页的数据，可以输出来看看有什么东西
      let prevPage = pages[pages.length - 2]; // 上一页的数据，也可以输出来看看有什么东西
      var data = this.data.content;
      // console.log(data)
      // // console.log(data[this.data.index].OrderProduct.length == 0)
      // if (data[this.data.index].OrderProduct.length==1){
      data.splice(this.data.index, 1)
      this.setData({
        popupShow:false
      })
      // }else{
      //   data[this.data.index].OrderProduct.splice(this.data.attr, 1)
      // }
      // if (prevPage.data.selected == '1') {
      prevPage.setData({
        waitingpay: data
      })
      if (prevPage.data.waitingpay.length == 0) {
        prevPage.setData({
          flag: false
        })
      }
      // } else if (prevPage.data.selected == '2') {
      //   prevPage.setData({
      //     waitingshare: data
      //   })
      // }
      util.toast("取消订单成功")
      setTimeout(() => {
        wx.navigateBack({

        })
      }, 500)
    })
  },
  copy: function(e) {
    var cur = e.currentTarget.dataset.current
    var that = this
    wx.setClipboardData({
      data: cur,
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
  hidePopup: function() {
    this.setData({
      popupShow: false
    })
  },
  tocustomerservice: function() {
    console.log(this.data.msg)
    wx.navigateTo({
      url: `../../../extend-view/news-extend/customerservice/customerservice?conversationID=${'C2C' + this.data.msg}`,
    })
  },
  togoodsdetail: function(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `../../../extend-view/proDetail/proDetail?id=${id}`,
    })
  },
  showphone: function() {
    this.setData({
      modal: true
    })
  },
  hide: function() {
    this.setData({
      modal: false
    })
  },
  copy: function(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.current,
      success(res) {
        //粘贴到对应的位置
        wx.getClipboardData({
          success(res) {
            console.log(res)
          }
        })
      }
    })
    this.setData({
      modal: false
    })
  },
  topay: function (e) {
    var cur = e.currentTarget.dataset.current
    var productid = e.currentTarget.dataset.id
    var score = e.currentTarget.dataset.score
    var extendmoney = ((score - score * this.data.ordinaryrepercent) * this.data.ratepercent)
    extendmoney = extendmoney.toFixed(2)
    console.log(extendmoney)
    console.log(productid)
    util.request("/WxPay/PayOrder", {
      orderIds: cur,
      TradeType: 3
    }, "GET", false).then((res) => {
      console.log(res)
      wx.requestPayment({
        'timeStamp': res.data.WxPay.timeStamp,
        'nonceStr': res.data.WxPay.nonceStr,
        'package': res.data.WxPay.package,
        'signType': 'MD5',
        'paySign': res.data.WxPay.paySign,
        'success': function (res) {
          console.log("支付成功")
          util.taskcomplete(1)
          wx.redirectTo({
            url: `../../../extend-view1/successorder/successorder?backflag=waitpay&tuanflag=maverickbuy&productid=${productid}&extendmoney=${extendmoney}`,
          })
        },
        'fail': function (res) {
          console.log("支付失败")
          // wx.navigateTo({
          //   url: `../../extend-view1/successorder/successorder?backflag=waitpay&tuanflag=maverickbuy&productid=${productid}&extendmoney=${extendmoney}`,
          // })
          util.toast("支付失败")
        },
        'complete': function (res) { }
      })
    })
  },
  wxpay: function (orderIds) {
    util.request("/WxPay/PayOrder", {
      orderIds: orderIds,
      TradeType: 1
    }, "GET", false).then((res) => {
      console.log(res)
      util.request("/WxPay/OrderPay", {
        TradeNo: res.Msg
      }, "GET", false).then((res) => {
        console.log(res)
        if (res.data.payresult == 'true') {
          // wx.navigateTo({
          //   // url: '../../../extend-view1/',
          // })
        }
      })
    })
  }
})