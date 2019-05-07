export function bytesToSize(bytes) {
  const b = +bytes
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (b === 0) { return '0 KB' }
  const i = parseInt(Math.floor(Math.log(b) / Math.log(1024)), 10)
  if (i === 0) { return `${b} ${sizes[i]}` }
  return `${(b / (1024 ** i)).toFixed(1)} ${sizes[i]}`
}

export function calcProgress(totalLength, completedLength) {
  totalLength = +totalLength
  completedLength = +completedLength

  if (totalLength === 0 || completedLength === 0) return 0

  const percentage = completedLength / totalLength
  return parseFloat(percentage.toFixed(2))
}

export function timeRemaining(totalLength, completedLength, downloadSpeed) {
  totalLength = +totalLength
  completedLength = +completedLength
  downloadSpeed = +downloadSpeed
  const remainingLength = totalLength - completedLength
  if (remainingLength === 0) return 0
  if (downloadSpeed === 0) return '-'
  return Math.ceil(remainingLength / downloadSpeed)
}
