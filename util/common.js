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
    ctx
      .checkParams('uri')
      .isURL()
      .isValidHost()
  }
  if (ctx.request.url.indexOf('/resize/gcs') > -1) {
    ctx.checkParams('imgPath').isQueryString()
  }
  return ctx.validationErrors()
}
module.exports = { getCommonParams, checkParams }
