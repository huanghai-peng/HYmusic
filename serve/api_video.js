import yhmusic from './index'

// 获取topMv的数据
export function getTopMv(offset,limit=10){
  return yhmusic.get('/top/mv',{offset,limit})
}

// 获取 mv 数据
export function getDetail(mvid){
  return yhmusic.get('/mv/detail',{mvid})
}

// mv地址
export function getMvUrl(id){
  return yhmusic.get('/mv/url',{id})
}

// 相关视频 
export function getAllVideo(id){
  return yhmusic.get('/related/allvideo',{id})
}