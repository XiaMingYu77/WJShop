// pages/extend-view1//marketmodule/newpeople/newpeople.js
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rulemodal:false
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

    console.log(this.data.id)
    util.request("/WxHome/NewWelfare", {
      ID: 'hd0010',
      PageIndex: '1'
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        isnew: res.data.Isnews,
        // isnew:true,
        goodlist: res.data._ProductInfoList
      })
    })

    util.request("/WxDocumenInfo/GetAboutus", {
      Type: "a89d717b7d864ce1acf5f35a81e8255d"
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        rule: res.data[0]
      })
    })
  },
  refresh: function() {
    util.request("/WxHome/NewWelfare", {
      ID: 'hd0010',
      PageIndex: '1'
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        isnew: res.data.Isnews,
        goodlist: res.data._ProductInfoList
      })
    })
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
  togoodsdetail: function (e) {
    console.log(this.data.isnew)
    // if (!this.data.isnew){
    //   util.toast("该活动新用户才可以参与哦");
    //   return;
    // }
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `../../../extend-view/proDetail/proDetail?id=${id}&isnew=true&newflag=true&OrderSource=hd0010`,
    })
  },
  tochoujiang:function(){
    wx.navigateTo({
      url: '../luckdraw/luckdraw',
    })
  },
  showrule:function(){
    this.setData({
      rulemodal: true
    })
  },
  hide:function(){
    this.setData({
      rulemodal:false
    })
  }
})