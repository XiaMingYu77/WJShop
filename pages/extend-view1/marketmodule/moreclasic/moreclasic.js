// pages/extend-view1//marketmodule/moreclasic/moreclasic.js
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
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

    this.setData({
      key: options.key,
      id: options.id
    })
    console.log(options)

    util.request("/WXHome/IndexCateMore", {
      cate: this.data.id,
      page: 1,
      type: 1
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        goodslist: res.data
      })
    })
  },
  back: function() {
    // var isshare = wx.getLaunchOptionsSync().scene
    // if (isshare == 1007 || isshare == 1008) {
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
    util.request("/WXHome/IndexCateMore", {
      cate: this.data.id,
      page: 1,
      type: 1
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        goodslist: res.data
      })
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    util.request("/WXHome/IndexCateMore", {
      cate: this.data.id,
      page: this.data.page+1,
      type: 1
    }, "GET", false).then((res) => {
      console.log(res)
      if (res.data.length==0){
        util.toast("没有更多数据了")
        return
      }
      this.setData({
        goodslist: this.data.goodslist.concat(res.data),
        page: this.data.page + 1
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  togoodsdetail: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `../../../extend-view/proDetail/proDetail?id=${id}`,
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
        url: '../../createposter/createposter?img=' + img,
      })
    })
  }
})