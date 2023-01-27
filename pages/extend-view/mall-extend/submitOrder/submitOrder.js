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
    customodal:false,
    name:"",
    idnumber:""
  },
  onLoad: function(options) {
    this.setData({
      goodid: options.goodid
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
      isnew: isnew
    })
    if (options.tuanId) {
      this.setData({
        tuanId: options.tuanId
      })
    }
    if (options.extendmoney) {
      this.setData({
        extendmoney: options.extendmoney,
        returnmoney: options.returnmoney
      })
    }
    if (options.OrderSource){
      this.setData({
        OrderSource: options.OrderSource
      })
      console.log("OrderSource  " + options.OrderSource)
    }
    this.setData({
      productid: options.productid,
      goodid: options.goodid,
      quantity: Number(options.quantity),
      storage: options.storage,
      tuanflag: options.tuanflag,
      linkflag:options.linkflag
      // productid: "654793",
      // goodid: "4543089",
      // quantity: "1",
      // storage:"10"
    })
    if (options.address) {
      console.log(options.address)
      this.setData({
        addressList: JSON.parse(options.address)
      })
    }
    console.log(options)
    util.request("/WxTuanOrder/SubmitTuanOrderPre", {
      productid: this.data.productid,
      goodid: this.data.goodid
    }, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        isBonded: res.data.IsBonded,
        // addressList: res.data.addressList,
        productInfo: res.data.productInfo,
        shopinfo: res.data.shopbase
      })
      // console.log(this.data.address)
      if (this.data.addressList == null || this.data.addressList == '') {
        this.setData({
          addressList: res.data.addressList
        })
      }

      // var product = this.data.productInfo;
      // // console.log(product)
      // product.tuanflag = ""
      // var pro = JSON.parse(product.productRule).root
      // console.log(product)
      // for (var i = 0; i < pro.length; i++) {
      //   console.log(pro[i].specVal[0].val)
      //   pro[i] = pro[i].specVal[0].val
      // }
      // product.productRule = pro

      // product.productRule = [JSON.parse(product.productRule).root[0].specVal[0].val, JSON.parse(product.productRule).root[1].specVal[0].val]
      // console.log(JSON.parse(product.productRule).root[0].specVal[0].val)
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
    // util.request("/WxTuanOrder/SubmitTuanOrderPre", {
    //   productid: this.data.productid,
    //   goodid: this.data.goodid
    // }, "POST", false).then((res) => {
    //   console.log(res.data)
    //   if (res.data.addressList.length == 1) {
    //     this.setData({
    //       addressList: res.data.addressList
    //     })
    //   }
    // })

    // util.request("/WxTuanOrder/SubmitTuanOrderPre", {
    //   productid: this.data.productid,
    //   goodid: this.data.goodid
    // }, "POST", false).then((res) => {
    //   console.log(res)
    //   if (res.data.addressList == null) {
    //     this.setData({
    //       addressList: null,
    //       modal: true
    //     })
    //     return
    //   } else {
    //     this.setData({
    //       addressList: res.data.addressList
    //     })
    //   }
    // })

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
      // if (res.data.length > 1){
      //   this.setData({
      //     addressList: res.data[0]
      //   })
      // }
      // if (res.data.length != 0) {
      //   this.setData({
      //     address: res.data[0],
      //     addressid: res.data[0].AddressID
      //   })
      // }
    })
  },
  chooseAddr() {
    this.setData({
      modal: false
    })
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
    var regName = /^[\u4e00-\u9fa5]{2,4}$/;
    var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (this.data.isBonded&&!regName.test(this.data.name) && !regIdNo.test(this.data.idnumber)) {
      this.setData({
        customodal:true
      })
      return false;
    }  
    if (this.data.tuanflag == 'attendgroup') {
      console.log('参与拼团')
      util.request("/WxTuanOrder/SubmitTuanOrder", {
        productId: this.data.productid,
        goodId: this.data.goodid,
        quantity: this.data.quantity,
        tuanId: this.data.tuanId,
        addressId: this.data.addressList.ReceiverAddressID,
        remark: this.data.remark,
        RealName:this.data.name,
        IDNumber:this.data.idnumber,
        OrderSource:this.data.OrderSource
      }, "GET", false).then((res) => {
        if(res.Code==400){
          util.toast(res.Msg)
          that.setData({
            customodal:true
          })
          return
        }
        console.log(res)
        console.log(res.data.orderId)
        var id = res.data.orderId
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
              wx.navigateTo({
                url: `../../../extend-view1/successorder/successorder?tuanflag=${that.data.tuanflag}&extendmoney=${that.data.extendmoney}&returnmoney=${that.data.returnmoney}&backflag=orderpay&productid=${that.data.productid}&orderid=${id}&linkflag=${that.data.linkflag}`
              })
            },
            'fail': function(res) {
              console.log("支付失败")
              wx.redirectTo({
                url: `../../../mycenter-extend/myorder/myorder?cur=0`,
              })
            },
            'complete': function(res) {}
          })
        })
      })
    } else if (this.data.tuanflag == 'maverickbuy') {
      console.log("单独购买")
      util.request("/WxTuanOrder/SubmitNoOrder", {
        productId: this.data.productid,
        goodId: this.data.goodid,
        quantity: this.data.quantity,
        addressId: this.data.addressList.ReceiverAddressID,
        remark: this.data.remark,
        RealName: this.data.name,
        IDNumber: this.data.idnumber,
        OrderSource: this.data.OrderSource
      }, "GET", false).then((res) => {
        if (res.Code == 400) {
          util.toast(res.Msg)
          that.setData({
            customodal: true
          })
          return
        }
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
              wx.navigateTo({
                url: `../../../extend-view1/successorder/successorder?backflag=orderpay&tuanflag=${that.data.tuanflag}&extendmoney=${that.data.extendmoney}&returnmoney=${that.data.returnmoney}&productid=${that.data.productid}`,
              })
            },
            'fail': function(res) {
              console.log("支付失败")
              wx.redirectTo({
                url: `../../../mycenter-extend/myorder/myorder?cur=0`,
              })
            },
            'complete': function(res) {}
          })
        })

      })
    } else {
      console.log("发起拼团")
      util.request("/WxTuanOrder/SubmitTuanOrder", {
        productId: this.data.productid,
        goodId: this.data.goodid,
        quantity: this.data.quantity,
        addressId: this.data.addressList.ReceiverAddressID,
        remark: this.data.remark,
        RealName: this.data.name,
        IDNumber: this.data.idnumber,
        OrderSource: this.data.OrderSource
      }, "GET", false).then((res) => {
        if (res.Code == 400) {
          util.toast(res.Msg)
          that.setData({
            customodal: true
          })
          return
        }
        var orderid = res.data.orderId
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
              let pages = getCurrentPages(); // 当前页的数据，可以输出来看看有什么东西
              let prevPage = pages[pages.length - 2];
              // prevPage.setData({
              //   goodsid: this.data.productid
              // })
              prevPage.onShow()
              setTimeout(() => {
                wx.navigateBack({})
                prevPage.setData({
                  modal3: true,
                  assemblerecash: that.data.productInfo.scorce * that.data.repercent * that.data.quantity,
                  timeList: 86400,
                  orderid: orderid
                })
              }, 1000)
            },
            'fail': function(res) {
              console.log("支付失败")
              wx.redirectTo({
                url: `../../../mycenter-extend/myorder/myorder?cur=0`,
              })
            },
            'complete': function(res) {}
          })
        })

      })
    }
  },
  hidemodal: function() {
    this.setData({
      modal: false
    })
  },
  hidecustomodal:function(){
    this.setData({
      customodal:false,
      name:"",
      idnumber:""
    })
  },
  getname:function(e){
    console.log(e)
    this.setData({
      name:e.detail.value
    })
  },
  getidnumber: function (e) {
    console.log(e)
    this.setData({
      idnumber: e.detail.value
    })
  },
  customodalsubmit:function(){
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
      customodal:false
    })  
  }
})