const util = require('../../../../utils/util.js')
const date = new Date()
const days = ["今天", "明天", "后天"]
const hours = []
const minutes = []

// for (let i = 1990; i <= date.getFullYear(); i++) {
//   years.push(i)
// }

// for (let i = 0; i <= 24; i++) {
//   hours.push(i)
// }

// for (let i = 0; i <= 60; i++) {
//   minutes.push(i)
// }

Page({
  data: {
    hasCoupon: true,
    insufficient: false,
    value1: 1,
    selected: 1,
    modal1: false,
    days: days,
    day: "今天",
    hours: hours,
    hour: 10,
    minutes: minutes,
    minute: 9,
    value: ["", 9, 9],
    selected1: 2,
    tuanId: '',
    modal: false,
    remark: "",
    quantity:1
  },
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
    var isnew = wx.getStorageSync("isnew")
    console.log(repercent, ratepercent)
    this.setData({
      repercent,
      ratepercent
    })
    // console.log(options.address)
    console.log(options)
    this.setData({
      RecordID: options.id
    })
    util.request("/WxTuanOrder/SubmitBargainOrderPre", {
      RecordID: this.data.RecordID
    }, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        addressList: res.data.addressList,
        productInfo: res.data.productInfo,
        shopinfo: res.data.shopbase
      })
      this.setData({
        productInfo: this.data.productInfo
      })
      console.log(this.data.productInfo)
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
  onShow(options) {
    //获取默认地址
    util.request("/WxUserAddress/GetUserAddre", {

    }, "POST", false).then((res) => {
      console.log(res.data)
      if (res.data.length == 0) {
        this.setData({
          addressList: null,
          modal: true
        })
        return
      }
      if (res.data.length == 1) {
        this.setData({
          addressList: res.data[0]
        })
      }
    })
  },
  chooseAddr() {
    this.setData({
      modal: false
    })
    wx.navigateTo({
      url: "../../mall-extend/address/address?flag=true"
    })
  },
  btnPay() {
    wx.navigateTo({
      url: "../success/success"
    })
  },
  change: function(e) {
    if (this.data.isnew == 'true') {
      util.toast("该商品新用户限购一件")
    } else {
      this.setData({
        quantity: e.detail.value
      })
    }
  },
  selectpay: function(e) {
    let cur = e.currentTarget.dataset.current;
    this.setData({
      selected: cur
    })
  },
  bindChange: function(e) {
    const data = new Date()
    const val = e.detail.value
    this.setData({
      day: this.data.days[val[0]],
      hour: this.data.hours[val[1]],
      minute: this.data.minutes[val[2]]
    })
    console.log(this.data.day)
    console.log(data.getDate())
    console.log(data.getMonth())
  },
  checktype: function(e) {
    const cur = e.currentTarget.dataset.index;
    // console.log(cur);
    this.setData({
      selected1: cur
    })
  },
  getInput: function(e) {
    console.log(e.detail.value)
    this.setData({
      remark: e.detail.value
    })
  },
  topay: function() {
    var that = this
    console.log(this.data.remark)
    console.log(this.data.tuanflag)
    console.log(this.data.addressList)
    if (this.data.addressList == null) {
      util.toast("请填写地址")
      return
    }
    console.log("砍价下单购买")
    util.request("/WxTuanOrder/SubmitBargainOrder", {
      RecordID: this.data.RecordID,
      addressId: this.data.addressList.ReceiverAddressID,
      remark: this.data.remark
    }, "GET", false).then((res) => {
      console.log(res)
      console.log(res.data.orderId)
      util.request("/WxPay/PayOrder", {
        orderIds: res.data.orderId,
        TradeType: 3
      }, "GET", false).then((res) => {
        console.log(res)
        wx.requestPayment({
          'timeStamp': res.data.WxPay.timeStamp,
          'nonceStr': res.data.WxPay.nonceStr,
          'package': res.data.WxPay.package,
          'signType': 'MD5',
          'paySign': res.data.WxPay.paySign,
          'success': function(res) {
            console.log("支付成功")
            util.taskcomplete(1)
            wx.reLaunch({
              url: `../../../extend-view1/successorder/successorder?backflag=barging&tuanflag=cartshop&extendmoney=0&returnmoney=0&productid=${that.data.productid}`,
            })
          },
          'fail': function(res) {
            console.log("支付失败")
            wx.reLaunch({
              url: `../../../mycenter-extend/myorder/myorder?cur=0&backflag=true`,
            })
          },
          'complete': function(res) {}
        })
      })
    })
  },
  hidemodal: function() {
    this.setData({
      modal: false
    })
  }
})