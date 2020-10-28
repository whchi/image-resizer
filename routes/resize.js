import Router from '@koa/router'
import koaValidator from 'koa-async-validator'
import { resize } from '../util/resizer'
import MimeLite from 'mime/lite'
import { getCommonParams, checkParams } from '../util/common'
import url from 'url'
const resolve = require('path').resolve
const router = new Router({ prefix: '/resize' })

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
      isValidBucket: function (value) {
        return require(resolve('config/settings.json')).buckets.includes(value)
      },
      isValidHost: function (value) {
        let hostname = url.parse(value).hostname
        return require(resolve('config/settings.json')).hosts.includes(hostname)
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

export default router
