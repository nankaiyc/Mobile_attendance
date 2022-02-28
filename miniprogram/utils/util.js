const formatTime = date => {

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const _hour = hour<10?'0' + hour:hour
  const _minute = minute<10?'0' + minute:minute
  const _second = second<10?'0' + second:second

  return ` ${[_hour, _minute, _second].map(formatNumber).join(':')}`
}
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return year + "年" + month + "月" + day + "日"
}
const formatDateLine = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const _year = year<10?'0' + year:year
  const _month = month<10?'0' + month:month
  const _day = day<10?'0' + day:day
  return _year + "-" + _month + "-" + _day
}
const formatMonthLine = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const _year = year<10?'0' + year:year
  const _month = month<10?'0' + month:month
  return _year + "-" + _month 
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
const getWeekByDate = dates => {
  let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
  let date = new Date(dates);
  date.setDate(date.getDate());
  let day = date.getDay();
  return show_day[day];
}
function getdistance(la1, lo1, la2, lo2) {
  var La1 = la1 * Math.PI / 180.0;
  var La2 = la2 * Math.PI / 180.0;
  var La3 = La1 - La2;
  var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
  s = s * 6378.137;
  s = Math.round(s * 10000) / 10000;
  s = s.toFixed(2);
  return s;
}

module.exports = {
  formatTime,
  formatDate,
  formatDateLine,
  formatMonthLine,
  getdistance,
  getWeekByDate
}
