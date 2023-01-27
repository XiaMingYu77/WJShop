// pages/mycenter-extend//myorder/myorder.js
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        name: "全部"
      },
      {
        name: "待付款"
      },
      {
        name: "待分享"
      },
      {
        name: "待发货"
      },
      {
        name: "待收货"
      },
      {
        name: "待评价"
      }
    ],
    selected: 0,
    flag: true,
    popupShow: false,
    activeindex: '0',
    modal: false,
    ordermodal: false,
    pageindex: 1,
    deletemodal: false
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

    var repercent = wx.getStorageSync("RePecent")
    var ratepercent = wx.getStorageSync("RatePecent")
    var ordinaryrepercent = wx.getStorageSync("OrdinaryRePecent")
    console.log(repercent, ratepercent)
    this.setData({
      repercent,
      ratepercent,
      ordinaryrepercent
    })
    if (options) {
      var cur = options.cur
      // var cur = 2
      console.log(options)
      this.setData({
        selected: cur,
        
        // selected: 2
      })
    }
    if(options.backflag){
      this.setData({
        backflag: options.backflag
      })
    }

    if (cur == '0') {
      util.request("/WxProOrders/GetUserOrders", {}, "POST", false).then((res) => {
        console.log(res)
        if (res.data.length == 0) {
          this.setData({
            alllist: res.data,
            flag: false,
            pageindex: 1
          })
        } else {
          this.setData({
            alllist: res.data,
            flag: true,
            pageindex: 1
          })
        }
      })
    } else if (cur == '1') {
      util.request("/WxProOrders/GetUserOrders", {
        Status: '1'
      }, "POST", false).then((res) => {
        console.log(res)
        if (res.data.length == 0) {
          this.setData({
            waitingpay: res.data,
            flag: false,
            pageindex: 1
          })
        } else {
          this.setData({
            waitingpay: res.data,
            flag: true,
            pageindex: 1
          })
        }
      })
    } else if (cur == '2') {
      util.request("/WxProOrders/GetUserOrders", {
        Status: '2'
      }, "POST", false).then((res) => {
        console.log(res)
        if (res.data.length == 0) {
          this.setData({
            waitingshare: res.data,
            flag: false,
            pageindex: 1
          })
        } else {
          this.setData({
            waitingshare: res.data,
            flag: true,
            pageindex: 1
          })
        }
      })
    } else if (cur == '3') {
      util.request("/WxProOrders/GetUserOrders", {
        Status: '3'
      }, "POST", false).then((res) => {
        console.log(res)
        console.log(res.data.length == 0)
        if (res.data.length == 0) {
          this.setData({
            waitingdeliver: res.data,
            flag: false,
            pageindex: 1
          })
        } else {
          this.setData({
            waitingdeliver: res.data,
            flag: true,
            pageindex: 1
          })
        }
      })
    } else if (cur == '4') {
      util.request("/WxProOrders/GetUserOrders", {
        Status: '4'
      }, "POST", false).then((res) => {
        console.log(res)
        console.log(res.data.length == 0)
        if (res.data.length == 0) {
          this.setData({
            waitingreceving: res.data,
            flag: false,
            pageindex: 1
          })
        } else {
          this.setData({
            waitingreceving: res.data,
            flag: true,
            pageindex: 1
          })
        }
      })
    } else if (cur == '5') {
      util.request("/WxProOrders/GetUserOrders", {
        Status: '5'
      }, "POST", false).then((res) => {
        console.log(res)
        console.log(res.data.length == 0)
        if (res.data.length == 0) {
          this.setData({
            waitingevaluate: res.data,
            flag: false,
            pageindex: 1
          })
        } else {
          this.setData({
            waitingevaluate: res.data,
            flag: true,
            pageindex: 1
          })
        }
      })
    } else {
      if (this.data.alllist.length == 0) {
        this.setData({
          flag: false,
          pageindex: 1
        })
      }
    }

    util.request("/WxRefundOrder/GetRefundRemark", {
      Type: 2
    }, "POST", false, true).then((res) => {
      this.setData({
        reason: res.data
      })
    })
  }, 
  back: function() {
    console.log(this.data.backflag)
    if (this.data.backflag){
      console.log(11111)
      wx.switchTab({
        url: '../../mycenter/mycenter',
      })
      return
    }
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
    var cur = this.data.selected
    if (cur == '0') {
      util.request("/WxProOrders/GetUserOrders", {}, "POST", false).then((res) => {
        console.log(res)
        if (res.data.length == 0) {
          this.setData({
            alllist: res.data,
            flag: false,
            pageindex: 1
          })
        } else {
          this.setData({
            alllist: res.data,
            flag: true,
            pageindex: 1
          })
        }
      })
    } else if (cur == '1') {
      util.request("/WxProOrders/GetUserOrders", {
        Status: '1'
      }, "POST", false).then((res) => {
        console.log(res)
        if (res.data.length == 0) {
          this.setData({
            waitingpay: res.data,
            flag: false,
            pageindex: 1
          })
        } else {
          this.setData({
            waitingpay: res.data,
            flag: true,
            pageindex: 1
          })
        }
      })
    }
    else if (cur == '2') {
      util.request("/WxProOrders/GetUserOrders", {
        Status: '2'
      }, "POST", false).then((res) => {
        console.log(res)
        if (res.data.length == 0) {
          this.setData({
            waitingshare: res.data,
            flag: false,
            // pageindex: 1
          })
        } else {
          this.setData({
            waitingshare: res.data,
            flag: true,
            // pageindex: 1
          })
        }
      })
    } 
    // else if (cur == '3') {
    //   util.request("/WxProOrders/GetUserOrders", {
    //     Status: '3'
    //   }, "POST", false).then((res) => {
    //     console.log(res)
    //     console.log(res.data.length == 0)
    //     if (res.data.length == 0) {
    //       this.setData({
    //         waitingdeliver: res.data,
    //         flag: false,
    //         pageindex: 1
    //       })
    //     } else {
    //       this.setData({
    //         waitingdeliver: res.data,
    //         flag: true,
    //         pageindex: 1
    //       })
    //     }
    //   })
    // } else if (cur == '4') {
    //   util.request("/WxProOrders/GetUserOrders", {
    //     Status: '4'
    //   }, "POST", false).then((res) => {
    //     console.log(res)
    //     console.log(res.data.length == 0)
    //     if (res.data.length == 0) {
    //       this.setData({
    //         waitingreceving: res.data,
    //         flag: false,
    //         // pageindex: 1
    //       })
    //     } else {
    //       this.setData({
    //         waitingreceving: res.data,
    //         flag: true,
    //         // pageindex: 1
    //       })
    //     }
    //   })
    // } 
    else if (cur == '5') {
      util.request("/WxProOrders/GetUserOrders", {
        Status: '5'
      }, "POST", false).then((res) => {
        console.log(res)
        console.log(res.data.length == 0)
        if (res.data.length == 0) {
          this.setData({
            waitingevaluate: res.data,
            flag: false,
            pageindex: 1
          })
        } else {
          this.setData({
            waitingevaluate: res.data,
            flag: true,
            pageindex: 1
          })
        }
      })
    }
    //else {
    //   if (this.data.alllist.length == 0) {
    //     this.setData({
    //       flag: false,
    //       // pageindex: 1
    //     })
    //   }
    // }
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
    var cur = this.data.selected
    if (cur == '0') {
      util.request("/WxProOrders/GetUserOrders", {}, "POST", false).then((res) => {
        console.log(res)
        if (res.data.length == 0) {
          this.setData({
            alllist: res.data,
            flag: false,
            pageindex: 1
          })
        } else {
          this.setData({
            alllist: res.data,
            flag: true,
            pageindex: 1
          })
        }
        wx.stopPullDownRefresh()
      })
    } else if (cur == '1') {
      util.request("/WxProOrders/GetUserOrders", {
        Status: '1',
        page: 1
      }, "POST", false).then((res) => {
        console.log(res)
        if (res.data.length == 0) {
          this.setData({
            waitingpay: res.data,
            flag: false,
            pageindex: 1
          })
        } else {
          this.setData({
            waitingpay: res.data,
            flag: true,
            pageindex: 1
          })
        }
        wx.stopPullDownRefresh()
      })
    } else if (cur == '2') {
      util.request("/WxProOrders/GetUserOrders", {
        Status: '2'
      }, "POST", false).then((res) => {
        console.log(res)
        if (res.data.length == 0) {
          this.setData({
            waitingshare: res.data,
            flag: false,
            pageindex: 1
          })
        } else {
          this.setData({
            waitingshare: res.data,
            flag: true,
            pageindex: 1
          })
        }
        wx.stopPullDownRefresh()
      })
    } else if (cur == '3') {
      util.request("/WxProOrders/GetUserOrders", {
        Status: '3'
      }, "POST", false).then((res) => {
        console.log(res)
        console.log(res.data.length == 0)
        if (res.data.length == 0) {
          this.setData({
            waitingdeliver: res.data,
            flag: false,
            pageindex: 1
          })
        } else {
          this.setData({
            waitingdeliver: res.data,
            flag: true,
            pageindex: 1
          })
        }
        wx.stopPullDownRefresh()
      })
    } else if (cur == '4') {
      util.request("/WxProOrders/GetUserOrders", {
        Status: '4'
      }, "POST", false).then((res) => {
        console.log(res)
        console.log(res.data.length == 0)
        if (res.data.length == 0) {
          this.setData({
            waitingreceving: res.data,
            flag: false,
            pageindex: 1
          })
        } else {
          this.setData({
            waitingreceving: res.data,
            flag: true,
            pageindex: 1
          })
        }
        wx.stopPullDownRefresh()
      })
    } else if (cur == '5') {
      util.request("/WxProOrders/GetUserOrders", {
        Status: '5'
      }, "POST", false).then((res) => {
        console.log(res)
        console.log(res.data.length == 0)
        if (res.data.length == 0) {
          this.setData({
            waitingevaluate: res.data,
            flag: false,
            pageindex: 1
          })
        } else {
          this.setData({
            waitingevaluate: res.data,
            flag: true,
            pageindex: 1
          })
        }
        wx.stopPullDownRefresh()
      })
    } else {
      if (this.data.alllist.length == 0) {
        this.setData({
          flag: false,
          pageindex: 1
        })
      }
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log(this.data.pageindex)
    var cur = this.data.selected
    console.log(111)
    if (cur == '0') {
      util.request("/WxProOrders/GetUserOrders", {
        page: this.data.pageindex + 1
      }, "POST", false).then((res) => {
        if (res.data.length == 0) {
          return
        }
        console.log(res)
        this.setData({
          alllist: this.data.alllist.concat(res.data),
          flag: true,
          pageindex: this.data.pageindex + 1
        })
        wx.stopPullDownRefresh()
      })
    } else if (cur == '1') {
      util.request("/WxProOrders/GetUserOrders", {
        Status: '1',
        page: this.data.pageindex + 1
      }, "POST", false).then((res) => {
        console.log(res)
        if (res.data.length == 0) {
          util.toast("暂无更多数据")
          return
        }
        this.setData({
          waitingpay: this.data.waitingpay.concat(res.data),
          flag: true,
          pageindex: this.data.pageindex + 1
        })
        wx.stopPullDownRefresh()
      })
    } else if (cur == '2') {
      util.request("/WxProOrders/GetUserOrders", {
        Status: '2',
        page: this.data.pageindex + 1
      }, "POST", false).then((res) => {
        console.log(res)
        if (res.data.length == 0) {
          util.toast("暂无更多数据")
          return
        }
        this.setData({
          waitingshare: this.data.waitingshare.concat(res.data),
          flag: true,
          pageindex: this.data.pageindex + 1
        })
        wx.stopPullDownRefresh()
      })
    } else if (cur == '3') {
      util.request("/WxProOrders/GetUserOrders", {
        Status: '3',
        page: this.data.pageindex + 1
      }, "POST", false).then((res) => {
        console.log(res)
        console.log(res.data.length == 0)
        if (res.data.length == 0) {
          util.toast("暂无更多数据")
          return
        }
        this.setData({
          waitingdeliver: this.data.waitingdeliver.concat(res.data),
          flag: true,
          pageindex: this.data.pageindex + 1
        })
        wx.stopPullDownRefresh()
      })
    } else if (cur == '4') {
      util.request("/WxProOrders/GetUserOrders", {
        Status: '4',
        page: this.data.pageindex + 1
      }, "POST", false).then((res) => {
        console.log(res)
        console.log(res.data.length == 0)
        if (res.data.length == 0) {
          util.toast("暂无更多数据")
          return
        }
        this.setData({
          waitingreceving: this.data.waitingreceving.concat(res.data),
          flag: true,
          pageindex: this.data.pageindex + 1
        })
        wx.stopPullDownRefresh()
      })
    } else if (cur == '5') {
      util.request("/WxProOrders/GetUserOrders", {
        Status: '5',
        page: this.data.pageindex + 1
      }, "POST", false).then((res) => {
        console.log(res)
        console.log(res.data.length == 0)
        if (res.data.length == 0) {
          util.toast("暂无更多数据")
          return
        }
        this.setData({
          waitingevaluate: this.data.waitingevaluate.concat(res.data),
          flag: true,
          pageindex: this.data.pageindex + 1
        })
        wx.stopPullDownRefresh()
      })
    }
  },
  change: function(e) {
    const cur = e.currentTarget.dataset.index
    console.log(cur)
    this.setData({
      selected: cur,
      flag: true
    })
    if (cur == '0') {
      util.request("/WxProOrders/GetUserOrders", {}, "POST", false).then((res) => {
        console.log(res)
        if (res.data.length == 0) {
          this.setData({
            alllist: res.data,
            flag: false,
            pageindex: 1
          })
        } else {
          this.setData({
            alllist: res.data,
            flag: true,
            pageindex: 1
          })
        }
      })
    } else if (cur == '1') {
      util.request("/WxProOrders/GetUserOrders", {
        Status: '1',
        page: 1
      }, "POST", false).then((res) => {
        console.log(res)
        if (res.data.length == 0) {
          this.setData({
            waitingpay: res.data,
            flag: false,
            pageindex: 1
          })
        } else {
          this.setData({
            waitingpay: res.data,
            flag: true,
            pageindex: 1
          })
        }
      })
    } else if (cur == '2') {
      util.request("/WxProOrders/GetUserOrders", {
        Status: '2'
      }, "POST", false).then((res) => {
        console.log(res)
        if (res.data.length == 0) {
          this.setData({
            waitingshare: res.data,
            flag: false,
            pageindex: 1
          })
        } else {
          this.setData({
            waitingshare: res.data,
            flag: true,
            pageindex: 1
          })
        }
      })
    } else if (cur == '3') {
      util.request("/WxProOrders/GetUserOrders", {
        Status: '3'
      }, "POST", false).then((res) => {
        console.log(res)
        console.log(res.data.length == 0)
        if (res.data.length == 0) {
          this.setData({
            waitingdeliver: res.data,
            flag: false,
            pageindex: 1
          })
        } else {
          this.setData({
            waitingdeliver: res.data,
            flag: true,
            pageindex: 1
          })
        }
      })
    } else if (cur == '4') {
      util.request("/WxProOrders/GetUserOrders", {
        Status: '4'
      }, "POST", false).then((res) => {
        console.log(res)
        console.log(res.data.length == 0)
        if (res.data.length == 0) {
          this.setData({
            waitingreceving: res.data,
            flag: false,
            pageindex: 1
          })
        } else {
          this.setData({
            waitingreceving: res.data,
            flag: true,
            pageindex: 1
          })
        }
      })
    } else if (cur == '5') {
      util.request("/WxProOrders/GetUserOrders", {
        Status: '5'
      }, "POST", false).then((res) => {
        console.log(res)
        console.log(res.data.length == 0)
        if (res.data.length == 0) {
          this.setData({
            waitingevaluate: res.data,
            flag: false,
            pageindex: 1
          })
        } else {
          this.setData({
            waitingevaluate: res.data,
            flag: true,
            pageindex: 1
          })
        }
      })
    } else {
      if (this.data.alllist.length == 0) {
        this.setData({
          flag: false,
          pageindex: 1
        })
      }
    }
  },
  applyrefund: function(e) {
    var orderid = e.currentTarget.dataset.orderid
    var price = e.currentTarget.dataset.price
    console.log(e)
    wx.navigateTo({
      url: `../applyrefund/applyrefund?orderid=${orderid}&price=${price}`
    })
  },
  checklogistic: function(e) {
    var logisticno = e.currentTarget.dataset.logisticno
    var TrackingNumber = e.currentTarget.dataset.trackingno
    var ReceiverAddress = e.currentTarget.dataset.address
    var orderid = e.currentTarget.dataset.orderid
    var name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `../checklogistic/checklogistic?logisticno=${logisticno}&TrackingNumber=${TrackingNumber}&ReceiverAddress=${ReceiverAddress}&orderid=${orderid}&name=${name}`
    })
  },
  toevaluatedetail: function(e) {
    var cur = e.currentTarget.dataset.current
    var index = e.currentTarget.dataset.index
    // cur = JSON.stringify(cur)
    wx.navigateTo({
      url: `../order-extend/evaluatedetail/evaluatedetail?order=${cur}&index=${index}`
    })
  },
  towaitinggoodsdetail: function(e) {
    var cur = e.currentTarget.dataset.current
    var index = e.currentTarget.dataset.index
    var content = e.currentTarget.dataset.content
    // console.log(index)
    // cur = JSON.stringify(cur)
    content = JSON.stringify(content)
    wx.navigateTo({
      url: `../order-extend/waitinggoodsdetail/waitinggoodsdetail?order=${cur}&index=${index}&content=${content}`
    })
  },
  towaitingdelivergoodsdetail: function(e) {
    var cur = e.currentTarget.dataset.current
    var index = e.currentTarget.dataset.index
    // cur = JSON.stringify(cur)
    wx.navigateTo({
      url: `../order-extend/waitingdelivergoodsdetail/waitingdelivergoodsdetail?order=${cur}&index=${index}`
    })
  },
  towaitingleaguedetail: function(e) {
    var cur = e.currentTarget.dataset.current
    var index = e.currentTarget.dataset.index
    var content = e.currentTarget.dataset.content
    // cur = JSON.stringify(cur)
    content = JSON.stringify(content)
    wx.navigateTo({
      url: `../order-extend/waitingleaguedetail/waitingleaguedetail?order=${cur}&index=${index}&content=${content}`
    })
  },
  towaitingpaymentdetail: function(e) {
    var cur = e.currentTarget.dataset.current
    var index = e.currentTarget.dataset.index
    var content = e.currentTarget.dataset.content
    // cur = JSON.stringify(cur)
    content = JSON.stringify(content)
    wx.navigateTo({
      url: `../order-extend/waitingpaymentdetail/waitingpaymentdetail?order=${cur}&index=${index}&content=${content}`
    })
  },
  cancleorder: function(e) {
    var cur = e.currentTarget.dataset.current;
    console.log(cur)
    var index = e.currentTarget.dataset.index;
    var content = e.currentTarget.dataset.content;
    var attr = e.currentTarget.dataset.attr
    console.log(index, attr)
    console.log(content)
    this.setData({
      orderid: cur,
      popupShow: true,
      index: index,
      attr: attr,
      content: content
    })
  },
  hidePopup: function() {
    this.setData({
      popupShow: false
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
    console.log(this.data.orderid)
    util.request("/WxProOrders/CancelOrder", {
      OrderID: this.data.orderid,
      Key: this.data.activeindex
    }, "GET", false).then((res) => {
      if (res.Msg == "请选择未付款订单！") {
        this.setData({
          popupShow: false
        })
        util.toast(res.Msg);
        return
      }
      console.log(res)
      var data = this.data.content;
      console.log(data)
      // // console.log(data[this.data.index].OrderProduct.length == 0)
      // if (data[this.data.index].OrderProduct.length==1){
      data.splice(this.data.index, 1)
      if (data.length == 0) {
        this.setData({
          flag: false
        })
      }
      // }else{
      //   data[this.data.index].OrderProduct.splice(this.data.attr, 1)
      // }
      if (this.data.selected == '1') {
        this.setData({
          popupShow: false
        })
        util.request("/WxProOrders/GetUserOrders", {
          Status: '1',
          page: 1
        }, "POST", false).then((res) => {
          console.log(res)
          if (res.data.length == 0) {
            this.setData({
              waitingpay: res.data,
              flag: false,
              pageindex: 1,
              popupShow: false
            })
          } else {
            this.setData({
              waitingpay: res.data,
              flag: true,
              pageindex: 1,
              popupShow: false
            })
          }
        })
      } else if (this.data.selected == '2') {
        this.setData({
          popupShow: false
        })
        util.request("/WxProOrders/GetUserOrders", {
          Status: '2'
        }, "POST", false).then((res) => {
          console.log(res)
          if (res.data.length == 0) {
            this.setData({
              waitingshare: res.data,
              flag: false,
              pageindex: 1,
              popupShow: false
            })
          } else {
            this.setData({
              waitingshare: res.data,
              flag: true,
              pageindex: 1,
              popupShow: false
            })
          }
        })
      } else {
        this.setData({
          alllist: data,
          popupShow: false
        })
      }
      util.toast(res.Msg)
    })
  },
  hidemodal: function() {
    console.log(111)
    this.setData({
      modal: false
    })
  },
  confirmdeliver: function(e) {
    var cur = e.currentTarget.dataset.current;
    this.setData({
      orderid: cur,
      modal: true
    })
  },
  confirm: function() {
    util.request("/WxProOrders/Receiving", {
      OrderID: this.data.orderid
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        modal: false
      })
      util.toast("确认收获成功!")
      util.request("/WxProOrders/GetUserOrders", {
        Status: '4'
      }, "POST", false).then((res) => {
        console.log(res)
        console.log(res.data.length == 0)
        if (res.data.length == 0) {
          this.setData({
            waitingreceving: res.data,
            flag: false,
            pageindex: 1
          })
        } else {
          this.setData({
            waitingreceving: res.data,
            flag: true,
            pageindex: 1
          })
        }
      })
    })
  },
  hide: function() {
    this.setData({
      ordermodal: false
    })
  },
  showmodal: function() {
    this.setData({
      ordermodal: true
    })
  },
  allclick: function() {

  },
  urgedeliver: function(e) {
    var orderid = e.currentTarget.dataset.current
    util.request("/WxProOrders/RushSendProduct", {
      OrderID: orderid
    }, "GET", false).then((res) => {
      console.log(res)
      util.toast(res.Msg)
    })
  },
  togoodsdetail: function(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `../../extend-view/proDetail/proDetail?id=${id}`,
    })
  },
  toinviteassemble: function(e) {
    var orderno = e.currentTarget.dataset.orderno;
    var memberid = e.currentTarget.dataset.memberid
    console.log(orderno, memberid)
    wx.navigateTo({
      url: `../../extend-view1/inviteassemble/inviteassemble?orderno=${orderno}&memberid=${memberid}`
    })
  },
  delayreceipt: function(e) {
    var orderid = e.currentTarget.dataset.current;
    util.request("/WxProOrders/DelayExp", {
      OrderID: orderid
    }, "GET", false).then((res) => {
      console.log(res)
      util.toast(res.Msg)
    })
  },
  topublishevaluation: function(e) {
    var cur = e.currentTarget.dataset.current;
    // cur = JSON.stringify(cur)
    console.log(cur)
    wx.navigateTo({
      url: '../publishevaluation/publishevaluation?flag=order&data=' + cur,
    })
  },
  alllistclick: function(e) {
    var cur = e.currentTarget.dataset.current;
    var status = e.currentTarget.dataset.status;
    if (status == 1) {
      wx.navigateTo({
        url: `../order-extend/waitingpaymentdetail/waitingpaymentdetail?order=${cur}`
      })
    } else if (status == 2) {
      wx.navigateTo({
        url: `../order-extend/waitingleaguedetail/waitingleaguedetail?order=${cur}`
      })
    } else if (status == 3) {
      wx.navigateTo({
        url: `../order-extend/waitingdelivergoodsdetail/waitingdelivergoodsdetail?order=${cur}`
      })
    } else if (status == 4) {
      wx.navigateTo({
        url: `../order-extend/waitinggoodsdetail/waitinggoodsdetail?order=${cur}`
      })
    } else if (status == 5) {
      wx.navigateTo({
        url: `../order-extend/evaluatedetail/evaluatedetail?order=${cur}`
      })
    } else if (status == 6) {
      wx.navigateTo({
        url: `../order-extend/transactionclose/transactionclose?order=${cur}`
      })
    } else {
      wx.navigateTo({
        url: `../order-extend/evaluatedetail/evaluatedetail?order=${cur}&flag=true`
      })
    }
  },
  topay: function(e) {
    var that=this
    var cur = e.currentTarget.dataset.current
    var productid = e.currentTarget.dataset.proid
    var score = e.currentTarget.dataset.score / this.data.repercent
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
          wx.navigateTo({
            url: `../../extend-view1/successorder/successorder?backflag=waitpay&tuanflag=maverickbuy&productid=${productid}&extendmoney=${extendmoney}`,
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
  // wxpay: function(orderIds) {
  //   util.request("/WxPay/PayOrder", {
  //     orderIds: orderIds,
  //     TradeType: 1
  //   }, "GET", false).then((res) => {
  //     console.log(res)
  //     util.request("/WxPay/OrderPay", {
  //       TradeNo: res.Msg
  //     }, "GET", false).then((res) => {
  //       console.log(res)
  //       if (res.data.payresult == 'true') {
  //         // wx.navigateTo({
  //         //   // url: '../../../extend-view1/',
  //         // })
  //       }
  //     })
  //   })
  // },
  deleteorder: function(e) {
    var cur = e.currentTarget.dataset.current
    this.setData({
      orderid: cur,
      deletemodal: true
    })

  },
  hidemodal1: function() {
    this.setData({
      deletemodal: false
    })
  },
  confirm1: function() {
    var cur=this.data.orderid
    util.request("/WxRefundOrder/RemoveOrder", {
      orderId: cur
    }, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        deletemodal: false
      })
      if (this.data.selected == '0') {
        util.request("/WxProOrders/GetUserOrders", {}, "POST", false).then((res) => {
          console.log(res)
          if (res.data.length == 0) {
            this.setData({
              alllist: res.data,
              flag: false,
              pageindex: 1
            })
          } else {
            this.setData({
              alllist: res.data,
              flag: true,
              pageindex: 1
            })
          }
        })
      } else {
        util.request("/WxProOrders/GetUserOrders", {
          Status: '5'
        }, "POST", false).then((res) => {
          console.log(res)
          console.log(res.data.length == 0)
          if (res.data.length == 0) {
            this.setData({
              waitingevaluate: res.data,
              flag: false,
              pageindex: 1
            })
          } else {
            this.setData({
              waitingevaluate: res.data,
              flag: true,
              pageindex: 1
            })
          }
        })
      }
    })
  },
  refresh:function(){
    this.onLoad()
  }
})