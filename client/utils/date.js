export const getDateTime = (date) => {
  const target = new Date(date)
  const y = target.getUTCFullYear()
  const m = target.getUTCMonth() + 1
  const d = target.getUTCDate()
  const hh = ("0" + target.getHours()).slice(-2)
  const mm = ("0" + target.getMinutes()).slice(-2)
  const ss = ("0" + target.getSeconds()).slice(-2)
  return `${y} 年 ${m} 月 ${d} 日 ${hh}:${mm}:${ss}`
}

export const getTimesAgo = (date) => {
  const target = new Date(date)
  const now = new Date(Date.now())

  const targetYear = target.getUTCFullYear()
  const nowYear = now.getUTCFullYear()
  if (targetYear < nowYear) return ` ${nowYear - targetYear} 年`

  const targetMonth = target.getUTCMonth()
  const nowMonth = now.getUTCMonth()
  if (targetMonth < nowMonth) return ` ${nowMonth - targetMonth} 个月`

  const targetDate = target.getUTCDate()
  const nowDate = now.getUTCDate()
  if (targetDate < nowDate) return ` ${nowDate - targetDate} 天`

  const targetHour = target.getUTCHours()
  const nowHour = now.getUTCHours()
  if (targetHour < nowHour) return ` ${nowHour - targetHour} 小时`

  const targetMinute = target.getUTCMinutes()
  const nowMinute = now.getUTCMinutes()
  if (targetMinute < nowMinute) return ` ${nowMinute - targetMinute} 分钟`

  const targetSecond = target.getUTCSeconds()
  const nowSecond = now.getUTCSeconds()
  return ` ${nowSecond - targetSecond} 秒`
}
