const Router = require('@koa/router')
const router = new Router()
const fs = require('fs')
const bodyParser = require('koa-bodyparser')
const resolve = require('path').resolve
var settings = require(resolve('config/settings.json'))

router.get('/', async (ctx, next) => {
  ctx.body = 'success'
  ctx.status = 200
})

router
  .use(bodyParser())
  .post('/white-list', async (ctx, next) => {
    ctx.type = 'application/json'
    if (settings.token !== ctx.headers.authorization) {
      ctx.body = {
        success: false,
        code: '0001',
        items: [],
        msg: 'token mismatch',
      }
      ctx.status = 400
      return
    }
    let body = ctx.request.body
    if (!body.hosts && !body.buckets) {
      ctx.body = {
        success: false,
        code: '0002',
        items: [],
        msg: 'invalid params',
      }
      ctx.status = 400
      return
    }

    if (body.hosts) {
      settings.hosts = body.hosts
    }
    if (body.buckets) {
      settings.buckets = body.buckets
    }
    fs.writeFileSync(resolve('config/settings.json'), JSON.stringify(settings))
    ctx.body = {
      success: true,
      code: '0000',
      items: [],
      msg: 'success',
    }
    ctx.status = 200
  })
  .get('/white-list', async (ctx, next) => {
    ctx.type = 'application/json'
    if (settings.token !== ctx.headers.authorization) {
      ctx.body = {
        success: false,
        code: '0404',
        items: [],
        msg: 'token mismatch',
      }
      ctx.status = 404
      return
    }
    console.log(require(resolve('config/settings.json')))
    let toDisplay = {}
    Object.assign(toDisplay, settings)
    delete toDisplay.token

    ctx.body = {
      success: true,
      code: '0000',
      items: [toDisplay],
      msg: 'success',
    }
    ctx.staus = 200
  })

module.exports = router
