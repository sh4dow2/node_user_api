const Koa = require('koa')
const Router = require('koa-router')
const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser')
const passport = require('koa-passport')


// 实例化koa
const app = new Koa()
const router = new Router()

app.use(bodyParser())

app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

// 引入路由
const users = require('./routes/api/user')
const profiles = require('./routes/api/profile')

// 路由
router.get('/', async ctx => {
  ctx.body = {
    msg: 'Hello Koa!'
  }
})

// 连接数据库
const db = require('./config/keys').mongoURI
//mongodb://dan:123@127.0.0.1:27017/koa
mongoose.connect(db , {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('mongodb connected x...')
}).catch(err => {
  console.log(err)
})

// 配置路由地址
router.use('/api/users', users)
router.use('/api/profile', profiles)

// 配置路由
app.use(router.routes()).use(router.allowedMethods())
const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`server started on ${port}`)
})