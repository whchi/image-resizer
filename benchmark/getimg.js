const cheerio = require('cheerio')
const request = require('request')
const fs = require('fs')

function download() {
  request.get('https://www.cw.com.tw', (err, res, body) => {
    var $ = cheerio.load(body)
    let rst = []
    let simplerst = []
    $('body')
      .find('img')
      .each((idx, ele) => {
        try {
          let src = ele.attribs.src.split('?')[0]
          let f = src.split('/')
          let fname = f[f.length - 1]
          if (src.indexOf('https') < 0) {
            return
          }
          request.get(src).pipe(fs.createWriteStream(`../public/images/${fname}`))

          let qs = ''
          simplerst.push(`/images/${fname}?t=now1`)
          if (src.indexOf('storage.googleapis.com') > -1) {
            let fpath = src.substring('https://storage.googleapis.com/'.length)
            let bucket = fpath.split('/')[0]
            qs = `/resize/gcs/${bucket}/${encodeURIComponent(
              fpath.substring((bucket + '/').length)
            )}`
          } else {
            qs = `/resize/uri/${encodeURIComponent(src)}`
          }
          rst.push(qs + '/?w=110&h=110')
        } catch (error) {
          return
        }
      })
      fs.writeFileSync('all.json', JSON.stringify(rst))
      fs.writeFileSync('simpleall.json', JSON.stringify(simplerst))
    })
}
download()
