// pages/extend-view//bargaining/bargaininglist/bargaininglist.js
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: false,
    timeList: 1000,
    pageindex:1,
    choosemodelflag:false,
    selectedCurrent: [],
    selectedAttr: [],
    selectedname: [],
    hasaddress:false,
    address:"",
    activelength: "",
    rulemodal: false
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

    util.request("/WxBargain/BargainIndex", {
      ID: "6b72b004a7094a11a8e49c722b44ee7c",
      PageIndex:1,
      PageSize:10
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        barginglist:res.data
      })
    })

    // 判断有无砍价
    util.request("/WxBargain/IsOnlyOneBargain", {
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        flag: res.data
      })
      if (this.data.flag){
        util.request("/WxBargain/MyBargainInfo", {
          Memid: wx.getStorageSync("MemID")
        }, "GET", false).then((res) => {
          console.log(res)
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
            totalamount: res.data.F_NegotiatedAmount + res.data.RemainingAmount,
            timeList,
            bargingrecordid: res.data.ID
          })

          let query = wx.createSelectorQuery()
          query.select('#line').boundingClientRect((rect) => {
            this.setData({
              linewidth: rect.width
            })
            // console.log(rect.width)
            // var a = this.data.F_NegotiatedAmount * rect.width / this.data.totalamount * 2
            // console.log(a)
            // this.setData({
            //   activelength: a
            // })
          }).exec()
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
    
    // 获取规则
    util.request("/WxDocumenInfo/GetDocumenInfo", {
      Type: "cf8096bd4f1f439e8af6e29c9ade4d8c"
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        rulecontent: res.data.list[0].Content
      })
    })
  },
  back: function() {
    // var isshare = this.data.isshare
    // console.log(isshare)
    // if (isshare == 1007 || isshare == 1008 || isshare == 1089) {
    //   wx.reLaunch({
    //     url: '/pages/wujieindex/wujieindex'
    //   })
    // } else {
    //   wx.navigateBack()
    // }
    wx.navigateBack()
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
    // 判断有无砍价
    util.request("/WxBargain/IsOnlyOneBargain", {
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        flag: res.data
      })
      if (this.data.flag) {
        util.request("/WxBargain/MyBargainInfo", {
          Memid: wx.getStorageSync("MemID")
        }, "GET", false).then((res) => {
          console.log(res)
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
            totalamount: res.data.F_NegotiatedAmount + res.data.RemainingAmount,
            timeList,
            bargingrecordid: res.data.ID
          })

          let query = wx.createSelectorQuery()
          query.select('#line').boundingClientRect((rect) => {
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
    util.request("/WxBargain/IsOnlyOneBargain", {
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        flag: res.data
      })
      if (this.data.flag) {
        util.request("/WxBargain/MyBargainInfo", {
          Memid: wx.getStorageSync("MemID")
        }, "GET", false).then((res) => {
          console.log(res)
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
            totalamount: res.data.F_NegotiatedAmount + res.data.RemainingAmount,
            timeList,
            bargingrecordid: res.data.ID
          })

          let query = wx.createSelectorQuery()
          query.select('#line').boundingClientRect((rect) => {
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
          wx.stopPullDownRefresh()
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    util.request("/WxBargain/BargainIndex", {
      ID: "6b72b004a7094a11a8e49c722b44ee7c",
      PageIndex: this.data.pageindex+1,
      PageSize: 10
    }, "GET", false).then((res) => {
      console.log(res)
      if (res.data.length==0){
        util.toast("暂无更多数据")
        return
      }
      this.setData({
        barginglist: this.data.barginglist.concat(res.data),
        pageindex: this.data.pageindex+1
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  startbarging:function(e){
    console.log(this.data.flag)
    if (this.data.flag){
      util.toast("您已有砍价中的商品")
      return
    }
    var id=e.currentTarget.dataset.id
    var img = e.currentTarget.dataset.img
    var storage = e.currentTarget.dataset.storage
    var productrule = JSON.parse(e.currentTarget.dataset.productrule) 
    var name = e.currentTarget.dataset.name
    console.log(id)
    this.setData({
      id,
      choosemodelflag:true,
      modalimg:img,
      storage,
      productrule,
      name,
      selectedCurrent: [],
      selectedAttr: [],
      selectedname: []
    })
  },
  clickaddress: function (e) {
    console.log(e.currentTarget.dataset.current)
    this.setData({
      address: e.currentTarget.dataset.current
    })
  },
  tobarginggetgoods: function () {
    if (this.data.address==''){
      util.toast("请先选择地址")
      return
    }
    this.setData({
      hasaddress:false
    })
    wx.navigateTo({
      url: `../barginggetgoods/barginggetgoods?productid=${this.data.id}&modalid=${this.data.modalid}&addressid=${this.data.address.ReceiverAddressID}&img=${this.data.modalimg}&name=${this.data.name}`,
    })
  },
  hidemodelflag:function(){
    this.setData({
      choosemodelflag:false
    })
  },
  hidehasaddress:function(){
    this.setData({
      hasaddress:false,
      choosemodelflag:true
    })
  },
  choosemodel: function (e) {
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
          url: '../../../login/login?backflag=detail'
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
  choosemodalsubmit:function(){
    var num = 0
    var that = this
    for (var i = 0; i < this.data.productrule.length; i++) {
      if (this.data.productrule[i].specName) {
        num = num + 1
      }
    }
    // console.log(num)
    var r = this.data.selectedname.filter(function (s) {
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
      hasaddress:true,
      choosemodelflag:false
    })
  },
  toaddress: function () {
    wx.navigateTo({
      url: '../../mall-extend/editAddress/editAddress?prodetail=' + true,
    })
  },
  tobargainingunderway:function(){
    wx.navigateTo({
      url: '../bargainingunderway/bargainingunderway?bargingrecordid='+this.data.bargingrecordid,
    })
  },
  hiderulemodal: function () {
    this.setData({
      rulemodal: false
    })
  },
  showrulemodal: function () {
    this.setData({
      rulemodal: true
    })
  },
  tobargingrecord: function () {
    wx.navigateTo({
      url: '../bargingrecord/bargingrecord',
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