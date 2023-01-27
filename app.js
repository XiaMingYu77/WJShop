//app.js
// import TIM from './utils/tim-wx.js';
import TIM from 'tim-wx-sdk';
import COS from "cos-wx-sdk-v5";
import Event from './utils/event.js'
import util from './utils/util.js'
//挂载到wx对象上
wx.event = new Event();
var app = getApp()
App({
    onLaunch: function(options) {


      this.iminit()
      //       // wx.navigateTo({
      //       //   url: '../getphonenumber/getphonenumber'
      //       // })
      // wx.getSetting({
      //   success: (res) => {
      //     url: '/pages/wujieindex/wujieindex',

      //     if (res.authSetting['scope.userInfo']) {
      //       this.getUserInfo()
      //       var hasPhone = wx.getStorageSync('hasphone');
      //       console.log("这里是测试最后:" + hasPhone);
      //       // wx.navigateTo({
      //       //   url: '../getphonenumber/getphonenumber'
      //       // })
      //       if (wx.getStorageSync('hasphone') == 'true') {
      //         wx.switchTab({
      //           url: '/pages/wujieindex/wujieindex',
      //         })
      //       } else {
      //         wx.navigateTo({
      //           url: '/pages/getphonenumber/getphonenumber'
      //         })
      //       }
      //     } else {
      //       //用户没有授权
      //       console.log("用户没有授权");
      //     }
      //   }
      // })

      // 获取系统信息
      var that = this
      wx.getSystemInfo({
        success: function(res) {
          that.globalData.platform = res.platform
          let totalTopHeight = 68
          if (res.model.indexOf('iPhone X') !== -1) {
            totalTopHeight = 88
          } else if (res.model.indexOf('iPhone') !== -1) {
            totalTopHeight = 64
          }
          that.globalData.statusBarHeight = res.statusBarHeight
          that.globalData.titleBarHeight = totalTopHeight - res.statusBarHeight
        },
        failure() {
          that.globalData.statusBarHeight = 0
          that.globalData.titleBarHeight = 0
        }
      })

      // 获取小程序更新机制兼容
      if (wx.canIUse('getUpdateManager')) {
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function(res) {
          // 请求完新版本信\息的回调
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function() {
              wx.showModal({
                title: '更新提示',
                content: '新版本已经上线啦~，为了获得更好的体验，建议立即更新',
                showCancel: false,
                confirmColor: "#5677FC",
                success: function(res) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              })

              wx.setTabBarBadge({
                index: 1,
                text: 'new'
              })
            })
            updateManager.onUpdateFailed(function() {
              // 新的版本下载失败
              wx.showModal({
                title: '更新失败',
                content: '新版本更新失败，为了获得更好的体验，请您删除当前小程序，重新搜索打开',
                confirmColor: "#5677FC",
                showCancel: false
              })
            })
          }
        })
      } else {
        // 当前微信版本过低，无法使用该功能
      }

      // setTimeout(() => {
      //   if (!wx.getStorageSync("thorui_" + this.globalData.version)) {
      //     wx.setTabBarBadge({
      //       index: 1,
      //       text: 'new'
      //     })
      //   }
      // }, 0)

      var logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)

      var isDebug = false; //调试状态使用本地服务器，非调试状态使用远程服务器
      if (!isDebug) {
        //远程域名
        // wx.setStorageSync('domainName', "https://shop.we-time.net")
        wx.setStorageSync('domainName', util.interfaceUrl())
        wx.setStorageSync('wssDomainName', "https://shop.we-time.net")
      } else {
        //本地测试域名
        // wx.setStorageSync('domainName', "http://localhost:58936")
        // wx.setStorageSync('wssDomainName', "ws://localhost:58936")
        //使用.NET Core 2.2 Sample（Senparc.Weixin.MP.Sample.vs2017.sln）配置：
        // wx.setStorageSync('domainName', "http://localhost:58936/VirtualPath")
        // wx.setStorageSync('wssDomainName', "ws://localhost:58936/VirtualPath")

        //使用 .NET Core 3.0 Samole（Senparc.Weixin.Sample.NetCore3.vs2019.sln）配置：
        //杨旺测试
        // wx.setStorageSync('domainName', "http://localhost:14460/")
        // wx.setStorageSync('wssDomainName', "wss://localhost:14460/")
        //彭商贤测试
        wx.setStorageSync('domainName', "http://192.168.1.115/")
        wx.setStorageSync('wssDomainName', "wss://192.168.1.115/")
      }

      // 打开调试
      // wx.setEnableDebug({
      //   enableDebug: true
      // })

      // if (wx.getStorageSync('userInfo')) {
      //   console.log("111")
      //   wx.switchTab({
      //     url: '/pages/login/login'
      //   })
      // } else {
      //   wx.reLaunch({
      //     url: '/pages/login/login'
      //   })
      // }
      // wx.loadFontFace({
      //   family: 'PingFangSC-Medium',
      //   source: 'url("https://www.your-server.com/PingFangSC-Medium.ttf")',
      //   success: function () { console.log('load font success') }
      // })



    },
    onShow: function(options) {
      // console.log(options)
      // const scene = decodeURIComponent(options.query.scene)
      // if (options.scene === 1047 || options.scene === 1048 || options.scene === 1049) {
      //   console.log(scene)
      //   var id = scene.substring(0,scene.length-6)
      //   var invitenum = scene.substring(scene.length - 6)
      //   console.log(id, invitenum)
      //   // console.log(this.getQueryString(scene, "A"))
      //   wx.navigateTo({
      //     url: `../pages/extend-view/proDetail/proDetail?id=${id}&invitenum=${invitenum}`
      //   })
      // }
      // console.log(scene)
      // // wx.setStorageSync("scene", scene)
      // console.log("appshow")
    },
    getQueryString: function(url, name) {
      console.log("url = " + url)
      console.log("name = " + name)
      var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
      var r = url.substr(1).match(reg)
      if (r != null) {
        console.log("r = " + r)
        console.log("r[2] = " + r[2])
        return r[2]
      }
      return null;
    },
    onError(err) {
      //全局错误监听
      //console.log("发生错误："+err)
      // const res = wx.getSystemInfoSync()
      // let errMsg = "手机品牌：" + res.brand + "；手机型号：" + res.model + "；微信版本号：" + res.version + "；操作系统版本：" + res.system + "；客户端平台：" + res.platform + "；错误描述：" + err;
    },
    getUserInfo: function(cb) {
      var that = this
      // var DeviceID=app.gloglobalData.DeviceID
      if (this.globalData.userInfo) {
        typeof cb == "function" && cb(this.globalData.userInfo)
      } else {
        //调用登录接口
        wx.login({
          success: function(res) {
            console.log(res)
            //换取openid & session_key
            wx.request({
              url: wx.getStorageSync('domainName') + '/WxOpen/OnLogin',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'AppType': '2',
                'DeviceID': "psx1234567890"
              },
              data: {
                code: res.code
              },
              success: function(json) {

                console.log("login success " + json);

                var result = json.data;
                console.log(result)
                if (result.success) {
                  wx.setStorageSync('sessionId', result.sessionId);
                  wx.setStorageSync('token', result.sessionId);
                  wx.setStorageSync('hasphone', result.hasPhone);
                  that.globalData.hasphone = result.hasPhone
                  wx.setStorageSync('RePecent', result.data.RePecent);
                  wx.setStorageSync('RatePecent', result.data.RatePecent);
                  wx.setStorageSync('OrdinaryRePecent', result.data.OrdinaryRePecent);
                  wx.setStorageSync('userid', result.data.UserPhone)
                  wx.setStorageSync('sig', result.data.IMSign)
                  wx.setStorageSync('MemID', result.data.MemID)
                  wx.setStorageSync('UserImg', result.data.UserImg)
                  wx.setStorageSync('isnew', result.data.IsNewPerson)
                  that.globalData.isnew = result.data.IsNewPerson
                  wx.setStorageSync('isLog', true)
                  console.log(wx.getStorageSync('hasphone'))

                  let promise = that.globalData.tim.login({
                    userID: result.data.UserPhone,
                    userSig: result.data.IMSign
                  });
                  promise.then(function(imResponse) {
                    console.log(imResponse.data); // 登录成功
                  }).catch(function(imError) {
                    console.warn('login error:', imError); // 登录失败的相关信息
                  });
                  //获取userInfo并校验
                  wx.getUserInfo({
                    success: function(userInfoRes) {
                      console.log('get userinfo', userInfoRes);
                      that.globalData.userInfo = userInfoRes.userInfo
                      typeof cb == "function" && cb(that.globalData.userInfo)

                      //校验
                      wx.request({
                        url: wx.getStorageSync('domainName') + '/WxOpen/CheckWxOpenSignature',
                        method: 'POST',
                        header: {
                          'content-type': 'application/x-www-form-urlencoded',
                          'AppType': '2',
                          'DeviceID': "psx1234567890"
                        },
                        data: {
                          sessionId: wx.getStorageSync('sessionId'),
                          rawData: userInfoRes.rawData,
                          signature: userInfoRes.signature
                        },
                        success: function(json) {
                          console.log(json.data);
                        }
                      });

                      //解密数据（建议放到校验success回调函数中，此处仅为演示）
                      wx.request({
                        url: wx.getStorageSync('domainName') + '/WxOpen/DecodeEncryptedData',
                        method: 'POST',
                        header: {
                          'content-type': 'application/x-www-form-urlencoded',
                          'AppType': '2',
                          'DeviceID': "psx1234567890"
                        },
                        data: {
                          'type': "userInfo",
                          sessionId: wx.getStorageSync('sessionId'),
                          encryptedData: userInfoRes.encryptedData,
                          iv: userInfoRes.iv
                        },
                        success: function(json) {
                          console.log(json.data);
                        }
                      });
                    }
                  })
                } else {
                  console.log('储存session失败！', json);
                }
              }
            })
          }
        })
      }
    },
    iminit() {
      let options = {
        SDKAppID: "1400353409" // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
      }
      var that = this
      // 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
      let tim = TIM.create(options); // SDK 实例通常用 tim 表示
      // 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
      // tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
      tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用
      // 注册 COS SDK 插件
      tim.registerPlugin({
        'cos-wx-sdk': COS
      })
      // 监听事件，例如：
      tim.on(TIM.EVENT.SDK_READY, function(event) {
        console.log('SDK_READY')
        that.globalData.isImLogin = true
        wx.setStorageSync('isImLogin', true)
        // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
        // event.name - TIM.EVENT.SDK_READY
      });

      tim.on(TIM.EVENT.MESSAGE_RECEIVED, function(event) {
        console.log('收到消息')
        // 若同时收到多个会话 需要根据conversationID来判断是哪个人的会话
        var msgarr = []
        var newMsgForm = event.data[0].conversationID // 定义会话键值
        console.log(msgarr[newMsgForm])
        if (msgarr[newMsgForm]) {
          msgarr[newMsgForm].push(event.data[0])
        } else {
          msgarr[newMsgForm] = [event.data[0]]
        }
        console.log(msgarr[newMsgForm])
        that.globalData.myMessages = msgarr
        // 这里引入了一个监听器 （因为小程序没有类似vuex的状态管理器 当global里面的数据变化时不能及时同步到聊天页面 因此 这个监听器可以emit一个方法 到需要更新会话数据的页面 在那里进行赋值）
        wx.event.emit('testFunc', that.globalData.myMessages, newMsgForm) // 详情页的函数
        wx.event.emit('conversation') // 会话列表的监听函数
        // 未读消息数
        var number = wx.getStorageSync('number_msg') || 0
        // 根据isRead判断是否未读 否则加1
        if (!event.data[0].isRead) {
          number = number++
        }
        console.log(number)
        wx.setStorageSync('number_msg', number)
        // 如果有未读数 需要设置tabbar的红点标志 反之去掉红点标志
        // if (number > 0) {
        //   wx.setTabBarBadge({
        //     index: 2,
        //     text: number.toString()
        //   })
        // } else {
        //   wx.hideTabBarRedDot({
        //     index: 2
        //   })
        // }
        // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
        // event.name - TIM.EVENT.MESSAGE_RECEIVED
        // event.data - 存储 Message 对象的数组 - [Message]
      })

      tim.on(TIM.EVENT.MESSAGE_REVOKED, function(event) {
        // 收到消息被撤回的通知
        // event.name - TIM.EVENT.MESSAGE_REVOKED
        // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isRevoked 属性值为 true
      });

      tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function(event) {
        // 更新当前所有会话列表
        // 注意 这个函数在首次点击进入会话列表的时候也会执行 因此点击消息 可以显示当前的未读消息数（unreadCount表示未读数）
        console.log('发送了消息')
        console.log('更新当前所有会话列表')
        var conversationList = event.data
        var number = 0
        conversationList.forEach(e => {
          number = number + e.unreadCount
        })
        wx.setStorageSync('number_msg', number)
        // if (number > 0) {
        //   wx.setTabBarBadge({
        //     index: 2,
        //     text: number.toString()
        //   })
        // } else {
        //   wx.hideTabBarRedDot({
        //     index: 2
        //   })
        // }
        // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
        // event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
        // event.data - 存储 Conversation 对象的数组 - [Conversation]
      });

      tim.on(TIM.EVENT.GROUP_LIST_UPDATED, function(event) {
        // 收到群组列表更新通知，可通过遍历 event.data 获取群组列表数据并渲染到页面
        // event.name - TIM.EVENT.GROUP_LIST_UPDATED
        // event.data - 存储 Group 对象的数组 - [Group]
      });

      tim.on(TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, function(event) {
        // 收到新的群系统通知
        // event.name - TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED
        // event.data.type - 群系统通知的类型，详情请参见 GroupSystemNoticePayload 的 operationType 枚举值说明
        // event.data.message - Message 对象，可将 event.data.message.content 渲染到到页面
      });

      tim.on(TIM.EVENT.PROFILE_UPDATED, function(event) {
        // 收到自己或好友的资料变更通知
        // event.name - TIM.EVENT.PROFILE_UPDATED
        // event.data - 存储 Profile 对象的数组 - [Profile]
      });

      tim.on(TIM.EVENT.BLACKLIST_UPDATED, function(event) {
        // 收到黑名单列表更新通知
        // event.name - TIM.EVENT.BLACKLIST_UPDATED
        // event.data - 存储 userID 的数组 - [userID]
      });

      tim.on(TIM.EVENT.ERROR, function(event) {
        // 收到 SDK 发生错误通知，可以获取错误码和错误信息
        // event.name - TIM.EVENT.ERROR
        // event.data.code - 错误码
        // event.data.message - 错误信息
      });

      tim.on(TIM.EVENT.SDK_NOT_READY, function(event) {
        // wx.setStorageSync('isImLogin', false)
        console.log('SDK_NOT_READY')
        that.globalData.isImLogin = false
        wx.setStorageSync('isImLogin', false)
        // 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
        // event.name - TIM.EVENT.SDK_NOT_READY
      });

      tim.on(TIM.EVENT.KICKED_OUT, function(event) {
        console.log('KICKED_OUT')
        wx.setStorageSync('isImLogin', false)
        that.globalData.isImLogin = false
        // 收到被踢下线通知
        // event.name - TIM.EVENT.KICKED_OUT
        // event.data.type - 被踢下线的原因，例如:
        //    - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
        //    - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
        //    - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢
      })
      that.globalData.tim = tim
    },
    globalData: {
      version: "1.4.2",
      isOnline: false,
      userInfo: null,
      DeviceID: "psx1234567890",
      selected: 1,
      tim: '',
      isImLogin: false,
      msgList: [],
      myMessages: new Map(),
      tabBottom: 0, // 全面屏底部黑条高度
      accountTid: '', //当前用户的tid
      isDetail: true,
      taskname:[],
      paymoney:"",
      evaluatemoney:""
    }
  })

  // app.js
  /**
   * 全局分享配置，页面无需开启分享
   * 使用隐式页面函数进行页面分享配置
   * 使用隐式路由获取当前页面路由，并根据路由来进行全局分享、自定义分享
   */
  ! function() {
    //获取页面配置并进行页面分享配置
    var PageTmp = Page
    Page = function(pageConfig) {
      //1. 获取当前页面路由
      let routerUrl = ""
      wx.onAppRoute(function(res) {
        //app.js中需要在隐式路由中才能用getCurrentPages（）获取到页面路由
        let pages = getCurrentPages(),
          view = pages[pages.length - 1];
        routerUrl = view.route
      })

      //2. 全局开启分享配置
      pageConfig = Object.assign({
        onShareAppMessage: function() {
          //根据不同路由设置不同分享内容（微信小程序分享自带参数，如非特例，不需配置分享路径）
          let shareInfo = {}
          let noGlobalSharePages = ["wujieindex/wujieindex"]
          //全局分享配置，如部分页面需要页面默认分享或自定义分享可以单独判断处理
          if (!routerUrl.includes(noGlobalSharePages)) {
            shareInfo = {
              title: "通用商城",
              // imageUrl: "/static/iconfont/none.png"
            }
          }
          return shareInfo
        }
      }, pageConfig);
      // 配置页面模板
      PageTmp(pageConfig);
    }
  }();