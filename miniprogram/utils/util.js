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
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

module.exports = {
  formatTime,
  formatDate,
  formatDateLine
}
