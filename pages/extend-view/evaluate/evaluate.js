// pages/extend-view//evaluate/evaluate.js
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:5,
    proid:"",
    shopid:"",
    current:0,
    fullScreen:false,
    pageindex:1,
    fullScreen:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      proid: options.proId,
      shopid: options.shopID
    })

    util.request("/WxProductComment/GetProductCommentModel", {
      PageSize: 10,
      PageIndex: 1,
      proId: this.data.proid,
      shopID: this.data.shopid,
      comm: ''
    }, "GET", false).then((res) => {
      console.log(res)
      var data = res.data._ProductCommentModel;
      // console.log(data)
      for(var i=0;i<data.length;i++){
        var str = data[i].AddDate
        str = str.slice(6)
        str = str.substring(0, str.length - 2);
        var a = new Date(str * 1);
        var nian = a.getFullYear();//年
        var yue = a.getMonth() + 1;//月
        var tian = a.getDate();//天
        data[i].AddDate = nian + "年" + yue + "月" + tian+"日"
        // console.log(str)
        for (var j = 0; j < data[i].ProductCommentMedia.length; j++) {
          if (data[i].ProductCommentMedia[j].ReComment == '1') {
            data[i].ProductCommentMedia.unshift(data[i].ProductCommentMedia.splice(j, 1)[0])
          }
        }
      }
      
      this.setData({
        num1: res.data.count,
        num4: res.data.cpcount,
        num3: res.data.zpcount,
        num2: res.data.hpcount,
        hpd: res.data.hpd,
        tpcount: res.data.tpcount,
        evaluate: res.data._ProductCommentModel
      })
    })
  },
  chooselable:function(e){
    console.log(e.currentTarget.dataset.current)
    var cur = e.currentTarget.dataset.current;
    this.setData({
      current:cur
    })
    if(cur=='0'){
      util.request("/WxProductComment/GetProductCommentModel", {
        PageSize: 10,
        PageIndex: 1,
        proId: this.data.proid,
        shopID: this.data.shopid,
        comm: ''
      }, "GET", false).then((res) => {
        // console.log(res.data)
        var data = res.data._ProductCommentModel;
        for (var i = 0; i < data.length; i++) {
          var str = data[i].AddDate
          str = str.slice(6)
          str = str.substring(0, str.length - 2);
          var a = new Date(str * 1);
          var nian = a.getFullYear();//年
          var yue = a.getMonth() + 1;//月
          var tian = a.getDate();//天
          data[i].AddDate = nian + "年" + yue + "月" + tian + "日"
          // console.log(str)
          for (var j = 0; j < data[i].ProductCommentMedia.length; j++) {
            if (data[i].ProductCommentMedia[j].ReComment == '1') {
              data[i].ProductCommentMedia.unshift(data[i].ProductCommentMedia.splice(j, 1)[0])
            }
          }
        }
        this.setData({
          evaluate: res.data._ProductCommentModel,
          pageindex:1
        })
      })
    }else{
      util.request("/WxProductComment/GetProductCommentModel", {
        PageSize: 10,
        PageIndex: 1,
        proId: this.data.proid,
        shopID: this.data.shopid,
        comm: cur
      }, "GET", false).then((res) => {
        console.log(res.data)
        var data = res.data._ProductCommentModel;
        for (var i = 0; i < data.length; i++) {
          var str = data[i].AddDate
          str = str.slice(6)
          str = str.substring(0, str.length - 2);
          var a = new Date(str * 1);
          var nian = a.getFullYear();//年
          var yue = a.getMonth() + 1;//月
          var tian = a.getDate();//天
          data[i].AddDate = nian + "年" + yue + "月" + tian + "日"
          // console.log(str)
          for (var j = 0; j < data[i].ProductCommentMedia.length; j++) {
            if (data[i].ProductCommentMedia[j].ReComment == '1') {
              data[i].ProductCommentMedia.unshift(data[i].ProductCommentMedia.splice(j, 1)[0])
            }
          }
        }
        this.setData({
          evaluate: res.data._ProductCommentModel,
          pageindex: 1
        })
      })
    }
  },
  previewImage: function (e) {
    console.log(e)
    var current = e.currentTarget.dataset.current;
    var list = e.currentTarget.dataset.list.ProductCommentMedia;
    var imglist = []
    for (var i = 0; i < list.length; i++) {
      if (list[i].ReComment == '0') {
        imglist.push(list[i].MediaUrl)
      }
    }
    console.log(list)
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: imglist // 需要预览的图片http链接列表
    })
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    util.request("/WxProductComment/GetProductCommentModel", {
      PageSize: 10,
      PageIndex: 1,
      proId: this.data.proid,
      shopID: this.data.shopid,
      comm: ''
    }, "GET", false).then((res) => {
      console.log(res)
      var data = res.data._ProductCommentModel;
      // console.log(data)
      for (var i = 0; i < data.length; i++) {
        var str = data[i].AddDate
        str = str.slice(6)
        str = str.substring(0, str.length - 2);
        var a = new Date(str * 1);
        var nian = a.getFullYear();//年
        var yue = a.getMonth() + 1;//月
        var tian = a.getDate();//天
        data[i].AddDate = nian + "年" + yue + "月" + tian + "日"
        // console.log(str)
        for (var j = 0; j < data[i].ProductCommentMedia.length; j++) {
          if (data[i].ProductCommentMedia[j].ReComment == '1') {
            data[i].ProductCommentMedia.unshift(data[i].ProductCommentMedia.splice(j, 1)[0])
          }
        }
      }

      this.setData({
        num1: res.data.count,
        num2: res.data.cpcount,
        num3: res.data.zpcount,
        num4: res.data.hpcount,
        hpd: res.data.hpd,
        tpcount: res.data.tpcount,
        evaluate: res.data._ProductCommentModel,
        
      })
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom:function(){
    console.log(111)
    var cur=this.data.current
    if (cur == '0') {
      util.request("/WxProductComment/GetProductCommentModel", {
        PageSize: 10,
        PageIndex: this.data.pageindex + 1,
        proId: this.data.proid,
        shopID: this.data.shopid,
        comm: ''
      }, "GET", false).then((res) => {
        if (res.data._ProductCommentModel.length == 0) {
          util.toast("无更多数据")
          return
        }
        // console.log(res.data)
        var data = res.data._ProductCommentModel;
        for (var i = 0; i < data.length; i++) {
          var str = data[i].AddDate
          str = str.slice(6)
          str = str.substring(0, str.length - 2);
          var a = new Date(str * 1);
          var nian = a.getFullYear();//年
          var yue = a.getMonth() + 1;//月
          var tian = a.getDate();//天
          data[i].AddDate = nian + "年" + yue + "月" + tian + "日"
          // console.log(str)
          for (var j = 0; j < data[i].ProductCommentMedia.length; j++) {
            if (data[i].ProductCommentMedia[j].ReComment == '1') {
              data[i].ProductCommentMedia.unshift(data[i].ProductCommentMedia.splice(j, 1)[0])
            }
          }
        }
        
        this.setData({
          evaluate: this.data.evaluate.concat(res.data._ProductCommentModel),
          pageindex: this.data.pageindex + 1
        })
      })
    } else {
      util.request("/WxProductComment/GetProductCommentModel", {
        PageSize: 10,
        PageIndex: this.data.pageindex + 1,
        proId: this.data.proid,
        shopID: this.data.shopid,
        comm: cur
      }, "GET", false).then((res) => {
        if (res.data._ProductCommentModel.length == 0) {
          util.toast("无更多数据")
        }
        // console.log(res.data)
        var data = res.data._ProductCommentModel;
        for (var i = 0; i < data.length; i++) {
          var str = data[i].AddDate
          str = str.slice(6)
          str = str.substring(0, str.length - 2);
          var a = new Date(str * 1);
          var nian = a.getFullYear();//年
          var yue = a.getMonth() + 1;//月
          var tian = a.getDate();//天
          data[i].AddDate = nian + "年" + yue + "月" + tian + "日"
          // console.log(str)
          for (var j = 0; j < data[i].ProductCommentMedia.length; j++) {
            if (data[i].ProductCommentMedia[j].ReComment == '1') {
              data[i].ProductCommentMedia.unshift(data[i].ProductCommentMedia.splice(j, 1)[0])
            }
          }
        }
        
        this.setData({
          evaluate: this.data.evaluate.concat(res.data._ProductCommentModel),
          pageindex: this.data.pageindex + 1
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function () {

  // },

  // /**
  //  * 页面上拉触底事件的处理函数
  //  */
  // onReachBottom: function () {

  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  playvideo:function(){
    this.setData({
      fullScreen:true
    })
  }
})