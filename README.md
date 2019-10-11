<!--
 * @Description: In User Settings Edit
 * @Author: mavis.yang
 * @Date: 2019-08-01 18:33:43
 * @LastEditTime: 2019-09-06 18:14:58
 * @LastEditors: Please set LastEditors
 -->

### 主子档案

> 记录小猫咪的点点滴滴，封存它与你的美好时光。

- [页面介绍](#页面介绍)
- [阿拉丁小程序统计平台SDK集成](#阿拉丁小程序统计平台SDK集成)
- [授权](#授权)

### 页面介绍

"pages/index/index",          --- 记录
"pages/addRecord/index",      --- 添加记录
"pages/remindDetail/index"    --- 记录详情
"pages/remind/index",         --- 提醒
"pages/addRemind/index",        --- 添加提醒
"pages/addCat/index",         --- 添加猫咪
"pages/variety_list/index",


添加记录页面进入情况

1.添加
2.查看详情
3.转为记录
3.1  previewRemind 和 remindDetail 页面进去 

```


//查看记录详情
  gotoEditRecord: function (e) {
    let catId = this.data.catInfo.id,
      recordtype = e.currentTarget.dataset.recordtype,
      id = e.currentTarget.dataset.id;
    pageGo(`/pages/addRecord/index?catId=${catId}&recordtype=${recordtype}&id=${id}`, 1)
  },
  //添加记录
  gotoAddRecord: function (e) {
    let catId = this.data.catInfo.id,
      id = e.detail.id ;
    pageGo(`/pages/addRecord/index?catId=${catId}&recordtype=${id}`, 1)
  },


 //转为记录
  goEditRecord:function (e) {
    // data - time='{{item.record_time}}'
    // data - recordtype='{{item.record_type}}'
    // data - scheduleid='{{item.schedule_id}}'
    // data - projectid='{{item.project_id}}'
    let catId = this.data.catId,
      time = e.currentTarget.dataset.time,
      scheduleid = e.currentTarget.dataset.scheduleid,
      projectid = e.currentTarget.dataset.projectid,
      recordtype = e.currentTarget.dataset.recordtype;
    pageGo(`/pages/addRecord/index?catId=${catId}&recordtype=${recordtype}&time=${time}&scheduleId=${scheduleid}&projectId=${projectid}`, 1)
    
  },
```



### 阿拉丁小程序统计平台SDK集成

您的同事正在使用阿拉丁统计平台对小程序：「主子档案」进行统计分析，邀请您协助完成SDK集成工作。请根据小程序基本信息集成SDK。集成方法如下：

小程序基本信息
小程序名称： 主子档案
app_key: e1c6d25cb53b07d0c481071ce138ccb3
SDK下载： https://www.aldwx.com/downSDK/下载
SDK集成方法


1.下载解压SDK

下载加压SDK,将文件ald-stat.js和ald-stat-conf.js拷贝到小程序项目的utils文件夹中



2.修改appkey配置

打开ald-stat-conf.js文件,修改其中的app_key配置。app_key如上所示



3.添加一行代码

打开app.js文件，在文件顶部 (其他代码之前) 添加如下代码：

var aldstat= require("./url/ald-stat.js")



4.设置request合法域名

在微信后台设置request合法域名：log.aldwx.com

后台数据显示出来，即为接入成功。更多高级功能的集成方法详见：SDK帮助文档http://doc.aldwx.com/aldwx/

如有问题请登录阿拉丁统计平台www.aldwx.com联系在线客服或加入阿拉丁官方QQ群：945441703。

阿拉丁技术支持

 - [专注于小程序的代码监测](https://tj.aldwx.com/downSDK/)
 - [标准版小程序SDK接入指南](http://doc.aldwx.com/aldwx/gao-ji-gong-neng/sdkjie-ru-zhi-nan.html)

### 授权
审核怎么都不通过
处理就是加了个弹框
让用户同意授权之后在进行微信授权。

**2019.10.10**

ios 9.3.5 不支持grid布局，
修改grid布局为flex,暂且还不清楚支不支持（没有测试）
看论坛说也不支持flex布局：https://developers.weixin.qq.com/community/develop/doc/0004c4856dc52869e02702f445bc00

**2019.10.11**

使用自定义tabBar是因为在点击记录和提醒时出现选择弹框，如果不自定义，只是隐藏tabbar，页面会有抖动的bug，
官方提供了自定义tabBar，但是只适用于一排显示，不支持突出显示。

- 使用[自定义tabBar](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/custom-tabbar.html)



