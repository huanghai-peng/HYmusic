import yhmusic from './index'

// 获取轮播图
export function getBanners(){
  return yhmusic.get('/banner',{type:2})
}

// 获取歌曲排行数据
export function getRankings(idx){
  return yhmusic.get('/top/list',{idx})
}

// 获取歌单数据
export function getSongMenuData(cat="全部",limit="6",offset="0"){
  return yhmusic.get('/top/playlist',{cat,limit,offset})
}

// 获取歌单详情数据
export function getSongDetail(id){
  return yhmusic.get('/playlist/detail/dynamic',{id})
}

// 获取歌词信息
export function getLyric(id){
  return yhmusic.get('/lyric',{id})
}
