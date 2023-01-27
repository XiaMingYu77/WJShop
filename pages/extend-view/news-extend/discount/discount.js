// pages/extend-view//news-extend/discount/discount.js
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

    util.request("/WxMsgPush/GetActivityMsgList", {}, "POST", false).then((res) => {
      console.log(res)
      var activitylist = res.data
      for (var i = 0; i < activitylist.length; i++) {
        if (activitylist[i].createdate) {
          var str = activitylist[i].createdate
          str = str.slice(6)
          str = str.substring(0, str.length - 2);
          activitylist[i].createdate = this.getTime(str * 1)
          // console.log(this.getTime(str * 1))
        }
      }
      this.setData({
        activitylist
      })
    })
  },
  back: function () {
    wx.navigateBack({

    })
  },
  getTime: function(data, type) {
    var _data = data;
    //如果是13位正常，如果是10位则需要转化为毫秒
    if (String(data).length == 13) {
      _data = data
    } else {
      _data = data * 1000
    }
    const time = new Date(_data);
    const Y = time.getFullYear();
    const Mon = time.getMonth() < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
    const Day = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
    const H = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
    const Min = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    const S = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
    //自定义选择想要返回的类型
    if (type == "Y") {
      return `${Y}-${Mon}-${Day}`
    } else if (type == "H") {
      return `${H}:${Min}:${S}`
    } else {
      return `${Y}年${Mon}月${Day} ${H}:${Min}`
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
    util.request("/WxMsgPush/GetActivityMsgList", {}, "POST", false).then((res) => {
      console.log(res)
      var activitylist = res.data
      for (var i = 0; i < activitylist.length; i++) {
        if (activitylist[i].createdate) {
          var str = activitylist[i].createdate
          str = str.slice(6)
          str = str.substring(0, str.length - 2);
          activitylist[i].createdate = this.getTime(str * 1)
          // console.log(this.getTime(str * 1))
        }
      }
      this.setData({
        activitylist
      })
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  toproductdetail: function(e) {
    var cur = e.currentTarget.dataset.current;
    console.log(cur)
    wx.navigateTo({
      url: `../../../extend-view/proDetail/proDetail?id=${cur}`,
    })
  },
  findgoods:function(e){
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    if(index=='3'){
      wx.navigateTo({
        url: `../../../extend-view/proDetail/proDetail?id=${id}`,
      })
    }
  }
})