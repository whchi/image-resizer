const MimeLite = require('mime/lite')

function validHosts() {
  return /(cw.com.tw|cwg.tw|ec.cw1.tw|commonhealth.com.tw|cheers.com.tw)/
}

function getMimeType(qs, raw) {
  return qs || MimeLite.getType(raw)
}

function validFileFormats() {
  return ['gif', 'jpg', 'jpeg', 'png', 'webp']
}

function getCommonParams(ctx) {
  let width = parseInt(ctx.request.query.w) || 50
  let height = parseInt(ctx.request.query.h) || 50
  let quality = parseInt(ctx.request.query.q) || 80
  let format = ctx.request.query.format || undefined

  return { width, height, quality, format }
}
function checkParams(ctx) {
  ctx.checkQuery('h').optional().isInt()
  ctx.checkQuery('w').optional().isInt()
  ctx.checkQuery('q').optional().isQuality()
  ctx.checkQuery('format').optional().isValidFormat()
  ctx.checkQuery('fit').optional().isValidFit()

  if (ctx.request.url.indexOf('/resize/uri') > -1) {
    ctx.checkParams('uri').isURL().isValidHost()
  }
  if (ctx.request.url.indexOf('/resize/gcs') > -1) {
    ctx.checkParams('imgPath').isQueryString()
  }
  return ctx.validationErrors()
}
module.exports = {
  getCommonParams,
  checkParams,
  validHosts,
  validFileFormats,
  getMimeType,
}
