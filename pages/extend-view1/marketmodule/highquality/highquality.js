// pages/extend-view1//marketmodule/hotlist/hotlist.js
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    interval: 2000,
    duration: 500,
    PageIndex: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    console.log("onLoad")

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
      id: options.id
    })

    console.log(this.data.id)
    util.request("/WxHome/PremiumHairRing", {
      ID: this.data.id,
      PageIndex: '1'
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        info: res.data,
        goodlist: res.data.ProductInfoList
      })
    })

  },
  back:function(){
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
    util.request("/WxHome/PremiumHairRing", {
      ID: this.data.id,
      PageIndex: '1'
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        goodlist: res.data.ProductInfoList,
        PageIndex: 1
      })
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    util.request("/WxHome/PremiumHairRing", {
      ID: this.data.id,
      PageIndex: this.data.PageIndex+1
    }, "GET", false).then((res) => {
      console.log(res)
      if (res.data.ProductInfoList.length==0){
        util.toast("暂无更多数据")
        return
      }
      this.setData({
        goodlist: this.data.goodlist.concat(res.data.ProductInfoList),
        PageIndex: this.data.PageIndex + 1
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  change(e) {
    this.setData({
      currentTab: e.detail.index
    })
  },
  swichNav: function(e) {
    var current = e.currentTarget.dataset.current //获取当前tab的index
    var tabWidth = this.data.windowWidth / 4 // 导航tab共5个，获取一个的宽度
    console.log(this.data.windowWidth)
    this.setData({
      scrollLeft: (current - 1) * tabWidth //使点击的tab始终在居中位置
    })
    if (this.data.currentTab == current) {
      return false
    } else {
      this.setData({
        currentTab: current
      })
    }
  },
  copy: function (e) {
    var cur=e.currentTarget.dataset.current
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
  tocreateposter: function (e) {
    if (!wx.getStorageSync("sessionId")) {
      wx.navigateTo({
        url: '../login/login?backflag=detail'
      })
      return
    }
    var cur = e.currentTarget.dataset.current
    console.log(cur)
    util.request("/WxShare/GeneratePrice", {
      productID: cur
    }, "GET", false).then((res) => {
      console.log(res)
      var img = res.Msg
      wx.navigateTo({
        url: '../../createposter/createposter?img=' + img,
      })
    })
  },
  previewImage: function (e) {
    var current = e.currentTarget.dataset.current;
    var imglist = e.currentTarget.dataset.imgs;
    console.log(current,imglist)
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: imglist // 需要预览的图片http链接列表
    })
  },
  botbannerclick: function (e) {
    var id = e.currentTarget.dataset.id
    var key = e.currentTarget.dataset.key
    util.bannerclick(key, id)
  }
})