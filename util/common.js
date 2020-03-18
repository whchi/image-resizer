const url = require('url')

function getImageUri(baseHost, inputUri) {
  let imageUrl = url.parse(inputUri)
  imageUrl.host = baseHost.replace('https://', '').replace('http://', '')
  imageUrl.protocol = baseHost.startsWith('https') ? 'https' : 'http'
  return url.format(imageUrl)
}

function getMethods(obj) {
  Object.getOwnPropertyNames(obj).filter(e => typeof obj[e] === 'function')
}

function getCommonParams(ctx) {
  const width = parseInt(ctx.request.query.w) || 50
  const height = parseInt(ctx.request.query.h) || 50
  const quality = parseInt(ctx.request.query.q) || 80
  let webp = false
  if (ctx.userAgent.isChrome) {
    webp = true
  }
  return { width, height, quality, webp }
}
function checkParams(ctx) {
  ctx
    .checkQuery('h')
    .optional()
    .isInt()
  ctx
    .checkQuery('w')
    .optional()
    .isInt()
  ctx
    .checkQuery('q')
    .optional()
    .isQuality()
  if (ctx.request.url.indexOf('/resize/uri') > -1) {
    ctx.checkParams('uri').isURL({ require_tld: false })
  }
  return ctx.validationErrors()
}
module.exports = { getImageUri, getMethods, getCommonParams, checkParams }
