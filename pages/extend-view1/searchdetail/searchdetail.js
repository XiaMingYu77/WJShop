// pages/extend-view1//searchdetail/searchdetail.js
const util = require('../../../utils/util.js')
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
    goodslist: [],
    priceflag: '3',
    priceflag1:'',
    flag: true,
    pageIndex:1,
    morelistpage:1
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
      inputTop: obj.top + (obj.height - 30) / 2,
      arrowTop: obj.top + (obj.height - 32) / 2,
      searchKey: options.searchKey || ""
    }, () => {
      wx.getSystemInfo({
        success: (res) => {
          this.setData({
            //略小，避免误差带来的影响
            dropScreenH: this.data.height * 750 / res.windowWidth + 186,
            drawerH: res.windowHeight - res.windowWidth / 750 * 100 - this.data.height
          })
        }
      })
    });

    console.log(this.data.searchKey)
    util.request("/WXHome/SearchPage", {
      orderType: '1',
      productName: this.data.searchKey,
      pageIndex: '1'
    }, "POST", false).then((res) => {
      console.log(res)
      if (res.data.productlist.length==0){
        this.setData({
          flag:false
        })
      }
      this.setData({
        goodslist: res.data.productlist
      })
    })

    util.request("/WXHome/IndexCateMore", {
      cate: 3,
      page: 1
    }, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        morelist: res.data
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
    if(this.data.flag){
      let index = this.data.tabIndex;
      if (index == '0') {
        util.request("/WXHome/SearchPage", {
          orderType: '1',
          productName: this.data.searchKey,
          pageIndex: '1'
        }, "POST", false).then((res) => {
          console.log(res)
          this.setData({
            goodslist: res.data.productlist,
            priceflag: '',
            pageIndex:1
          })
          wx.stopPullDownRefresh()
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
            priceflag: '',
            pageIndex: 1
          })
          wx.stopPullDownRefresh()
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
              priceflag: '4',
              pageIndex: 1
            })
            wx.stopPullDownRefresh()
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
              priceflag: '3',
              pageIndex: 1
            })
            wx.stopPullDownRefresh()
          })
        }
      }
    }else{
      util.request("/WXHome/SearchPage", {
        orderType: '1',
        productName: this.data.searchKey,
        pageIndex: '1'
      }, "POST", false).then((res) => {
        console.log(res)
        if (res.data.productlist.length == 0) {
          this.setData({
            flag: false
          })
        }
        this.setData({
          goodslist: res.data.productlist,
          pageIndex:1
        })

        util.request("/WXHome/IndexCateMore", {
          cate: 3,
          page: 1
        }, "POST", false,true).then((res) => {
          console.log(res)
          this.setData({
            morelist: res.data,
            morelistpage:1
          })
        })
        wx.stopPullDownRefresh()
      })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.flag) {
      let index = this.data.tabIndex;
      if (index == '0') {
        console.log(this.data.pageIndex)
        util.request("/WXHome/SearchPage", {
          orderType: '1',
          productName: this.data.searchKey,
          pageIndex: this.data.pageIndex + 1
        }, "POST", false).then((res) => {
          console.log(res)
          if (res.data.productlist.length==0){
            util.toast("暂无更多数据")
            return
          }
          this.setData({
            goodslist: this.data.goodslist.concat(res.data.productlist),
            priceflag: '',
            pageIndex: this.data.pageIndex+1
          })
        })
      } else if (index == "1") {
        util.request("/WXHome/SearchPage", {
          orderType: '2',
          productName: this.data.searchKey,
          pageIndex: this.data.pageIndex + 1
        }, "POST", false).then((res) => {
          if (res.data.productlist.length == 0) {
            util.toast("暂无更多数据")
            return
          }
          console.log(res)
          this.setData({
            goodslist: this.data.goodslist.concat(res.data.productlist),
            priceflag: '',
            pageIndex: this.data.pageIndex + 1
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
            pageIndex: this.data.pageIndex + 1
          }, "POST", false).then((res) => {
            if (res.data.productlist.length == 0) {
              util.toast("暂无更多数据")
              return
            }
            console.log(res)
            this.setData({
              goodslist: this.data.goodslist.concat(res.data.productlist),
              priceflag: '4',
              pageIndex: this.data.pageIndex + 1
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
            pageIndex: this.data.pageIndex + 1
          }, "POST", false).then((res) => {
            if (res.data.productlist.length == 0) {
              util.toast("暂无更多数据")
              return
            }
            console.log(res)
            this.setData({
              goodslist: this.data.goodslist.concat(res.data.productlist),
              priceflag: '3',
              pageIndex: this.data.pageIndex + 1
            })
          })
        }
      }
    } else {
      util.request("/WXHome/SearchPage", {
        orderType: '1',
        productName: this.data.searchKey,
        pageIndex: '1'
      }, "POST", false).then((res) => {
        console.log(res)
        if (res.data.productlist.length == 0) {
          this.setData({
            flag: false
          })
        }
        this.setData({
          goodslist: res.data.productlist,
          pageIndex: 1
        })

        util.request("/WXHome/IndexCateMore", {
          cate: 3,
          page: this.data.morelistpage+1
        }, "POST", false, true).then((res) => {
          console.log(res)
          this.setData({
            morelist: this.data.morelist.concat(res.data),
            morelistpage: this.data.morelistpage + 1
          })
        })
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  back: function() {
    let pages = getCurrentPages(); // 当前页的数据，可以输出来看看有什么东西
    let prevPage = pages[pages.length - 2]; // 上一页的数据，也可以输出来看看有什么东西
    /** 设置数据 这里面的 value 是上一页你想被携带过去的数据，
后面是本方法里你得到的数据，我这里是detail.value，根据自己实际情况设置 */
    prevPage.setData({
      searchRecord: wx.getStorageSync('searchRecord') || [],
    })
    /** 返回上一页 这个时候数据就传回去了 可以在上一页的onShow方法里把 value 输出来查看是否已经携带完成 */
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
      tabIndex: index,
      pageIndex:1
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
          priceflag1:"3"
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
  search: function() {
    // wx.navigateTo({
    //   url: '../../extend-view/news-search/news-search'
    // })
    let pages = getCurrentPages(); // 当前页的数据，可以输出来看看有什么东西
    let prevPage = pages[pages.length - 2]; // 上一页的数据，也可以输出来看看有什么东西
    /** 设置数据 这里面的 value 是上一页你想被携带过去的数据，
后面是本方法里你得到的数据，我这里是detail.value，根据自己实际情况设置 */
    prevPage.setData({
      searchRecord: wx.getStorageSync('searchRecord') || [],
    })
    /** 返回上一页 这个时候数据就传回去了 可以在上一页的onShow方法里把 value 输出来查看是否已经携带完成 */
    wx.navigateBack({})
  },
  togoodsdetail: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `../../extend-view/proDetail/proDetail?id=${id}`,
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
        url: '../createposter/createposter?img=' + img,
      })
    })
  },
  tofindgoods: function(){
    wx.navigateTo({
      url: '../../extend-view/search/findgoods/findgoods',
    })
  }
})