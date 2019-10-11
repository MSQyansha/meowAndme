Component({
  data: {
    selected: 0,
    color: "#B6B6B6",
    selectedColor: "#3CCB9B",
    list: [{
      "pagePath": "/pages/index/index",
      "text": "记录",
      "iconPath": "/images/icon/ic_eye.png",
      "selectedIconPath": "/images/icon/ic_eye_active.png"
    },
      {
        "pagePath": "/pages/remind/index",
        "text": "提醒",
        "iconPath": "/images/icon/ic_clock.png",
        "selectedIconPath": "/images/icon/ic_clock_active.png"
      }]
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})