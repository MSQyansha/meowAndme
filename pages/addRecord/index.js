// pages/addRecord/index.js
import { formatTime, pageGo, successShowText } from '../../utils/util.js'
import { get_record_detail, add_record, update_record,delete_record, upload_photos_url, select_cat } from '../../utils/config.js'
const EditMap = require('../../utils/editMaputil')
const dateUtils = require('../../component/date-picker/dateutils.js')

const places = {
   0: '写点成长的过程吧，如第一次埋屎，第一次洗澡，第一次听到自己的名字有反应等〜',
   1: '写点记录称体重的过程吧～',
   2: '写点记录驱虫的过程吧～',
   3: '写点记录打疫苗的过程吧～'
}
// parmas: {
// record_time: '',
// "record_type": 3, // 1. 随手记 2. 称重 3. 打疫苗  4.做驱虫
// "detail": {
///   weight: 0, //缺体重字段
// "desc": null,
// "type": null ,// 驱虫类型 1...
// "insecticide_type": null, // 驱虫药 1...
// "rabiesvaccine_type": null, // 狂犬疫苗 1... //缺狂犬疫苗段
// }
// }, 
Page({

   /**
    * 页面的初始数据
    */
   data: {
     loading:false,
      recordtype: 0,
      isShowPicker:false,//日期控件
      date:new Date().getTime(),
      today: formatTime(new Date(), 'YMDMS'),
      place: '',
      verify: false,
      openSet: false,
      uploadImgUrl: '',
      parmas: {},
      catInfo: [],
      catId: '',
      request: true,
      edit:false,//是否可修改
      txt_focus: false//判断textarea是否获取焦点 解决穿透问题
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
      console.log(options, 'options==recordtype');

      let that =this
      let catId = options.catId,
         recordtype = Number(options.recordtype),
         nickname = options.nickname,
        role = Number(options.role);

      // let catInfo = wx.getStorageSync('catInfo'),
      let unionId = wx.getStorageSync('union_id');

      //转为记录跳转进去
      this.setData({
         catId,
         recordtype,
         nickname,
          role,//角色
         id: options.id, //查看记录详情
         place: places[recordtype],
         parmas: {
            event_id: options.eventId ? options.eventId : '',
            record_time: formatTime(new Date(), 'YMDMS'),
            record_type: recordtype,
            nickname: nickname ? nickname : null,
            record_photos: [],
            detail: {},
         },
        //  catInfo: catInfo,
        //  catIndex: catInfo.findIndex(v => v.nickname == nickname),
         unionId: unionId,
         uploadImgUrl: upload_photos_url(unionId)
      },()=>{
        that.getSelectCat()
      })

      wx.setNavigationBarTitle({
         title: recordtype != 0 ? EditMap.rTypes[Number(recordtype)] : '随手记'
      });

      //查看详情
      if (options.id) {
         this.getDetails(catId, options.id)
      }
   },
    //Select选择框猫咪列表
    getSelectCat:function(){
      const { unionId, nickname}= this.data
      select_cat(unionId).then(res=>{
        if(res.errcode==0){
          const cat_ndex = res.data.findIndex(v => v.nickname == nickname)
          this.setData({
            catInfo:res.data,
            catIndex: cat_ndex != -1 ? cat_ndex : 0,
            loading:true
          })
        }
      })
    },

  // 查看详情
   getDetails: function(catId, id) {
      let self = this
     const { unionId, recordtype} = self.data
      get_record_detail(id, catId, unionId).then(res => {
         if (res.errcode == 0) {
            let data = res.data
            const initNewData = {
              id: data.id,
               record_time: data.record_time.slice(0,-3) ,
              record_photos: data.record_photos,
              nickname: self.data.nickname,
              event_id: '',
              record_type: recordtype,
              detail: { ...data },
            }
            wx.setStorageSync('editRecord', initNewData);

            self.setData({
               parmas: initNewData,
              loading: true
            }, () => {
               self.verifyParmas()
            })
         }
      })


   },
   handleTxtFocus:function (params) {
      this.setData({
         txt_focus: true
      })
   },
   handleTxtBlur:function (params) {
      this.setData({
         txt_focus: false
      })
   },
   changeIpt: function(e) {
      let { parmas } = this.data
      const name = e.currentTarget.dataset.name;
      let value = e.detail.value;
      parmas.detail[name] = value

      this.setData({
         parmas
      }, () => this.verifyParmas())
   },
   bindPickerChange: function(e) {
      let self = this
      let { parmas, catId, catInfo } = this.data
      const name = e.currentTarget.dataset.name;
      const value = e.detail.value
      //  name == 'record_time' ? parmas[name] = value : parmas.detail[name] = Number(value)
      if (name == 'record_time') {
         parmas[name] = value
      } else if (name == 'nickname') {
         catId = catInfo[value].id
         parmas[name] = catInfo[value].nickname
      } else {
         parmas.detail[name] = Number(value)
      }

      self.setData({
         parmas,
         catId
      }, () => self.verifyParmas())
   },


   verifyParmas: function(params) {
      let self = this
      const { parmas, recordtype } = self.data

      // console.log(parmas,'verifyParmas');

      let flag = true
      switch (recordtype) {
         case 0: //随手记
            if (parmas.record_time == null || parmas.detail.desc == undefined || parmas.detail.desc == '' || parmas.nickname == null)
               flag = false
            break;
         case 1: //称体重
            if (parmas.record_time == null || parmas.detail.weight == undefined || parmas.detail.weight == '' || parmas.nickname == null)
               flag = false
            break;
         case 2: //做驱虫
            if (parmas.record_time == null || parmas.detail.type == undefined || parmas.detail.insecticide_type == undefined || parmas.nickname == null)
               flag = false
            break;
         case 3: //打疫苗
            if (parmas.record_time == null || parmas.detail.type == undefined || parmas.nickname == null)
               flag = false
            break;
         default:
            break;
      }
      self.setData({
         verify: flag
      })

   },
   //上传图片
   //监听组件事件，返回的结果
   uploadPhotos: function(e) {
      let { parmas } = this.data
      parmas['record_photos'] = e.detail.picsList
      this.setData({
         parmas
      })
   },
   //点击确定 记好啦
   confrimHandle: function() {
     let { id,catId, parmas, unionId, recordtype, verify,request } = this.data

     if (!verify) return
     if (!request) return
     this.setData({
       request: false
     })

      if (recordtype == 0) parmas.detail.type = 2 // 0. 生日 1. 领养日 2. 随手记(页面录入)
      if (recordtype == 1) parmas.detail.weight = Number(parmas.detail.weight)

      // console.log(parmas, 'confrimHandle==')

      if(id){
          update_record(unionId, catId, id, parmas).then(res=>{
            if (res.errcode == 0) {
              successShowText('修改成功')
              this.goback()
            } else {
              successShowText('修改失败')
            }
            this.setData({
              request: true
            })
          })
         
      }else{
         add_record(parmas, catId, unionId).then(res => {
            if (res.errcode == 0) {
               successShowText('添加成功')
               this.goback()
            } else {
               successShowText('添加失败')
            }
            this.setData({
               request: true
            })
         })
      }

      
    
   },
   showOpenSet: function() {
      this.setData({
         openSet: true
      })
   },
   closeOpenSet: function(params) {
      this.setData({
         openSet: false
      })
   },
   deleteRecord: function() {
      let { catId, id, unionId } = this.data
      delete_record(id, catId, unionId).then(res => {
         if (res.errcode == 0) {
            this.closeOpenSet()
            this.goback()
         }
      })
   },
   goback: function() {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2]; //上一个页面

      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
         showStatus: true
      })
      pageGo('/pages/index/index', 4)
   },
    /**选择时间 beigin*/
    onYMDhm: function (e) {
       this.handleTxtBlur()
       if (this.data.id && !this.data.edit) return
       this.setData({
          isShowPicker: true,
          mode: "YMDhm",
          dateType: { type: "YMDhm" }
       })
    },
    cancelPicker: function (e) {
      this.setData({
        isShowPicker: false
      })
    },
    okEventPicker: function (e) {
      let changeDate = e.detail.date;
      if (changeDate > this.data.date){
        successShowText('不能选择未来的时间哦～')
        return
      }
      let { parmas } = this.data
      parmas['record_time'] = dateUtils.formatLongTime(changeDate, "Y-M-D h:m")
      console.log(parmas,'parmas')
      this.setData({
        isShowPicker: false,
        parmas
      })
    },
    /**选择时间 end*/
    handleEdit:function(){
      this.setData({
        edit:true
      })
    },
   cancelEdit: function () {
      this.setData({
         edit: false,
         parmas: wx.getStorageSync('editRecord')
      })
   },
   onUnload: function () {
      wx.removeStorageSync('editRecord');
   },
})