const req = require('request')
const sharp = require('sharp')
const mime = require('mime-types')

module.exports = (imagePath, params) => {
  const res = req.get(imagePath).on('response', res => {
    if (res.statusCode >= 400) {
      throw 'error happened'
    }
  })

  const transform = sharp().resize({
    width: params.width,
    height: params.height,
  })
  let type = 'webp'
  if (params.webp) {
    transform.webp()
  } else {
    const options = {
      progressive: true,
      quality: params.quality,
      chromaSubsampling: params.quality >= 90 ? '4:2:0' : '4:4:4',
    }
    type = mime.lookup(imagePath)
    if (type === 'image/png') {
      transform.png(options)
    } else {
      transform.jpeg(options)
    }
  }
  if (params.grayscale) {
    transform.grayscale()
  }

  return [res.pipe(transform), type]
}
