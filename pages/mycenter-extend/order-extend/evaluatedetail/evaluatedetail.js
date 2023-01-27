// pages/mycenter-extend//order-extend/evaluatedetail/evaluatedetail.js
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modal: false,
    flag:false
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
    if(options.flag){
      this.setData({
        flag:options.flag
      })
    }
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
        var list = res.data.list[0]
        let str = list.time
        str = str.slice(6)
        str = str.substring(0, str.length - 2);
        list.time = util.timestampToTime1(str * 1)
        this.setData({
          logistics: res.data,
          list
        })
      })
    })

    



    // var order = JSON.parse(options.order)
    // var str = order.OrderTime
    // console.log(str)
    // str = str.slice(6)
    // str = str.substring(0, str.length - 2);
    // var a = new Date(str * 1);
    // var nian = a.getFullYear(); //年
    // var yue = a.getMonth() + 1; //月
    // var tian = a.getDate(); //天
    // var hour = a.getHours();
    // var minute = a.getMinutes();
    // var second = a.getSeconds()
    // var time = nian + "-" + yue + "-" + tian + " " + hour + ":" + minute + ":" + second
    // // console.log(time)
    // console.log(order.OrderProduct)
    // console.log(order, options.index)
    // this.setData({
    //   order: order,
    //   orderproduct: order.OrderProduct,
    //   time: time
    // })

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
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
  togoodsdetail: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `../../../extend-view/proDetail/proDetail?id=${id}`,
    })
  },
  topublishevaluation: function (e) {
    var cur = e.currentTarget.dataset.current;
    // cur = JSON.stringify(cur)
    console.log(cur)
    wx.navigateTo({
      url: '../../publishevaluation/publishevaluation?flag=orderdetail&data=' + cur,
    })
  },
  deleteorder: function (e) {
    var cur = e.currentTarget.dataset.current
    util.request("/WxRefundOrder/RemoveOrder", {
      orderId: cur
    }, "POST", false).then((res) => {
      console.log(res)
      if (res.Msg == '删除成功') {
        util.toast("删除成功")
        setTimeout(() => {
          wx.navigateBack({

          })
        }, 500)
      } else {
        util.toast("删除失败")
      }
    })
  },
  checklogistic: function (e) {
    var TrackingNumber = e.currentTarget.dataset.trackingno
    var orderid = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: `../../checklogistic/checklogistic?TrackingNumber=${TrackingNumber}&orderid=${orderid}`
    })
  }
})