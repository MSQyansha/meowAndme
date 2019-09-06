// pages/family/familyDetails/index.js
import {  set_family_role, delete_family } from '../../../utils/config'
import { pageGo, successShowText } from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    family_info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('familyDetails',options)
    if (!wx.getStorageSync('union_id')) {
      pageGo('/pages/index/index', 4)
      return
    }
    this.setData({
      catId: options.catId,
      cat_name: options.cat_name,
      role: options.role,
      unionId: wx.getStorageSync('union_id'),
      family_info:{
        id:options.id,
        nickname: options.user_name,
        role: options.role
      }
    })
  },
  // 移出提示modal beigin
  showDeleteModal: function () {
    const { cat_name, family_info } = this.data
    this.setData({
      deletePrompt: true,
      deleteContent: `真的要将${family_info.nickname }移出${cat_name}的家人吗？`
    })
  },
  hideDeleteModal: function (params) {
    this.setData({
      deletePrompt: false,
      deleteContent: ''
    })
  },
  //确定移出
  deleteConfrim: function () {
    let { family_info, unionId, catId } = this.data
    let params = {
      "family_user_id": family_info.id
    }
    console.log(unionId, catId, params, '确定移出===');

    delete_family(unionId, catId, params).then(res => {
      if (res.errcode == 0) {
        successShowText('移出成功')
        setTimeout(() => {
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2];  //上一个页面
          //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
          prevPage.setData({
            reload: true
          })
          wx.navigateBack({
            delta: 1
          });
        }, 500);
      } else {
        successShowText('移出失败')
      }
      this.hideDeleteModal()
    })

   

  },
  // 设为亲人和家人
  setFamilyRole:function(){
    const {unionId,catId, family_info } = this.data
    let params = {
      status:  family_info.role == 2 ? 2 : 1  // 1.更新为家人 2.更新为亲人 3.删除
    }
    // console.log(unionId, catId, family_info.id,params, '==setFamilyRole=');
    set_family_role(unionId, catId, family_info.id, params).then(res => {
      if (res.errcode == 0) {
        family_info.role == 2 ? successShowText('已设为亲人') : successShowText('已设为家人')
        family_info.role = family_info.role == 2 ? 3 : 2
        this.setData({
          family_info
        })
      } else {
        successShowText('设置失败')
      }
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if(this.data.role!= this.data.family_info.role){
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];  //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        reload: true
      })
    }
  },
})