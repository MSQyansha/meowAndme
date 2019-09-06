
const formatTime = (date,type) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  switch (type) {
    case 'YYYY-MM-DD':
      return formatNumber(year) + '-' + formatNumber(month) + '-' + formatNumber(day)
      break;
    case 'YMDMS':
      return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
      break;
    case 'MD':
      return formatNumber(month) + '月' + formatNumber(day) + '日'
      break;
    case "YMMDDMMSS":
      //2019年08月01日 17:50
      return year + '年' + formatNumber(month) + '月' + formatNumber(day) + '日'  + [hour, minute].map(formatNumber).join(':')
      break;
    default:
      return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
      break;
  }
}

 const date_Time = (date)=> {
 //2019年08月01日 17:50 -->2019-08-01 17:50
  let ary = date.split(' ')
   const year = ary[0].slice(0, 4)
   const month = ary[0].slice(5, 7)
   const day = ary[0].slice(8, 10)
   return year + '-' + month + '-' + day  + ' ' + ary[1]
}

const date_Time_YMD = (date) => {
  //2019-08-01 17:50:00 -->2019年08月01日 17:50
  let ary = date.slice(0, -3).split(' ')
  const year = ary[0].slice(0, 4)
  const month = ary[0].slice(5, 7)
  const day = ary[0].slice(8, 10)
  return year + '年' + month + '月' + day + '日'+' ' + ary[1]
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 页面跳转数据字典
// 1:navigate  保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面  可加参数
// 2:redirectTo 关闭当前页面，跳转到应用内的某个页面。 可加参数
// 3:reLaunch 关闭所有页面，打开到应用内的某个页面。 可加参数
// 4:switchTab 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面  不可加参数
// 5:navigateBack 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages()) 获取当前的页面栈，决定需要返回几层
/**
 * 页面跳转函数
 * @param path 跳转路径 部分可携带参数
 * @param type 跳转类型
 * @param num 是否为返回上级
 */
function pageGo(path, type, num) {
  if (num) {
    wx.navigateBack({
      delta: path
    })
  } else {
    switch (type) {
      case 1:
        wx.navigateTo({
          url: path
        });
        break;
      case 2:
        wx.redirectTo({
          url: path
        });
        break;
      case 3:
        wx.reLaunch({
          url: path
        });
        break;
      case 4:
        wx.switchTab({
          url: path
        });
        break;
      default:
        break
    }
  }
}

/**
 * 分享集成函数
 * @param title 分享的标题
 * @param path 分享的页面路径
 * @param imageUrl 分享出去要显示的图片
 * @param callback 分享后的回调
 * @returns {{title: *, path: *, imageUrl: *, success: success, complete: complete}}
 */
function openShare(title, path, imageUrl, callback) {
  return {
    title: title,
    path: path,
    imageUrl: imageUrl,
    success: function (res) {
      // console.log('res success',res)
      wx.showToast({
        title: '分享成功',
        icon: 'success',
        duration: 3000
      })
    },
    complete: function (req) {
      callback(req)
    }
  }
}

function successShowText(str, icon, duration) {
  wx.showToast({
    title: str,
    icon: icon ? icon : 'none',
    duration: duration ? duration : 1500
  })
}
function showLoading(str) {
  wx.showLoading({
    title: str ? str : '加载中',
    mask: true,
  });
}
function hideLoading() {
  wx.hideLoading()
}

// 生成唯一标识
function __uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

//getUUID
function getUUID() {

  let uuid
  let cat_uuid = wx.getStorageSync('cat_uuid')
  if (cat_uuid && cat_uuid != 'null') {
    uuid = wx.getStorageSync('cat_uuid');
  } else {
    uuid = __uuid()
    wx.setStorageSync('cat_uuid', uuid);
  }
  return uuid
}
function analyzeStatus(status, array) {
  array.forEach(v => {
    if (v.status == status) {
      v.select = true
    } else {
      v.select = false
    }
  })
  return array
}

function getFormatListData(data) {

  const yearList = [];
  const resultList = [];

  data.forEach(item => {
    const year = item.year;
    const index = yearList.indexOf(year);
    if (index > -1) {
      resultList[index].content.push(item);
    } else {
      resultList.push({ year, content: [item] });
      yearList.push(year);
    }
  })
  // resultList.forEach(item => {
  //   item.content.sort((a, b) => new Date(a.record_time) < new Date(b.record_time) ? 1 : -1);
  // })
  return resultList.sort((a, b) => parseInt(a.year) < parseInt(b.year) ? 1 : -1);
}

//获取星座
function getConstellation (date) {
  //m, d 月，日
  var dateAry = date.split('-')
  var m = Number(dateAry[1]), d = Number(dateAry[2]);
  var s = "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";
  var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
  return s.substr(m * 2 - (d < arr[m - 1] ? 2 : 0), 2) + '座';
}



module.exports = {
  formatTime,
  successShowText,
  showLoading,
  hideLoading,
  pageGo,
  openShare,
  getUUID,
  analyzeStatus,
  getFormatListData,
  date_Time,
  date_Time_YMD,
  getConstellation
}
