// pages/mycenter-extend//collectshop/collectshop.js
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectAllStatus:false,
    modal:false,
    flag:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.request("/WxshopCollection/GetshopFavoritInfo", {
      PageIndex:1,
      pageSize:999
    }, "GET", false).then((res) => {
      console.log(res)
      var data=res.data;
      for(var i=0;i<data.length;i++){
        data[i].selected=false
      }
      this.setData({
        shoplist:res.data
      })
    })
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
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  manage:function(){
    this.setData({
      flag:false
    })
  },
  complete: function () {
    this.setData({
      flag: true
    })
  },
  checkboxChange: function(e){
    var cur = e.currentTarget.dataset.current;
    var data = this.data.shoplist;
    var currentselect=data[cur].selected;
    var selectAllStatus = this.data.selectAllStatus
    data[cur].selected = !currentselect;
    // data[cur]
    console.log(e)
    var flag = true
    for(var i=0;i<data.length;i++){
      if(!data[i].selected){
        flag=false
      }
    }
    if(flag){
      selectAllStatus=true
    }else{
      selectAllStatus=false
    }

    this.setData({
      selectAllStatus: selectAllStatus,
      shoplist: data
    })
  },
  selectall: function(){
    let selectAllStatus = this.data.selectAllStatus
    selectAllStatus = !selectAllStatus;
    var data = this.data.shoplist
    for (var i = 0; i < data.length; i++){
      data[i].selected = selectAllStatus
    }
    this.setData({
      shoplist: data,
      selectAllStatus: selectAllStatus
  })
  },
  submit:function(){
    var data = this.data.shoplist
    for (var i = 0; i < data.length;i++){
      
      if (data[i].selected){
        data.splice(i,1)
      }
    }
    util.request("/WxshopCollection/NotCollectionProduct", {
      shopid: this.data.shopid
    }, "GET", false).then((res) => {
      console.log(res)
      var data = this.data.shoplist
      for (var i = 0; i < data.length; i++) {
        if (data[i].selected) {
          data.splice(i, 1)
        }
      }
      this.setData({
        shoplist:data
      })
      util.toast('取消关注成功')
      setTimeout(()=>{
        this.setData({
          modal:false
        })
      })

    })
  },
  canclecollect:function(){
    var data = this.data.shoplist;
    var flag=false
    var str=""
    for (var i = 0; i < data.length; i++) {
      if (data[i].selected){
        str += data[i].FavShopID+","
        flag=true
      }
    }
    var reg = /,$/gi;
    str = str.replace(reg, "");
    if(flag){
      this.setData({
        modal: true,
        shopid:str
      })
    }else{
      util.toast('您没有选择任何店铺')
    }
  },
  hide:function(){
    this.setData({
      modal: false
    })
  }
})