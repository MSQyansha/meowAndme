// pages/addCat/index.js
import WeCropper from '../../we-cropper/we-cropper.min.js'
import { upload_photos_url, add_cat_info, update_cat_info, get_cat_details,get_cat_list} from '../../utils/config'
import { formatTime,pageGo, successShowText, analyzeStatus } from '../../utils/util.js'

const EditMap = require('../../utils/editMaputil')

const device = wx.getSystemInfoSync() // 获取设备信息

const width = device.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
const height = device.windowHeight - 60
const cutW = 300
const cutH = cutW

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openSet: false,
    login: true,//是否有授权
    request:true,
    today: formatTime(new Date(), 'YYYY-MM-DD'),
    showStatus: false, //显示图片裁剪状态值
    cropperOpt: {
      id: 'cropper', // 用于手势操作的canvas组件标识符
      targetId: 'targetCropper', // 用于用于生成截图的canvas组件标识符
      pixelRatio: device.pixelRatio, // 传入设备像素比
      width,  // 画布宽度
      height, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - cutW) / 2, // 裁剪框x轴起点
        y: (height - cutH) / 2, // 裁剪框y轴期起点
        width: cutW, // 裁剪框宽度
        height: cutH  // 裁剪框高度
      }
    },
    head_url: null,
    EditMap: EditMap,
    id: null,//猫咪编辑的id
    verify: false,
    parmas: {
      // "nickname": null,
      // "head_url": null,
      // "sex": null,
      // "spay_status": null,
      // "type": null,//品种
      // "weight": null,
      // "date_of_birth": null,
      // "date_of_adopted": null,
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, 'ononLoad');

    let union_id = wx.getStorageSync('union_id');

    let id = options.id, current_type = options.current_type, current_index = options.current_index;
    this.setData({
      first: options.first,
      current_type,//是否定位猫咪 1 定位 0 否 
      current_index,//当前猫咪的index
      id,
      unionId: union_id && union_id != 'null' ? union_id : null,
      login: union_id && union_id != 'null' ? true : false,
    })

    if (union_id && union_id != 'null') {
      this.getCatInfo(union_id)
    }

    if (id) this.getCatDetails(id)

    //图片裁剪
    const { cropperOpt } = this.data
    this.cropper = new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        wx.hideToast()
      })
      .updateCanvas()
  },
  handleLogin:function(e){
     this.setData({ 
        login: true,
        unionId: e.detail.unionId
     }, () => this.getCatInfo(e.detail.unionId))
  },
   //获取猫咪信息
   getCatInfo: function (union_id) {
      get_cat_list({ current_page: 0, page_size: 6 }, union_id).then(res => {
         if (res.errcode == 0) {
            let catNum = res.data.length
            if (catNum > 6) { //每个人最多能添加6只猫咪
               this.setData({
                  openSet:true
               })
            }
         }
      })
   },
   modalConfrim:function(){
      pageGo('/pages/index/index', 4)
   },
  //获取猫咪详情信息
  getCatDetails: function (id) {
    let { unionId} =this.data
    get_cat_details(id, unionId).then(res=>{
      if (res.errcode==0){
        let data = res.data
        let newEditMap={
          ...EditMap,
          sexMap: analyzeStatus(data.sex, EditMap.sexMap),
          spayMap: analyzeStatus(data.spay_status, EditMap.spayMap)
        }
        this.setData({
          parmas: data,
          EditMap: newEditMap
        },()=>this.verifyParmas())
      }

    })
  },
  //跳转选择猫咪品种
  goSelectVarity:function () {
    let type = this.data.parmas.type
    pageGo(type ? `/pages/variety_list/index?type=${type}` :`/pages/variety_list/index`,1)
  },
   //点击修改
  comfirmHandle:function () {
    let that = this
    let { id, parmas, verify, current_type, current_index, request, first } = that.data

    if (!verify) return
    if (!request) return
    that.setData({
      request:false
    })

    let unionId = wx.getStorageSync('union_id')
    parmas.weight = Number(parmas.weight)
    if (id) {
      update_cat_info(parmas, id, unionId).then(res => {
        if (res.errcode == 0) {
          wx.setStorageSync('current_index', current_index)
          successShowText('修改成功')
          that.goback()
        } else {
          successShowText('修改失败')
        }
        that.setData({
          request: true
        })
      })
    } else {
      add_cat_info(parmas, unionId).then(res => {
        if (res.errcode == 0) {
          successShowText('添加成功')
          wx.setStorageSync('current_type', '1')
          if (first) {
            wx.setStorageSync('first', true)
          }
          that.goback()
        } else if (res.errcode == 1003) {//errcode 1003 不能在增加猫咪了
          that.setData({
            openSet: true
          })
        } else {
          successShowText('添加失败')
        }
        that.setData({
          request: true
        })
      })
    }
  },
  goback: function () {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];  //上一个页面

    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      reload: true,
      homeReload: true
    }, () => {
      wx.navigateBack({
        delta: 1
      })
    })
    
  },
  changeIpt: function (e) {
    let { parmas } = this.data
    const name = e.currentTarget.dataset.name;
    let value = e.detail.value;
    parmas[name] = value
    this.setData({
      parmas
    }, () => this.verifyParmas())
  },
  selectTab: function (e) {
    let { parmas, EditMap } = this.data
    const dataset = e.currentTarget.dataset
    parmas[dataset.name] = dataset.status
    EditMap[dataset.map] = EditMap[dataset.map].map(v => (
      v.status == dataset.status ? { ...v, select: true } : { ...v, select: false }
    ))
    this.setData({
      parmas,
      EditMap
    }, () => this.verifyParmas())
  },
  bindPickerChange: function (e) {
    let self = this
    let { parmas } = this.data
    const name = e.currentTarget.dataset.name;
    const value = e.detail.value

    //date_of_birth < date_of_adopted 出生日期<领养时间 
    if (name == 'date_of_birth'){
      let date_of_adopted = parmas.date_of_adopted
      if (date_of_adopted && new Date(date_of_adopted).getTime() < new Date(value).getTime()){//有选择到家时间
        successShowText('出生日期不能大于到家时间哦～', 'none')
        return 
      }
    }

    if (name =='date_of_adopted'){
      let date_of_birth = parmas.date_of_birth
      if (date_of_birth && new Date(value).getTime() < new Date(date_of_birth).getTime()) {//有选择到家时间
        successShowText('到家时间不能小于出生日期哦～', 'none')
        return
      }
    }

    parmas[name] = value

    self.setData({
      parmas
    }, () => self.verifyParmas())
  },
  // 图片上传 裁剪 end

  verifyParmas:function (params) {
    let self = this
    const { parmas } = self.data
    let flag = true
    if (parmas.head_url==null 
      || parmas.nickname == null || parmas.nickname == '' 
      || parmas.sex == null
      || parmas.weight == null || parmas.weight == '' 
      || parmas.type == null || parmas.spay_status == null 
      || parmas.date_of_birth == null || parmas.date_of_adopted == null) {
      flag = false
    } else {
      flag = true
    }


    self.setData({
      verify: flag
    })
    
  },
  // 图片上传 裁剪 begin
  touchStart: function (e) {
    this.cropper.touchStart(e)
  },
  touchMove: function (e) {
    this.cropper.touchMove(e)
  },
  touchEnd: function (e) {
    this.cropper.touchEnd(e)
  },
  uploadTap: function (params) {
    const self = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        self.setData({
          showStatus: true
        });
        self.cropper.pushOrign(src)
      }
    })
  },
  hideShowStatus:function (params) {
    this.setData({
      showStatus: false
    });
  },
  getCropperImage: function (e) {

    wx.showLoading({
      title: '裁剪中'
    })

    const self = this
    const { parmas, unionId} = self.data

    let uploadImgUrl = upload_photos_url(unionId)
    
    this.cropper.getCropperImage((tempFilePath) => {
      // console.log(tempFilePath, '裁剪后的图片临时路径');
      wx.uploadFile({
        url: uploadImgUrl,
        filePath: tempFilePath,
        name: 'file',
        formData: null,
        success: (res) => {
          let pic = JSON.parse(res.data).data[0];
          parmas['head_url'] = pic
          self.setData({
            showStatus: false,
            head_url: pic,
            parmas
          }, () => self.verifyParmas())
          wx.hideLoading()
        }
      });

    })
  }
})



