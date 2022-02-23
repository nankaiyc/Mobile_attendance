const formatTime = date => {

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return ` ${[hour, minute, second].map(formatNumber).join(':')}`
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
  return year + "-" + month + "-" + day
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
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
  getdistance
}
