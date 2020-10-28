import Koa from 'koa'
import conditional from 'koa-conditional-get'
import logger from 'koa-logger'
import resizeRouter from './routes/resize'
import rootRouter from './routes/root'
import path from 'path'
import serve from 'koa-static'
import etag from 'koa-etag'
const app = new Koa()

app.use(logger())
app.use(async (ctx, next) => {
  await next()
  ctx.set('Cache-Control', 'public,max-age=31536000')
  ctx.set('Expires', new Date(Date.now() + 31536000000).toUTCString())
})
app.use(conditional())
app.use(etag())
app.use(rootRouter.routes())
app.use(resizeRouter.routes())
app.use(serve(path.join(__dirname, 'public')))

export default app
