// pages/mycenter-extend//order-extend/waitingleaguedetail/waitingleaguedetail.js
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // popupShow:false,
    ordermodal: false,
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
      orderid:options.order
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

    util.request("/WxRefundOrder/GetRefundRemark", {
      Type: 2
    }, "POST", false, true).then((res) => {
      this.setData({
        reason: res.data
      })
    })
   

    // console.log(this.data.orderproduct)

    // util.request("/WxProOrders/GetUserOrders", {
    //   OrderID: this.data.order.OrderID
    // }, "POST", false).then((res) => {
    //   console.log(res)
    // })
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
  hide: function() {
    this.setData({
      ordermodal: false
    })
  },
  showmodal: function() {
    this.setData({
      popupShow: true
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
      console.log(prevPage)
      // var data = this.data.content;
      // // console.log(data)
      // // // console.log(data[this.data.index].OrderProduct.length == 0)
      // // if (data[this.data.index].OrderProduct.length==1){
      // data.splice(this.data.index, 1)
      // // }else{
      // //   data[this.data.index].OrderProduct.splice(this.data.attr, 1)
      // // }
      // // if (prevPage.data.selected == '1') {
      // prevPage.setData({
      //   waitingshare: data
      // })
      // // } else if (prevPage.data.selected == '2') {
      // //   prevPage.setData({
      // //     waitingshare: data
      // //   })
      // // }
      // prevPage.refresh()

      util.toast("取消订单成功")
      setTimeout(() => {
        wx.navigateBack({

        })
      }, 500)
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
  hide1: function() {
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
  toinviteassemble: function(e) {
    var orderno = e.currentTarget.dataset.orderno;
    var memberid = e.currentTarget.dataset.memberid
    console.log(orderno, memberid)
    wx.navigateTo({
      url: `../../../extend-view1/inviteassemble/inviteassemble?orderno=${orderno}&memberid=${memberid}`
    })
  },
  hidePopup:function(){
    this.setData({
      popupShow:false
    })
  }
})