//app.js
const aldstat = require("./utils/ald-stat.js")
import { get_unionId } from './utils/config'
const API = require('./utils/api.js');
App({
  onLaunch: function () {
  },
  onShow:function (params) {
    //获取设备信息
    this.getSystemInfo();
    //版本自动更新
    this.checkUpdateVersion()
  },
  globalData: {
    userInfo: null,
    systemInfo: null,//客户端设备信息
  },
  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.systemInfo = res;
      }
    });
  },
  // 全局获取用户信息
  getUserInfoAll: function (res, callback) {
    let _this = this;
    // console.log(res, '---获取用户信息---');
    if (res.detail.errMsg == 'getUserInfo:fail auth deny') {
      wx.showModal({
        title: '温馨提示',
        content: '授权后可享受更多功能',
        mask: true,
        confirmColor: '#2ABE76',
        success: function (res) { }
      })
    } else if (res.detail.errMsg == 'getUserInfo:ok') {
      let userInfo = res.detail.userInfo;
      _this.globalData.userInfo = userInfo;
      wx.setStorageSync('user_info', userInfo); //存储用户信息
      // _this.wxLogin(res.detail.encryptedData, res.detail.iv);
      let encryptedData = res.detail.encryptedData;
      let iv = res.detail.iv
      //callback 必须在拿到unionid之后才返回
      wx.login({
        success: function (res) {
          console.log(res, 'wx_login_success')
          if (res.code) {
            let params = {
              app_id: API.APP_ID,
              code: res.code,
              encrypted_data: encryptedData,
              iv: iv
            };
            // console.log(params, 'get_unionId==params')
            get_unionId(params).then(res => {
              "use strict";
              console.log(res,'get_unionId_res')
              if (res.errcode == 0 && res.data.user_id!='') {
                //存储unionid等
                let unionId = res.data.user_id;
                wx.setStorageSync('union_id', unionId)
                callback({
                  userInfo: userInfo,
                  hasUserInfo: true,
                  unionId: unionId
                });
              } else {
                console.log("获取unionid报错", res)
              }
            }).catch(req => {
              console.log('接口调取失败--', req)
            })
          }
        },
        fail: function (req) {
          console.log('fail--', req)
        }
      })

    }
  },
  //版本自动更新的实现
  checkUpdateVersion: function () {
    //判断微信版本是否 兼容小程序更新机制API的使用
    if (wx.canIUse('getUpdateManager')) {
      //创建 UpdateManager 实例
      const updateManager = wx.getUpdateManager();
      //检测版本更新
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //监听小程序有版本更新事件
          updateManager.onUpdateReady(function () {
            //TODO 新的版本已经下载好，调用 applyUpdate 应用新版本并重启 （ 此处进行了自动更新操作）
            updateManager.applyUpdate();
          })
          updateManager.onUpdateFailed(function () {
            // 新版本下载失败
            wx.showModal({
              title: '已经有新版本喽~',
              content: '请您删除当前小程序，重新搜索打开哦~',
            })
          })
        }
      })
    } else {
      //TODO 此时微信版本太低（一般而言版本都是支持的）
      wx.showModal({
        title: '溫馨提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }
})