// pages/extend-view1//marketmodule/limited/limited.js
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: [{
        name: '今日疯抢'
      },
      {
        name: '明日开场'
      }
    ],
    selected: 0,
    PageIndex1:1,
    PageIndex2:1,
    myTime: null,
    taskid: "",
    animation: {},
    countdownflag: false
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
    console.log(options)

    console.log(this.data.id)
    util.request("/WxHome/LimitedTimeSecondsKill", {
      ID: this.data.id,
      PageIndex: '1'
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        info: res.data,
        goodlist: res.data.ProductInfoList,
      })
    })

    util.request("/WxHome/LimitedTimeSecondsKill", {
      ID: 'hd0011',
      PageIndex: '1'
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        goodlist1: res.data.ProductInfoList,
      })
    })
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
    if (this.data.selected == '0') {
      util.request("/WxHome/LimitedTimeSecondsKill", {
        ID: this.data.id,
        PageIndex: '1'
      }, "GET", false).then((res) => {
        console.log(res)
        this.setData({
          info: res.data,
          goodlist: res.data.ProductInfoList,
          PageIndex1: 1
        })
        wx.stopPullDownRefresh()
      })
    } else {
      util.request("/WxHome/LimitedTimeSecondsKill", {
        ID: 'hd0011',
        PageIndex: '1'
      }, "GET", false).then((res) => {
        console.log(res)
        this.setData({
          goodlist1: res.data.ProductInfoList,
          PageIndex2: 1
        })
        wx.stopPullDownRefresh()
      })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if(this.data.selected=='0'){
      util.request("/WxHome/LimitedTimeSecondsKill", {
        ID: this.data.id,
        PageIndex: this.data.PageIndex1+1
      }, "GET", false).then((res) => {
        console.log(res, res.data.ProductInfoList)
        if (res.data.ProductInfoList==undefined){
          util.toast("暂无更多数据")
          return
        }
        this.setData({
          goodlist: this.data.goodlist.concat(res.data.ProductInfoList),
          PageIndex: this.data.PageIndex1 + 1
        })
      })
    }else{
      util.request("/WxHome/LimitedTimeSecondsKill", {
        ID: this.data.id,
        PageIndex: this.data.PageIndex2 + 1
      }, "GET", false).then((res) => {
        console.log(res)
        if (res.data.ProductInfoList == undefined) {
          util.toast("暂无更多数据")
          return
        }
        this.setData({
          goodlist1: this.data.goodlist1.concat(res.data.ProductInfoList),
          PageIndex: this.data.PageIndex2 + 1
        })
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  change: function(e) {
    var cur = e.currentTarget.dataset.index
    console.log(cur)
    this.setData({
      selected: cur
    })
  },
  togoodsdetail: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `../../../extend-view/proDetail/proDetail?id=${id}&OrderSource=${this.data.id}`,
    })
  },
  callme:function(e){
    var id = e.currentTarget.dataset.current;
    var index = e.currentTarget.dataset.index
    util.request("/WxHome/SetReminders", {
      ProID: id
    }, "GET", false).then((res) => {
      console.log(res)
      util.toast(res.Msg)
      var list = this.data.goodlist1
      if (list[index].IsReminders=='0'){
        list[index].IsReminders='1'
      }else{
        list[index].IsReminders = '0'
      }
      this.setData({
        goodlist1:list
      })
    })
  },
  botbannerclick:function(e){
    var id = e.currentTarget.dataset.id
    var key = e.currentTarget.dataset.key
    util.bannerclick(key,id)
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