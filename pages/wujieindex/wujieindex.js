const util = require('../../utils/util.js')
import TIM from 'tim-wx-sdk';
import COS from "cos-wx-sdk-v5";
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    tab: [],
    tabScroll: 0,
    windowHeight: '',
    windowWidth: 300,
    tabs2: [{
      name: "全部商品"
    }, {
      name: "爆款推荐"
    }, {
      name: "好评优质"
    }, {
      name: "商城精选"
    }],
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    currentTab1: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    animation: false, //滚动条
    gundonglan: "B站10分日本动漫已消失，9.9分仅剩12部，这一部动漫包揽三席！", //滚动栏内容
    current: 0,
    hotSearch: [],
    banner: [],
    category: [{
      img: "jiu_1.png",
      name: "限时秒杀"
    }, {
      img: "jiu_2.png",
      name: "清仓特卖"
    }, {
      img: "jiu_3.png",
      name: "9.9包邮"
    }, {
      img: "jiu_4.png",
      name: "热销榜单"
    }, {
      img: "jiu_5.png",
      name: "砍至1元"
    }, {
      img: "jiu_6.png",
      name: "工厂直供"
    }, {
      img: "jiu_7.png",
      name: "商城宠物"
    }, {
      img: "jiu_8.png",
      name: "优惠券"
    }, {
      img: "jiu_9.png",
      name: "优质发圈"
    }, {
      img: "jiu_10.png",
      name: "每日好店"
    }],
    newsList: [],
    isGuessLoveList: [],
    isPopularList: [],
    isExcellentList: [],
    isTopHotList: [],
    list: ["isGuessLoveList", "isPopularList", "isExcellentList", "isTopHotList"],
    morelist: [],
    productList: [],
    explosionProduct: [],
    page1: [1, 1, 1, 1],
    page2: 1,
    loadding: false,
    pullUpOn: true,
    dropShow: false,
    tabflag1: true,
    left: 0,
    flag: true,
    isGoIndex: false,
    iShidden: true,
    isAuto: true,
    imageflag: false,
    invitenum: '',
    newpeopleflag: false,
    invitepeopleflag: false,
    imageshowflag: true
  },
  onLoad: function(options) {
    let query = wx.createSelectorQuery()
    query.select('#tabbigbox').boundingClientRect((rect) => {
      this.setData({
        tabtop1: rect.top
      })
    }).exec()

    // wx.checkSession({
    //   success: function (res) {
    //     console.log(res, '登录未过期')
    //     wx.showToast({
    //       title: '登录未过期啊',
    //     })
    //   },
    //   fail: function (res) {
    //     console.log(res, '登录过期了')
    //   }
    // })

    // console.log(wx.getLaunchOptionsSync())
    // console.log(options)
    // if (wx.getStorageSync('scene')){
    //   console.log(wx.getStorageSync('scene'))
    //   // wx.navigateTo({
    //   //   url: `../extend-view/proDetail/proDetail?id=${wx.getStorageSync('scene')}`,
    //   // })
    // }



    // query.select('#tui-mtop').boundingClientRect((rect) => {
    //   this.setData({
    //     tabtop2: rect.top
    //   })
    // }).exec()
    var repercent = wx.getStorageSync("RePecent")
    var ratepercent = wx.getStorageSync("RatePecent")
    var ordinaryrepercent = wx.getStorageSync("OrdinaryRePecent")
    console.log(repercent, ratepercent)
    this.setData({
      repercent,
      ratepercent,
      ordinaryrepercent,
      // imageflag: wx.getStorageSync("isnew")
    })
    if (options.invitenum) {
      invitenum: options.invitenum
    }

    util.request("/WxHome/IndexData", {}, "POST", false).then((res) => {
      console.log(res.data)
      var obj = {
        id: "1",
        name: "推荐"
      }
      var tab = res.data.tab.unshift(obj)
      console.log(tab)
      this.setData({
        tab: res.data.tab,
        banner: res.data.banner,
        newsList: res.data.newsList,
        hotSearch: res.data.hotSearch
      })
      query.select('#clasic').boundingClientRect((rect) => {
        this.setData({
          clasictap: rect.height
        })
        console.log(rect)
      }).exec()
    })

    util.request("/WXHome/GetPromActivity", {}, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        category: res.data.ActivityList,
        categorynum: res.data.ActivityList.length,
        newsProductInfo: res.data.newsProductInfo,
        highServantList: res.data.HighServantList,
        factoryList: res.data.FactoryList,
        otherList: res.data.OtherList,
        subsidyList: res.data.SubsidyList
      })
      var innerwidth = 60 * (5 / res.data.ActivityList.length)
      this.setData({
        innerwidth
      })

    })


    util.request("/WXHome/IndexProduct", {
      type: 1,
      page: 1
    }, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        isGuessLoveList: res.data
      })
    })

    util.request("/WXHome/IndexProduct", {
      type: 2,
      page: 1
    }, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        isPopularList: res.data
      })
    })

    util.request("/WXHome/IndexProduct", {
      type: 3,
      page: 1
    }, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        isExcellentList: res.data
      })
    })

    util.request("/WXHome/IndexProduct", {
      type: 4,
      page: 1
    }, "POST", false).then((res) => {
      console.log(res)
      this.setData({
        isTopHotList: res.data
      })
    })

    var userID = wx.getStorageSync('userid')
    var userSig = wx.getStorageSync('sig')
    let promise = this.gettim().login({
      userID: userID,
      userSig: userSig
    });
    promise.then(function(imResponse) {
      console.log(imResponse.data); // 登录成功
    }).catch(function(imError) {
      console.warn('login error:', imError); // 登录失败的相关信息
    });
  },
  onShow: function(options) {
    console.log(options)
    setTimeout((res) => {
      if (wx.getStorageSync('token')) {
        console.log(wx.getStorageSync("isnew") == 'true')
        let query = wx.createSelectorQuery()
        if (app.globalData.isnew == true) {
          console.log(111)
          this.setData({
            newpeopleflag: true,
          })
        } else {
          console.log(222)
          this.setData({
            invitepeopleflag: true,
            imageflag: false
          })
          query.select('.newexclusiveimg').boundingClientRect((rect) => {
            this.setData({
              newexclusiveimgtop: rect.top,
              newexclusiveimgheight: rect.height
            })
          }).exec()
        }
      }
    }, 5000)

    var repercent = wx.getStorageSync("RePecent")
    var ratepercent = wx.getStorageSync("RatePecent")
    var ordinaryrepercent = wx.getStorageSync("OrdinaryRePecent")
    console.log(repercent, ratepercent)
    this.setData({
      repercent,
      ratepercent,
      ordinaryrepercent
    })
    this.setData({
      notreadnum: wx.getStorageSync("number_msg")
    })
    console.log(this.data.notreadnum)
    if (app.globalData.isImLogin) {
      // 已经登录了SDK处于read状态
      this.setData({
        hasUserInfo: true
      })
      // 由于登录是写在会话列表的 因此如果已经登录 （SDK处于ready状态）就直接获取会话列表（会话列表函数在下面会话列表里整体贴）
      // this.initRecentContactList()
    } else {
      if (wx.getStorageSync('token')) {
        // util.sLoading()
        this.setData({
          hasUserInfo: true
        })
        // 获取登录密码userSign和tid（这里通过后端接口获取）
        this.getPassword()
      } else {
        // 没有登录 就会出现一个授权页 让用户登录（小程序的登录）针对没有登录过的用户，登录过的用户做了静默登录 会自动登录
        this.setData({
          hasUserInfo: false
        })
      }
    }
  },
  // 获取登录所用的userSign 和 tid(密码)
  getPassword() {
    this.setData({
      userID: wx.getStorageSync('userid'),
      userSig: wx.getStorageSync('sig')
    })
  },
  //腾讯云im的登录
  loginIm() {
    var that = this
    var tim = app.globalData.tim
    let promise = tim.login({
      userID: that.data.userId,
      userSig: that.data.userSign
    });
    promise.then(function(imResponse) {
      console.log(imResponse)
      console.log('登录成功')
      wx.setStorageSync('isImLogin', true)
      app.globalData.isImLogin = true
      setTimeout(() => {
        // 拉取会话列表
        that.initRecentContactList()
      }, 1000);
    }).catch(function(imError) {
      // util.sLoadingHide()
      wx.showToast({
        title: 'login error' + imError,
        icon: 'none',
        duration: 3000
      })
      console.warn('login error:', imError); // 登录失败的相关信息
    })
  },
  categoryscoll: function(e) {
    var scale = 30 / (142 * this.data.categorynum)
    console.log(e.detail.scrollLeft, scale)
    var scrollleft = e.detail.scrollLeft * 2
    var left = scale * scrollleft * 2
    this.setData({
      left
    })
  },
  // change: function(e) {
  //   const cur = e.currentTarget.dataset.index
  //   console.log(cur)
  //   this.setData({
  //     selected: cur
  //   })
  // },
  showtopdropdown: function() {
    this.setData({
      dropShow: !this.data.dropShow
    })
  },
  btnCloseDrop: function() {
    this.setData({
      dropShow: false
    })
  },
  clickclasic: function(e) {
    this.setData({
      flag: true
    })
    var cur = e.currentTarget.dataset.current;
    var tabWidth = this.data.windowWidth / 4 // 导航tab共5个，获取一个的宽度
    console.log(cur)
    wx.pageScrollTo({
      scrollTop: 0
    })
    this.setData({
      currentTab: cur,
      dropShow: false,
    })

    this.setData({
      tabScroll: (this.data.currentTab - 2) * tabWidth
    })

    var id = e.currentTarget.dataset.id
    console.log(id)
    util.request("/WXHome/IndexCate", {
      cate: id
    }, "POST", false).then((res) => {
      console.log(res.data)
      var list1 = [res.data.hotlist[0], res.data.hotlist[1], res.data.hotlist[2]]
      var list2 = [res.data.hotlist[3], res.data.hotlist[4], res.data.hotlist[5]]
      var list3 = [res.data.hotlist[6], res.data.hotlist[7], res.data.hotlist[8]]
      this.setData({
        hotlist: res.data.hotlist,
        catelist: res.data.catelist,
        explosionProduct: [list1, list2, list3],
        morelist: res.data.morelist,
        page2: 1
      })
      if (this.data.hotlist.length == 0 && this.data.morelist.length == 0) {
        console.log(111)
        this.setData({
          flag: false
        })
      }
    })
  },
  // 滚动切换标签样式
  // switchTab: function(e) {
  //   let that = this;
  //   that.setData({
  //     currentTab: e.detail.current
  //   });
  //   that.checkCor();
  // },
  // 点击标题切换当前页时改变样式
  // swichNav: function(e) {
  //   let cur = e.currentTarget.dataset.current;

  //   if (this.data.currentTab == cur) {
  //     return false;
  //   } else {
  //     this.setData({
  //       currentTab: cur
  //     })
  //   }
  // },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function() {
    let that = this;
    if (that.data.currentTab > 3) {
      that.setData({
        scrollLeft: 300
      })
    } else {
      that.setData({
        scrollLeft: 0
      })
    }
  },
  tomessage: function(e) {
    var cur = e.currentTarget.dataset.current;
    wx.navigateTo({
      url: '../extend-view1/messagedetail/messagedetail?id=' + cur
    })
  },
  more: function(e) {
    // if (!wx.getStorageSync("sessionId")) {
    //   wx.navigateTo({
    //     url: '../login/login?backflag=detail'
    //   })
    //   return
    // }
    let key = e.currentTarget.dataset.key;
    var cur = e.currentTarget.dataset.current
    if (key == '限时秒杀') {
      wx.navigateTo({
        url: '../extend-view1/marketmodule/limited/limited?id=' + cur
      })
    } else if (key == '商城榜单') {
      wx.navigateTo({
        url: '../extend-view1/marketmodule/hotlist/hotlist?id=' + cur
      })
    } else if (key == '优质发圈') {
      wx.navigateTo({
        url: '../extend-view1/marketmodule/highquality/highquality?id=' + cur
      })
    } else if (key == '每日上新') {
      wx.navigateTo({
        url: '../extend-view1/marketmodule/everydaynew/everydaynew?id=' + cur
      })
    } else if (key == '轻奢范er') {
      wx.navigateTo({
        url: '../extend-view1/marketmodule/bannerandcategory/bannerandcategory?id=' + cur
      })
    } else if (key == '新人上手') {
      wx.navigateTo({
        url: '../extend-view1/marketmodule/newpeople/newpeople?id=' + cur
      })
    } else if (key == '高佣商品') {
      wx.navigateTo({
        url: '../extend-view1/marketmodule/marketdetail/marketdetail?id=hd0005'
      })
    } else if (key == '百亿补贴') {
      wx.navigateTo({
        url: '../extend-view1/billionsubsidies/billionsubsidies?id=hd0007'
      })
    } else if (key == '好物免费拿') {
      wx.navigateTo({
        url: '../extend-view/bargaining/bargaininglist/bargaininglist'
      })
    } else {
      wx.navigateTo({
        url: '../extend-view1/factorysupply/factorysupply?id=hd0006'
      })
    }
  },
  search: function(e) {
    var cur = e.currentTarget.dataset.current;
    var hotsearch = this.data.hotSearch
    hotsearch = JSON.stringify(hotsearch)
    console.log(hotsearch)
    wx.navigateTo({
      url: `../extend-view/news-search/news-search?key=${cur}&hotsearch=${hotsearch}`
    })
  },
  change(e) {
    var cur = e.currentTarget.dataset.current;
    // console.log(cur)
    this.setData({
      currentTab1: cur
    })
  },
  onPullDownRefresh: function() {
    // this.setData({
    //   tabflag1: false,
    //   tabflag2: false
    // })
    console.log(111)
    console.log(this.data.currentTab)
    if (this.data.currentTab == 0) {
      util.request("/WxHome/IndexData", {}, "POST", false).then((res) => {
        console.log(res.data)
        var obj = {
          id: "1",
          name: "推荐"
        }
        util.request("/WXHome/GetPromActivity", {}, "POST", false).then((res) => {
          console.log(res)
          this.setData({
            category: res.data.ActivityList,
            categorynum: res.data.ActivityList.length,
            newsProductInfo: res.data.newsProductInfo,
            highServantList: res.data.HighServantList,
            factoryList: res.data.FactoryList,
            otherList: res.data.OtherList,
            subsidyList: res.data.SubsidyList
          })
          var innerwidth = 60 * (5 / res.data.ActivityList.length)
          this.setData({
            innerwidth
          })
        })
        var tab = res.data.tab.unshift(obj)
        console.log(tab)
        this.setData({
          tab: res.data.tab,
          banner: res.data.banner,
          newsList: res.data.newsList,
          hotSearch: res.data.hotSearch,
          page1: [1, 1, 1, 1]
        })
        util.request("/WXHome/IndexProduct", {
          type: 1,
          page: 1
        }, "POST", false).then((res) => {
          console.log(res)
          this.setData({
            isGuessLoveList: res.data
          })
        })

        util.request("/WXHome/IndexProduct", {
          type: 2,
          page: 1
        }, "POST", false).then((res) => {
          console.log(res)
          this.setData({
            isPopularList: res.data
          })
        })

        util.request("/WXHome/IndexProduct", {
          type: 3,
          page: 1
        }, "POST", false).then((res) => {
          console.log(res)
          this.setData({
            isExcellentList: res.data
          })
        })

        util.request("/WXHome/IndexProduct", {
          type: 4,
          page: 1
        }, "POST", false).then((res) => {
          console.log(res)
          this.setData({
            isTopHotList: res.data
          })
        })
        wx.stopPullDownRefresh()
      })
    } else {
      util.request("/WXHome/IndexCate", {
        cate: this.data.cateid
      }, "POST", false).then((res) => {
        console.log(res)
        this.setData({
          morelist: res.data.morelist,
          page2: 1
        })
        wx.stopPullDownRefresh()
      })
    }

    // wx.showToast({
    //   title: '刷新成功',
    //   icon: "none"
    // })
  },
  // 下拉触底
  onReachBottom: function() {
    var currentTab1 = this.data.currentTab1
    console.log(111)
    console.log(this.data.currentTab1 + 1, this.data.page1 + 1)
    if (this.data.currentTab == 0) {
      util.request("/WxHome/IndexProduct", {
        type: this.data.currentTab1 + 1,
        page: this.data.page1[currentTab1] + 1
      }, "GET", false).then((res) => {
        console.log(res.data)
        if (res.data.length == 0) {
          util.toast("没有更多的数据了");
          return
        }
        // this.setData({
        //   page1: this.data.page1 + 1,
        //   name: this.data.name
        // })
        var page1 = this.data.page1
        console.log(currentTab1)
        if (currentTab1 == 0) {
          page1[currentTab1] = page1[currentTab1] + 1
          this.setData({
            page1: page1,
            isGuessLoveList: this.data.isGuessLoveList.concat(res.data)
          })
        } else if (currentTab1 == 1) {
          page1[currentTab1] = page1[currentTab1] + 1
          this.setData({
            page1: page1,
            isPopularList: this.data.isPopularList.concat(res.data)
          })
        } else if (currentTab1 == 2) {
          page1[currentTab1] = page1[currentTab1] + 1
          this.setData({
            page1: page1,
            isExcellentList: this.data.isPopularList.concat(res.data)
          })
        } else {
          page1[currentTab1] = page1[currentTab1] + 1
          this.setData({
            page1: page1,
            isTopHotList: this.data.isTopHotList.concat(res.data)
          })
        }
      })
      console.log(this.data.page1)
    } else {
      console.log(this.data.cateid)
      if (this.data.nodata) {
        return
      }
      util.request("/WXHome/IndexCateMore", {
        cate: this.data.cateid,
        page: this.data.page2 + 1
      }, "GET", false).then((res) => {
        if (res.data.length == 0) {
          util.toast("没有更多的数据了");
          this.setData({
            nodata: true
          })
          return
        }
        console.log(res.data)
        this.setData({
          page2: this.data.page2 + 1,
          morelist: this.data.morelist.concat(res.data),
        })
      })
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // onLoad: function() {


  // if (app.globalData.userInfo) {
  //   this.setData({
  //     userInfo: app.globalData.userInfo,
  //     hasUserInfo: true
  //   })
  // } else if (this.data.canIUse) {
  //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //   // 所以此处加入 callback 以防止这种情况
  //   app.userInfoReadyCallback = res => {
  //     this.setData({
  //       userInfo: res.userInfo,
  //       hasUserInfo: true
  //     })
  //   }
  // } else {
  //   // 在没有 open-type=getUserInfo 版本的兼容处理
  //   wx.getUserInfo({
  //     success: res => {
  //       app.globalData.userInfo = res.userInfo
  //       this.setData({
  //         userInfo: res.userInfo,
  //         hasUserInfo: true
  //       })
  //     }
  //   })
  // }
  // this.aaa()
  // getPhoneNumber();
  // },

  // getPhoneNumber: function (e) {
  //   console.log(e.detail.errMsg)
  //   console.log(e.detail.iv)
  //   console.log(e.detail.encryptedData);

  //   //传输到后台解密
  //   wx.request({
  //     url: wx.getStorageSync('domainName') + '/WxOpen/DecryptPhoneNumber',
  //     data: {
  //       sessionId: wx.getStorageSync('sessionId'),
  //       iv: e.detail.iv,
  //       encryptedData: e.detail.encryptedData
  //     },
  //     method: 'POST',
  //     header: { 'content-type': 'application/x-www-form-urlencoded' },
  //     success: function (res) {
  //       // success
  //       var json = res.data;
  //       console.log(res.data);

  //       if (!json.success) {

  //         wx.showModal({
  //           title: '解密过程发生异常',
  //           content: json.msg,
  //           showCancel: false
  //         });
  //         return;
  //       }

  //       //模组对话框
  //       var phoneNumberData = json.phoneNumber;
  //       var msg = '手机号：' + phoneNumberData.phoneNumber +
  //         '\r\n手机号（不带区号）：' + phoneNumberData.purePhoneNumber +
  //         '\r\n区号（国别号）' + phoneNumberData.countryCode +
  //         '\r\n水印信息：' + JSON.stringify(phoneNumberData.watermark);

  //       wx.showModal({
  //         title: '收到解密后的手机号信息',
  //         content: msg,
  //         showCancel: false
  //       });
  //     }
  //   })

  // },
  // detail(e) {
  //   wx.showToast({
  //     title: '详情功能尚未完善~',
  //     icon: "none"
  //   })
  // },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  clickMenu: function(e) {
    this.setData({
      flag: true
    })
    var id = e.currentTarget.dataset.id
    console.log(id)
    this.setData({
      cateid: id
    })
    var current = e.currentTarget.dataset.current //获取当前tab的index
    var tabWidth = this.data.windowWidth / 5 ///导航tab共5个，获取一个的宽度
    console.log(this.data.windowWidth)
    this.setData({
      tabScroll: (current - 2) * tabWidth //使点击的tab始终在居中位置
    })
    if (this.data.currentTab == current) {
      // return false
    } else {
      this.setData({
        currentTab: current,
        nodata: false
      })
    }

    var id = e.currentTarget.dataset.id
    console.log(id)
    util.request("/WXHome/IndexCate", {
      cate: id
    }, "POST", false).then((res) => {
      console.log(res.data)
      var list1 = [res.data.hotlist[0], res.data.hotlist[1], res.data.hotlist[2]]
      var list2 = [res.data.hotlist[3], res.data.hotlist[4], res.data.hotlist[5]]
      var list3 = [res.data.hotlist[6], res.data.hotlist[7], res.data.hotlist[8]]
      this.setData({
        hotlist: res.data.hotlist,
        catelist: res.data.catelist,
        explosionProduct: [list1, list2, list3],
        morelist: res.data.morelist,
        page2: 1
      })
      if (this.data.hotlist.length == 0 && this.data.morelist.length == 0) {
        console.log(111)
        this.setData({
          flag: false
        })
      }
    })
  },
  togoodsdetail: function(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `../extend-view/proDetail/proDetail?id=${id}`,
    })
  },
  clickbanner: function(e) {
    var url = e.currentTarget.dataset.current;
    console.log(url)
    wx.navigateTo({
      url: url
    })
  },
  onPageScroll: function(e) {
    // console.log(this.data.tabtop)
    // console.log(e.scrollTop)
    var scrolltop = e.scrollTop
    // if (this.data.currentTab == '0') {
    //   if (scrolltop == 0) {
    //     this.setData({
    //       tabflag1: true,
    //       tabflag2: false
    //     })
    //   } else if (scrolltop > 0 && scrolltop < this.data.tabtop2) {
    //     this.setData({
    //       tabflag1: false,
    //       tabflag2: false
    //     })
    //   } else if (scrolltop >= this.data.tabtop2) {
    //     this.setData({
    //       tabflag1: true,
    //       tabflag2: true
    //     })
    //   }

    // } else {
    // if (scrolltop > 0) {
    //   this.setData({
    //     tabflag1: false
    //   })
    // } else {
    //   this.setData({
    //     tabflag1: true
    //   })
    // }
    // console.log(this.data.currentTab)
    // if (this.data.currentTab == '0') {
    //   if (scrolltop >= this.data.tabtop2) {
    //     this.setData({
    //       tabflag2: true
    //     })
    //   } else {
    //     this.setData({
    //       tabflag2: false
    //     })
    //   }
    // }else{
    // }
    // }
    let query = wx.createSelectorQuery()
    query.select('.newexclusiveimg').boundingClientRect((rect) => {
      this.setData({
        newexclusiveimgtop: rect.top,
        newexclusiveimgheight: rect.height
      })
    }).exec()
    console.log(this.data.newexclusiveimgtop)
    if (scrolltop > 0) {
      this.setData({
        tabflag1: false
      })
    } else {
      this.setData({
        tabflag1: true
      })
    }
    if (this.data.imageshowflag) {
      if (this.data.newexclusiveimgtop <= 0) {
        console.log(1111)
        this.setData({
          imageflag: true
        })
      } else {
        this.setData({
          imageflag: false
        })
      }
    }
  },
  tocreateposter: function(e) {
    // wx.checkSession({
    //   success: function () {
    //     //session_key 未过期，并且在本生命周期一直有效
    //     console.log("登录状态")
    //     return;
    //   },
    //   fail: function () {
    //     console.log("登录失效")
    //     // session_key 已经失效，需要重新执行登录流程
    //   }
    // })
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
        url: '../extend-view1/createposter/createposter?img=' + img,
      })
    })
  },
  addtoassistant: function(e) {
    var cur = e.currentTarget.dataset.current
    util.request("/WxUserInfo/RobotSendProduct", {
      strProduct: cur
    }, "GET", false).then((res) => {
      console.log(res)
      util.toast(res.Msg)
    })
  },
  gettim: function() {
    let options = {
      SDKAppID: 1400353409 // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
    };
    // 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
    let tim = TIM.create(options); // SDK 实例通常用 tim 表示

    // 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
    tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
    // tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用

    // 注册 COS SDK 插件
    tim.registerPlugin({
      'cos-wx-sdk': COS
    });
    return tim
  },
  tonavmessage: function() {
    wx.switchTab({
      url: '../message/message',
    })
  },
  hideimg: function() {
    this.setData({
      imageflag: false,
      imageshowflag: false
    })
  },
  toluckdraw: function() {
    if (!wx.getStorageSync("sessionId")) {
      wx.navigateTo({
        url: '../login/login?backflag=detail'
      })
      return
    }
    wx.navigateTo({
      url: '../extend-view1/marketmodule/luckdraw/luckdraw',
    })
  },
  tonewgoodsdetail: function(e) {
    var id = e.currentTarget.dataset.current;
    console.log(id)
    wx.navigateTo({
      url: `../extend-view/proDetail/proDetail?id=${id}&isnew=true&newflag=true&OrderSource=hd0010`,
    })
  }
})