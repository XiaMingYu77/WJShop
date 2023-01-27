// pages/mycenter-extend//checklogistic/checklogistic.js
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: 'orderlogistic'
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

    console.log(options)
    if (options.flag =='imdeliver') {
      var address=JSON.parse(options.address)
      this.setData({
        flag: options.flag,
        orderid: options.orderid,
        orderno:options.orderno,
        address:address,
        trackingno: options.TrackingNumber
      })
    } else if (options.flag == 'otherdeliver') {
      this.setData({
        flag: options.flag,
        trackingno: options.TrackingNumber,
        orderid: options.orderid,
        orderno: options.orderno
      })
    } else if (options.flag == 'barging') {
      var info = JSON.parse(options.info)
      console.log(info)
      this.setData({
        flag: options.flag,
        // trackingno: options.TrackingNumber,
        // orderid: options.orderid,
        // orderno: options.orderno
        info
      })
    } else if (options.flag == 'luckdraw') {
      var info = JSON.parse(options.info)
      console.log(info)
      this.setData({
        flag: options.flag,
        // trackingno: options.TrackingNumber,
        // orderid: options.orderid,
        // orderno: options.orderno
        info
      })
    }else {
      this.setData({
        // logisticno: options.logisticno,
        trackingno: options.TrackingNumber,
        // address: options.ReceiverAddress,
        orderid: options.orderid,
        // name:options.name
      })
    }


    if (options.flag == 'imdeliver') {
      util.request("/WxProOrders/GetWuLiuList", {
        nu: this.data.trackingno
        // nu:"4307701170344"
      }, "GET", false).then((res) => {
        console.log(res)
        this.setData({
          logistics: res.data
        })
      })
    } else if (options.flag == 'otherdeliver') {
      util.request("/WxProOrders/GetWuLiuList", {
        nu: this.data.trackingno
        // nu: "4307701170344"
      }, "GET", false).then((res) => {
        console.log(res)
        this.setData({
          logistics: res.data
        })
      })

      util.request("/WxProOrders/GetUserOrderInfo", {
        OrderId: this.data.orderid
        // OrderId:"CC012999C350485EB6D780E20DC8A158"
      }, "GET", false).then((res) => {
        console.log(res)
        this.setData({
          address: res.data
        })
      })
    } else if (options.flag == 'barging') {
      util.request("/WxProOrders/GetWuLiuList", {
        nu: this.data.info.F_LogisticsNo
        // nu: "4307701170344"
      }, "GET", false).then((res) => {
        if (res.Msg == '查询成功') {
          this.setData({
            logisticflag: true
          })
        } else {
          this.setData({
            logisticflag: false
          })
        }
        console.log(res)
        this.setData({
          logistics: res.data
        })
      })
    } else if (options.flag == 'luckdraw') {
      util.request("/WxProOrders/GetWuLiuList", {
        nu: this.data.info.F_LogisticsNo,
        // showType:1
        // nu: "4307701170344"
      }, "GET", false).then((res) => {
        if (res.Msg == '查询成功') {
          this.setData({
            logisticflag: true
          })
        } else {
          this.setData({
            logisticflag: false
          })
        }
        console.log(this.data.logisticflag)
        console.log(res, res.Msg)
        this.setData({
          logistics: res.data
        })
      })
    }else {
      util.request("/WxProOrders/SearchExp", {
        no: this.data.trackingno
        // no:"5432543252436543"
      }, "POST", false).then((res) => {
        console.log(res,res.Msg.length)
        if (res.Msg == '暂无物流信息！') {
          this.setData({
            logisticflag: false
          })
        }else{
          this.setData({
            logisticflag: true
          })
        }
        this.setData({
          msg: res.Msg,
          logistics: res.data
        })
      })

      util.request("/WxProOrders/GetUserOrderInfo", {
        OrderId: this.data.orderid
      }, "GET", false).then((res) => {
        console.log(res)
        this.setData({
          address: res.data
        })
      })
    }

    // 获取客服信息
    util.request("/WxOpen/GetCustomerService", {}, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        msg: res.Msg
      })
    })

  },
  back: function() {
    // var isshare = wx.getLaunchOptionsSync().scene
    // if (isshare == 1007 || isshare == 1008) {
    //   wx.reLaunch({
    //     url: '/pages/wujieindex/wujieindex'
    //   })
    // } else {
    //   wx.navigateBack()
    // }
    wx.navigateBack()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  tocustomerservice: function() {
    console.log(this.data.goodsid)
    console.log(this.data.msg)
    var msg = this.data.msg
    wx.navigateTo({
      url: `../../extend-view/news-extend/customerservice/customerservice?conversationID=${'C2C' + msg}`
    })
  }
})