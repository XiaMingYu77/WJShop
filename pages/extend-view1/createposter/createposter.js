// pages/extend-view1//createposter/createposter.js
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      src: options.img,
    })
    console.log(options)
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
              wx.openSetting({
                success(settingdata) {
                  console.error(settingdata)
                  if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                    console.error("获取权限成功，再次点击图片保存到相册")
                  } else {
                    console.error("获取权限失败")
                  }
                }
              })
            }
          });
        }
      }
    })
  }
})