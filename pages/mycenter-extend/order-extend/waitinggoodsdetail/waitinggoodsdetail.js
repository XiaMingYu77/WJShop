// pages/mycenter-extend//order-extend/waitinggoodsdetail/waitinggoodsdetail.js
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modal: false,
    modal1: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var repercent = wx.getStorageSync("RePecent")
    this.setData({
      repercent
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
      str = str.slice(6)
      str = str.substring(0, str.length - 2);
      var time = util.timestampToTime1(str * 1)
      var str1 = order.ShipTime
      str1 = str1.slice(6)
      str1 = str1.substring(0, str1.length - 2);
      var shiptime = util.timestampToTime1(str1 * 1)
      console.log(time)

      console.log(util.timestampToTime1(str * 1))

      console.log(order, options.index)
      this.setData({
        order: order,
        orderproduct: order.OrderProduct,
        time: time,
        shiptime
      })

      util.request("/WxProOrders/SearchExp", {
        no: this.data.order.TrackingNumber
        // no:"5432543252436543"
      }, "POST", false).then((res) => {
        console.log(res)
        if (res.Msg == '暂无物流信息！') {
          this.setData({
            logisticflag: false
          })
        } else {
          var list = res.data.list[0]
          let str = list.time
          str = str.slice(6)
          str = str.substring(0, str.length - 2);
          list.time = util.timestampToTime1(str * 1)
          this.setData({
            logistics: res.data,
            logisticflag: true,
            list
          })
        }
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
  applyrefund: function(e) {
    var orderid = e.currentTarget.dataset.orderid
    var price = e.currentTarget.dataset.price
    console.log(e)
    wx.navigateTo({
      url: `../../applyrefund/applyrefund?orderid=${orderid}&price=${price}`
    })
    console.log(orderid)
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
  tocustomerservice: function() {
    console.log(this.data.msg)
    wx.navigateTo({
      url: `../../../extend-view/news-extend/customerservice/customerservice?conversationID=${'C2C' + this.data.msg}`,
    })
  },
  checklogistic: function(e) {
    var TrackingNumber = e.currentTarget.dataset.trackingno
    var orderid = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: `../../checklogistic/checklogistic?TrackingNumber=${TrackingNumber}&orderid=${orderid}`
    })
  },
  delayreceipt: function(e) {
    var orderid = e.currentTarget.dataset.orderid;
    console.log(orderid)
    util.request("/WxProOrders/DelayExp", {
      OrderID: orderid
    }, "GET", false).then((res) => {
      console.log(res)
      util.toast(res.Msg)
    })
  },
  hidemodal: function() {
    this.setData({
      modal1: false
    })
  },
  confirmdeliver: function() {
    this.setData({
      modal1: true
    })
  },
  confirm: function() {
    util.request("/WxProOrders/Receiving", {
      OrderID: this.data.order.OrderID
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        modal1: false
      })
      util.toast(res.Msg)
      setTimeout(() => {
        var waitingreceving = this.data.content
        let pages = getCurrentPages(); // 当前页的数据，可以输出来看看有什么东西
        let prevPage = pages[pages.length - 2]; // 上一页的数据，也可以输出来看看有什么东西
        waitingreceving.splice(this.data.index, 1)
        prevPage.setData({
          waitingreceving: waitingreceving
        })
        if (waitingreceving.length == 0) {
          prevPage.setData({
            flag: false
          })
        }
        wx.navigateBack({

        })
      }, 500)
    })
  }
})