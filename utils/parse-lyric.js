export function parseLyric(lyric) {
  const strReg = /\[(\d{2}):(\d{2}).(\d{2,3})\]/
  const lyricArr = lyric.split('\n')
  const lyricInfo = []
  for (let key of lyricArr) {
    const arr = strReg.exec(key)
    if(arr != null){
      // 获取时间
      const minutes = arr[1] * 60 * 1000
      const seconds = arr[2] * 1000
      const millisecond = arr[3].length == 2 ? arr[3] * 10 : arr[3] * 1
      const time = minutes +  seconds + millisecond

      // 获取歌词
      const text = key.replace(strReg,"")
      lyricInfo.push({time,text})
    }
  }






  return lyricInfo
}