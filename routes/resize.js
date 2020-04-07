const Router = require('@koa/router')
const koaValidator = require('koa-async-validator')
const router = new Router({ prefix: '/resize' })
const resize = require('../util/resizer')
const MimeLite = require('mime/lite')
const { getCommonParams, checkParams, getMimeType } = require('../util/common')

router.get('/', async (ctx, next) => {
  ctx.body = 'success'
})

router.use(
  koaValidator({
    customValidators: {
      isQuality: function (value) {
        return value >= 0 && value <= 100
      },
      isQueryString: function (value) {
        return /\/(.*)\.(gif|jpg|jpeg|png)$/i.test(value)
      },
      isValidFormat: function (value) {
        return ['gif', 'jpg', 'jpeg', 'png', 'webp'].includes(value)
      },
      isValidHost: function (value) {
        return /(cw|commonhealth|cheers)\.com\.tw|(ec\.cw1|cwg)\.tw/.test(value)
      },
      isValidFit: function (value) {
        return ['cover', 'contain', 'fill', 'inside', 'outside'].includes(value)
      },
    },
  })
)

router.get('/gcs/:bucket/:imgPath/*', async (ctx, next) => {
  const errors = await checkParams(ctx)
  if (errors) {
    ctx.throw(400)
  }

  const bucket = ctx.params.bucket
  const uriPrefix = `https://storage.googleapis.com/${bucket}`
  const imgPath = `${uriPrefix}/${decodeURIComponent(ctx.params.imgPath)}`

  const options = getCommonParams(ctx)

  let format = options.format || MimeLite.getType(ctx.params.imgPath)

  try {
    await resize(imgPath, options, format)
      .toBuffer()
      .then(data => {
        ctx.type = format
        ctx.body = data
      })
      .catch(err => {
        ctx.throw(err)
      })
  } catch (error) {
    next(error)
  }
})
router.get('/uri/:uri/*', async (ctx, next) => {
  const errors = await checkParams(ctx)
  if (errors) {
    ctx.throw(400)
  }

  const options = getCommonParams(ctx)

  let format = options.format || MimeLite.getType(ctx.params.uri)

  try {
    await resize(ctx.params.uri, options, format)
      .toBuffer()
      .then(data => {
        ctx.type = format
        ctx.body = data
      })
      .catch(err => {
        ctx.throw(err)
      })
  } catch (error) {
    next(error)
  }
})

module.exports = router
