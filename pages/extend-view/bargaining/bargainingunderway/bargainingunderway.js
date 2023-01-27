// pages/extend-view//bargaining/bargainingunderway/bargainingunderway.js
const util = require('../../../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activelength: 345,
    timeList: 1000,
    flag: true,
    tabindex: 0,
    rulemodal: false,
    remindmodal: false,
    goodsid: "0e78e066c42a4a9d86a02244a6cefc02",
    choosemodelflag: false, //选择规格弹框
    hasaddress: false, //选择地址弹框
    successmodal: false, //砍价成功弹框
    address: "",
    taskcompleteflag: true,
    memid: wx.getStorageSync("MemID"),
    alltimeflag: false, //该商品倒计时结束
    timeflag: true, //任务倒计时结束
    browseflag: true, //浏览弹窗
    browermoney: 0, //浏览砍价money
    shareflag: true, //分享弹窗
    sharemoney: "", //分享砍价money
    buyflag: true, //购买弹窗
    buymoney: "", //购买金钱
    timeendflag: true, //时间到了就砍
    timeendmoney: 0, //时间到了就砍money
    evaluateflag: true, //评价弹窗
    evaluatemoney: "", //购买金钱
    pageindex: 1,
    allmoney: 0,
    pageindex: 1,
    selectedCurrent: [],
    selectedAttr: [],
    selectedname: [],
    bargingrecordid: "",
    buyandevaluateflag: true,
    invitenum: "",
    F_BargainAmount: 0,

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

    var isshare = wx.getLaunchOptionsSync().scene
    this.setData({
      isshare
    })

    console.log(app.globalData.paymoney, app.globalData.evaluatemoney)
    // 判断有无砍价
    // util.request("/WxBargain/IsOnlyOneBargain", {
    // }, "GET", false).then((res) => {
    //   console.log(res)
    //   this.setData({
    //     flag: res.data
    //   })
    // })

    console.log(options)
    if (options.memid) {
      this.setData({
        memid: options.memid,
        backflag: true
      })
    } else {
      this.setData({
        memid: wx.getStorageSync("MemID")
      })
    }
    if (options.bargingrecordid) {
      this.setData({
        bargingrecordid: options.bargingrecordid
      })
    }

    if (options.invitenum) {
      this.setData({
        invitenum: options.invitenum
      })
    }

    // if (!wx.getStorageSync("sessionId")) {
    //   wx.navigateTo({
    //     url: '../../../login/login?backflag=detail&invitenum=' + this.data.invitenum
    //   })
    // }

    if (this.data.memid != wx.getStorageSync("MemID")) {
      this.setData({
        flag: false
      })
    } else {
      this.setData({
        flag: true
      })
    }

    //获取砍价列表
    // util.request("/WxProductData/GetProductInfo", {
    //   id: this.data.goodsid
    // }, "POST", false).then((res) => {
    //   console.log(res)
    //   // if (res.data.data == '该商品已下架') {
    //   //   util.toast("")
    //   //   return
    //   // }

    //   this.setData({
    //     banner: res.data.ImgList,
    //     infoModel: res.data.InfoModel,
    //     storage: res.data.InfoModel.Storage,
    //     marketPrice: res.data.InfoModel.MarketPrice,
    //     Shop: res.data.Shop[0],
    //     modalimg: res.data.InfoModel.FullImg
    //   })

    //   var productrule = JSON.parse(this.data.infoModel.ProductRule)
    //   console.log(productrule)
    //   this.setData({
    //     productrule: productrule
    //   })
    // })

    //获取地址信息
    util.request("/WxUserAddress/GetUserAddre", {}, "POST", false).then((res) => {
      console.log(res.data)
      this.setData({
        addresslist: res.data
      })
    })

    // 获取规则
    util.request("/WxDocumenInfo/GetDocumenInfo", {
      Type: "cf8096bd4f1f439e8af6e29c9ade4d8c"
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        rulecontent: res.data.list[0].Content
      })
    })

    // 获取我的砍价信息
    util.request("/WxBargain/MyBargainInfo", {
      ID: this.data.bargingrecordid,
      Memid: this.data.memid,
      F_HelpMemberID: wx.getStorageSync("MemID")
    }, "GET", false).then((res) => {
      console.log(this.data.bargingrecordid, wx.getStorageSync("MemID"))
      console.log(res)
      this.setData({
        bargingrecordid:res.data.ID
      })
      // if (!res.data) {
      //   util.toast("该砍价已结束")
      //   return
      // }
      var str = res.data.DateTime * 1
      console.log(util.timestampToTime2(str * 1))
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      console.log(str, timestamp, res.data.F_NegotiatedAmount, res.data.F_NegotiatedAmount + res.data.RemainingAmount)
      var timeList = str - timestamp
      this.setData({
        F_NegotiatedAmount: res.data.F_NegotiatedAmount,
        RemainingAmount: res.data.RemainingAmount,
        FullImg: res.data.FullImg,
        ProductName: res.data.ProductName,
        Photo: res.data.Photo,
        NickName: res.data.NickName,
        totalamount: res.data.F_NegotiatedAmount + res.data.RemainingAmount,
        BargainPurchasePrice: res.data.BargainPurchasePrice,
        Storage: res.data.Storage,
        timeList,
        GangChopStatus: res.data.GangChopStatus,
        F_BargainAmount: res.data.F_BargainAmount,
        ID: res.data.ID
      })
      // if (!this.data.alltimeflag) {
      //   let query = wx.createSelectorQuery()
      //   query.select('.line').boundingClientRect((rect) => {
      //     this.setData({
      //       linewidth: rect.width
      //     })
      //     console.log(rect.width)
      //     var a = this.data.F_NegotiatedAmount * rect.width / this.data.totalamount * 2
      //     console.log(a)
      //     this.setData({
      //       activelength: a
      //     })
      //   }).exec()
      // }
    })

    // 获取砍价记录
    util.request("/WxBargain/GetDetailsList", {
      Memid: wx.getStorageSync("MemID"),
      PageIndex: 1
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        recordlist: res.data
      })
    })
  },
  back: function() {
    console.log(getCurrentPages())
    var isshare = this.data.isshare
    console.log(isshare)
    if (this.data.backflag) {
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
  onShow: function(options) {
    console.log(options)
    if (!wx.getStorageSync("sessionId")) {
      wx.navigateTo({
        url: '../../../login/login?backflag=detail&invitenum=' + this.data.invitenum
      })
    }

    console.log(wx.getStorageSync('paymoney'), wx.getStorageSync('evaluatemoney'))
    if (wx.getStorageSync('paymoney') != "") {
      this.setData({
        buyandevaluateflag: false,
        buyflag: false,
        allmoney: this.data.allmoney + Number(wx.getStorageSync('paymoney'))
      })
    }
    if (wx.getStorageSync('evaluatemoney') != "") {
      this.setData({
        buyandevaluateflag: false,
        evaluateflag: false,
        allmoney: this.data.allmoney + Number(wx.getStorageSync('evaluatemoney'))
      })
    }
    if (wx.getStorageSync('sharemoney') != "") {
      this.setData({
        buyandevaluateflag: false,
        shareflag: false,
        allmoney: this.data.allmoney + Number(wx.getStorageSync('sharemoney'))
      })
    }

    if (this.data.memid != wx.getStorageSync("MemID")) {
      this.setData({
        flag: false
      })
    } else {
      this.setData({
        flag: true
      })
    }
    console.log(this.data.flag)

    //判断有无砍价
    util.request("/WxBargain/IsOnlyOneBargain", {}, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        hasbarginginfo: res.data
      })
    })

    // 获取我的砍价信息
    util.request("/WxBargain/MyBargainInfo", {
      ID: this.data.bargingrecordid,
      Memid: this.data.memid,
      F_HelpMemberID: wx.getStorageSync("MemID")
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        bargingrecordid:res.data.ID
      })
      if (!res.data.Status) {
        // util.toast("该砍价已结束")
        this.setData({
          alltimeflag: true
        })
        return
      }
      var str = res.data.DateTime * 1
      console.log(util.timestampToTime2(str * 1))
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      console.log(str, timestamp, res.data.F_NegotiatedAmount, res.data.F_NegotiatedAmount + res.data.RemainingAmount)
      var timeList = str - timestamp
      this.setData({
        F_NegotiatedAmount: res.data.F_NegotiatedAmount,
        RemainingAmount: res.data.RemainingAmount,
        FullImg: res.data.FullImg,
        ProductName: res.data.ProductName,
        Photo: res.data.Photo,
        NickName: res.data.NickName,
        totalamount: res.data.F_NegotiatedAmount + res.data.RemainingAmount,
        BargainPurchasePrice: res.data.BargainPurchasePrice,
        Storage: res.data.Storage,
        timeList,
        GangChopStatus: res.data.GangChopStatus,
        F_BargainAmount: res.data.F_BargainAmount,
        ID: res.data.ID
      })
      if (!this.data.alltimeflag) {
        let query = wx.createSelectorQuery()
        query.select('.line').boundingClientRect((rect) => {
          this.setData({
            linewidth: rect.width
          })
          console.log(rect.width)
          // var a = this.data.F_NegotiatedAmount * rect.width / this.data.totalamount
          // console.log(a)
          // this.setData({
          //   activelength: a
          // })
        }).exec()
      }
    })

    //获取砍价任务
    util.request("/WxBargain/GetTaskList", {
      Memid: wx.getStorageSync("MemID")
    }, "GET", false).then((res) => {
      console.log(res)
      var str1 = res.data[4].BargainTimeStamp * 1
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      console.log(str1, timestamp)
      var timeList2 = str1 - timestamp
      console.log(timeList2)
      if (timeList2 <= 0) {
        this.setData({
          timeflag: true
        })
      } else {
        this.setData({
          timeflag: false
        })
      }
      this.setData({
        tasklist: res.data,
        timeList2
      })
    })

    //获取地址信息
    util.request("/WxUserAddress/GetUserAddre", {}, "POST", false).then((res) => {
      console.log(res.data)
      this.setData({
        addresslist: res.data
      })
    })

    // 获取砍价记录
    util.request("/WxBargain/GetDetailsList", {
      Memid: wx.getStorageSync("MemID"),
      PageIndex: 1
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        recordlist: res.data
      })
    })

    util.request("/WxBargain/BargainIndex", {
      ID: "6b72b004a7094a11a8e49c722b44ee7c",
      PageIndex: 1,
      PageSize: 10
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        barginglist: res.data
      })
    })
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
    //判断有无砍价
    util.request("/WxBargain/IsOnlyOneBargain", {}, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        hasbarginginfo: res.data
      })
    })

    // 获取我的砍价信息
    util.request("/WxBargain/MyBargainInfo", {
      ID: this.data.bargingrecordid,
      Memid: this.data.memid,
      F_HelpMemberID: wx.getStorageSync("MemID")
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        bargingrecordid: res.data.ID
      })
      if (!res.data.Status) {
        // util.toast("该砍价已结束")
        this.setData({
          alltimeflag: true
        })
        return
      }
      var str = res.data.DateTime * 1
      console.log(util.timestampToTime2(str * 1))
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      console.log(str, timestamp, res.data.F_NegotiatedAmount, res.data.F_NegotiatedAmount + res.data.RemainingAmount)
      var timeList = str - timestamp
      this.setData({
        F_NegotiatedAmount: res.data.F_NegotiatedAmount,
        RemainingAmount: res.data.RemainingAmount,
        FullImg: res.data.FullImg,
        ProductName: res.data.ProductName,
        Photo: res.data.Photo,
        NickName: res.data.NickName,
        totalamount: res.data.F_NegotiatedAmount + res.data.RemainingAmount,
        BargainPurchasePrice: res.data.BargainPurchasePrice,
        Storage: res.data.Storage,
        timeList,
        GangChopStatus: res.data.GangChopStatus,
        F_BargainAmount: res.data.F_BargainAmount,
        ID: res.data.ID
      })
      if (!this.data.alltimeflag) {
        let query = wx.createSelectorQuery()
        query.select('.line').boundingClientRect((rect) => {
          this.setData({
            linewidth: rect.width
          })
          console.log(rect.width)
          var a = this.data.F_NegotiatedAmount * rect.width / this.data.totalamount * 2
          console.log(a)
          this.setData({
            activelength: a
          })
        }).exec()
      }
      wx.stopPullDownRefresh()
    })

    //获取砍价任务
    util.request("/WxBargain/GetTaskList", {
      Memid: wx.getStorageSync("MemID")
    }, "GET", false).then((res) => {
      console.log(res)
      var str1 = res.data[4].BargainTimeStamp * 1
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      console.log(str1, timestamp)
      var timeList2 = str1 - timestamp
      console.log(timeList2)
      if (timeList2 <= 0) {
        this.setData({
          timeflag: true
        })
      } else {
        this.setData({
          timeflag: false
        })
      }
      this.setData({
        tasklist: res.data,
        timeList2
      })
    })

    // 获取砍价记录
    util.request("/WxBargain/GetDetailsList", {
      Memid: wx.getStorageSync("MemID"),
      PageIndex: 1
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        recordlist: res.data
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    util.request("/WxBargain/BargainIndex", {
      ID: "6b72b004a7094a11a8e49c722b44ee7c",
      PageIndex: this.data.pageindex + 1,
      PageSize: 10
    }, "GET", false).then((res) => {
      console.log(res)
      if (res.data.length == 0) {
        util.toast("暂无更多数据")
        return
      }
      this.setData({
        barginglist: this.data.barginglist.concat(res.data),
        pageindex: this.data.pageindex + 1
      })
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    if (!wx.getStorageSync("sessionId")) {
      wx.navigateTo({
        url: '../../../login/login?backflag=detail&invitenum=' + this.data.invitenum
      })
    }

    util.request("/WxBargain/FinishTheTask", {
      Memid: this.data.memid,
      ID: '0040b79dad164f08abcbcb340947d415'
    }, "GET", true).then((res) => {
      console.log(res)
      if (res.data.F_Status == '0') {
        wx.setStorageSync("sharemoney", res.data.F_BargainAmount)
      } else if (res.data.F_Status == '2') {
        wx.reLaunch({
          url: '../bargingrecord/bargingrecord?backflag=true',
        })
      }
    })
    console.log(this.data.memid, this.data.bargingrecordid)
    return {
      title: "一起来砍价吧",
      // title: `☛仅剩一个名额☚我${this.data.info.TuanPrice}元拼了${this.data.info.ProductName}`,
      path: `/pages/extend-view/bargaining/bargainingunderway/bargainingunderway?memid=${wx.getStorageSync("MemID")}&bargingrecordid=${this.data.bargingrecordid}`,
      // imageUrl: this.data.info.ThumbnailImg,
      success: function(res) {
        console.log("转发成功")
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      },
      complete: function(res) {
        console.log("转发完成")
      }
    }
  },
  tabchange: function(e) {
    console.log(e)
    var tabindex = e.currentTarget.dataset.index
    this.setData({
      tabindex
    })
  },
  hiderulemodal: function() {
    this.setData({
      rulemodal: false
    })
  },
  showrulemodal: function() {
    this.setData({
      rulemodal: true
    })
  },
  tobargingrecord: function() {
    wx.navigateTo({
      url: '../bargingrecord/bargingrecord',
    })
  },
  showremindmodal: function() {
    this.setData({
      remindmodal: true
    })
  },
  hideremindmodal: function() {
    this.setData({
      remindmodal: false
    })
  },
  hidemodelflag: function() {
    this.setData({
      choosemodelflag: false
    })
  },
  hidetaskcomplete: function() {
    this.setData({
      taskcompleteflag: false
    })
  },
  clickaddress: function(e) {
    console.log(e.currentTarget.dataset.current)
    this.setData({
      address: e.currentTarget.dataset.current
    })
  },
  toaddress: function() {
    // if (!wx.getStorageSync("sessionId")) {
    //   wx.navigateTo({
    //     url: '../../login/login?backflag=detail'
    //   })
    //   return
    // }
    wx.navigateTo({
      url: '../../mall-extend/editAddress/editAddress?prodetail=' + true,
    })
  },
  hidehasaddress: function() {
    this.setData({
      hasaddress: false
    })
  },
  hidesuccessmodal: function() {
    this.setData({
      successmodal: false
    })
  },
  gotocomplete: function(e) {
    var sort = e.currentTarget.dataset.sort
    var id = e.currentTarget.dataset.id
    console.log(sort)
    if (sort == 1) {
      var arr = ['1', '3', '4', '5', '7', '8']
      var num = Math.floor(Math.random() * 6);
      console.log(num)
      util.bannerclick(arr[num], "", id)
    } else if (sort == 2) {
      this.setData({
        taskid: id
      })
    } else if (sort == 3) {
      this.setData({
        taskid: id
      })
    } else if (sort == 4) {
      var arr = ['1', '3', '4', '5', '7', '8']
      var num = Math.floor(Math.random() * 6);
      util.bannerclick(arr[num], "")
    } else if (sort == 5) {
      console.log(111)
      util.request("/WxBargain/FinishTheTask", {
        Memid: this.data.memid,
        ID: id
      }, "GET", false).then((res) => {
        console.log(res)
        if (res.data.F_Status == 2) {
          wx.reLaunch({
            url: '../bargingrecord/bargingrecord?backflag=true',
          })
        }
        if (res.data.F_Status == 0) {
          var str = `你砍掉了${res.data.F_BargainAmount}元`
          util.toast(str)
          this.setData({
            bargingtask: res.data,
            timeendmoney: res.data.F_BargainAmount,
            timeendflag: false
          })
        }

        util.request("/WxBargain/MyBargainInfo", {
          ID: this.data.bargingrecordid,
          Memid: this.data.memid,
          F_HelpMemberID: wx.getStorageSync("MemID")
        }, "GET", false).then((res) => {
          console.log(res)
          if (!res.data.Status) {
            // util.toast("该砍价已结束")
            this.setData({
              alltimeflag: true
            })
            return
          }
          var str = res.data.DateTime * 1
          console.log(util.timestampToTime2(str * 1))
          var timestamp = Date.parse(new Date());
          timestamp = timestamp / 1000;
          console.log(str, timestamp)
          var timeList = str - timestamp
          this.setData({
            F_NegotiatedAmount: res.data.F_NegotiatedAmount,
            RemainingAmount: res.data.RemainingAmount,
            FullImg: res.data.FullImg,
            ProductName: res.data.ProductName,
            Photo: res.data.Photo,
            NickName: res.data.NickName,
            totalamount: res.data.F_NegotiatedAmount + res.data.RemainingAmount,
            BargainPurchasePrice: res.data.BargainPurchasePrice,
            Storage: res.data.Storage,
            timeList,
            ID: res.data.ID
          })
          let query = wx.createSelectorQuery()
          query.select('#line').boundingClientRect((rect) => {
            this.setData({
              activelength: rect.width * 2
            })
            console.log(rect)
          }).exec()
        })

        //获取砍价任务
        util.request("/WxBargain/GetTaskList", {
          Memid: wx.getStorageSync("MemID")
        }, "GET", false).then((res) => {
          console.log(res)
          var str1 = res.data[4].BargainTimeStamp * 1
          var timestamp = Date.parse(new Date());
          timestamp = timestamp / 1000;
          console.log(str1, timestamp)
          var timeList2 = str1 - timestamp
          console.log(timeList2)
          if (timeList2 <= 0) {
            this.setData({
              timeflag: true
            })
          } else {
            this.setData({
              timeflag: false
            })
          }
          this.setData({
            tasklist: res.data,
            timeList2
          })
        })
      })
    } else {
      wx.navigateTo({
        url: '../../../mycenter-extend/myevaluation/myevaluation',
      })
    }
  },
  endOfTime: function() {
    this.setData({
      timeflag: true
    })
  },
  allendOfTime: function() {
    this.setData({
      alltimeflag: true
    })
  },
  clickbrowseflag: function() {
    console.log(111)
    this.setData({
      browseflag: true
    })
  },
  clickbuyflag: function() {
    this.setData({
      buyandevaluateflag: true,
      allmoney:0
    })
    wx.setStorageSync('paymoney', "")
    wx.setStorageSync('evaluatemoney', "")
    wx.setStorageSync('sharemoney', "")
  },
  clicktimeendflag: function() {
    this.setData({
      timeendflag: true
    })
  },
  clickevaluateflag: function() {
    this.setData({
      evaluateflag: true
    })
    wx.setStorageSync(evaluatemoney, "")
  },
  seemore: function() {
    util.request("/WxBargain/GetDetailsList", {
      Memid: wx.getStorageSync("MemID"),
      PageIndex: this.data.pageindex + 1
    }, "GET", false).then((res) => {
      console.log(res)
      if (res.data.length == 0) {
        util.toast("暂无更多数据")
        return
      }
      this.setData({
        recordlist: this.data.recordlist.concat(res.data),
        pageindex: this.data.pageindex + 1
      })
    })
  },
  scrolltotasklist: function() {
    let query = wx.createSelectorQuery()
    query.select('.task').boundingClientRect((rect) => {
      this.setData({
        tasktop: rect.top
      })
      wx.pageScrollTo({
        scrollTop: 500
      });
    }).exec()
  },
  helphe: function() {
    if (!wx.getStorageSync("sessionId")) {
      wx.navigateTo({
        url: '../../../login/login?backflag=detail&invitenum=' + this.data.invitenum
      })
    }

    console.log(this.data.memid, this.data.bargingrecordid, wx.getStorageSync("MemID"))
    util.request("/WxBargain/FinishTheTask", {
      F_HelpMemberID: wx.getStorageSync("MemID"),
      Memid: this.data.memid,
      ID: "27e48cefa6b141c18a5b595fb84c5507"
    }, "GET", false).then((res) => {
      if (res.Code == '401' || res.Code == '400') {
        wx.navigateTo({
          url: '../../../login/login?backflag=detail&invitenum=' + this.data.invitenum
        })
        return
      }
      console.log(res)
        this.setData({
          F_BargainAmount: res.data.F_BargainAmount,
          successmodal: true
        })
        util.request("/WxBargain/MyBargainInfo", {
          ID: this.data.bargingrecordid,
          Memid: this.data.memid,
          F_HelpMemberID: wx.getStorageSync("MemID")
        }, "GET", false).then((res) => {
          console.log(res)
          if (!res.data.Status) {
            // util.toast("该砍价已结束")
            this.setData({
              alltimeflag: true
            })
            return
          }
          var str = res.data.DateTime * 1
          console.log(util.timestampToTime2(str * 1))
          var timestamp = Date.parse(new Date());
          timestamp = timestamp / 1000;
          console.log(str, timestamp, res.data.F_NegotiatedAmount, res.data.F_NegotiatedAmount + res.data.RemainingAmount)
          var timeList = str - timestamp
          this.setData({
            F_NegotiatedAmount: res.data.F_NegotiatedAmount,
            RemainingAmount: res.data.RemainingAmount,
            FullImg: res.data.FullImg,
            ProductName: res.data.ProductName,
            Photo: res.data.Photo,
            NickName: res.data.NickName,
            totalamount: res.data.F_NegotiatedAmount + res.data.RemainingAmount,
            BargainPurchasePrice: res.data.BargainPurchasePrice,
            Storage: res.data.Storage,
            timeList,
            GangChopStatus: res.data.GangChopStatus,
            F_BargainAmount: res.data.F_BargainAmount,
            ID: res.data.ID
          })
          if (!this.data.alltimeflag) {
            let query = wx.createSelectorQuery()
            query.select('.line').boundingClientRect((rect) => {
              this.setData({
                linewidth: rect.width
              })
              console.log(rect.width)
              var a = this.data.F_NegotiatedAmount * rect.width / this.data.totalamount * 2
              console.log(a)
              this.setData({
                activelength: a
              })
            }).exec()
          }
        })
    })
  },
  startbarging: function(e) {
    console.log(this.data.flag)
    // if (this.data.flag) {
    //   util.toast("您已有砍价中的商品")
    //   return
    // }
    if (this.data.hasbarginginfo) {
      this.setData({
        remindmodal: true
      })
      return;
    }



    var id = e.currentTarget.dataset.id
    var img = e.currentTarget.dataset.img
    var storage = e.currentTarget.dataset.storage
    var productrule = JSON.parse(e.currentTarget.dataset.productrule)
    var name = e.currentTarget.dataset.name
    console.log(id)
    this.setData({
      id,
      choosemodelflag: true,
      modalimg: img,
      storage,
      productrule,
      name,
      selectedCurrent: [],
      selectedAttr: [],
      selectedname: []
    })
  },
  choosemodel: function(e) {
    this.setData({
      value: 1
    })
    // console.log(e)
    console.log(e.currentTarget.dataset.current, e.currentTarget.dataset.attrIndex);
    console.log(e.currentTarget.dataset.name);

    // console.log(e.currentTarget.dataset.attrIndex)
    var nowCurrent = this.data.selectedCurrent;
    var nowAttr = this.data.selectedAttr;
    var selectedname = this.data.selectedname;
    nowCurrent[e.currentTarget.dataset.current - 1] = e.currentTarget.dataset.current;
    nowAttr[e.currentTarget.dataset.current - 1] = e.currentTarget.dataset.attrIndex;
    selectedname[e.currentTarget.dataset.current - 1] = e.currentTarget.dataset.name
    this.setData({
      selectedCurrent: nowCurrent,
      selectedAttr: nowAttr,
      selectedname: selectedname
    })
    console.log(this.data.selectedCurrent, this.data.selectedAttr, this.data.selectedname)
    var modalstr = ''
    for (var i = 0; i < this.data.selectedname.length; i++) {
      if (this.data.selectedname[i] !== undefined) {
        modalstr += this.data.selectedname[i] + ","
      }
    }
    var reg = /,$/gi;
    modalstr = modalstr.replace(reg, "");
    console.log(modalstr)
    this.setData({
      modalstr: modalstr
    })
    // console.log(this.data.productrule[e.currentTarget.dataset.current - 1].specVal[e.currentTarget.dataset.attrIndex].val)
    // console.log(e.currentTarget.dataset.current, e.currentTarget.dataset.attrIndex)
    // console.log(nowCurrent[e.currentTarget.dataset.current - 1]);
    // console.log(this.data.productrule[e.currentTarget.dataset.current - 1].specVal[e.currentTarget.dataset.attrIndex].val)
    util.request("/WxProductData/GetProductGoodInfo", {
      proid: this.data.id,
      vailS: modalstr
    }, "GET", false).then((res) => {
      if (res.Code == '401') {
        wx.navigateTo({
          url: '../../../login/login?backflag=detail&invitenum=' + this.data.invitenum
        })
      }
      console.log(res)
      this.setData({
        storage: res.data.Storage,
        modalid: res.data.GoodID,
        modalimg: res.data.GoodImg
      })
    })
  },
  choosemodalsubmit: function() {
    var num = 0
    var that = this
    for (var i = 0; i < this.data.productrule.length; i++) {
      if (this.data.productrule[i].specName) {
        num = num + 1
      }
    }
    // console.log(num)
    var r = this.data.selectedname.filter(function(s) {
      return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
    });
    // console.log(r.length)
    if (r.length !== num) {
      util.toast("请完整选择规格");
      return;
    }
    if (this.data.storage <= 0) {
      util.toast("当前规格库存不足")
      return
    }
    this.setData({
      hasaddress: true,
      choosemodelflag: false
    })
  },
  toaddress: function() {
    wx.navigateTo({
      url: '../../mall-extend/editAddress/editAddress?prodetail=' + true,
    })
  },
  tobarginggetgoods: function() {
    if (this.data.address == '') {
      util.toast("请先选择地址")
      return;
    }
    this.setData({
      hasaddress: false
    })
    wx.navigateTo({
      url: `../barginggetgoods/barginggetgoods?productid=${this.data.id}&modalid=${this.data.modalid}&addressid=${this.data.address.ReceiverAddressID}&img=${this.data.modalimg}&name=${this.data.name}`,
    })
  },
  tobargaininglist: function() {
    wx.navigateTo({
      url: '../bargaininglist/bargaininglist',
    })
  },
  tobargainingsettlement: function() {
    wx.navigateTo({
      url: '../bargainingsettlement/bargainingsettlement?id=' + this.data.ID,
    })
  },
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    // const images = this.data.images
    var arr = []
    arr[0] = idx
    wx.previewImage({
      current: idx, //当前预览的图片
      urls: arr, //所有要预览的图片
    })
  }
})