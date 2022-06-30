export default function(offset){
  return new Promise((resolve)=>{
    const query = wx.createSelectorQuery()
    query.select(offset).boundingClientRect()
    query.exec((res) => {
        resolve(res)
    })
  })
}