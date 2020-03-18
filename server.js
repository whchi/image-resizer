const Koa = require('koa')
const conditional = require('koa-conditional-get')
const logger = require('koa-logger')
const resizeRouter = require('./routes/resize')
const path = require('path')
const serve = require('koa-static')
const etag = require('koa-etag')
const app = new Koa()

const userAgent = require('koa2-useragent')

app.use(conditional())
app.use(etag())
app.use(userAgent())
app.use(resizeRouter.routes())
app.use(logger())
app.use(serve(path.join(__dirname, 'public')))

app.listen(5000)
