// pages/extend-view1//marketmodule/bannerandcategory/bannerandcategory.js
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PageIndex:1,
    myTime: null,
    taskid: "",
    animation: {},
    countdownflag: false
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
      id: options.id,
      taskid: options.taskid
    })
    if (this.data.taskid && this.data.taskid != 'undefined' && this.data.taskid != '') {
      console.log("倒计时开始")
      this.setData({
        second: 30,
        alarmflag: true,
        countdownflag: true
      })
      this.timer()
    }

    console.log(this.data.id)
    util.request("/WxHome/GetPromActivityInfo", {
      ID: this.data.id,
      PageIndex: '1'
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        info: res.data,
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
    clearInterval(this.myTime)
    console.log("页面销毁")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    util.request("/WxHome/GetPromActivityInfo", {
      ID: this.data.id,
      PageIndex: '1'
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        goodlist: res.data._ProductInfoList,
        PageIndex: 1
      })
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log(this.data.PageIndex + 1)
    util.request("/WxHome/GetPromActivityInfo", {
      ID: this.data.id,
      PageIndex: this.data.PageIndex+1
    }, "GET", false).then((res) => {
      console.log(res)
      if (res.data._ProductInfoList.length==0){
        util.toast("暂无更多数据")
        return
      }
      this.setData({
        goodlist: this.data.goodlist.concat(res.data._ProductInfoList),
        PageIndex: this.data.PageIndex+1
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

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
  togoodsdetail: function(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `../../../extend-view/proDetail/proDetail?id=${id}&OrderSource=${this.data.id}`,
    })
  },
  botbannerclick: function (e) {
    var id = e.currentTarget.dataset.id
    var key = e.currentTarget.dataset.key
    util.bannerclick(key, id)
  },
  timer: function () {
    let promise = new Promise((resolve, reject) => {
      this.myTime = setInterval(
        () => {
          this.setData({
            second: this.data.second - 1
          })
          console.log(this.data.second)
          if (this.data.second <= 0) {
            this.setData({
              second: 0
            })
            util.request("/WxBargain/FinishTheTask", {
              Memid: wx.getStorageSync('MemID'),
              ID: this.data.taskid
            }, "GET", true).then((res) => {
              console.log(res)
              console.log("砍价成功")
              if (res.data.F_Status == 0) {
                this.setData({
                  alarmflag: false
                })
                let pages = getCurrentPages(); // 当前页的数据，可以输出来看看有什么东西
                let prevPage = pages[pages.length - 2];
                prevPage.setData({
                  browseflag: false,
                  browermoney: res.data.F_BargainAmount
                })
                // 1: 创建动画实例animation:
                var animation = wx.createAnimation({
                  duration: 500,
                  timingFunction: 'ease',
                })
                this.animation = animation
                var next = true;
                //连续动画关键步骤
                setInterval(function () {
                  //2: 调用动画实例方法来描述动画
                  if (next) {
                    animation.translateX(0).step();
                    animation.rotate(10).step()
                    next = !next;
                  } else {
                    animation.translateX(0).step();
                    animation.rotate(-10).step()
                    next = !next;
                  }
                  //3: 将动画export导出，把动画数据传递组件animation的属性 
                  this.setData({
                    animation: animation.export()
                  })
                }.bind(this), 300)
                // var str = `你砍掉了${res.data.F_BargainAmount}元`
                // util.toast(str)
                // this.setData({
                //   bargingtask: res.data,
                // })
              } else {
                this.setData({
                  alarmflag: false
                })
                let pages = getCurrentPages(); // 当前页的数据，可以输出来看看有什么东西
                let prevPage = pages[pages.length - 2];
                prevPage.setData({
                  browseflag: false,
                  browermoney: res.data.F_BargainAmount
                })
                // 1: 创建动画实例animation:
                var animation = wx.createAnimation({
                  duration: 500,
                  timingFunction: 'ease',
                })
                this.animation = animation
                var next = true;
                //连续动画关键步骤
                setInterval(function () {
                  //2: 调用动画实例方法来描述动画
                  if (next) {
                    animation.translateX(0).step();
                    animation.rotate(10).step()
                    next = !next;
                  } else {
                    animation.translateX(0).step();
                    animation.rotate(-10).step()
                    next = !next;
                  }
                  //3: 将动画export导出，把动画数据传递组件animation的属性 
                  this.setData({
                    animation: animation.export()
                  })
                }.bind(this), 300)
                wx.reLaunch({
                  url: '../../../extend-view/bargaining/bargingrecord/bargingrecord?backflag=true',
                })
              }
            })

            resolve(this.myTime)
          }
        }, 1000)
    })
    promise.then((setTimer) => {
      clearInterval(this.myTime)
    })
  }
})