// pages/extend-view1//marketmodule/luckdraw/luckdraw.js
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    awardList: [], //奖品数组
    indexSelect: -1, //被选中的奖品index
    isRunning: false, //是否正在抽奖
    modal1: false,
    modal2: false,
    rulemodal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!wx.getStorageSync("sessionId")) {
      wx.navigateTo({
        url: '../../../login/login'
      })
      return
    }
    util.request("/WxDraw/GetMyInvitation", {}, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        myinvite: res.data
      })
    })

    util.request("/WxDraw/GetNewsDraw", {}, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        awardList: res.data.DrawProduct,
        drawinfo: res.data.DrawInfo
      })
    })

    util.request("/WxDraw/GetMyDrawCount", {}, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        count: res.data.Count
      })
    })

    util.request("/WxDocumenInfo/GetAboutus", {
      Type: "738abe50cc3f43ecb93ff3ad565b78ed"
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        rule: res.data[0]
      })
    })

    util.request("/WxDraw/GetWinningRecordRolling", {}, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        roll: res.data
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
    util.request("/WxDraw/GetMyInvitation", {}, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        myinvite: res.data
      })
    })

    util.request("/WxDraw/GetNewsDraw", {}, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        awardList: res.data.DrawProduct,
        drawinfo: res.data.DrawInfo
      })
    })

    util.request("/WxDraw/GetMyDrawCount", {}, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        count: res.data.Count
      })
    })

    util.request("/WxDocumenInfo/GetAboutus", {
      Type: "738abe50cc3f43ecb93ff3ad565b78ed"
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        rule: res.data[0]
      })
    })

    util.request("/WxDraw/GetWinningRecordRolling", {}, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        roll: res.data
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
    // let url = encodeURIComponent('/pages/extend-view1/marketmodule/luckdraw/luckdraw');
    return {
      title: "新人福利"
    }
  },
  getRandom: function(u) {
    let rnd = Math.random() > 0.5 ? "2" : "1";
    u = u || 3;
    for (var i = 0; i < u; i++) {
      rnd += Math.floor(Math.random() * 10);
    }
    return Number(rnd);
  },
  drawing: function() {
    if (this.data.count == '0') {
      util.toast("您没有抽奖机会了")
      return
    }
    util.request("/WxDraw/LuckDraw", {
      F_Main_GUID: this.data.drawinfo.F_GUID
    }, "GET", false).then((res) => {
      console.log(res)
      if (res.data.ProductName == '谢谢惠顾') {
        this.setData({
          isselect:1
        })
        console.log(111)
      } else {
        this.setData({
          isselect: 2
        })
        console.log(222)
      }
      this.setData({
        name: res.data.ProductName,
        img: res.data.Img,
        sort: res.data
      })
      this.startDrawing()
    })
  },
  //开始抽奖
  startDrawing: function() {
    if (this.data.isRunning) return
    this.setData({
      isRunning: true
    })
    let indexSelect = -1
    let i = 0;
    let randomNum = this.getRandom(3);
    let timer = setInterval(() => {
      ++indexSelect;
      //这里用y=30*x+150函数做的处理.可根据自己的需求改变转盘速度
      indexSelect = indexSelect % 8;
      this.setData({
        indexSelect: indexSelect
      })
      i += 40;
      console.log(randomNum)
      if (i > randomNum) {
        //去除循环
        clearInterval(timer);
        this.setData({
          indexSelect: this.data.sort.F_Sort - 1,
          isRunning: false
        })
        if (this.data.isselect == 1) {
          this.setData({
            modal1:true
          })
        } else {
          this.setData({
            modal2: true
          })
        }
        timer = null;
        util.request("/WxDraw/GetMyDrawCount", {}, "GET", false).then((res) => {
          console.log(res)
          this.setData({
            count: res.data.Count
          })
        })
      }
    }, (70 + i))
  },
  hide: function() {
    this.setData({
      modal1: false
    })
  },
  hidemodal:function(){
    this.setData({
      modal2:false
    })
  },
  toaddresswrite: function() {
    wx.navigateTo({
      url: '../fillinrecordaddress/fillinrecordaddress?id=' + this.data.sort.ID
    })
    this.setData({
      modal2:false
    })
  },
  towinningrecord: function() {
    wx.navigateTo({
      url: '../winningrecord/winningrecord',
    })
  },
  hide1: function() {
    this.setData({
      rulemodal: false
    })
  },
  showrulemodal: function() {
    this.setData({
      rulemodal: true
    })
  },
  know:function(){
    this.setData({
      modal1:false
    })
  }
})