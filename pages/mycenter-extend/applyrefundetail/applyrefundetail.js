// pages/mycenter-extend//applyrefundetail/applyrefundetail.js
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 2,
    modal: false
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

    this.setData({
      chargebackid: options.id,
      status: options.status
    })
    console.log(options)
    util.request("/WxOrderChargeback/GetOrderChargebackApplyForModel", {
      ChargebackId: this.data.chargebackid
    }, "GET", false).then((res) => {
      console.log(res)
      var data = res.data
      var str = data.OrderTime
      str = str.slice(6)
      str = str.substring(0, str.length - 2);
      data.OrderTime = util.timestampToTime1(str * 1)
      if (data.EndTime) {
        var strtime = data.EndTime
        strtime = new Date(strtime.replace(/-/g, '/'));
        var time1 = strtime.getTime();
        var time2 = (new Date()).valueOf()
        var time = (time1 - time2)/1000
        console.log(time)
        this.setData({
          time
        })
      }
      if (data.CustomerAgreeEndTime){
        var strtime = data.CustomerAgreeEndTime
        strtime = new Date(strtime.replace(/-/g, '/'));
        var time1 = strtime.getTime();
        var time2 = (new Date()).valueOf()
        var time3 = (time1 - time2) / 1000
        console.log(time)
        this.setData({
          time3
        })
      }
      data.UploadingUrl = data.UploadingUrl.split(",")
      for (var i = 0; i < data.UploadingUrl.length;i++){
        if (data.UploadingUrl[i]==""){
          data.UploadingUrl.splice(i,1)
        }
      }
      this.setData({
        info: data
      })
      console.log(data)
    })

    util.request("/WxOpen/GetCustomerService ", {}, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        msg: res.Msg
      })
    })
  },
  formatDuring: function(mss) {
    var days = parseInt(mss / (1000 * 60 * 60 * 24));
    var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = ((mss % (1000 * 60)) / 1000).toFixed(0);
    return days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒 ";
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
    util.request("/WxOrderChargeback/GetOrderChargebackApplyForModel", {
      ChargebackId: this.data.chargebackid
    }, "GET", false).then((res) => {
      console.log(res)
      var data = res.data
      var str = data.OrderTime
      str = str.slice(6)
      str = str.substring(0, str.length - 2);
      data.OrderTime = util.timestampToTime1(str * 1)
      if (data.EndTime) {
        var strtime = data.EndTime
        strtime = new Date(strtime.replace(/-/g, '/'));
        var time1 = strtime.getTime();
        var time2 = (new Date()).valueOf()
        var time = (time1 - time2) / 1000
        console.log(time)
        this.setData({
          time
        })
      }
      data.UploadingUrl = data.UploadingUrl.split(",")
      for (var i = 0; i < data.UploadingUrl.length; i++) {
        if (data.UploadingUrl[i] == "") {
          data.UploadingUrl.splice(i, 1)
        }
      }
      this.setData({
        info: data
      })
      wx.stopPullDownRefresh()
    })
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
  copy: function(e) {
    console.log(e.currentTarget.dataset.current)
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
  },
  tocustomerservice: function() {
    console.log(this.data.msg)
    wx.navigateTo({
      url: `../../extend-view/news-extend/customerservice/customerservice?conversationID=${'C2C' + this.data.msg}`,
    })
  },
  showmodal: function() {
    this.setData({
      modal: true
    })
  },
  hidemodal: function() {
    this.setData({
      modal: false
    })
  },
  revoke: function(e) {
    var cur = e.currentTarget.dataset.current
    util.request("/WxOrderChargeback/SetChargebackApplyFor", {
      ChargebackId: cur
    }, "GET", false).then((res) => {
      console.log(res)
      if (res.Msg == '操作成功') {
        util.toast("撤销成功")
        setTimeout(() => {
          wx.navigateBack({

          })
        }, 500)
      } else {
        util.toast("撤销失败")
      }
    })
  },
  tofillinnum: function(e) {
    var cur = e.currentTarget.dataset.current
    wx.navigateTo({
      url: '../fillinnum/fillinnum?id=' + cur,
    })
  },
  change: function(e) {
    var orderid = e.currentTarget.dataset.orderid
    var price = e.currentTarget.dataset.price
    var chargebackid = e.currentTarget.dataset.chargebackid
    console.log(e)
    wx.navigateTo({
      url: `../applyrefund/applyrefund?orderid=${orderid}&price=${price}&chargebackid=${chargebackid}&changeflag=true`
    })
  },
  confirmreceipt:function(e){
    var cur = e.currentTarget.dataset.current
    util.request("/WxOrderChargeback/confirmGoodByBuyer", {
      ChargebackId: cur
    }, "POST", false).then((res) => {
      console.log(res)
      if (res.Msg == '操作成功') {
        util.toast("确认收货成功")
        setTimeout(() => {
          wx.navigateBack({

          })
        }, 500)
      } else {
        util.toast("确认收货失败")
      }
    })
  },
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    var images = this.data.info.UploadingUrl
    console.log(images)
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },
  tochecklogistic:function(e){
    var status = e.currentTarget.dataset.status
    if (status=='5'){
      var address={
        name: this.data.info.ReplacementContact,
        phone: this.data.info.ReplacementContactInformation,
        address: this.data.info.ReplacementAddress
      }
      address = JSON.stringify(address)
      wx.navigateTo({
        url: `../checklogistic/checklogistic?flag=imdeliver&address=${address}&orderid=${this.data.info.OrderId}&orderno=${this.data.info.OrdersNo}&TrackingNumber=${this.data.info.TrackingNumber}`,
      })
    }else{
      wx.navigateTo({
        url: `../checklogistic/checklogistic?flag=otherdeliver&TrackingNumber=${this.data.info.ReplacementLogisticsFirm}&orderid=${this.data.info.OrderId}&orderno=${this.data.info.OrdersNo}`,
      })
    }
  }
})