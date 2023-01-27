// pages/extend-view1//mymenmber/mymember.js
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        name: "普通会员"
      },
      {
        name: "超级会员"
      },
      {
        name: "导师"
      },
      {
        name: "合伙人"
      }
    ],
    selected: 0,
    flag1: false,
    flag2: false,
    count:0,
    myhy:0,
    PageIndex:1
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
    
    util.request("/WxJuniormembers/GetMembers", {
      PageIndex: 1,
      PageSize: 10,
      type: 1
    }, "POST", false).then((res) => {
      if (res.data.lists.length == 0) {
        this.setData({
          flag1: true
        })
      }
      var list = res.data.lists
      for (var i = 0; i < list.length; i++) {
        if (list[i].RegisterTime) {
          var str = list[i].RegisterTime
          str = str.slice(6)
          str = str.substring(0, str.length - 2);
          list[i].RegisterTime = this.getTime(str * 1)
          // console.log(this.getTime(str * 1))
        }
      }
      console.log(res.data)
      this.setData({
        registermember: res.data,
        registerlist: list,
        count: res.data.Count,
        myhy: res.data.Myhy
      })
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
    const Mon = time.getMonth() + 1;
    const Day = time.getDate();
    const H = time.getHours();
    const Min = time.getMinutes();
    const S = time.getSeconds();
    //自定义选择想要返回的类型
    if (type == "Y") {
      return `${Y}-${Mon}-${Day}`
    } else if (type == "H") {
      return `${H}:${Min}:${S}`
    } else {
      return `${Y}-${Mon}-${Day} ${H}:${Min}:${S}`
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
    util.request("/WxJuniormembers/GetMembers", {
      PageIndex: 1,
      PageSize: 10,
      type: this.data.selected+1
    }, "POST", false).then((res) => {
      if (res.data.lists.length == 0) {
        this.setData({
          flag1: true
        })
      }
      var list = res.data.lists
      for (var i = 0; i < list.length; i++) {
        if (list[i].RegisterTime) {
          var str = list[i].RegisterTime
          str = str.slice(6)
          str = str.substring(0, str.length - 2);
          list[i].RegisterTime = this.getTime(str * 1)
          // console.log(this.getTime(str * 1))
        }
      }
      console.log(res.data)
      this.setData({
        registermember: res.data,
        registerlist: list,
        count: res.data.Count,
        myhy: res.data.Myhy
      })
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    util.request("/WxJuniormembers/GetMembers", {
      PageIndex: this.data.PageIndex+1,
      PageSize: 10,
      type: this.data.selected + 1
    }, "POST", false).then((res) => {
      if (res.data.lists.length == 0) {
        util.toast("暂无更多数据")
        return
      }
      var list = res.data.lists
      for (var i = 0; i < list.length; i++) {
        if (list[i].RegisterTime) {
          var str = list[i].RegisterTime
          str = str.slice(6)
          str = str.substring(0, str.length - 2);
          list[i].RegisterTime = this.getTime(str * 1)
          // console.log(this.getTime(str * 1))
        }
      }
      console.log(res.data)
      this.setData({
        registermember: this.data.registermember.concat(res.data),
        registerlist: this.data.list.concat(list),
        count: res.data.Count,
        myhy: res.data.Myhy,
        PageIndex: this.data.PageIndex + 1
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  change: function(e) {
    const cur = e.currentTarget.dataset.index
    console.log(cur)
    this.setData({
      selected: cur,
      PageIndex: 1,
      flag1: false
    })
    // if(cur==0){
    //   this.setData({
    //     count: this.data.registermember.Count,
    //     myhy: this.data.registermember.Myhy
    //   })
    // }else{
    //   this.setData({
    //     count: this.data.supermember.Count,
    //     myhy: this.data.supermember.Myhy
    //   })
    // }
    util.request("/WxJuniormembers/GetMembers", {
      PageIndex: 1,
      PageSize: 10,
      type: cur+1
    }, "POST", false).then((res) => {
      if (res.data.lists.length == 0) {
        this.setData({
          flag1: true
        })
      }
      var list = res.data.lists
      for (var i = 0; i < list.length; i++) {
        if (list[i].RegisterTime) {
          var str = list[i].RegisterTime
          str = str.slice(6)
          str = str.substring(0, str.length - 2);
          list[i].RegisterTime = this.getTime(str * 1)
          // console.log(this.getTime(str * 1))
        }
      }
      console.log(res.data)
      this.setData({
        registermember: res.data,
        registerlist: list,
        count: res.data.Count,
        myhy: res.data.Myhy
      })
    })
  },
  tomemberdetail: function(e) {
    var cur = e.currentTarget.dataset.current
    var name = e.currentTarget.dataset.name
    console.log(cur)
    wx.navigateTo({
      url: `../memberdetail/memberdetail?id=${cur}&name=${name}`,
    })
  },
  back: function () {
    var isshare = wx.getLaunchOptionsSync().scene
    if (isshare == 1007 || isshare == 1008) {
      wx.reLaunch({
        url: '/pages/wujieindex/wujieindex'
      })
    } else {
      wx.navigateBack()
    }
  }
})