const req = require('request')
const sharp = require('sharp')

module.exports = (imagePath, params, format) => {
  const res = req.get(imagePath)
  const transform = sharp().resize({
    width: params.width,
    height: params.height,
    fit: params.fit || 'contain',
  })
  const options = {
    progressive: true,
    quality: params.quality,
    withoutEnlargement: true,
    chromaSubsampling: params.quality >= 90 ? '4:2:0' : '4:4:4',
  }

  format = format.split('/').pop()

  switch (format) {
    case 'webp':
      transform.webp()
      break
    case 'jpg':
    case 'jpeg':
      transform.jpeg(options)
      break
    case 'png':
      transform.png(options)
      break
    default:
      throw Error(500)
  }
  return res.pipe(transform)
}
