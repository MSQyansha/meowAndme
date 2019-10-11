// pages/my/index.js
import { get_cat_list, get_record_list} from '../../utils/config'
import { pageGo, getFormatListData, getConstellation} from '../../utils/util'
const EditMap = require('../../utils/editMaputil')
const utilStorage = require('../../utils/storage.js')
const app = getApp()
// redcordList: [
  // {
  //   year: '2019年',
  //   content: [
  //     { "record_time": "2019-09-09 09:09:09", "content": "5月称重 1.4kg，比上次重了0.2kg", "record_type": 4 },
  //     { "record_time": "2019-09-10 19:09:09", "content": "5月第一次打了猫三联", "record_type": 2 },
  //   ]
  // },
// ],
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:0,
    showStatus:false,
    isIphoneX: app.globalData.systemInfo.model.slice(0, 8) == "iPhone X" ? true : false,
    tabbar: {},
    projects: EditMap.recordType,
    hasCatInfo:true,
    catInfo:[],
    addRecord: false,//是否显示添加类型 
    loading: false,//页面是否加载完毕
    isLoading: false,//是否正在加载 false 可继续请求数据了 true 数据请求中
    loadMoreData: false, //主页是否可以加载更多  false 否 true 是
    loadAll: false,//是否全部加载完毕 false 否 true 是
    page_size: 10,
    initData:[],//原始数据
    redcordList:[],
    page_info:[],
    windowHeight:0,
    is_show_button: true,//是否展示添加记录/添加提醒按钮 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad');
    this.handleShow('onload')
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    console.log('onHosw');
    // console.log(this.route,wx.env)
    
    wx.stopPullDownRefresh()
    //已经授权的判断是否有猫咪信息
    console.log('onShow-index', this.data.showStatus)
    if(this.data.showStatus){
      this.handleShow()
    }else{
      let catInfo = utilStorage.get('catInfo'),
        redcord_list = utilStorage.get('redcord_list'),
        init_redcord = utilStorage.get('init_redcord'),
        redcord_page = utilStorage.get('redcord_page');

      if (catInfo && redcord_list && init_redcord && redcord_page){
        console.log('has store');
        this.setData({
          catInfo: catInfo,
          redcordList: redcord_list,
          page_info: redcord_page,
          initData: init_redcord
        })
      }else{
        console.log('not has store')
        this.handleShow()
      }

    }
    
  },
  handleShow: function (options){
    let that = this
    if (options != 'onload'){
      that.setData({
        loadMoreData: false,
        loading: false,
        loadAll: false,
        showStatus: false,
        catInfo: [],
        redcordList: [],
        initData: [],
        page_info: [],
        current:0,
      })
    }
   
    let unionId = wx.getStorageSync('union_id')
    if (unionId && unionId != 'null') {//有unionid 
      that.setData({
        unionId: unionId
      })
      that.getCatInfo({ detail: { unionId: unionId } })
    } else {
      that.setData({ loading: true, hasCatInfo:false })
    }
  },

  //获取猫咪信息
  getCatInfo: function (e) {
    // console.log(e,'getCatInfo');
    
    let that =this
    let unionId = e.detail.unionId
    get_cat_list({ current_page: 0, page_size: 6 }, unionId).then(res => {
      if (res.errcode == 0 && res.data.length>0) {
        let data = res.data
        const roleItem = data.find(v => v.role == 1 || v.role == 2);//显示按钮

        let add = wx.getStorageSync('first')
        let invite = wx.getStorageSync('invitePage') && data.length == 1 && data.find(v => v.role != 1)
  
        if (add||invite){
          this.setData({
            first:true
          })
        }

        let newData = data.map(item=>{
          let year, month, day;
          year = item.year != 0 ? item.year + '岁' : ''
          month = item.month != 0 ? item.month + '个月' : ''
          day = item.day != 0 ? item.day + '天' : ''
          return {
            ...item,
            date_of_birth: getConstellation(item.date_of_birth),
            age: year + month + day,
          }
        })

        utilStorage.put('catInfo', newData,300) // 5分钟过期 
        
        let current_index = wx.getStorageSync('current_index');//修改之后定位到具体的某一只
        let current_type = wx.getStorageSync('current_type');//添加时 定位到最后一只猫咪 其他情况都定位0
        

        // console.log(data.length - 1, 'data.length - 1')
        // console.log(current_index, current_type, this.data.current,'index and type');
        

        that.setData({
          catInfo: newData,
          hasCatInfo:true,
          is_show_button: roleItem ? true : false,
          current: current_type == '1' ? data.length - 1 : current_index ? current_index : 0
        },()=>{
          that.initRecord(data)
            // console.log(this.data.current,this.data.is_show_button,'is_show_button')
        })
      }else{
        utilStorage.remove('catInfo')
        utilStorage.remove('redcord_list')
        utilStorage.remove('init_redcord')
        utilStorage.remove('redcord_page')

        that.setData({ hasCatInfo: false })
      }
     
    })
  },
  onTabItemTap:function (params) {
    // console.log('onTabItemTap,', params);
    
  },
  //获取记录列表 初始化
  initRecord:function(catData){
    wx.removeStorageSync('current_type')
    wx.removeStorageSync('current_index')

    let self= this, newredcordList = [],redcord_pageInfo=[], initRedcord=[]

    catData.map((item,index)=>{
      let parmas = {
        catId: item.id,
        current_page: 0,
        page_size: this.data.page_size,
      }

      get_record_list(parmas, this.data.unionId).then(res => {
        let data = res.data

        if (res.errcode == 0 && data.length > 0) {

          newredcordList[index] = getFormatListData(data)
          initRedcord[index] = data
          redcord_pageInfo[index] = res.page_info

          self.setData({
            redcordList: newredcordList,
            page_info: redcord_pageInfo,
            initData: initRedcord,
            loading: true
          })

          // console.log(this.data.redcordList, this.data.initData, 'list');

        } else{
          newredcordList[index] = []
          initRedcord[index] = []
          redcord_pageInfo[index] = {}
          self.setData({ loading: true })
        }

        
        utilStorage.put('redcord_list', newredcordList, 300) //5分钟过期
        utilStorage.put('init_redcord', initRedcord, 300) //5分钟过期
        utilStorage.put('redcord_page', redcord_pageInfo, 300) //5分钟过期

       
      })
    })
  },

  //获取记录列表
  getRecord: function () {
    wx.stopPullDownRefresh()

    let self = this
    const { page_info, current,catInfo, unionId, redcordList, initData} = self.data

    self.setData({ isLoading: true })

    let parmas = {
      catId: catInfo[current].id,
      current_page: page_info[current].current_page,
      page_size: page_info[current].page_size,
    }
  
    get_record_list(parmas, this.data.unionId).then(res => {
      let data = res.data
      if (res.errcode == 0 && data.length > 0) {
        //判断是否全部加载完毕
        let loadingAll = true
        if (data.length < res.page_info.total_count) { //有数据
          loadingAll = false
        }

        initData[current] = initData[current].concat(data)
        redcordList[current] = getFormatListData(initData[current])
        page_info[current] = res.page_info
     
        utilStorage.put('redcord_list', redcordList, 300) //5分钟过期
        utilStorage.put('init_redcord', initData, 300) //5分钟过期
        utilStorage.put('redcord_page', page_info, 300) //5分钟过期

        self.setData({
          initData,
          redcordList,
          page_info,
          loadAll: loadingAll,
          isLoading: false,
        }) 
      }
      self.setData({ loading: true })
    })
  },
  //添加猫咪
  goToAdd: function (e) {
    console.log(e.detail.unionId,'goToAdd')
    if (!this.data.hasCatInfo) {
      let unionId = e.detail.unionId
      this.setData({ unionId })
      get_cat_list({ current_page: 0, page_size: 1 }, unionId).then(res => {
        if (res.errcode == 0 && res.data.length > 0) {//有
          this.handleShow()
        } else {
          pageGo(`/pages/addCat/index?first=true`, 1)
        }
      })
    }
  },
  //查看记录详情
  gotoEditRecord: function (e) {
     let { catInfo, current } = this.data
     let catId = catInfo[current].id,
        recordtype = e.currentTarget.dataset.recordtype,
        nickname = catInfo[current].nickname,
        id = e.currentTarget.dataset.id;
     pageGo(`/pages/addRecord/index?catId=${catId}&recordtype=${recordtype}&id=${id}&nickname=${nickname}`, 1)
  },
  //添加记录
  gotoAddRecord: function (e) {
    let { catInfo, current } =this.data
    let role = catInfo[current].role, //角色 1 主人 2 家人 3亲人
      catId = catInfo[current].id,
      nickname = catInfo[current].nickname,
      id = e.detail.id ;
    if (role!=3){
      pageGo(`/pages/addRecord/index?catId=${catId}&recordtype=${id}&nickname=${nickname}&role=${role}`, 1)
    }else{
      pageGo(`/pages/addRecord/index?catId=${catId}&recordtype=${id}&role=${role}`, 1)
    }
    this.hideAddRecord()
  },
  //查看猫咪列表
  goToEdit:function () {
    pageGo(`/pages/family/catList/index`, 1)    
  },

  showAddRecord: function () {
    this.setData({
      addRecord: true
    })
  },

  hideAddRecord: function () {
    this.setData({
      addRecord: false
    })
  },
  
  onReachBottom: function () {
    let { page_info, isLoading,current } = this.data

    if (Object.keys(page_info[current]).length!=0){
      if (page_info[current].current_page == (page_info[current].total_page - 1)) {
        this.setData({
          loadMoreData: false,
          loadAll: true
        })

      } else {
        if (isLoading) return
        page_info[current].current_page = page_info[current].current_page + 1
        this.setData({
          page_info,
          loadMoreData: true
        })

        this.getRecord();
      }
    }
  },


  // 图片预览
  previewCatImg: function (e){
    let current = e.currentTarget.dataset.current
    let urls = e.currentTarget.dataset.urls
   
    wx.previewImage({
      current:current,
      urls:urls,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 卡片滑动
  swriperChange:function(e){
    let that= this
    let { redcordList,catInfo} =that.data
    that.setData({
      current: e.detail.current
    },()=>{
      if(redcordList.length != catInfo.length)
        that.getRecord(that.data.page_size)
    })
  },
  // 隐藏引导
  hideGuide:function () {
    wx.removeStorageSync('first');
    wx.removeStorageSync('invitePage');
    this.setData({
      first:false
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {  

  
  },
})

