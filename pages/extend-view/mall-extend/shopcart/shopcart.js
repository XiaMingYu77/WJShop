const util = require('../../../../utils/util.js')
Page({
  data: {
    value: 1,
    carts: [],
    hasList: false, // 列表是否有数据
    totalPrice: 0, // 总价，初始为0
    totalNum: 0, //总数
    Score: 0, //返利
    selectAllStatus: false, // 全选状态，默认全选
    deleteflag: false,
    refreshflag: false,
    modal1: false,
    modal2: false,
    choosemodelflag: false,
    attr: "",
    selectedCurrent: [],
    selectedAttr: [],
    selectedname: [],
    flag: true,
    page:1
  },
  loaddata: function() {
    util.request("/WxShopCart/GetCart", {
      PageIndex: 1,
      PageSize: 10
    }, "POST", true).then((res) => {
      console.log(res)
      this.setData({
        invalid: res.data.Invalid,
        InvalidCount: res.data.InvalidCount
      })

      if (res.data.Effective.length != 0) {
        var data = res.data.Effective;
        // console.log(data)
        for (var i = 0; i < data[0].Cartlist.length; i++) {
          console.log(data[0].Cartlist[i])
          if (data[0].Cartlist[i].AndStorage > 0 && data[0].Cartlist[i].Storage <= 0) {
            continue
          }
          data[0].Cartlist[i].selected = false
        }
        // for (var j = 0; j < data.length; j++) {
        //   var data1 = data[j].Cartlist
        //   for (var i = 0; i < data1.length; i++) {
        //     data1[i].selected = false
        //   }
        // }
        // console.log(data, res.data.Effective[0])
        this.setData({
          carts: data,
          deleteflag: false
        })
      } else {
        this.setData({
          carts: []
        })
      }

      if (this.data.carts.length == 0) {
        this.setData({
          flag: false
        })
      }
      // console.log(data)
      this.getTotalPrice()
      this.getTotalNum()
      // console.log(data[0].Cartlist[0].ProductSpec.root[0].specVal[0].val)
      // console.log(this.data.carts[1].Cartlist[0].ProductSpec)
    })
    util.request("/WXHome/IndexCateMore", {
      cate: 3,
      page: 1
    }, "POST", false).then((res) => {
      console.log(res.data)
      this.setData({
        productList: res.data
      })
    })
  },
  onLoad: function(options) {
    var repercent = wx.getStorageSync("RePecent")
    var ratepercent = wx.getStorageSync("RatePecent")
    var ordinaryrepercent = wx.getStorageSync("OrdinaryRePecent")
    console.log(repercent, ratepercent)
    this.setData({
      repercent,
      ratepercent,
      ordinaryrepercent
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
    console.log(repercent, ratepercent)
    this.setData({
      repercent,
      ratepercent
    })
    this.loaddata()
    // this.setData({
    //   selectAllStatus: false
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
  onReachBottom: function() {
    util.request("/WXHome/IndexCateMore", {
      cate: 3,
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
  onPullDownRefresh: function() {
    this.setData({
      flag:true
    })
    this.loaddata()
    this.setData({
      selectAllStatus: false
    })
    wx.stopPullDownRefresh()
  },
  onShow: function() {
    if (this.data.refreshflag == true) {
      this.loaddata()
      this.setData({
        selectAllStatus: false
      })
    }
  },
  toshopcartsettlement: function() {
    var carts = this.data.carts;
    var str = ""

    var data = this.data.carts
    for (var j = 0; j < data.length; j++) {
      var data1 = data[j].Cartlist
      for (var i = 0; i < data1.length; i++) {
        console.log(data1[i].selected)
        if (data1[i].selected) {
          str += data1[i].ID + ","
        }
      }
    }
    console.log(str)
    var reg = /,$/gi;
    str = str.replace(reg, "");
    if (str == "") {
      util.toast("您还没有选择宝贝哦")
      return;
    }
    wx.navigateTo({
      url: '../shopcartsettlement/shopcartsettlement?cartid=' + str,
    })
  },
  manage: function() {
    this.setData({
      deleteflag: !this.data.deleteflag
    })
  },
  getproductid: function(e) {
    var productid = e.currentTarget.dataset.productid
    var goodsid = e.currentTarget.dataset.goodsid
    console.log(productid, goodsid)
    // this.setData({
    //   productid: productid,
    //   goodsid: goodsid
    // })
    wx.navigateTo({
      url: '../../proDetail/proDetail?id=' + productid,
    })
  },
  change: function(e) {
    const index = e.currentTarget.dataset.index; // 获取data- 传进来的index
    const attr = e.currentTarget.dataset.attr;
    var productid = e.currentTarget.dataset.productid
    var goodsid = e.currentTarget.dataset.goodsid
    console.log(e.detail.value)
    var value = e.detail.value
    console.log(productid, goodsid)
    console.log(this.data.carts)
    console.log(e.currentTarget.dataset);
    util.request("/WxShopCart/ChangeCartProduct", {
      ProductID: productid,
      GoodsID: goodsid,
      Quantity: value
    }, "POST", false).then((res) => {
      // this.getTotalPrice()
      var carts = this.data.carts;
      console.log(carts)
      carts[attr].Cartlist[index].Quantity = value;
      this.setData({
        carts: carts
      })
      console.log(res)
      if (res.Msg == "库存不足") {
        util.toast("库存不足")
        setTimeout(() => {
          this.loaddata()
        }, 1000)
        return;
      }
      // const pages = getCurrentPages()
      // //声明一个pages使用getCurrentPages方法
      // const perpage = pages[pages.length - 1]
      // //声明一个当前页面
      // perpage.onLoad()
      this.getTotalPrice()
      this.getTotalNum()
    })

  },
  getTotalPrice() {
    let carts = this.data.carts; // 获取购物车列表
    let total = 0;
    for (var j = 0; j < carts.length; j++) {
      var data1 = carts[j].Cartlist
      for (var i = 0; i < data1.length; i++) {
        if (data1[i].selected) { // 判断选中才会计算价格
          // console.log(carts[i].Cartlist[0].Quantity, carts[i].Cartlist[0].MarketPrice)
          total += data1[i].Quantity * data1[i].MarketPrice; // 所有价格加起来
        }
      }
    }
    // for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据
    //   if (carts[i].Cartlist[0].selected) { // 判断选中才会计算价格
    //     // console.log(carts[i].Cartlist[0].Quantity, carts[i].Cartlist[0].MarketPrice)
    //     total += carts[i].Cartlist[0].Quantity * carts[i].Cartlist[0].MarketPrice; // 所有价格加起来
    //   }
    // }
    this.setData({ // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },
  getTotalNum() {
    let carts = this.data.carts; // 获取购物车列表
    let totalnum = 0;
    let Score = 0;
    for (var j = 0; j < carts.length; j++) {
      var data1 = carts[j].Cartlist
      for (var i = 0; i < data1.length; i++) {
        if (data1[i].selected) { // 判断选中才会计算价格
          // console.log(carts[i].Cartlist[0].Quantity, carts[i].Cartlist[0].MarketPrice)
          // totalnum += data1[i].Quantity
          totalnum ++
          Score += data1[i].Score * this.data.repercent * data1[i].Quantity
        }
      }
    }
    this.setData({ // 最后赋值到data中渲染到页面
      carts: carts,
      totalNum: totalnum,
      Score: Score
    });
  },
  checkboxChange: util.throttle(function(e) {
    const index = e.currentTarget.dataset.index; // 获取data- 传进来的index
    console.log(index)
    // const attr = e.currentTarget.dataset.attr;
    // console.log(index, e.currentTarget.dataset.attr)
    let carts = this.data.carts; // 获取购物车列表
    console.log(carts)
    let selectAllStatus = this.data.selectAllStatus; //获取全选状态
    const selected = carts[0].Cartlist[index].selected; // 获取当前商品的选中状态
    // console.log(carts[attr].Cartlist[index].selected)
    carts[0].Cartlist[index].selected = !selected; // 改变状态
    carts[0].Cartlist[index]['selected'] = !selected;
    var flag = true
    // this.setData({
    //   carts: carts
    // })
    var data = carts[0].Cartlist
    // console.log(data)
    for (var j = 0; j < data.length; j++) {
      if (data[j].AndStorage > 0 && data[j].Storage <= 0) {
        continue
      }
      if (!data[j].selected) {
        flag = false
      }
    }
    // console.log(flag)
    if (flag) {
      selectAllStatus = true;
    } else {
      selectAllStatus = false;
    }
    // let j = 0;
    // for (let i = 0; i < carts[0].Cartlist.length; i++) {
    //   if (carts[0].Cartlist[i].selected == true) {
    //     j++;
    //     continue;
    //   } else {
    //     selectAllStatus = false;
    //   }
    // }
    // if (j == carts[0].Cartlist.length) {
    //   selectAllStatus = true;
    // }
    //如果都选中，全选也选中实现
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalNum()
    this.getTotalPrice(); // 重新获取总价
  }, 100),
  selectall: function() {
    let selectAllStatus = this.data.selectAllStatus; // 是否全选状态
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;
    for (var j = 0; j < carts.length; j++) {
      var data1 = carts[j].Cartlist
      for (var i = 0; i < data1.length; i++) {
        if (data1[i].AndStorage > 0 && data1[i].Storage <= 0) {
          continue
        }
        data1[i].selected = selectAllStatus
        data1[i]['selected'] = selectAllStatus;
      }
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    console.log(this.data.carts)
    this.getTotalNum()
    this.getTotalPrice(); // 重新获取总价
  },
  delete: function() {
    console.log(111)
    var carts = this.data.carts;
    var str = ""

    var data = this.data.carts
    for (var j = 0; j < data.length; j++) {
      var data1 = data[j].Cartlist
      for (var i = 0; i < data1.length; i++) {
        // console.log(data1[i].selected)
        if (data1[i].selected) {
          str += data1[i].ID + ","
        }
      }
    }
    var reg = /,$/gi;
    str = str.replace(reg, "");
    if (str == "") {
      util.toast("您还没有选择宝贝哦")
      return;
    }
    console.log(str)
    util.request("/WxShopCart/DeleteCartProduct", {
      listid: str
    }, "POST", false).then((res) => {
      console.log(res)
      this.loaddata()
      this.setData({
        selectAllStatus: false,
        modal1: false
      })
    })
  },
  clearpro: function() {
    util.request("/WxShopCart/DelInvalid", {}, "POST", false).then((res) => {
      this.setData({
        invalid: [],
        modal2: false
      })
      this.loaddata()
    })
  },
  hidemodal1: function() {
    this.setData({
      modal1: false
    })
  },
  hidemodal2: function() {
    this.setData({
      modal2: false
    })
  },
  showmodal1: function() {
    this.setData({
      modal1: true
    })
  },
  showmodal2: function() {
    this.setData({
      modal2: true
    })
  },
  hide: function() {
    this.setData({
      choosemodelflag: false
    })
  },
  reselect: function(e) {
    console.log(e.currentTarget.dataset.current)
    var id = e.currentTarget.dataset.current
    var cartid = e.currentTarget.dataset.cartid
    var infoModel = e.currentTarget.dataset.info
    var storage = e.currentTarget.dataset.storage
    var price = e.currentTarget.dataset.price
    var img = e.currentTarget.dataset.img
    console.log(infoModel)
    this.setData({
      goodsid: id,
      cartid
    })
    this.setData({
      choosemodelflag: true
    })
    // util.request("/WxProductData/GetProductInfo", {
    //   id: this.data.goodsid
    // }, "POST", false).then((res) => {
    //   console.log(res)
    //   this.setData({
    //     infoModel: res.data.InfoModel,
    //     storage: res.data.InfoModel.Storage,
    //     marketPrice: res.data.InfoModel.MarketPrice,
    //     // Shop: res.data.Shop[0],
    //     // IsCare: res.data.Shop[0].IsCare,
    //   })
    //   var productrule = JSON.parse(this.data.infoModel.ProductRule)
    //   console.log(productrule)
    //   this.setData({
    //     productrule: productrule
    //   })
    // })
    this.setData({
      storage: storage,
      marketPrice: price,
      img: img
    })
    var productrule = JSON.parse(infoModel)
    console.log(productrule)
    this.setData({
      productrule: productrule
    })
  },
  choosemodel: function(e) {
    this.setData({
      value: 1
    })
    console.log(e.currentTarget.dataset.current);
    console.log(e.currentTarget.dataset.name);

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
    util.request("/WxProductData/GetProductGoodInfo", {
      proid: this.data.goodsid,
      vailS: modalstr
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        storage: res.data.Storage,
        marketPrice: res.data.MarketPrice,
        modalid: res.data.GoodID,
        TuanPrice: res.data.TuanPrice
      })
    })
  },
  change1: function(e) {
    console.log(e.detail.value)
    this.setData({
      value: e.detail.value
    })
  },
  // 重选提交
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
    if (this.data.storage == 0) {
      util.toast("当前规格库存不足")
      return
    }
    util.request("/WxShopCart/Upspecifications", {
      ID: this.data.cartid,
      GoodsID: this.data.modalid,
      Quantity: this.data.value
    }, "GET", false).then((res) => {
      console.log(res)
      if (res.Msg == "重选成功") {
        this.loaddata()
        this.setData({
          selectAllStatus: false,
          choosemodelflag: false
        })
      } else {
        util.toast("重选失败")
      }
    })
  },
  togoodsdetail: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `../../proDetail/proDetail?id=${id}`,
    })
  },
  tocreateposter: function (e) {
    var cur = e.currentTarget.dataset.current
    util.request("/WxShare/GeneratePrice", {
      productID: cur
    }, "GET", false).then((res) => {
      console.log(res)
      var img = res.Msg
      wx.navigateTo({
        url: '../../../extend-view1/createposter/createposter?img=' + img,
      })
    })
  }
})