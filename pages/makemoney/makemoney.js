// pages/makemoney/makemoney.js
const util = require('../../utils/util.js')
var app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        name: "拼团购"
      },
      {
        name: "新人上手"
      },
      {
        name: "分享素材"
      }
    ],
    selected: 1,
    pt_tex: "同样的商品，我们更省钱，部分产品拼团还能返现",
    task: [],
    material: [{
        text1: ["我们平台好", "真的好", "我们平台妙", "真的妙"],
        text2: ["加入我们", "不用你投一分钱", "就能实现自己的创业梦"]
      },
      {
        text1: ["我们平台好", "真的好", "我们平台妙", "真的妙"],
        text2: ["加入我们", "不用你投一分钱", "就能实现自己的创业梦"]
      }
    ],
    // src: "http://imgs1.we-time.net/ProductTemp/0200/41/90/WJ202004190158206903/9a86925ab16f486c940e337fcb817f6d.png",
    imgflag: true,
    swiperIndex: 0,
    tasknum: ['任务一', '任务二', '任务三', '任务四', '任务五', '任务六', '任务七'],
    duration:300,
    imgList:[],
    flag:false,
    kpheight:'auto'
  },
  change: function(e) {
    this.setData({
      swiperIndex:0
    })
    const cur = e.currentTarget.dataset.index
    console.log(cur)
    if (this.data.selected == cur) {
      return false;
    } else {
      if (cur == 1) {
        this.setData({
          pt_tex: "完成这6步，你成功的有了一个收入可观的副业"
        });
      } else if (cur == 2) {
        this.setData({
          pt_tex: "我们已经帮你做好你的专属海报，一键转发"
        });
      } else {
        this.setData({
          pt_tex: "我想告诉你的,都在这里啦"
        });
      }
      this.setData({
        selected: cur
      });
    }
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
      windowheight: wx.getSystemInfoSync().windowHeight
    })
    console.log(wx.getSystemInfoSync().windowHeight)

    console.log(app.globalData.selected)

    util.request("/WxDocumenInfo/GetDocumenInfo", {
      Type: 2
    }, "GET", false).then((res) => {
      console.log(res)
      this.setData({
        assembleshop: res.data.list[0],
        src: res.data.list[0].photo,
        video: res.data.list[0].Video,
        banner: res.data.list
      })
    })
    /**
     * 获取新人上手页面接口
     */
    util.request("/WxDocumenInfo/GetDocumenInfo", {
      Type: 3
    }, "GET", false).then((res) => {
      var task = res.data.list
      console.log(res.data.list)
      for (var i = 0; i < task.length; i++) {
        task[i].current = -1;
        task[i].disabled = false;
      }
      this.setData({
        task,
        info:res.data
      })
      console.log(task)
    })

    util.request("/WxDocumenInfo/GetDocumenInfo", {
      Type: 4
    }, "GET", false).then((res) => {
      console.log(res.data)
      this.setData({
        material: res.data
      })
    })
  },
  clicknav: function(e) {
    console.log(e.currentTarget.dataset.current)
    var cur = e.currentTarget.dataset.current
    var task = this.data.task
    // console.log(res.data.list)
    for (var i = 0; i < task.length; i++) {
      if (i == cur) {
        task[i].disabled = !task[i].disabled;
      }
    }
    this.setData({
      task
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
    util.request("/WxDocumenInfo/GetDocumenInfo", {
      Type: 3
    }, "GET", false,true).then((res) => {
      console.log(res)
      this.setData({
        info: res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  back:function(){
    wx.navigateBack({
      
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    // app.globalData.selected = 1
    // this.setData({
    //   selected: 1,
    //   flag: false
    // })
  },
  swiperChange(e) {
    console.log(e.detail.current)
    this.setData({
      swiperIndex: e.detail.current,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    util.request("/WxDocumenInfo/GetDocumenInfo", {
      Type: 2
    }, "GET", false).then((res) => {
      this.setData({
        assembleshop: res.data.list[0],
        src: res.data.list[0].photo,
        video: res.data.list[0].Video
      })
      console.log(res.data.list)
    })
    /**
     * 获取新人上手页面接口
     */
    util.request("/WxDocumenInfo/GetDocumenInfo", {
      Type: 3
    }, "GET", false).then((res) => {
      this.setData({
        task: res.data.list
      })
      console.log(res.data.list)
      // var data = res.data.list;
      // var arr=[]
      // for (var i = 0; i < data.length;i++){
      //   arr.push(data[i].Subjects.split(" "))
      // }
      // arr = arr.filter(function (e) { return e }); 
    })

    util.request("/WxDocumenInfo/GetDocumenInfo", {
      Type: 4
    }, "GET", false).then((res) => {
      console.log(res.data)
      this.setData({
        material: res.data
      })
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
    var shareimg = [
      "https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/01/01/ChMkJ1mhRcaISLHUAAaIAQtVJyoAAf_UAJK9e8ABogZ224.jpg",
      "https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/01/01/ChMkJ1mhRciIK04QAAPSUiTmb7UAAf_UAJRfggAA9Jq257.jpg",
      "https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/01/01/ChMkJ1mhRciIGHuyAAIISdSwzIYAAf_UAJ1MKkAAghh731.jpg"
    ]
    var randomImg = shareimg[Math.floor(Math.random() * shareimg.length)];
    let that = this;
    return {
      title: '简直走别拐弯', // 转发后 所显示的title
      path: '/pages/makemoney/makemoney', // 相对的路径
      imgUrl: "../../static/logo/home.png",
      success: (res) => { // 成功后要做的事情
        console.log(res.shareTickets[0])
        // console.log

        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: (res) => {
            that.setData({
              isShow: true
            })
            console.log(that.setData.isShow)
          },
          fail: function(res) {
            console.log(res)
          },
          complete: function(res) {
            console.log(res)
          }
        })
      },
      fail: function(res) {
        // 分享失败
        console.log(res)
      }
    }
  },
  togroupinformation: function() {
    if (!wx.getStorageSync("sessionId")) {
      wx.navigateTo({
        url: '../login/login?backflag=detail'
      })
      return
    }
    wx.navigateTo({
      url: '../mycenter-extend/mygroup/mygroup',
    })
  },
  copy: function(e) {
    var cur = e.currentTarget.dataset.current
    var that = this
    wx.setClipboardData({
      data: cur,
      success(res) {
        //粘贴到对应的位置
        wx.getClipboardData({
          success(res) {
            console.log(res)
          }
        })
      }
    })
  },
  shareimg: function(e) {
    if (!wx.getStorageSync("sessionId")) {
      wx.navigateTo({
        url: '../login/login?backflag=detail'
      })
      return
    }
    var cur = e.currentTarget.dataset.current;
    console.log(cur)
    util.request("/WxShare/PostersImg", {
      img: cur
    }, "GET", false).then((res) => {
      console.log(res)
      var img = res.Msg
      wx.navigateTo({
        url: '../extend-view1/createposter/createposter?img=' + img,
      })
    })
  },
  clickposter: function() {
    console.log(111)
    var urls = []
    var src = this.data.src
    urls[0] = src
    console.log(urls)
    wx.previewImage({
      current: this.data.src, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  keepphoto: function() {
    wx.downloadFile({
      url: this.data.src, //仅为示例，并非真实的资源
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          let img = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: img,
            success(res) {
              util.toast('保存成功');
            },
            fail(res) {
              util.toast('保存失败');
            }
          });
        }
      }
    })
  },
  showimg: function(e) {
    console.log(e.currentTarget.dataset.current)
    var cur = e.currentTarget.dataset.current
    this.setData({
      src: cur,
      // imgflag: false,
      // cover: '1'
    })
    var that = this;
    var imgList = that.data.imgList;
    imgList[0] = cur
    this.setData({
      imgList
    })
    //图片预览
    wx.previewImage({
      current: cur, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  playvideo: function(e) {
    // console.log(e.currentTarget.dataset.current)
    var cur = e.currentTarget.dataset.current
    console.log(cur)
    console.log(111)
    this.setData({
      video: cur,
      imgflag: false,
      cover: '2'
    })
  },
  closeimg: function() {
    this.setData({
      imgflag: true
    })
  },
  copy: function(e) {
    console.log(e.currentTarget.dataset.current)
    var cur = e.currentTarget.dataset.current
    var weixin = cur.split("微信号:")[1]
    console.log(wx)
    var that = this
    wx.setClipboardData({
      data: weixin,
      success(res) {
        //粘贴到对应的位置
        wx.getClipboardData({
          success(res) {
            console.log(res)
          }
        })
      }
    })
  },
  copytext: function(e) {
    console.log(e.currentTarget.dataset.current)
    var cur = e.currentTarget.dataset.current
    var that = this
    wx.setClipboardData({
      data: cur,
      success(res) {
        //粘贴到对应的位置
        wx.getClipboardData({
          success(res) {
            console.log(res)
          }
        })
      }
    })
  },
  toviewbenefits: function() {
    // if (!wx.getStorageSync("sessionId")) {
    //   wx.navigateTo({
    //     url: '../login/login?backflag=detail'
    //   })
    //   return
    // }
    wx.navigateTo({
      url: '../extend-view1/viewbenefits/viewbenefits',
    })
  }
})