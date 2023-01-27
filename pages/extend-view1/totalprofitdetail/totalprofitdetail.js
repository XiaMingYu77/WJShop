// pages/extend-view1//totalprofitdetail/totalprofitdetail.js
// import * as echarts from '../../../ec-canvas/echarts';
const util = require('../../../utils/util.js')
let wxCharts = require('./../../../utils/wxcharts.js');
var lineChart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        name: "近7天"
      },
      {
        name: "近30天"
      },
      {
        name: "自定义"
      }
    ],
    selected: 0,
    money: [],
    date1: "开始时间",
    date2: "结束时间",
    date1flag:false,
    date2flag:false,
    start1:"",
    start2:"",
    end1:"",
    end2:""
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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
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

    util.request("/WxEstimatedRevenue/GetIncomeNumberDetails", {
      Type: 1,
      istg: 0
    }, "GET", false).then((res) => {
      console.log(res)
      var list = res.data
      var categories = []
      var data = []
      for (var i = 0; i < list.Income.length; i++) {
        categories.push(list.Income[i].datetime)
        data.push(list.Income[i].Money)
        console.log(111)
      }
      this.setData({
        list: list,
        categories: categories,
        money: data
      })
      this.getdata(e)
    })
  },
  getdata: function(e) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '收益',
        data: simulationData.data,
        format: function(val, name) {
          return val.toFixed(2) + '万';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        // title: '预估收益(单位:元)',
        format: function(val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        // lineStyle: 'curve'
      }
    });
  },
  updateData: function() {
    var simulationData = this.createSimulationData();
    var series = [{
      name: '成交量1',
      data: simulationData.data,
      format: function(val, name) {
        return val.toFixed(2) + '万';
      }
    }];
    lineChart.updateData({
      categories: simulationData.categories,
      series: series
    });
  },
  createSimulationData: function() {
    var categories = this.data.categories;
    var data = this.data.money;
    // data[4] = null;
    return {
      categories: categories,
      data: data
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  change: function(e) {
    const cur = e.currentTarget.dataset.index
    console.log(cur)
    this.setData({
      selected: cur
    });
    if (cur == 0) {
      util.request("/WxEstimatedRevenue/GetIncomeNumberDetails", {
        Type: 1,
        istg: 0
      }, "GET", false).then((res) => {
        console.log(res)
        var list = res.data
        var categories = []
        var data = []
        for (var i = 0; i < list.Income.length; i++) {
          categories.push(list.Income[i].datetime)
          data.push(list.Income[i].Money)
          console.log(111)
        }
        this.setData({
          list: list,
          categories: categories,
          money: data
        })
        this.getdata()
      })
    } else if (cur == 1) {
      util.request("/WxEstimatedRevenue/GetIncomeNumberDetails", {
        Type: 2,
        istg: 0
      }, "GET", false).then((res) => {
        console.log(res)
        var list = res.data
        var categories = []
        var data = []
        for (var i = 0; i < list.Income.length; i++) {
          categories.push(list.Income[i].datetime)
          data.push(list.Income[i].Money)
          console.log(111)
        }
        this.setData({
          list: list,
          categories: categories,
          money: data
        })
        this.getdata()
      })
    }
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    if (e.detail.value == this.data.date2){
      util.toast("不能选择同一天,请重新选择")
      return
    }
    this.setData({
      date1: e.detail.value,
      date1flag:true
    })
    // if (this.data.date1flag) {
    //   console.log(e.detail.value)
    //   var value = e.detail.value;
    //   var arr = value.split("-")
    //   for(var i=0;i<arr.length;i++){
    //     arr[i]=Number(arr[i])
    //   }
    //   console.log(arr)
    //   this.setData({
    //     start2: this.data.date1,
    //     end2: arr[0] + "-" + (arr[1]+1)+"-"+arr[2]
    //   })
    // }
    if(this.data.date1!="开始时间"&&this.data.date2!="结束时间"){
      util.request("/WxEstimatedRevenue/GetIncomeNumberDetails", {
        Type: 3,
        istg: 0,
        StartDatetime:this.data.date1,
        EndDatetime: this.data.date2,
      }, "GET", false).then((res) => {
        console.log(res)
        var list = res.data
        var categories = []
        var data = []
        for (var i = 0; i < list.Income.length; i++) {
          categories.push(list.Income[i].datetime)
          data.push(list.Income[i].Money)
          console.log(111)
        }
        this.setData({
          list: list,
          categories: categories,
          money: data
        })
        this.getdata()
      })
    }
  },
  bindDateChange1: function(e) {
    if (this.data.date1 == e.detail.value) {
      util.toast("不能选择同一天,请重新选择")
      return
    }
    
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date2: e.detail.value,
      date2flag: true
    })
    // if (this.data.date2flag) {
    //   console.log(e.detail.value)
    //   var value = e.detail.value;
    //   var arr = value.split("-")
    //   for (var i = 0; i < arr.length; i++) {
    //     arr[i] = Number(arr[i])
    //   }
    //   console.log(arr)
    //   this.setData({
    //     start1: arr[0] + "-" + (arr[1] - 1) + "-" + arr[2],
    //     end1: this.data.date2
    //   })
    // }
    if (this.data.date1 != "开始时间" && this.data.date2 != "结束时间") {
      util.request("/WxEstimatedRevenue/GetIncomeNumberDetails", {
        Type: 3,
        istg: 0,
        StartDatetime: this.data.date1,
        EndDatetime: this.data.date2,
      }, "GET", false).then((res) => {
        console.log(res)
        var list = res.data
        var categories = []
        var data = []
        for (var i = 0; i < list.Income.length; i++) {
          categories.push(list.Income[i].datetime)
          data.push(list.Income[i].Money)
        }
        this.setData({
          list: list,
          categories: categories,
          money: data
        })
        this.getdata()
      })
    }
  }
})