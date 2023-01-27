// pages/message/message.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unread:'',
    message_number:4,
    message:[
      {
        img:"https://shop.we-time.net/images/icons/transactionlogistics.png",
        title:"交易物流",
        to:"logistics"
      },
      {
        img: "https://shop.we-time.net/images/icons/offerinformation.png",
        title: "优惠活动",
        to:"discount"
      },
      {
        img: "https://shop.we-time.net/images/icons/shopinformation.png",
        title: "商家信息",
        to:"shopinformation"
      },
      {
        img: "https://shop.we-time.net/images/icons/customerservice.png",
        title: "官方客服",
        to: "replylist"
      } 
    ],
    productList: [],
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var repercent = wx.getStorageSync("RePecent")
    var ratepercent = wx.getStorageSync("RatePecent")
    var ordinaryrepercent = wx.getStorageSync("OrdinaryRePecent")
    var unread = wx.getStorageSync("number_msg")
    console.log(repercent, ratepercent)
    this.setData({
      repercent,
      ratepercent,
      ordinaryrepercent,
      unread
    })
    util.request("/WXHome/IndexCateMore", {
      cate:3,
      page:1
    }, "POST", false).then((res) => {
      console.log(res.data)
      this.setData({
        productList:res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    util.request("/WXHome/IndexCateMore", {
      cate: 3,
      page: this.data.page+1
    }, "POST", false).then((res) => {
      console.log(res.data)
      if (res.data.length==0){
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
  onShareAppMessage: function () {

  },
  href:function(e){
    if (!wx.getStorageSync("sessionId")){
      wx.navigateTo({
        url: '../login/login?backflag=detail'
      })
      return
    }
    var cur = e.currentTarget.dataset.current;
    console.log(cur)
    wx.navigateTo({
      url: `../extend-view/news-extend/${cur}/${cur}`
    })
  },
  togoodsdetail: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `../extend-view/proDetail/proDetail?id=${id}`,
    })
  },
  tocreateposter: function (e) {
    var cur = e.currentTarget.dataset.current
    util.request("/WxShare/GeneratePrice", {
      productID: cur
    }, "GET", false).then((res) => {
      if (res.Code == '401') {
        wx.navigateTo({
          url: '../login/login?invitenum=' + this.data.invitenum
        })
        return
      }
      console.log(res)
      var img = res.Msg
      wx.navigateTo({
        url: '../extend-view1/createposter/createposter?img=' + img,
      })
    })
  }
})