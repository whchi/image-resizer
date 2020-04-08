const Router = require('@koa/router')
const router = new Router()

router.get('/', async (ctx, next) => {
  ctx.body = 'success'
  ctx.status = 200
})

module.exports = router
