import TIM from 'tim-wx-sdk'
// import http from '../../utils/api.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noData: '/images/defaultPark.png',
    houseDefault: '/images/delete.png',
    inputValue: '', //发送的文字消息内容
    myMessages: [], //消息
    selToID: 0,
    scrollTop: 0,
    houseId: '',
    type: '',
    height: '',
    complete: 0, //默认为有历史记录可以拉取
    is_lock: true, //发送消息锁,
    nav_title: '',
    tim: '',
    userSign: '',
    userId: '', // 自己的id
    conversationID: '',
    msgList: app.globalData.msgList,
    friendAvatarUrl: '',
    tabBottom: app.globalData.tabBottom,
    top_height: app.globalData.height,
    isCompleted: false,
    nextReqMessageID: '',
    more_text: '下拉查看更多历史信息',
    isSuperSend: false,
    isDetail: false,
    inputHeight: 0,
    inputShow: true,
    focus: false,
    adjust: true,
    flag: false,
    add: true,
    custommsg: true,
    faceflag: false,
    emojiChar: ["😠", "😩", "😞", "😵", "😰", "😒", "😍", "😤", "😜", "😝", "😋", "😘", "😚", "😷", "😳", "😃", "😅", "😆", "😁", "😂", "😊", "😄", "😢", "😭", "😨", "😣", "😡", "😌", "😖", "😱", "😪", "😏", "😓", "😥", "😫", "😉", "🙅", "🙆", "🙇", "🙈", "🙊", "🙉", "🙋", "🙌",
      "🙏", "🏠", "🏡", "🏢", "🏣", "🏥", "🏦", "🏨", "🏫", "👞", "👟", "👠", "👡", "👢", "✊", "✋", "✌", "👊", "👍", "☝", "👆", "👇","👈",
      "👉", "👋", "👏", "👌", "👎", "👐", "❤", "💓", "💔", "💕", "💖", "💗", "💘", "💙", "💚", "💛", "💜", "💝", "💞", "💟", "⭕", "❌","❎",
      "❗", "❓", "🌙", "🌕", "🌛", "🌟", "⌚", "🍀", "🌷", "🌱", "🍁", "🌸", "🌹", "🌻", "🌴", "🌵", "🌾", "🌽", "🍄", "🌰", "🌼", "🌿", "🍒", "🍌", "🍎", "🍊", "🍓", "🍉", "🍅", "🍆", "🍈", "🍍", "🍇", "🍑", "🍏", "👀", "👂", "👃", "👄", "👅", "💄", "👦", "👧", "👨", "👩", "👪","👫",
      "👮", "👯", "👰", "👱", "👲", "👳", "👴", "👵", "👶", "👷","👸"
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      this.setData({
        proid: options.id,
        proname: options.proname,
        proprice: options.price,
        proimg: options.image,
        flag: true,
        friendAvatarUrl: '',
        custommsg: false
      })
    } else {
      this.setData({
        friendAvatarUrl: options.avatar,
      })
    }
    this.setData({
      myimg: wx.getStorageSync("UserImg")
    })
    var that = this
    wx.showLoading({
      title: '加载中...',
      icon: 'none'
    })
    that.setData({
      conversationID: options.conversationID,
      height: wx.getSystemInfoSync().windowHeight,
      // nav_title: options.name,// 设置头部title(自定义的)
      isDetail: true,
    })
    // wx.setNavigationBarTitle({
    //   title: options.name
    // })
    // 滚动到底部
    that.pageScrollToBottom()
    wx.event.on('testFunc', (e, newMsgForm) => {
      console.log('testFunc')
      if ((newMsgForm === options.conversationID) && app.globalData.isDetail) {
        var newmsg = app.globalData.myMessages[that.data.conversationID]
        if (newmsg) {
          newmsg.forEach(e => {
            if (e.type == 'TIMCustomElem') {
              // if (typeof (e.payload.data) == 'string' && e.payload.data) {
              //   var new_data = JSON.parse(e.payload.data)
              //   e.payload.data = new_data
              // }
            }
            if (!e.isRead) {
              that.setData({
                myMessages: that.data.myMessages.concat(newmsg)
              })
            }
          })
        }
        console.log(that.data.myMessages)
        that.setMessageRead()
        that.pageScrollToBottom()
      }
    })
    // watch.setWatcher(that); // 设置监听器，建议在onLoad下调用
    if (app.globalData.isImLogin) {
      console.log('登录了')
      // 获取消息列表
      that.getMsgList()
    } else {
      console.log('未登录')
      wx.navigateTo({
        url: '../../../login/login?backflag=customerservice'
      })
      that.getPassword()
    }
  },
  watch: {
    myMessages: function(newVal, oldVal) {
      console.log(newVal, oldVal)
    }
  },
  inputFocus(e) {
    console.log(e)
    var inputHeight = 0
    if (e.detail.height) {
      inputHeight = e.detail.height
    }
    this.setData({
      inputHeight: inputHeight
    })
    this.pageScrollToBottom()
  },
  inputBlur(e) {
    this.setData({
      inputHeight: 0,
    })
  },
  getPassword() {
    var that = this
    that.setData({
      userSign: res.data.sign,
      userId: res.data.tid
    })
    app.globalData.accountTid = res.data.tid
    var tim = app.globalData.tim
    let promise = tim.login({
      userID: wx.getStorageSync('userid'),
      userSig: wx.getStorageSync('sig')
    })
    that.loginIm()
  },
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
        that.getMsgList()
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
  getMsgList() {
    console.log('获取会话列表')
    var that = this
    var tim = app.globalData.tim
    if (that.data.houseId) {
      if (that.data.type * 1 === 0) {
        that.createXzlmsg()
      } else if (that.data.type * 1 === 1) {
        that.createShopmsg()
      }
    }
    // 拉取会话列表
    var params = {
      conversationID: that.data.conversationID,
      count: 15,
      nextReqMessageID: that.data.nextReqMessageID
    }
    let promise = tim.getMessageList(params);
    promise.then(function(imResponse) {
      console.log('会话列表')
      const messageList = imResponse.data.messageList; // 消息列表。
      console.log(messageList)
      // 处理自定义的消息
      messageList.forEach(e => {
        console.log(e)
        if (e.type == 'TIMCustomElem') {
          if (typeof(e.payload.data) == 'string' && e.payload.data) {
            console.log(e.payload.data)
            var new_data = JSON.parse(e.payload.data)
            e.payload.data = new_data
          }
        }
      })
      const nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
      const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。
      // 将某会话下所有未读消息已读上报
      tim.setMessageRead({
        conversationID: that.data.conversationID
      })
      that.setData({
        myMessages: messageList,
        isCompleted: isCompleted,
        nextReqMessageID: nextReqMessageID,
        more_text: isCompleted ? '没有更多了' : '下拉查看更多历史信息'
      })
      wx.hideLoading()
      that.pageScrollToBottom()
    }).catch(function(imError) {
      console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
    });
  },
  // 下拉加载更多聊天历史记录
  getMoreMsgList() {
    wx.hideLoading()
    // console.log('获取会话列表')
    var tim = app.globalData.tim
    var that = this
    // 拉取会话列表
    var params = {
      conversationID: that.data.conversationID,
      count: 15,
      nextReqMessageID: that.data.nextReqMessageID
    }
    let promise = tim.getMessageList(params);
    promise.then(function(imResponse) {
      // console.log('下拉获取会话列表')
      // 处理自定义的消息
      imResponse.data.messageList.forEach(e => {
        if (e.type == 'TIMCustomElem') {
          if (e.payload.data) {
            var new_data = JSON.parse(e.payload.data)
            e.payload.data = new_data
          }
        }
      })
      const messageList = imResponse.data.messageList.concat(that.data.myMessages); // 消息列表。
      const nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
      const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。
      that.setData({
        myMessages: messageList,
        isCompleted: isCompleted,
        nextReqMessageID: nextReqMessageID,
        more_text: isCompleted ? '没有更多了' : '下拉查看更多历史信息'
      })
    }).catch(function(imError) {
      console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
    });
  },
  // 设置已读上报
  setMessageRead() {
    var tim = app.globalData.tim
    var that = this
    let promise = tim.setMessageRead({
      conversationID: that.data.conversationID
    })
    promise.then(function(imResponse) {
      // 已读上报成功
      var noready = 0
      that.data.myMessages.forEach(e => {
        if (!e.isRead) {
          noready++
        }
      })
      var number = wx.getStorageSync('number_msg')
      var newNumber = number - noready
      wx.setStorageSync('number_msg', newNumber)
    }).catch(function(imError) {
      // 已读上报失败
      console.warn('setMessageRead error:', imError);
    })
  },
  //创建自定义消息
  createXzlmsg() {
    this.setData({
      flag: false,
      custommsg: true
    })
    var that = this;
    const params = {
      proid: that.data.proid,
      proimg: that.data.proimg,
      proname: that.data.proname,
      proprice: that.data.proprice
    }
    const option = {
      to: that.data.conversationID.slice(3), // 消息的接收方
      conversationType: TIM.TYPES.CONV_C2C, // 会话类型取值TIM.TYPES.CONV_C2C或TIM.TYPES.CONV_GROUP
      payload: {
        data: JSON.stringify(params), // 自定义消息的数据字段
        description: '', // 自定义消息的说明字段
        extension: '' // 自定义消息的扩展字段
      } // 消息内容的容器
    }
    console.log(option)
    const tim = app.globalData.tim
    // 2. 创建消息实例，接口返回的实例可以上屏
    let message = tim.createCustomMessage(option)
    // 2. 发送消息
    let promise = tim.sendMessage(message)
    promise.then(function(res) {
      // 发送成功
      // console.log('自定义消息发送成功')
      var new_data = JSON.parse(res.data.message.payload.data)
      res.data.message.payload.data = new_data
      var messageList = that.data.myMessages
      messageList.push(res.data.message)
      that.setData({
        myMessages: messageList
      })
      // 发送自定义欢迎语
      // that.getSingleMsg()
      that.pageScrollToBottom()
    })
  },
  // 获取到焦点
  focus: function(e) {
    var that = this;
    console.log(e.detail.height)
    this.setData({
      focus: true,
      add: true,
      cross: false,
      input_bottom: e.detail.height
    })
  },
  // 失去焦点
  no_focus: function(e) {
    if (this.data.cross) {
      this.setData({
        focus: false,
        input_bottom: 240,
      })
    } else {
      this.setData({
        focus: false,
        input_bottom: 0
      })
    }
  },
  // 点击加号
  add_icon_click: function(e) {
    // e.target.id == 1 点击加号   ==2  点击 X
    if (e.target.id == 2) {
      this.setData({
        add: true,
        cross: false,
        input_bottom: 0
      })
      if (!this.data.custommsg) {
        this.setData({
          flag: !this.data.flag
        })
      }
    } else if (e.target.id == 1) {
      this.setData({
        add: false,
        cross: true,
        input_bottom: 240
      })
      if (!this.data.custommsg) {
        this.setData({
          flag: !this.data.flag
        })
      }
    }
  },
  // 输入框
  bindKeyInput: function(e) {
    if (e.detail.value == "") {
      this.setData({
        if_send: false,
        inputValue: e.detail.value
      })
    } else {
      this.setData({
        if_send: true,
        inputValue: e.detail.value
      })
    }
  },
  // 表情选择
  selectEmoji(e) {
    this.setData({
      inputValue: this.data.inputValue + e.currentTarget.dataset.text,
      if_send: true
    })
  },
  // 发送普通文本消息
  bindConfirm(e) {
    // this.setData({
    //   add:true
    // })
    var that = this;
    if (that.data.is_lock) {
      that.setData({
        is_lock: false
      })
      if (that.data.inputValue.length == 0) {
        wx.showToast({
          title: '消息不能为空!',
          icon: 'none'
        })
        that.setData({
          is_lock: true
        })
        return;
      }
      var content = {
        text: that.data.inputValue
      };
      var tim = app.globalData.tim
      var options = {
        to: that.data.conversationID.slice(3), // 消息的接收方
        conversationType: TIM.TYPES.CONV_C2C, // 会话类型取值TIM.TYPES.CONV_C2C或TIM.TYPES.CONV_GROUP
        payload: content // 消息内容的容器
      }
      // // 发送文本消息，Web 端与小程序端相同
      // 1. 创建消息实例，接口返回的实例可以上屏
      let message = tim.createTextMessage(options)
      // 2. 发送消息
      let promise = tim.sendMessage(message)
      promise.then(function(imResponse) {
        // 发送成功
        var messageList = that.data.myMessages
        messageList.push(imResponse.data.message)
        that.setData({
          is_lock: true,
          myMessages: messageList,
          add: true,
          if_send: false
        })
        that.pageScrollToBottom()
        that.clearInput()
      }).catch(function(imError) {
        // 发送失败
        console.warn('sendMessage error:', imError);
      })
    }
  },
  // 清除输入框
  clearInput(e) {
    this.setData({
      inputValue: ''
    })
  },
  // 跳转
  house_detail(e) {
    var type = e.currentTarget.dataset.type
    var id = e.currentTarget.dataset.id
    // // 0：写字楼，1：商铺
    if (type * 1 === 0) {
      wx.navigateTo({
        url: `/pageHouse/xzl-detail/index?id=${id}&&index=1`
      })
    } else if (type * 1 === 1) {
      wx.navigateTo({
        url: `/pageHouse/shop-detail/index?id=${id}&&index=1`
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    app.globalData.isDetail = true
    if (!wx.getStorageSync("sessionId")) {
      wx.navigateTo({
        url: '../../../login/login?backflag=customerservice'
      })
      return
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    // 键盘消失
    wx.hideKeyboard()
    // this.setData({
    //   adjust: false
    // })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    // 关闭聊天界面的时候需要把当前聊天界面的监听器关闭 否则会一直监听着 在其他页面出现调用多次的问题
    wx.event.off("testFunc")
    // 键盘消失
    wx.hideKeyboard()
    // this.setData({
    //   adjust: false
    // })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this
    if (!that.data.isCompleted) {
      wx.showLoading({
        title: '加载历史记录中...',
        icon: 'none'
      })
      that.getMoreMsgList()
    } else {
      wx.showToast({
        title: '没有更多历史记录了',
        icon: 'none'
      })
    }
    setTimeout(() => {
      wx.stopPullDownRefresh(true)
    }, 300);
  },
  pageScrollToBottom() {
    wx.createSelectorQuery().select('#chat').boundingClientRect(function(rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        selector: '#chat',
        scrollTop: rect ? 10000 : 0,
        duration: 0
      })
    }).exec()
  },
  sendImg() {
    // 小程序端发送图片
    // 1. 选择图片
    var that = this
    var tim = app.globalData.tim
    wx.chooseImage({
      sourceType: ['album'], // 从相册选择
      count: 1, // 只选一张，目前 SDK 不支持一次发送多张图片
      success: function(res) {
        // 2. 创建消息实例，接口返回的实例可以上屏

        let message = tim.createImageMessage({
          to: that.data.conversationID.slice(3),
          conversationType: TIM.TYPES.CONV_C2C,
          payload: {
            file: res
          },
          onProgress: function(event) {
            console.log('-------file uploading:', event)
          }
        });
        let promise = tim.sendMessage(message);
        promise.then(function(imResponse) {
          // 发送成功
          console.log('----------发送图片:', imResponse);
          that.setMessageList(imResponse.data.message)
          that.setData({
            cross: false,
            add: true,
            input_bottom: 0
          })
        }).catch(function(imError) {
          // 发送失败
          console.warn('---------sendMessage error:', imError);
        });
      }
    })
  },
  parseText: function(payload) {
    let renderDom = []
    // 文本消息
    let temp = payload.text
    let left = -1
    let right = -1
    while (temp !== '') {
      left = temp.indexOf('[')
      right = temp.indexOf(']')
      switch (left) {
        case 0:
          if (right === -1) {
            renderDom.push({
              name: 'text',
              text: temp
            })
            temp = ''
          } else {
            let _emoji = temp.slice(0, right + 1)
            if (emojiMap[_emoji]) { // 如果您需要渲染表情包，需要进行匹配您对应[呲牙]的表情包地址
              renderDom.push({
                name: 'img',
                src: emojiUrl + emojiMap[_emoji]
              })
              temp = temp.substring(right + 1)
            } else {
              renderDom.push({
                name: 'text',
                text: '['
              })
              temp = temp.slice(1)
            }
          }
          break
        case -1:
          renderDom.push({
            name: 'text',
            text: temp
          })
          temp = ''
          break
        default:
          renderDom.push({
            name: 'text',
            text: temp.slice(0, left)
          })
          temp = temp.substring(left)
          break
      }
    }
    return renderDom
  },
  camera: function() {
    var that = this
    var tim = app.globalData.tim
    wx.chooseImage({
      sourceType: ['camera'], // 从相册选择
      count: 1, // 只选一张，目前 SDK 不支持一次发送多张图片
      success: function(res) {
        // 2. 创建消息实例，接口返回的实例可以上屏
        let message = tim.createImageMessage({
          to: that.data.conversationID.slice(3),
          conversationType: TIM.TYPES.CONV_C2C,
          payload: {
            file: res
          },
          onProgress: function(event) {
            console.log('-------file uploading:', event)
          }
        });
        let promise = tim.sendMessage(message);
        promise.then(function(imResponse) {
          // 发送成功
          console.log('----------发送图片:', imResponse);
          that.setMessageList(imResponse.data.message)
          that.setData({
            cross: false,
            add: true,
            input_bottom: 0
          })
        }).catch(function(imError) {
          // 发送失败
          console.warn('---------sendMessage error:', imError);
        });
      }
    })
  },
  preview: function(e) {
    var cur = e.currentTarget.dataset.current
    var imglist = this.data.imglist
    console.log(cur)
    wx.previewImage({
      current: imglist[cur], // 当前显示图片的http链接
      urls: this.data.imglist // 需要预览的图片http链接列表
    })
  },
  setMessageList(obj) {
    console.log('添加聊天列表数据')
    let messageList = this.data.myMessages;
    messageList.push(obj)
    this.setData({
      myMessages: messageList
    })
    this.pageScrollToBottom();
  },
  togoodsdetail: function(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: `../../proDetail/proDetail?id=${id}`,
    })
  },
  faceclick: function() {
    this.setData({
      faceflag: !this.data.faceflag
    })
  }
})