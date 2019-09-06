// pages/variety-book/index.js

const vatietyMap = require('./variety_data.js')


const TITLE_HEIGHT = 30

Page({
  data: {
    selectCat:'',
    hotData: vatietyMap.hotVatiety,
    toView: '',
    logs:[],
    scrollTop: 0,
    scrollHeight:0,
    listHeight: [],
    currentIndex: 0,
    fixedTop: 0,
    isSearch:false,
    searchValue:'',
    searchLogs:[]

  },
  onLoad: function (options) {
    this.setData({
      logs: this._normalizeSinger(vatietyMap.allVatiety)
    })
    if (options.type){
      this.setData({
        selectCat: options.type
      })
    }
  },
  onReady: function () {
    //计算高度
    this._calculateHeight()
  },
  _normalizeSinger(list) {
    //列表渲染
    let map = {}
    list.forEach((item, index) => {
      const key = item.index
      if (!map[key]) {
        map[key] = {
          title: key,
          items: []
        }
      }
      map[key].items.push({
        name: item.name,
      })
    })
    // 为了得到有序列表，我们需要处理 map
    let ret = []
    for (let key in map) {
      let val = map[key]
      if (val.title.match(/[a-zA-Z]/)) {
        ret.push(val)
      }
    }
    ret.sort((a, b) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })
    return ret
  },
  onShow:function (params) {
    
  },
  scroll: function (e) {
    var newY = e.detail.scrollTop;
    this.scrollY(newY);
  },
  scrollY(newY) {
    const listHeight = this.data.listHeight
    // 当滚动到顶部，newY>0
    if (newY == 0 || newY < 0) {
      this.setData({
        currentIndex: 0,
      })
      return
    }
    // 在中间部分滚动
    for (let i = 0; i < listHeight.length - 1; i++) {
      let height1 = listHeight[i]
      let height2 = listHeight[i + 1]
      if (newY >= height1 && newY < height2) {
        this.setData({
          currentIndex: i
        })
        this.fixedTt(height2 - newY);
        return
      }
    }
    // 当滚动到底部，且-newY大于最后一个元素的上限

    this.setData({
      currentIndex: listHeight.length - 2,
    })

  },
  fixedTt(newVal) {
    let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
    if (this.data.fixedTop === fixedTop) {
      return
    }
    this.setData({
      fixedTop: fixedTop
    })
  },
  _calculateHeight() {
    let lHeight = [],
      that = this;
    var height = 0;
    lHeight.push(height);
    var query = wx.createSelectorQuery();
    query.selectAll('.list-group').boundingClientRect(function (rects) {
      let rect = rects,
        len = rects.length;
      for (let i = 0; i < len; i++) {
        height += rect[i].height;
        lHeight.push(height)
      }
    }).exec();

    let scroll_view_h, list_shortcut_h
     query.select('.scroll_view').boundingClientRect(function (rects) {
       scroll_view_h= rects.height
    }).exec();;
    query.select('.list-shortcut').boundingClientRect(function (rects) {
      list_shortcut_h= rects.height
    }).exec();

    var calHeight = setInterval(function () {
      if (lHeight != [0]) {
        that.setData({
          listHeight: lHeight
        });
        clearInterval(calHeight);
        if (list_shortcut_h >= scroll_view_h){
          that.setData({
            scrollHeight: list_shortcut_h + 20 +'px'
          });
        }
      }
    }, 1000)
  },
  scrollToview(e) {
    let id = e.target.dataset.id
    this.setData({
      toView: id
    })
  },
  //滑动结束

  //选择品种
  changeCat: function (e) {
    let that = this
    const name = e.currentTarget.dataset.name;
    
    that.setData({
      selectCat: name
    },()=>{
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];  //上一个页面
      //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        parmas:{
          ...prevPage.data.parmas,
          type: that.data.selectCat
        }
      });

      wx.navigateBack({
        delta: 1 //delta为1时表示返回上一页，为2时表示上上一页，
      })
    })

  },
  

  //模糊搜索
  filterSearch:function(e){
    let that = this

    let value = e.detail.value;
    if (value==''){
      this.setData({
        searchLogs: [],
        searchValue: '',
      })
      return
    }
    
    let searchData = vatietyMap.allVatiety
    let newfilter = []
    searchData.map(item=>{
      if (item.name.match(value)!=null){
        let reg = new RegExp("(" + value + ")", "g");
        let newStr = item.name.replace(reg, "<span style='color:#3CCB9B'>$1</span>")
        item.str = "<div>" + newStr + "</div>"
        newfilter.push(item)
      }
    }).filter((item, i, self) => item && self.indexOf(item)===i)

    this.setData({
      searchLogs:newfilter,
      searchValue: value,
    })
  },

  //获得焦点
  filterFocus: function() {
    this.setData({
      isSearch:true
    })
  },
  clearIpt:function () {
    this.setData({
      searchLogs: [],
      searchValue: '',
    })
  },
  cancelFilter: function () {
    this.setData({
      isSearch: false,
      searchLogs: [],
      searchValue: '',
    })
  },
  
})
