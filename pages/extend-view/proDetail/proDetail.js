const util = require('../../../utils/util.js')
var app = getApp()
// var WxParse = require('../../../wxParse/wxParse.js');

Page({
  data: {
    tabs: [{
        name: "商品",
        id: "shop"
      },
      {
        name: "评价",
        id: "pingjia"
      },
      {
        name: "详情",
        id: "detail"
      },
      {
        name: "推荐",
        id: "pro"
      }
    ],
    keys: ['a', 'b', 'c', 'd'],
    addcartShow: false,
    currentindex: 0,
    currentTab: 0,
    height: 64, //header高度
    top: 0, //标题图标距离顶部距离
    scrollH: 0, //滚动总高度
    opcity: 0,
    iconOpcity: 1,
    scrollTop: 0, //滚动条离顶部的距离
    banner: [],
    bannerIndex: 0,
    infoModel: [], //商品信息
    specList: [], //商品规格
    index: 5,
    menuShow: false,
    popupShow: false,
    value: 1,
    collected: false,
    choosemodel: 0,
    timeList: 0,
    modal1: false,
    modal2: false,
    hasaddress: false,
    showaddress: "",
    goodsid: "",
    detaillist: '',
    attr: "",
    selectedCurrent: [],
    selectedAttr: [],
    selectedname: [],
    storage: "",
    marketPrice: "",
    address: '',
    addresslist: [],
    modalstr: '请选择商品规格',
    scrollTop1: 0,
    flag: "",
    IsCare: '',
    tuanid: "",
    evaluateflag: true,
    page: 1,
    hastuan: true,
    modal3: false,
    opcity: 0,
    goodId: '',
    isGoIndex: false,
    iShidden: true,
    isAuto: true,
    assemblerecash: 0,
    skeletonShow: true,
    undercarriageflag: false,
    comeback: "",
    OrderSource: "General"
  },
  onLoad: function(options) {
    // setTimeout(() => {
    //   this.setData({
    //     skeletonShow: false
    //   })
    // }, 2000);
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

    console.log(wx.getLaunchOptionsSync)

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
      this.setData({
        goodsid: options.id,
        isnew: options.isnew,
        newflag: options.newflag
      })
    }
    console.log(options)

    if (options.invitenum) {
      this.setData({
        invitenum: options.invitenum
      })
    }

    if (options.shareflag) {
      this.setData({
        comeback: true
      })
    }

    if (options.OrderSource) {
      this.setData({
        OrderSource: options.OrderSource
      })
      console.log("OrderSource" + options.OrderSource)
    }

    var isshare = wx.getLaunchOptionsSync().scene
    this.setData({
      isshare
    })
    console.log(isshare)
    if (options.scene) {
      var id = options.scene.substring(0, options.scene.length - 6)
      var invitenum = options.scene.substring(options.scene.length - 6)
      this.setData({
        goodsid: id,
        invitenum,
        comeback: true
      })
    }
    console.log(options.id)
    console.log(options)
    console.log(this.data.goodsid)
    //获取商品详情
    util.request("/WxProductData/GetProductInfo", {
      id: this.data.goodsid
    }, "POST", false).then((res) => {
      console.log(res)
      if (res.data.data == '该商品已下架') {
        this.setData({
          undercarriageflag: true
        })
        util.request("/WXHome/IndexCateMore", {
          cate: 3,
          page: 1
        }, "POST", false, true).then((res) => {
          console.log(res.data)
          this.setData({
            productList: res.data
          })
        })
        return
      }
      console.log(res.data.tuanlist)
      var tuanlist = res.data.tuanlist
      if (tuanlist.tuanlist) {
        for (var i = 0; i < tuanlist.tuanlist.length; i++) {
          var str = tuanlist.tuanlist[i].endTime
          str = str.slice(6)
          str = str.substring(0, str.length - 2);

          var timestamp = Date.parse(new Date());
          tuanlist.tuanlist[i].endTime = (str * 1 - timestamp) / 1000
          // console.log(util.timestampToTime1(timestamp))
          // console.log(util.timestampToTime1(str * 1))
          // console.log(tuanlist[i].endTime/1000)
        }
        console.log(res.data.tuanlist)
      }
      // if (res.data.tuanlist.TuanCount == 0) {
      //   this.setData({
      //     hastuan: false
      //   })
      // }

      // console.log(res.data.InfoModel.Description)
      if (res.data.InfoModel.Description !== null) {
        var detaillist = util.formatRichText(res.data.InfoModel.Description);
        this.setData({
          detaillist: detaillist
        })
      }

      this.setData({
        banner: res.data.ImgList,
        infoModel: res.data.InfoModel,
        // specList: res.data.SpecList,
        storage: res.data.InfoModel.Storage,
        marketPrice: res.data.InfoModel.MarketPrice,
        Shop: res.data.Shop[0],
        TuanPrice: res.data.InfoModel.TuanPrice,
        MemberPrice: res.data.InfoModel.MemberPrice,
        // IsCare: res.data.Shop[0].IsCare,
        tuanlist: tuanlist,
        modalimg: res.data.InfoModel.FullImg,
        goodsid: res.data.InfoModel.ID
      })

      // var text = res.data.InfoModel.Title
      // // text = text.replace(re, '<text>$&</text>');
      // text = this.superTrim(text)
      // console.log(this.superTrim(text))
      // this.setData({
      //   title: text
      // })

      console.log(this.data.storage)
      var extendmoney = ((this.data.infoModel.Score - this.data.ordinaryrepercent * this.data.infoModel.Score) * this.data.ratepercent).toFixed(2) //推广佣金
      var returnmoney = (this.data.repercent * this.data.infoModel.Score).toFixed(2) //返现
      this.setData({
        extendmoney,
        returnmoney
      })
      console.log(extendmoney, returnmoney)
      var productrule = JSON.parse(this.data.infoModel.ProductRule)
      console.log(productrule)
      this.setData({
        productrule: productrule
      })
      // console.log(res.data.InfoModel.Description)
      // var article = this.data.detaillist;
      // WxParse.wxParse('article', 'html', article, that, 5);
      //获取评论信息
      // console.log(this.data.goodsid)
      util.request("/WxProductComment/GetProductCommentModel", {
        PageSize: 10,
        PageIndex: 1,
        proId: this.data.goodsid,
        shopID: this.data.Shop.ShopID,
        // proId: "572a640a0b10445cba691647a9c83d7e",
        // shopID: "11466",
        comm: ''
      }, "GET", true, true).then((res) => {
        console.log(res)
        console.log(this.data.goodsid, this.data.Shop.ShopID)
        console.log(res.data._ProductCommentModel)
        if (res.data._ProductCommentModel.length == 0) {
          this.setData({
            evaluateflag: false
          })
        } else {
          var data = res.data._ProductCommentModel[0];
          for (var j = 0; j < data.ProductCommentMedia.length; j++) {
            if (data.ProductCommentMedia[j].ReComment == '1') {
              data.ProductCommentMedia.unshift(data.ProductCommentMedia.splice(j, 1)[0])
            }
          }

          var str = data.AddDate
          str = str.slice(6)
          str = str.substring(0, str.length - 2);
          var a = new Date(str * 1);
          var nian = a.getFullYear(); //年
          var yue = a.getMonth() + 1; //月
          var tian = a.getDate(); //天
          data.AddDate = nian + "年" + yue + "月" + tian + "日"
          this.setData({
            hpd: res.data.hpd,
            evaluate: data
          })
          this.setData({
            evaluatewidth: 170 * this.data.evaluate.ProductCommentMedia.length
          })
          console.log(this.data.evaluate.ProductCommentMedia.length)
          console.log(this.data.evaluatewidth)
        }
      })

      util.request("/WXHome/IndexCateMore", {
        cate: this.data.infoModel.FirstCateID,
        page: 1
      }, "POST", false, true).then((res) => {
        console.log(res.data)
        this.setData({
          productList: res.data
        })
      })

      setTimeout(() => {
        let query = wx.createSelectorQuery()
        query.select('#pingjia').boundingClientRect((rect) => {
          this.setData({
            evaluatetop: rect.top,
            evaluateheight: rect.height
          })
          // console.log(rect)
        }).exec()

        query.select('#detail').boundingClientRect((rect) => {
          this.setData({
            detailtop: rect.top,
            detailheight: rect.height
          })
          // console.log(rect)
        }).exec()

        // query.select('#detailbox').boundingClientRect((rect) => {
        //   this.setData({
        //     // detailtop: rect.top * 2
        //   })
        //   console.log(rect)
        // }).exec()
        query.select('#pro').boundingClientRect((rect) => {
          this.setData({
            recommendtop: rect.top,
            recommendheight: rect.height
          })
          // console.log(rect)
        }).exec()
        wx.hideLoading()
      }, 2000)

    })
    // console.log(this.data.detaillist)


    var that = this
    //获取默认地址
    util.request("/WxUserAddress/GetUserAddre", {
      IsDefault: "1"
    }, "POST", false).then((res) => {
      console.log(res.data)
      if (res.data.length != 0) {
        this.setData({
          address: res.data[0],
          addressid: res.data[0].AddressID
        })
      }

      console.log(res.data.length)
      if (res.data.length == 0) {
        // that.data.showaddress = "modal1"
        this.setData({
          showaddress: "modal1"
        })
      } else {
        // that.data.showaddress = "hasaddress"
        this.setData({
          showaddress: "hasaddress"
        })
      }
    })
    //获取地址信息
    util.request("/WxUserAddress/GetUserAddre", {}, "POST", false).then((res) => {
      console.log(res.data)
      this.setData({
        addresslist: res.data
      })
    })

    // 获取客服信息
    util.request("/WxOpen/GetCustomerService", {}, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        msg: res.Msg
      })
    })
  },
  // superTrim:function (str) {
  //   // 匹配标签之间的文本
  //   const reg = /(?<=>)(.|\s)*?(?=<\/?\w+[^<]*>)/g;
  //   return str.replace(reg, s => String(s));
  // },
  onShow: function(options) {
    var repercent = wx.getStorageSync("RePecent")
    var ratepercent = wx.getStorageSync("RatePecent")
    var ordinaryrepercent = wx.getStorageSync("OrdinaryRePecent")
    console.log(repercent, ratepercent)
    this.setData({
      repercent,
      ratepercent,
      ordinaryrepercent
    })
    // this.setData({
    //   timeList: 86400
    // })
    // console.log(this.data.timeList)
    setTimeout(() => {
      util.request("/WxProductData/GetProductInfo", {
        id: this.data.goodsid
      }, "POST", false, true).then((res) => {
        console.log(res)
        if (res.data.data == '该商品已下架') {
          this.setData({
            undercarriageflag: true
          })
          return
        }
        console.log(res)
        this.setData({
          storage: res.data.InfoModel.Storage
        })
        var extendmoney = ((this.data.infoModel.Score - this.data.ordinaryrepercent * this.data.infoModel.Score) * this.data.ratepercent).toFixed(2) //推广佣金
        var returnmoney = (this.data.repercent * this.data.infoModel.Score).toFixed(2) //返现
        this.setData({
          extendmoney,
          returnmoney
        })
        console.log(extendmoney, returnmoney)
        var tuanlist = res.data.tuanlist
        if (tuanlist.tuanlist) {
          for (var i = 0; i < tuanlist.tuanlist.length; i++) {
            var str = tuanlist.tuanlist[i].endTime
            str = str.slice(6)
            str = str.substring(0, str.length - 2);

            var timestamp = Date.parse(new Date());
            tuanlist.tuanlist[i].endTime = (str * 1 - timestamp) / 1000
          }
          console.log(res.data.tuanlist)
        }
        this.setData({
          tuanlist
        })
      })
      util.request("/WxUserAddress/GetUserAddre", {
        IsDefault: "1"
      }, "POST", false, true).then((res) => {
        console.log(res.data)
        if (res.data.length != 0) {
          this.setData({
            address: res.data[0],
            addressid: res.data[0].AddressID
          })
        }

        console.log(res.data.length)
        if (res.data.length == 0) {
          // that.data.showaddress = "modal1"
          this.setData({
            showaddress: "modal1",
            address: ""
          })
        } else {
          // that.data.showaddress = "hasaddress"
          this.setData({
            showaddress: "hasaddress"
          })
        }
      })
    }, 500)
  },
  onReady: function() {

  },
  jumpTo: function(e) {
    console.log(e)
    let option = e.currentTarget.dataset.item;
    this.setData({
      toitem: option
    })
  },
  reachbot: function() {
    util.request("/WXHome/IndexCateMore", {
      cate: this.data.infoModel.FirstCateID,
      page: this.data.page + 1
    }, "POST", false).then((res) => {
      console.log(res.data)
      // if(res.data.)
      this.setData({
        productList: this.data.productList.concat(res.data),
        page: this.data.page + 1
      })
    })
  },
  previewImage1: function(e) {
    console.log(e)
    var current = e.currentTarget.dataset.current;
    var list = e.currentTarget.dataset.list;
    var imglist = []
    for (var i = 0; i < list.length; i++) {
      if (list[i].ReComment == '0') {
        imglist.push(list[i].MediaUrl)
      }
    }
    console.log(list)
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: imglist // 需要预览的图片http链接列表
    })
  },
  clickaddress: function(e) {
    console.log(e.currentTarget.dataset.current)
    this.setData({
      address: e.currentTarget.dataset.current,
      hasaddress: false
    })
  },
  setScrollTop: function(e) {

  },
  clicknav: function(e) {
    // console.log(e.currentTarget.dataset.current)
    let cur = e.currentTarget.dataset.current;
    let id = e.currentTarget.dataset.id;
    console.log(id)
    this.setData({
      toitem: id,
      currentindex: cur
    })

    // console.log(id)
    // if (this.data.currentindex == cur) {
    //   return false;
    // } else {
    //   this.setData({
    //     currentindex: cur,
    //   })
    //   if (this.data.currentindex == 0) {
    //     wx.pageScrollTo({
    //       scrollTop: 0,
    //       duration: 0
    //     })
    //     this.setData({
    //       currentindex: 0
    //     })
    //   }
    //   if (this.data.currentindex == 1) {
    //     wx.pageScrollTo({
    //       scrollTop: this.data.evaluatetop + 200,
    //       duration: 0
    //     })
    //     this.setData({
    //       currentindex: 1
    //     })
    //   }
    //   if (this.data.currentindex == 2) {
    //     wx.pageScrollTo({
    //       scrollTop: this.data.detailtop + 340,
    //       duration: 0
    //     })
    //     this.setData({
    //       currentindex: 2
    //     })
    //   }
    //   if (this.data.currentindex == 3) {
    //     wx.pageScrollTo({
    //       scrollTop: this.data.recommendtop + 840,
    //       duration: 0
    //     })
    //     this.setData({
    //       currentindex: 3
    //     })
    //   }
    // }
  },
  addcart: function() {
    this.setData({
      addcartShow: true,
      flag: "addcart"
    })

  },
  gotoshopcart: function() {
    wx.navigateTo({
      url: '../mall-extend/shopcart/shopcart',
    })
  },
  addtocart: function() {
    if (this.data.newflag) {
      util.toast("该商品不可添加至购物车")
      return
    }
    if (this.data.storage <= 0) {
      util.toast('当前规格库存不足')
      return;
    }
    // console.log(this.data.productrule)
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
    console.log(this.data.Shop)
    console.log(this.data.goodsid, this.data.modalid, this.data.value, this.data.Shop.ShopID)
    util.request("/WxShopCart/AddGart", {
      ProductID: this.data.goodsid,
      GoodsID: this.data.modalid,
      Quantity: this.data.value,
      ShopID: this.data.Shop.ShopID,
      OrderSource: this.data.OrderSource
      // ProductID: "84f0c471960a4e5ca18e81a2254c5c55",
      // GoodsID: "65c011dedc854782988d27a58e736b71",
      // Quantity: "5",
    }, "POST", false).then((res) => {
      console.log(res)
      that.setData({
        addcartShow: false,
        popupShow: false
      })
      util.toast(res.Msg)
    })
  },
  //单独购买
  maverickbuy: function() {
    if (this.data.newflag && !wx.getStorageSync("isnew")) {
      util.toast("该商品仅新用户可以购买")
      return
    }
    if (this.data.storage <= 0) {
      util.toast('当前规格库存不足')
      return;
    }
    // console.log(this.data.productrule)
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
    console.log("maverickbuy")
    console.log(this.data.goodsid, this.data.modalid, this.data.value)
    var address = JSON.stringify(this.data.address)
    wx.navigateTo({
      url: `../mall-extend/submitOrder/submitOrder?productid=${this.data.goodsid}&goodid=${this.data.modalid}&quantity=${this.data.value}&storage=${this.data.storage}&tuanflag=maverickbuy&extendmoney=${this.data.extendmoney}&returnmoney=${this.data.returnmoney}&address=${address}&isnew=${this.data.isnew}&OrderSource=${this.data.OrderSource}`,
    })
    this.setData({
      addcartShow: false
    })
  },
  //发起拼团
  startgroup: function() {
    if (this.data.newflag && !wx.getStorageSync("isnew")) {
      util.toast("该商品仅新用户可以拼团")
      return
    }
    if (this.data.storage <= 0) {
      util.toast('当前规格库存不足')
      return;
    }
    // console.log(this.data.productrule)
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
    console.log("startgroup")
    console.log(this.data.goodsid, this.data.modalid, this.data.value)
    wx.navigateTo({
      url: `../mall-extend/submitOrder/submitOrder?productid=${this.data.goodsid}&goodid=${this.data.modalid}&quantity=${this.data.value}&tuanId=${this.data.tuanid}&storage=${this.data.storage}&tuanflag=startgroup&isnew=${this.data.isnew}&OrderSource=${this.data.OrderSource}`,
    })
    this.setData({
      addcartShow: false
    })
  },
  //参与拼团
  attendgroup: function(e) {
    if (this.data.newflag && !wx.getStorageSync("isnew")) {
      util.toast("该商品仅新用户可以拼团")
      return
    }
    if (e.currentTarget.dataset.current) {
      this.setData({
        tuanid: e.currentTarget.dataset.current
      })
      wx.setStorageSync("otherphoto", e.currentTarget.dataset.image)
    }
    if (this.data.storage <= 0) {
      util.toast('当前规格库存不足')
      return;
    }
    // console.log("attendgroup")
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
    console.log("startgroup")
    console.log(this.data.goodsid, this.data.modalid, this.data.value)
    wx.navigateTo({
      url: `../mall-extend/submitOrder/submitOrder?productid=${this.data.goodsid}&goodid=${this.data.modalid}&quantity=${this.data.value}&tuanId=${this.data.tuanid}&storage=${this.data.storage}&tuanflag=attendgroup&extendmoney=${this.data.extendmoney}&returnmoney=${this.data.returnmoney}&isnew=${this.data.isnew}&OrderSource=${this.data.OrderSource}`,
    })
    this.setData({
      addcartShow: false
    })
  },
  hidecartadd: function() {
    this.setData({
      addcartShow: false
    })
  },
  showaddress: function() {
    var showaddress = this.data.showaddress
    if (showaddress == "modal1") {
      this.setData({
        modal1: true
      })
    } else {
      this.setData({
        hasaddress: true
      })
    }

  },
  hideaddress: function() {
    var showaddress = this.data.showaddress
    if (showaddress == "modal1") {
      this.setData({
        modal1: false,
        hasaddress: false
      })
    } else {
      this.setData({
        hasaddress: false,
        modal1: false
      })
    }
  },
  editaddress: function() {
    wx.navigateTo({
      url: '../mall-extend/editAddress/editAddress'
    })
  },
  hideassemble: function() {
    this.setData({
      modal2: false
    })
  },
  toassemble: function(e) {
    var cur = e.currentTarget.dataset.current;
    console.log(cur)
    this.setData({
      modal2: true,
      tuan: cur,
      flag: "attendgroup"
    })
  },
  bannerChange: function(e) {
    this.setData({
      bannerIndex: e.detail.current
    })
  },
  previewImage: function(e) {
    let index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.banner[index],
      urls: this.data.banner
    })
  },
  //页面滚动执行方式
  onPageScroll(e) {
    let scroll = e.scrollTop <= 0 ? 0 : e.scrollTop;
    // console.log(scroll, this.data.evaluatetop)
    let opcity = scroll / this.data.scrollH;
    // if (this.data.opcity >= 1 && opcity >= 1) {
    //   return;
    // }
    this.setData({
      scrollTop: scroll
    })
  },
  back: function() {
    var isshare = wx.getLaunchOptionsSync().scene
    if (this.data.comeback) {
      wx.reLaunch({
        url: '/pages/wujieindex/wujieindex'
      })
    } else {
      wx.navigateBack()
    }
  },
  showPopup: function() {
    this.setData({
      popupShow: true
    })
    // for (var i = 0; i < this.data.infoModel.ProductRule.length;i++){
    //   arr.push(this.data.infoModel[i])
    // }
    // console.log(arr)
    // for(var index in arr){
    //   console.log(arr[index].root)
    // }
  },

  hidePopup: function() {
    this.setData({
      popupShow: false,
      hasaddress: false
    })
  },
  change: function(e) {
    if (this.data.isnew) {
      util.toast("该商品新用户限购一件")
    } else {
      this.setData({
        value: e.detail.value
      })
    }
  },
  collecting: function() {
    this.setData({
      collected: !this.data.collected
    })
  },
  common: function() {
    util.toast("功能开发中~")
  },
  submit() {
    this.hidePopup()
    wx.navigateTo({
      url: '../mall-extend/submitOrder/submitOrder'
    })
  },
  coupon() {
    wx.navigateTo({
      url: '../mall-extend/coupon/coupon'
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
    console.log(this.data.goodsid, modalstr)
    util.request("/WxProductData/GetProductGoodInfo", {
      proid: this.data.goodsid,
      vailS: modalstr
    }, "GET", false).then((res) => {
      if (res.Code == '401') {
        wx.navigateTo({
          url: '../../login/login?backflag=detail&invitenum=' + this.data.invitenum
        })
        this.setData({
          selectedCurrent: [],
          selectedAttr: [],
          selectedname: []
        })
        return
      }
      console.log(res)
      this.setData({
        storage: res.data.Storage,
        marketPrice: res.data.MarketPrice,
        modalid: res.data.GoodID,
        TuanPrice: res.data.TuanPrice,
        modalimg: res.data.GoodImg
      })
    })
  },
  clickchoose: function(e) {
    // console.log(e)
  },
  closePopup: function() {
    this.setData({
      popupShow: false
    })
  },
  loneybuy: function() {
    this.setData({
      addcartShow: true,
      flag: "maverickbuy"
    })
  },
  submitorder: function() {
    this.setData({
      addcartShow: true,
      flag: "startgroup",
      tuanid: ""
    })
  },
  toevaluate: function() {
    wx.navigateTo({
      url: `../evaluate/evaluate?proId=${this.data.goodsid}&shopID=${this.data.Shop.ShopID}`
    })
  },
  tomakemoney: function() {
    app.globalData.selected = 0
    wx.switchTab({
      url: '../../makemoney/makemoney?',
    })

  },
  toaddress: function() {
    if (!wx.getStorageSync("sessionId")) {
      wx.navigateTo({
        url: '../../login/login?backflag=detail'
      })
      return
    }
    wx.navigateTo({
      url: '../mall-extend/editAddress/editAddress?prodetail=' + true,
    })
  },
  collectshop: function() {
    util.request("/WxshopCollection/CollectionProduct", {
      shopid: this.data.Shop.ShopID
    }, "GET", false).then((res) => {
      console.log(res)
      if (res.Msg == '取消收藏成功') {
        this.setData({
          IsCare: 0
        })
      } else {
        this.setData({
          IsCare: 1
        })
      }
      util.toast(res.Msg)
    })
  },
  tocustomerservice: function() {
    if (!wx.getStorageSync("sessionId")) {
      wx.navigateTo({
        url: '../../login/login?backflag=detail'
      })
      return
    }
    console.log(this.data.goodsid)
    console.log(this.data.msg)
    var msg = this.data.msg
    wx.navigateTo({
      url: `../news-extend/customerservice/customerservice?conversationID=${'C2C' + msg}&id=${this.data.goodsid}&proname=${this.data.infoModel.ProductName}&price=${this.data.marketPrice}&image=${this.data.infoModel.FullImg}&name=${'商城客服'}`,
    })
  },
  addtoassistant: function() {
    util.request("/WxUserInfo/RobotSendProduct", {
      strProduct: this.data.goodsid
    }, "GET", false).then((res) => {
      console.log(res)
      // if (res.Msg == "正在努力执行，请耐心等待！") {
      //   util.toast("加入助理成功")
      // }
      util.toast(res.Msg)
    })
  },
  copy: function(e) {
    var cur = e.currentTarget.dataset.current
    console.log(cur)
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
  joingroup: function(e) {
    var tuanid = e.currentTarget.dataset.current;
    this.setData({
      tuanid: tuanid,
      addcartShow: true,
      flag: "attendgroup",
      modal2: false
    })
    wx.setStorageSync("otherphoto", this.data.tuan.photo)
  },
  endOfTime: function(e) {
    var index = e.currentTarget.dataset.current;
    console.log(index)
    var tuanlist = this.data.tuanlist
    tuanlist.tuanlist.splice(index, 1)
    this.setData({
      tuanlist
    })
  },
  toshop: function() {
    util.toast("")
  },
  tocreateposter: function(e) {
    // if (!wx.getStorageSync("sessionId")) {
    //   wx.navigateTo({
    //     url: '../login/login?backflag=detail'
    //   })
    //   return
    // }
    var cur = e.currentTarget.dataset.current
    console.log(cur)
    util.request("/WxShare/GeneratePrice", {
      productID: cur
    }, "GET", false).then((res) => {
      if (res.Code == '401') {
        wx.navigateTo({
          url: '../../login/login?backflag=detail&invitenum=' + this.data.invitenum
        })
        return
      }
      console.log(res)
      var img = res.Msg
      wx.navigateTo({
        url: '../../extend-view1/createposter/createposter?img=' + img,
      })
    })
  },
  getheight: function() {
    let query = wx.createSelectorQuery()
    query.select('#pingjia').boundingClientRect((rect) => {
      this.setData({
        // evaluatetop: rect.top,
        evaluateheight: rect.height
      })
      // console.log(rect)
    }).exec()

    query.select('#detail').boundingClientRect((rect) => {
      this.setData({
        // detailtop: rect.top,
        detailheight: rect.height
      })
      // console.log(rect)
    }).exec()

    // query.select('#detailbox').boundingClientRect((rect) => {
    //   this.setData({
    //     // detailtop: rect.top * 2
    //   })
    //   console.log(rect)
    // }).exec()
    query.select('#pro').boundingClientRect((rect) => {
      this.setData({
        // recommendtop: rect.top,
        recommendheight: rect.height
      })
      // console.log(rect)
    }).exec()
  },
  scroll: function(e) {
    this.getheight()
    if (!this.data.undercarriageflag) {
      var s = e.detail.scrollTop
      this.setData({
        scrollTop: s
      })
      console.log(s)
      console.log(this.data.evaluatetop, this.data.detailtop, this.data.recommendtop, this.data.detailheight, this.data.evaluateheight)
      if (s >= this.data.evaluatetop && s < this.data.detailtop - 20) {
        this.setData({
          currentindex: 1
        })
      } else if (s > this.data.detailtop && s < this.data.recommendtop - 20) {
        this.setData({
          currentindex: 2
        })
      } else if (s < this.data.evaluatetop - 20) {
        this.setData({
          currentindex: 0
        })
      } else if (s >= this.data.recommendtop + 20) {
        this.setData({
          currentindex: 3
        })
      }
      if (s > 0) {
        this.setData({
          opcity: 1
        })
      } else {
        this.setData({
          opcity: 0
        })
      }
    }
  },
  closemodal3: function() {
    this.setData({
      modal3: false
    })
  },
  togoodsdetail: function(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `../proDetail/proDetail?id=${id}`,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    console.log(res)
    if (res.from == 'menu') {
      return {
        title: this.data.infoModel.ProductName,
        path: `/pages/extend-view/proDetail/proDetail?id=${this.data.goodsid}&shareflag=true`,
        imageUrl: this.data.infoModel.ThumbnailImg,
        success: function(res) {
          // 转发成功
        },
        fail: function(res) {
          // 转发失败
        }
      }
    } else {
      var memid = wx.getStorageSync("MemID")
      console.log(this.data.orderid, memid)
      return {
        title: `☛仅剩一个名额☚我${this.data.infoModel.TuanPrice}元拼了${this.data.infoModel.ProductName}`,
        path: `/pages/extend-view1/links/links?orderid=${this.data.orderid}&memberid=${memid}`,
        imageUrl: this.data.infoModel.ThumbnailImg,
        success: function(res) {
          // 转发成功
        },
        fail: function(res) {
          // 转发失败
        }
      }
    }

  },
  decodeUnicode: function(str) {
    var ret = '';
    var splits = str.split('');
    console.log(splits)
    for (let i = 0; i < splits.length; i++) {
      ret += this.spliteDecode(splits[i]);
    }
    return ret;
  },
  spliteDecode: function(value) {
    var target = value.match(/\\u\d+/g);
    if (target && target.length > 0) {
      target = target[0];
      var temp = value.replace(target, '{{@}}');
      target = target.replace('\\u', '');
      target = String.fromCharCode(parseInt(target));
      return temp.replace("{{@}}", target);
    } else {
      console.log(222)
      value = value.replace('\\u', '');
      return String.fromCharCode(parseInt(value, '10'))
      return value;
    }
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