const util = require('../../../../utils/util.js')
const date = new Date()
const days = ["今天", "明天", "后天"]
const hours = []
const minutes = []

// for (let i = 1990; i <= date.getFullYear(); i++) {
//   years.push(i)
// }

for (let i = 0; i <= 24; i++) {
  hours.push(i)
}

for (let i = 0; i <= 60; i++) {
  minutes.push(i)
}

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
    isassemble: true,
    modal: false,
    remark: "",
    customodal: false,
    name: "",
    idnumber: ""
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
    console.log(repercent, ratepercent)
    this.setData({
      repercent,
      ratepercent
    })
    if (options) {
      this.setData({
        cartid: options.cartid
      })
    }

    util.request("/WxTuanOrder/SubmitCartOrderPre", {
      cartId: this.data.cartid
    }, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        isBonded: res.data.IsBonded,
        cartshoplist: res.data.cartshoplist
      })
      if (res.data.addressList != null) {
        this.setData({
          addressList: res.data.addressList,
          addressid: res.data.addressList.ReceiverAddressID
        })
      } else {
        this.setData({
          modal: true
        })
      }
      console.log(this.data.cartshoplist.length)
      var arr = []
      for (var i = 0; i < this.data.cartshoplist.length; i++) {
        arr[i] = ''
      }
      this.setData({
        inputarr: arr
      })

      var num = 0;
      for (var i = 0; i < res.data.cartshoplist.length; i++) {
        var data = res.data.cartshoplist[i].Cartlist
        console.log(data)
        for (var j = 0; j < data.length; j++) {
          num += data[j].MarketPrice * data[j].Quantity
        }
      }
      this.setData({
        totalprice: num.toFixed(2)
      })
    })
  },
  clickassemble: function(e) {

    this.setData({
      isassemble: !this.data.isassemble
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
  onShow: function() {
    util.request("/WxTuanOrder/SubmitCartOrderPre", {
      cartId: this.data.cartid
    }, "POST", false).then((res) => {
      console.log(res)
      if (res.data.addressList == null) {
        this.setData({
          addressList: null,
          modal: true
        })
        return
      }
      if (res.data.addressList.length == 1) {
        this.setData({
          addressList: res.data.addressList
        })
      }
      // if (res.data.length > 1) {
      //   this.setData({
      //     addressList: res.data[0]
      //   })
      // }
      // console.log(this.data.address)
      // if (this.data.address) {
      //   var address = JSON.parse(this.data.address)
      //   this.setData({
      //     addressList: address
      //   })
      // }
    })
  },
  chooseAddr() {
    wx.navigateTo({
      url: "../address/address?flag=true"
    })
  },
  btnPay() {
    wx.navigateTo({
      url: "../success/success"
    })
  },
  change: function(e) {
    this.setData({
      value: e.detail.value
    })
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
      selected1: cur,
      modal1: true
    })
  },
  hideaddress: function() {
    this.setData({
      modal1: false
    })
  },
  /**
   * 是否拼团
   */
  isassemble: function(e) {
    console.log(e)
    var cur = e.currentTarget.dataset.current;
    var ProductID = e.currentTarget.dataset.productid;
    var GoodsID = e.currentTarget.dataset.goodsid;
    console.log(cur, ProductID, GoodsID)
    console.log(e.currentTarget.dataset.current)
    util.request("/WxShopCart/ChangeCartProductTuan", {
      ProductID: ProductID,
      GoodsID: GoodsID,
      CartFrom: cur
    }, "GET", false).then((res) => {
      console.log(res)
      util.request("/WxTuanOrder/SubmitCartOrderPre", {
        cartId: this.data.cartid
      }, "POST", false).then((res) => {
        console.log(res)
        this.setData({
          addressList: res.data.addressList,
          cartshoplist: res.data.cartshoplist
        })
        console.log(this.data.cartshoplist)
        var num = 0;
        for (var i = 0; i < res.data.cartshoplist.length; i++) {
          var data = res.data.cartshoplist[i].Cartlist
          console.log(data)
          for (var j = 0; j < data.length; j++) {
            num += data[j].MarketPrice * data[j].Quantity
          }
        }
        this.setData({
          totalprice: num.toFixed(2)
        })
      })
    })
  },
  input: function(e) {
    var cur = e.currentTarget.dataset.current;
    var value = e.detail.value
    var arr = this.data.inputarr;
    arr[cur] = value;
    this.setData({
      inputarr: arr
    })
    console.log(this.data.inputarr, this.data.cartshoplist)
  },
  pay: function() {
    if (this.data.addressList == null) {
      util.toast("请填写地址")
      return
    }
    var regName = /^[\u4e00-\u9fa5]{2,4}$/;
    var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (this.data.isBonded && !regName.test(this.data.name) && !regIdNo.test(this.data.idnumber)) {
      this.setData({
        customodal: true
      })
      return false;
    }  
    var cartlist = this.data.cartshoplist
    console.log(cartlist)
    for (var i = 0; i < cartlist[0].Cartlist.length; i++) {
      cartlist[0].Cartlist[i].Remark = this.data.inputarr[i]
    }
    console.log(this.data.addressid, cartlist)
    console.log(JSON.stringify(cartlist))
    console.log(this.data.addressid, cartlist)
    util.request("/WxTuanOrder/SubmitCartOrder", {
      addressId: this.data.addressid,
      cartlist: JSON.stringify(cartlist),
      RealName: this.data.name,
      IDNumber: this.data.idnumber
    }, "POST", false).then((res) => {
      console.log(res)
      // console.log(res.data.orderId)
      if (res.data == "isNoInventory") {
        util.toast("你选择的商品中含有库存不足的商品,请重新选择")
      } else {
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
              wx.navigateTo({
                url: '../../../extend-view1/successorder/successorder?backflag=cartpay&tuanflag=' + "cartshop",
              })
              util.taskcomplete(1)
            },
            'fail': function(res) {
              console.log("支付失败")
              wx.navigateTo({
                url: `../../../mycenter-extend/myorder/myorder?cur=0&backflag=true`,
              })
            },
            'complete': function(res) {}
          })
        })

      }
    })
  },
  hidemodal: function() {
    this.setData({
      modal: false
    })
  },
  hidecustomodal: function () {
    this.setData({
      customodal: false,
      name: "",
      idnumber: ""
    })
  },
  getname: function (e) {
    console.log(e)
    this.setData({
      name: e.detail.value
    })
  },
  getidnumber: function (e) {
    console.log(e)
    this.setData({
      idnumber: e.detail.value
    })
  },
  customodalsubmit: function () {
    var regName = /^[\u4e00-\u9fa5]{2,4}$/;
    if (!regName.test(this.data.name)) {
      util.toast("真实姓名填写有误")
      return false;
    }
    var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!regIdNo.test(this.data.idnumber)) {
      util.toast("身份证号填写有误")
      return false;
    }
    this.setData({
      customodal: false
    })
  }
})