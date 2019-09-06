// tabBarComponent/tabBar.js

const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object,
      value: {
        "backgroundColor": "#ffffff",
        "color": "#B6B6B6",
        "selectedColor": "#3CCB9B",
        "list": [
          {
            "pagePath": "/pages/index/index",
            "iconPath": "/images/icon/ic_eye.png",
            "selectedIconPath": "/images/icon/ic_eye_active.png",
            "text": "记录",
            "isTabbar": true
          },
          {
            "pagePath": "/pages/remind/index",
            "iconPath": "/images/icon/ic_clock.png",
            "selectedIconPath": "/images/icon/ic_clock_active.png",
            "text": "提醒",
            "isTabbar": true
          }
        ]
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: app.globalData.systemInfo.model.slice(0, 8) == "iPhone X" ? true : false,
  },
  /**
     * 组件所在页面的生命周期
     */
  pageLifetimes: {
    show: function () {
      // 页面被展示
      
      // console.log('pageLifetimes==show')
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },
  /**
   * 组件的生命周期
   */
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      // console.log('attached')
      //隐藏系统tabbar
      wx.hideTabBar()
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      // console.log('detached')
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _navigator(e){
      let path = e.currentTarget.dataset.path
      let tabbar = e.currentTarget.dataset.tabbar
      if (tabbar){
        wx.switchTab({
          url: path,
        })
      }else{
        wx.navigateTo({
          url: path,
        })
      }
    },
    _gotorelease(e) {
      // wx.navigateTo({
      //   url: '/pages/release/page1/index'
      // })
    },
  }
})
