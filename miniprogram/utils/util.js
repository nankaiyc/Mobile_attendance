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

module.exports = {
  formatTime,
  formatDate,
  formatDateLine
}
