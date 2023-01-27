// pages/mycenter-extend//myevaluation/myevaluation.js
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        name: "待评价"
      },
      {
        name: "已评价"
      }
    ],
    selected: 0,
    current: 2,
    pageindex: 1,
    dataflag: true
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
    this.getdata()
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
  getdata: function() {
    util.request('/WxProductComment/GetNotProductCommentModel', {
      pageSize: 10,
      pageIndex: 1
    }, 'POST', false).then((res) => {
      console.log(res)
      this.setData({
        waitevaluation: res.data
      })
      if (this.data.waitevaluation.length == 0) {
        this.setData({
          dataflag: false
        })
      }
    })

    util.request('/WxProductComment/GetMyProductCommentModel', {
      pageSize: 10,
      pageIndex: 1
    }, 'POST', false).then((res) => {
      console.log(res)
      var ProductComment = res.data.ProductComment
      console.log(ProductComment)
      for (var i = 0; i < ProductComment.length; i++) {
        var str = ProductComment[i].AddDate
        str = str.slice(6)
        str = str.substring(0, str.length - 2);
        ProductComment[i].AddDate = this.getTime(str * 1, "Y")
        console.log(ProductComment[i].AddDate)
      }
      this.setData({
        ProductComment: res.data.ProductComment
      })
      if (this.data.ProductComment.length == 0) {
        this.setData({
          dataflag: false
        })
      }
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
    if (this.data.selected == '0') {
      util.request('/WxProductComment/GetNotProductCommentModel', {
        pageSize: 10,
        pageIndex: 1
      }, 'POST', false).then((res) => {
        console.log(res)
        this.setData({
          waitevaluation: res.data
        })
        if (this.data.waitevaluation.length == 0) {
          this.setData({
            dataflag: false
          })
        }
      })
    } else {
      util.request('/WxProductComment/GetMyProductCommentModel', {
        pageSize: 10,
        pageIndex: 1
      }, 'POST', false).then((res) => {
        console.log(res)
        var ProductComment = res.data.ProductComment
        console.log(ProductComment)
        for (var i = 0; i < ProductComment.length; i++) {
          var str = ProductComment[i].AddDate
          str = str.slice(6)
          str = str.substring(0, str.length - 2);
          ProductComment[i].AddDate = this.getTime(str * 1, "Y")
          console.log(ProductComment[i].AddDate)
        }
        this.setData({
          ProductComment: res.data.ProductComment
        })
        if (this.data.ProductComment.length == 0) {
          this.setData({
            dataflag: false
          })
        }
      })
    }
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
    if (this.data.selected == 0) {
      util.request('/WxProductComment/GetNotProductCommentModel', {
        pageSize: 10,
        pageIndex: 1
      }, 'POST', false).then((res) => {
        console.log(res)
        this.setData({
          waitevaluation: res.data
        })
        if (this.data.waitevaluation.length == 0) {
          this.setData({
            dataflag: false
          })
        }
        wx.stopPullDownRefresh()
      })
    } else {
      util.request('/WxProductComment/GetMyProductCommentModel', {
        pageSize: 10,
        pageIndex: 1
      }, 'POST', false).then((res) => {
        console.log(res)
        var ProductComment = res.data.ProductComment
        console.log(ProductComment)
        for (var i = 0; i < ProductComment.length; i++) {
          var str = ProductComment[i].AddDate
          str = str.slice(6)
          str = str.substring(0, str.length - 2);
          ProductComment[i].AddDate = this.getTime(str * 1, "Y")
          console.log(ProductComment[i].AddDate)
        }
        this.setData({
          ProductComment: res.data.ProductComment
        })
        if (this.data.ProductComment.length == 0) {
          this.setData({
            dataflag: false
          })
        }
        wx.stopPullDownRefresh()
      })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log(111)
    var selected = this.data.selected
    if (selected == '0') {
      util.request('/WxProductComment/GetNotProductCommentModel', {
        pageSize: 10,
        pageIndex: this.data.pageindex + 1
      }, 'POST', false, true).then((res) => {
        console.log(res)
        this.setData({
          waitevaluation: this.data.waitevaluation.concat(res.data),
          pageindex: this.data.pageindex + 1
        })
        // if (this.data.waitevaluation.length == 0) {
        //   this.setData({
        //     dataflag: false
        //   })
        // }
      })
    } else {
      util.request('/WxProductComment/GetMyProductCommentModel', {
        pageSize: 10,
        pageIndex: this.data.pageindex + 1
      }, 'POST', false, true).then((res) => {
        console.log(res)
        var ProductComment = res.data.ProductComment
        console.log(ProductComment)
        for (var i = 0; i < ProductComment.length; i++) {
          var str = ProductComment[i].AddDate
          str = str.slice(6)
          str = str.substring(0, str.length - 2);
          ProductComment[i].AddDate = this.getTime(str * 1, "Y")
          console.log(ProductComment[i].AddDate)
        }
        this.setData({
          ProductComment: this.data.ProductComment.concat(res.data.ProductComment),
          pageindex: this.data.pageindex + 1
        })
        // if (this.data.ProductComment.length == 0) {
        //   this.setData({
        //     dataflag: false
        //   })
        // }
      })
    }



  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  change: function(e) {
    this.setData({
      dataflag: true
    })
    const cur = e.currentTarget.dataset.index
    this.setData({
      selected: cur,
    })
    if (cur == '0') {
      util.request('/WxProductComment/GetNotProductCommentModel', {
        pageSize: 10,
        pageIndex: 1
      }, 'POST', false).then((res) => {
        console.log(res)
        this.setData({
          waitevaluation: res.data,
          pageindex: 1
        })
        if (this.data.waitevaluation.length == 0) {
          this.setData({
            dataflag: false
          })
        }
      })
    } else {
      util.request('/WxProductComment/GetMyProductCommentModel', {
        pageSize: 10,
        pageIndex: 1
      }, 'POST', false).then((res) => {
        console.log(res)
        var ProductComment = res.data.ProductComment
        console.log(ProductComment)
        for (var i = 0; i < ProductComment.length; i++) {
          var str = ProductComment[i].AddDate
          str = str.slice(6)
          str = str.substring(0, str.length - 2);
          ProductComment[i].AddDate = this.getTime(str * 1, "Y")
          console.log(ProductComment[i].AddDate)
        }
        this.setData({
          ProductComment: res.data.ProductComment,
          pageindex: 1
        })
        if (this.data.ProductComment.length == 0) {
          this.setData({
            dataflag: false
          })
        }
      })
    }
  },
  change1: function(e) {
    this.setData({
      index: e.detail.index,
      current: e.detail.index
    })
  },
  topublishevaluation: function(e) {
    var cur = e.currentTarget.dataset.current;
    // cur = JSON.stringify(cur)
    console.log(cur)
    wx.navigateTo({
      url: '../publishevaluation/publishevaluation?data=' + cur,
    })
  },
  tomyevaluationdetail: function(e) {
    var cur = e.currentTarget.dataset.current
    wx.navigateTo({
      url: '../myevaluationdetail/myevaluationdetail?id=' + cur,
    })
  }
})