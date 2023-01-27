// pages/extend-view1//inviteassemble/inviteassemble.js
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeList: 0,
    modal: true,
    page: 1,
  },

  /**
   * 
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

    var memberid = wx.getStorageSync("MemID")
    this.setData({
      orderno: options.orderno,
      memberid: memberid
    })
    console.log(options)
    // wx.setStorageSync("memberid", this.data.memberid)

    util.request("/WxTuanOrder/GetInviteSpellGroup", {
      OrderID: this.data.orderno,
      MemberID: this.data.memberid
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        info: res.data.Entity
      })
      var str = res.data.Entity.EndTime
      str = str.slice(6)
      str = str.substring(0, str.length - 2);
      var timestamp = Date.parse(new Date());
      var time = (str * 1 - timestamp) / 1000
      this.setData({
        timeList: time
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
  back: function() {
    var isshare = wx.getLaunchOptionsSync().scene
    console.log(isshare)
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
      OrderID: this.data.orderno,
      MemberID: this.data.memberid
    }, "GET", false).then((res) => {
      console.log(res.data)
      this.setData({
        info: res.data.Entity
      })
      var str = res.data.Entity.EndTime
      str = str.slice(6)
      str = str.substring(0, str.length - 2);
      var timestamp = Date.parse(new Date());
      var time = (str * 1 - timestamp) / 1000
      this.setData({
        timeList: time
      })

      util.request("/WXHome/IndexCateMore", {
        cate: this.data.info.FirstCateID,
        page: 1
      }, "POST", false).then((res) => {
        console.log(res.data)
        if (res.data.length==0){
          util.toast("暂无更多数据")
          return
        }
        this.setData({
          productList: this.data.productList.concat(res.data),
          page:1
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
      page: this.data.page+1
    }, "POST", false).then((res) => {
      console.log(res.data)
      this.setData({
        productList: res.data,
        page: this.data.page + 1
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res.from == 'button') {
      var memid = wx.getStorageSync("MemID")
      return {
        title: `☛仅剩一个名额☚我${this.data.info.TuanPrice}元拼了${this.data.info.ProductName}`,
        path: `/pages/extend-view1/links/links?orderid=${this.data.orderno}&memberid=${memid}&shareflag=true`,
        imageUrl: this.data.info.ThumbnailImg,
        success: function(res) {
          // 转发成功
        },
        fail: function(res) {
          // 转发失败
        }
      }
    }
  },
  closemodal: function() {
    this.setData({
      modal: false
    })
  },
  showmodal: function() {
    this.setData({
      modal: true
    })
  },
  tohome: function() {
    wx.reLaunch({
      url: '../../wujieindex/wujieindex',
    })
  }
})