// pages/extend-view1//shop/shop.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKey: "", //搜索关键词
    width: 200, //header宽度
    height: 64, //header高度
    inputTop: 0, //搜索框距离顶部距离
    arrowTop: 0, //箭头距离顶部距离
    tabIndex: 0, //顶部筛选索引
    selectflag: false,
    flag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var repercent = wx.getStorageSync("RePecent")
    var ratepercent = wx.getStorageSync("RatePecent")
    console.log(repercent, ratepercent)
    this.setData({
      repercent,
      ratepercent
    })
    // let obj = wx.getMenuButtonBoundingClientRect();
    // this.setData({
    //   width: obj.left,
    //   height: obj.top + obj.height + 8,
    //   inputTop: obj.top + (obj.height - 30) / 2,
    //   arrowTop: obj.top + (obj.height - 32) / 2,
    //   searchKey: options.searchKey || ""
    // }, () => {
    //   wx.getSystemInfo({
    //     success: (res) => {
    //       this.setData({
    //         //略小，避免误差带来的影响
    //         dropScreenH: this.data.height * 750 / res.windowWidth + 186,
    //         drawerH: res.windowHeight - res.windowWidth / 750 * 100 - this.data.height
    //       })
    //     }
    //   })
    // });
    let query = wx.createSelectorQuery()
    query.select('#tui-header').boundingClientRect((rect) => {
      this.setData({
        tabtop: rect.top
      })
    }).exec()
    
  },
  back: function() {
//     let pages = getCurrentPages(); // 当前页的数据，可以输出来看看有什么东西
//     let prevPage = pages[pages.length - 2]; // 上一页的数据，也可以输出来看看有什么东西
//     /** 设置数据 这里面的 value 是上一页你想被携带过去的数据，
// 后面是本方法里你得到的数据，我这里是detail.value，根据自己实际情况设置 */
//     prevPage.setData({
//       searchRecord: wx.getStorageSync('searchRecord') || [],
//     })
//     /** 返回上一页 这个时候数据就传回去了 可以在上一页的onShow方法里把 value 输出来查看是否已经携带完成 */
    var isshare = wx.getLaunchOptionsSync().scene
    if (isshare == 1007 || isshare == 1008) {
      wx.reLaunch({
        url: '/pages/wujieindex/wujieindex'
      })
    } else {
      wx.navigateBack()
    }
  },
  screen: function(e) {
    console.log(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index;
    this.setData({
      tabIndex: index
    })
    if (index == '0') {
      util.request("/WXHome/SearchPage", {
        orderType: '1',
        productName: this.data.searchKey,
        pageIndex: '1'
      }, "POST", false).then((res) => {
        console.log(res)
        this.setData({
          goodslist: res.data.productlist,
          priceflag: ''
        })
      })
    } else if (index == "1") {
      util.request("/WXHome/SearchPage", {
        orderType: '2',
        productName: this.data.searchKey,
        pageIndex: '1'
      }, "POST", false).then((res) => {
        console.log(res)
        this.setData({
          goodslist: res.data.productlist,
          priceflag: ''
        })
      })
    } else {
      // if(this.data.priceflag==''){
      //   this.setData({
      //     priceflag: '3'
      //   })
      // }
      if (this.data.priceflag == '3') {
        this.setData({
          priceflag1: "3"
        })
        util.request("/WXHome/SearchPage", {
          orderType: '3',
          productName: this.data.searchKey,
          pageIndex: '1'
        }, "POST", false).then((res) => {
          console.log(res)
          this.setData({
            goodslist: res.data.productlist,
            priceflag: '4'
          })
        })
      } else {
        this.setData({
          priceflag1: "4"
        })
        console.log(111)
        util.request("/WXHome/SearchPage", {
          orderType: '4',
          productName: this.data.searchKey,
          pageIndex: '1'
        }, "POST", false).then((res) => {
          console.log(res)
          this.setData({
            goodslist: res.data.productlist,
            priceflag: '3'
          })
        })
      }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  onPageScroll:function(e){
    // console.log(this.data.tabtop)
    // console.log(e.scrollTop)
    var scrolltop = e.scrollTop
    if (scrolltop >= this.data.tabtop){
      this.setData({
        flag: true
      })
    }else{
      this.setData({
        flag: false
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  clickdown: function() {
    this.setData({
      selectflag: !this.data.selectflag
    })
  },
  toshopdetail:function(){
    wx.navigateTo({
      url: '../shopdetail/shopdetail',
    })
  }
})