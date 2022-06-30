import yhmusic from './index'

// 获取热门搜索建议
export function getHotSearchData(){
  return yhmusic.get('/search/hot')
}

// 搜索建议
export function getSearchSuggest(keywords,type='mobile'){
  return yhmusic.get('/search/suggest',{keywords,type})
}

// 搜索接口
export function getResultSearch(keywords){
  return yhmusic.get('/search',{keywords})
}