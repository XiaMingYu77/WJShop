// pages/mycenter-extend//order-extend/waitingdelivergoodsdetail/waitingdelivergoodsdetail.js\
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modal: false
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
      console.log(str)
      str = str.slice(6)
      str = str.substring(0, str.length - 2);
      var time = util.timestampToTime1(str)
      console.log(time)

      console.log(order, options.index)
      this.setData({
        order: order,
        orderproduct: order.OrderProduct,
        time: time
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
    console.log(orderid, price)
    wx.navigateTo({
      url: `../../applyrefund/applyrefund?orderid=${orderid}&price=${price}`
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
    // var msg = '13017312662'
    wx.navigateTo({
      url: `../../../extend-view/news-extend/customerservice/customerservice?conversationID=${'C2C' + this.data.msg}`,
    })
  },
  urgedeliver: function(e) {
    var orderid = e.currentTarget.dataset.current
    util.request("/WxProOrders/RushSendProduct", {
      OrderID: orderid
    }, "GET", false).then((res) => {
      console.log(res)
      util.toast(res.Msg)
    })
  }
})