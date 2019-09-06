var weekArray = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六')

function withData(param) {
  return param < 10 ? '0' + param : '' + param;
}
function getLoopArray(start, end) {
  var start = start || 0;
  var end = end || 1;
  var array = [];
  for (var i = start; i <= end; i++) {
    array.push(withData(i));
  }
  return array;
}
function getMonthDay(year, month) {
  var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0), array = null;

  switch (month) {
    case '01':
    case '03':
    case '05':
    case '07':
    case '08':
    case '10':
    case '12':
      array = getLoopArray(1, 31)
      break;
    case '04':
    case '06':
    case '09':
    case '11':
      array = getLoopArray(1, 30)
      break;
    case '02':
      array = flag ? getLoopArray(1, 29) : getLoopArray(1, 28)
      break;
    default:
      array = '月份格式不正确，请重新输入！'
  }
  return array;
}
function getNewDateArry(week,date) {
  // 当前时间的处理
  var newTime = date ? new Date(date) : new Date();
  // var newTime = date ? new Date(date) : new Date('2019-08-09 16:00:50');

  var newDate = new Date(newTime.getTime() + 10 * 60 * 1000) //设置10分钟之后的时间

  var year = withData(newDate.getFullYear()),
    mont = withData(newDate.getMonth() + 1),
    date = withData(newDate.getDate()),
    week = newDate.getDay().toString(),
    hour = newDate.getMinutes() > 50  ? withData(newDate.getHours()+1) : withData(newDate.getHours()),
    minu = minuteArray(newDate.getMinutes()),
    seco = withData(newDate.getSeconds());

  let newDateArry = week ? [year, mont, date + '日' + ' ' + weekArray[week], hour, minu, seco] : [year, mont, date, hour, minu, seco];

  return newDateArry
}

function dateTimePicker(startYear, endYear, week,date) {
  
  // 返回默认显示的数组和联动数组的声明
  var dateTime = [], dateTimeArray = [[], [], [], [], [], []];
  var start = startYear || 1978;
  var end = endYear || 2100;
  
  
  console.log('date', date,'======')
  // 默认开始显示数据
  var defaultDate = getNewDateArry(week, date ? date:'');

  
  console.log(defaultDate, 'defaultDate');


  // 处理联动列表数据
  /*年月日 时分秒*/
  dateTimeArray[0] = getLoopArray(start, end);
  dateTimeArray[1] = getLoopArray(1, 12);
  dateTimeArray[2] = week ? getWeekDay(defaultDate[0], defaultDate[1]) : getMonthDay(defaultDate[0], defaultDate[1])
  dateTimeArray[3] = getLoopArray(0, 23);
  // dateTimeArray[4] = getLoopArray(0, 59);//分
  dateTimeArray[4] = ["00", "10", "20", "30", "40", "50"];
  dateTimeArray[5] = getLoopArray(0, 59);//秒


  dateTimeArray.forEach((current, index) => {
    dateTime.push(current.indexOf(defaultDate[index]));
  });

  console.log(dateTime, 'dateTime');//[9, 8, 18, 20, 11, -1]
  

  return {
    dateTimeArray: dateTimeArray,
    dateTime: dateTime
  }
}
function getWeekDay(year, month) {
  let montAry = getMonthDay(year, month)
  new Date(`${year}-${month}-01`).getDay()
  return getDates(montAry[montAry.length - 1], `${year}-${month}-01`)
}

//获取d当前时间多少天后的日期和对应星期
function getDates(days, todate = getCurrentMonthFirst()) {//todate默认参数是当前日期，可以传入对应时间
  var dateArry = [];
  for (var i = 0; i < days; i++) {
    var dateObj = dateLater(todate, i);
    dateArry.push(dateObj)
  }
  return dateArry;
}

/**
   * 传入时间后几天
   * param：传入时间：dates:"2018-04-02",later:往后多少天
   */
function dateLater(dates, later) {
  let dateObj = [];
  // let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
  let newdate = new Date(dates);
  newdate.setDate(newdate.getDate() + later);
  let day = newdate.getDay();
  let item = withData(newdate.getDate()) + '日' + ' ' + weekArray[day]
  dateObj = item
  return dateObj;
}

//获取当前时间
function getCurrentMonthFirst() {
  let date = new Date();
  let todate = date.getFullYear() + "-" + withData(date.getMonth() + 1) + '-' + withData(date.getDate());
  return todate;
}


function minuteArray(nowMinu) {
  let a = ["00", "10", "20", "30", "40", "50"]
  let ceil = Math.ceil(nowMinu/10)
  let num ='00'
  if (ceil<=5){
    num = a[ceil]
  }
  return num
}

function getNowDate( date) {
  // 当前时间的处理
  var newDate = new Date()
  var year = withData(newDate.getFullYear()),
    mont = withData(newDate.getMonth() + 1),
    date = withData(newDate.getDate()),
    hour = withData(newDate.getHours()),
    minu = withData(newDate.getMinutes());

  var newTime = year + '-' + mont + '-' + date  + ' ' + hour + ':' + minu
  return newTime
}

module.exports = {
  dateTimePicker: dateTimePicker,
  getMonthDay: getMonthDay,
  getWeekDay: getWeekDay,
  getNowDate: getNowDate
}