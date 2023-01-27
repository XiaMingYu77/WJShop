// pages/extend-view1//links/links.js
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeList: 10000,
    modal: false,
    value: 1,
    selectedCurrent: [],
    selectedAttr: [],
    selectedname: [],
    flag: true,
    page: 1,
    invitenum: '',
    isGoIndex: false,
    iShidden: true,
    isAuto: true,
    shareflag:""
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
    console.log(isshare)

    if (options.shareflag) {
      this.setData({
        shareflag: options.shareflag
      })
    }

    console.log(wx.getStorageSync("sessionId"))
    // if (!wx.getStorageSync("sessionId")) {
    //   wx.navigateTo({
    //     url: '../../login/login?backflag=detail&invitenum='+this.data.invitenum
    //   })
    // }

    var repercent = wx.getStorageSync("RePecent")
    var ratepercent = wx.getStorageSync("RatePecent")
    var ordinaryrepercent = wx.getStorageSync("OrdinaryRePecent")
    console.log(repercent, ratepercent)
    this.setData({
      repercent,
      ratepercent,
      ordinaryrepercent
    })

    

    console.log(options)
    this.setData({
      orderid: options.orderid, 
      memberid: options.memberid,
      invitenum: options.invitenum
    })



    util.request("/WxTuanOrder/GetInviteSpellGroup", {
      OrderID: this.data.orderid,
      MemberID: this.data.memberid
    }, "GET", false).then((res) => {
      console.log(res)
      if (res.Msg == '发起邀请失败') {
        this.setData({
          flag: false
        })
        return
      }
      if (this.data.memberid == wx.getStorageSync('MemID')) {
        wx.redirectTo({
          url: "../inviteassemble/inviteassemble?orderno=" + this.data.orderid
        })
      }
      this.setData({
        info: res.data.Entity,
        list: res.data.List[0],
        storage: res.data.List[0].Storage,
        marketPrice: res.data.List[0].MarketPrice,
        modalid: res.data.List[0].GoodID,
        TuanPrice: res.data.List[0].TuanPrice,
        goodsid: res.data.Entity.ProductID,
        tuanid: res.data.Entity.TuanID
      })
      var extendmoney = ((this.data.info.Score - this.data.ordinaryrepercent * this.data.info.Score) * this.data.ratepercent).toFixed(2) //推广佣金
      var returnmoney = (this.data.repercent * this.data.info.Score).toFixed(2) //返现
      this.setData({
        extendmoney,
        returnmoney
      })
      wx.setStorageSync("otherphoto", res.data.Entity.Photo)
      var str = this.data.info.EndTime
      str = str.slice(6)
      str = str.substring(0, str.length - 2);
      var timestamp = Date.parse(new Date());
      var time = (str * 1 - timestamp) / 1000
      this.setData({
        timeList: time
      })
      var productrule = JSON.parse(this.data.list.GoodRule)
      console.log(productrule)
      this.setData({
        productrule: productrule
      })

      util.request("/WXHome/IndexCateMore", {
        cate: this.data.info.FirstCateID,
        page: 1
      }, "POST", false).then((res) => {
        console.log(res.data)
        this.setData({
          productList: res.data
        })
      })
    })
  },
  choosemodel: function(e) {
    this.setData({
      value: 1
    })
    // console.log(e)
    console.log(e.currentTarget.dataset.current);
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
      proid: this.data.goodsid,
      vailS: modalstr
    }, "GET", false).then((res) => {
      console.log(res)
      if (res.Code == '401') {
        wx.navigateTo({
          url: '../../login/login?backflag=detail&invitenum=' + this.data.invitenum
        })
        this.setData({
          selectedCurrent: [],
          selectedAttr: [],
          selectedname: [],
          modal:false
        })
        return
      }
      this.setData({
        storage: res.data.Storage,
        marketPrice: res.data.MarketPrice,
        modalid: res.data.GoodID,
        TuanPrice: res.data.TuanPrice
      })
    })
  },
  attendgroup: function(e) {
    if (this.data.storage <= 0) {
      util.toast('当前规格库存不足')
      return;
    }
    // console.log("attendgroup")
    var num = 0
    var that = this
    console.log(this.data.productrule)
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
    console.log("startgroup")
    console.log(this.data.goodsid, this.data.modalid, this.data.value)
    wx.navigateTo({
      url: `../../extend-view/mall-extend/submitOrder/submitOrder?productid=${this.data.goodsid}&goodid=${this.data.modalid}&quantity=${this.data.value}&tuanId=${this.data.tuanid}&storage=${this.data.storage}&tuanflag=attendgroup&extendmoney=${this.data.extendmoney}&returnmoney=${this.data.returnmoney}&linkflag=true&OrderSource=${this.data.info.OrderSource}`,
    })
    this.setData({
      modal: false
    })
  },
  back: function() {
    var isshare = this.data.isshare
    console.log(isshare)
    if (this.data.shareflag) {
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
    var repercent = wx.getStorageSync("RePecent")
    var ratepercent = wx.getStorageSync("RatePecent")
    var ordinaryrepercent = wx.getStorageSync("OrdinaryRePecent")
    console.log(repercent, ratepercent)
    this.setData({
      repercent,
      ratepercent,
      ordinaryrepercent
    })

    util.request("/WxTuanOrder/GetInviteSpellGroup", {
      OrderID: this.data.orderid,
      MemberID: this.data.memberid
    }, "GET", false).then((res) => {
      console.log(res)
      if (res.Msg == '发起邀请失败') {
        this.setData({
          flag: false
        })
        return
      }
      if (this.data.memberid == wx.getStorageSync('MemID')) {
        wx.redirectTo({
          url: "../inviteassemble/inviteassemble?orderno=" + this.data.orderid
        })
      }
      this.setData({
        info: res.data.Entity,
        list: res.data.List[0],
        storage: res.data.List[0].Storage,
        marketPrice: res.data.List[0].MarketPrice,
        modalid: res.data.List[0].GoodID,
        TuanPrice: res.data.List[0].TuanPrice,
        goodsid: res.data.Entity.ProductID,
        tuanid: res.data.Entity.TuanID
      })
      var extendmoney = ((this.data.info.Score - this.data.ordinaryrepercent * this.data.info.Score) * this.data.ratepercent).toFixed(2) //推广佣金
      var returnmoney = (this.data.repercent * this.data.info.Score).toFixed(2) //返现
      this.setData({
        extendmoney,
        returnmoney
      })
      wx.setStorageSync("otherphoto", res.data.Entity.Photo)
      var str = this.data.info.EndTime
      str = str.slice(6)
      str = str.substring(0, str.length - 2);
      var timestamp = Date.parse(new Date());
      var time = (str * 1 - timestamp) / 1000
      this.setData({
        timeList: time
      })
      var productrule = JSON.parse(this.data.list.GoodRule)
      console.log(productrule)
      this.setData({
        productrule: productrule
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
    util.request("/WxTuanOrder/GetInviteSpellGroup", {
      OrderID: this.data.orderid,
      MemberID: this.data.memberid
    }, "GET", false).then((res) => {
      console.log(res)
      if (res.Msg == '发起邀请失败') {
        this.setData({
          flag: false
        })
        return
      }
      if (this.data.memberid == wx.getStorageSync('MemID')) {
        wx.redirectTo({
          url: "../inviteassemble/inviteassemble?orderno=" + this.data.orderid
        })
      }
      this.setData({
        info: res.data.Entity,
        list: res.data.List[0],
        storage: res.data.List[0].Storage,
        marketPrice: res.data.List[0].MarketPrice,
        modalid: res.data.List[0].GoodID,
        TuanPrice: res.data.List[0].TuanPrice,
        goodsid: res.data.Entity.ProductID,
        tuanid: res.data.Entity.TuanID
      })
      var extendmoney = ((this.data.info.Score - this.data.ordinaryrepercent * this.data.info.Score) * this.data.ratepercent).toFixed(2) //推广佣金
      var returnmoney = (this.data.repercent * this.data.info.Score).toFixed(2) //返现
      this.setData({
        extendmoney,
        returnmoney
      })
      wx.setStorageSync("otherphoto", res.data.Entity.Photo)
      var str = this.data.info.EndTime
      str = str.slice(6)
      str = str.substring(0, str.length - 2);
      var timestamp = Date.parse(new Date());
      var time = (str * 1 - timestamp) / 1000
      this.setData({
        timeList: time
      })
      var productrule = JSON.parse(this.data.list.GoodRule)
      console.log(productrule)
      this.setData({
        productrule: productrule.root
      })

      util.request("/WXHome/IndexCateMore", {
        cate: this.data.info.FirstCateID,
        page: 1
      }, "POST", false).then((res) => {
        console.log(res.data)
        this.setData({
          productList: res.data,
          page: 1
        })
      })
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    util.request("/WXHome/IndexCateMore", {
      cate: this.data.info.FirstCateID,
      page: this.data.page + 1
    }, "POST", false).then((res) => {
      console.log(res.data)
      if (res.data.length == 0) {
        util.toast("暂无更多数据")
        return
      }
      this.setData({
        productList: this.data.productList.concat(res.data),
        page: this.data.page + 1
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  hide: function() {
    this.setData({
      modal: false
    })
  },
  partake: function() {
    this.setData({
      modal: true
    })
  },
  change: function(e) {
    this.setData({
      value: e.detail.value
    })
  },
  togoodsdetail: function(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `../../extend-view/proDetail/proDetail?id=${id}`,
    })
  }

})