import Router from '@koa/router'

const router = new Router()

router.get('/', async (ctx, next) => {
  ctx.body = 'success'
  ctx.status = 200
})

export default router
