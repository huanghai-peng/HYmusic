export default function stringToNodes(suggestArr, value) {
  const nodes = []
  suggestArr.forEach((item) => {
    const arr = []
    if (item.indexOf(value) != -1) {
      const key1 = {
        name: 'span',
        attrs: {
          style: 'color: #26CE8A;'
        },
        children: [{
          type: 'text',
          text: item.slice(0, value.length)
        }]
      }
      arr.push(key1)

      const key2 = {
        name: 'span',
        attrs: {
          style: 'color: #000;'
        },
        children: [{
          type: 'text',
          text: item.slice(value.length)
        }]
      }
      arr.push(key2)

    } else {
      const key1 = {
        name: 'span',
        attrs: {
          style: 'color: #000;'
        },
        children: [{
          type: 'text',
          text: item
        }]
      }
      arr.push(key1)
    }

    nodes.push(arr)
  })

  return nodes
}