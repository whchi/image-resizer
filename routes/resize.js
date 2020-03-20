const Router = require('@koa/router')
const koaValidator = require('koa-async-validator')
const router = new Router({ prefix: '/resize' })
const resize = require('../util/resizer')
const { getCommonParams, checkParams } = require('../util/common')
require('dotenv').config()

router.get('/', async (ctx, next) => {
  ctx.body = 'success'
})

router.use(
  koaValidator({
    customValidators: {
      isQuality: function(value) {
        return value >= 0 && value <= 100
      },
      isQueryString: function(value) {
        return /\/(.*)\.(gif|jpg|jpeg|png)$/i.test(value)
      },
      isValidHost: function(value) {
        return new RegExp(process.env.VALID_HOST).test(value)
      },
    },
  })
)

router.get('/gcs/:bucket/:imgPath/*', async (ctx, next) => {
  const errors = await checkParams(ctx)
  if (errors) {
    ctx.status = 400
    ctx.body = errors
    return
  }

  const bucket = ctx.params.bucket
  const uriPrefix = `https://storage.googleapis.com/${bucket}`
  const imgPath = `${uriPrefix}/${decodeURIComponent(ctx.params.imgPath)}`
  const options = getCommonParams(ctx)

  try {
    const [img, format] = resize(imgPath, options)
    await img
      .toBuffer()
      .then(data => {
        ctx.type = format
        ctx.body = data
      })
      .catch(err => {
        ctx.status = 400
        ctx.body = 'error'
      })
  } catch (error) {
    next(error)
  }
})
router.get('/uri/:uri/*', async (ctx, next) => {
  const errors = await checkParams(ctx)
  if (errors) {
    ctx.status = 400
    ctx.body = errors
    return
  }
  const options = getCommonParams(ctx)
  try {
    const [img, format] = resize(ctx.params.uri, options)
    await img
      .toBuffer()
      .then(data => {
        ctx.type = format
        ctx.body = data
      })
      .catch(err => {
        ctx.status = 400
        ctx.body = 'error'
      })
  } catch (error) {
    next(error)
  }
})

module.exports = router
