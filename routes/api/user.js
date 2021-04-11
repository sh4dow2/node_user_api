const Router = require('koa-router')
const router = new Router()
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const passport = require('koa-passport')

const keys = require('../../config/keys')
const User = require('../../models/User')
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')


/**
 * @route GET api/users/test
 * @desc 测试接口
 * @access 公共
 */
router.get('/test', async ctx => {
  ctx.status = 200;
  ctx.body = {
    msg: 'user works...'
  }
})

/**
 * @route POST api/users/register
 * @desc 注册接口
 * @access 公开
 */
router.post('/register', async ctx => {
  const {errors, isValid} = validateRegisterInput(ctx.request.body)
  if(!isValid) {
    ctx.status = 400
    ctx.body = errors
    return
  }

  // 存储到数据库
  const findResult = await User.find({email: ctx.request.body.email})
  if(findResult.length > 0) {
    ctx.status = 500
    ctx.body = {email: '邮箱已被占用'}
  } else {
    const avatar = gravatar.url(ctx.request.body.email, {s: '200', r: 'pg', d: 'mm'})
    const newUser = new User({
      name: ctx.request.body.name,
      email: ctx.request.body.email,
      avatar,
      password: ctx.request.body.password
    })

    let hash = bcrypt.hashSync(newUser.password, 10)
    newUser.password = hash

    // 存储到数据库
    await newUser.save().then(user => {
      console.log(222, user)
      ctx.body = user
    }).catch(err => {
      console.log(err)
    })
  }
})

/**
 * @route POST api/users/login
 * @desc 登录接口地址 返回token
 * @access 公共
 */
router.post('/login', async ctx => {
  const {errors, isValid} = validateLoginInput(ctx.request.body)
  if(!isValid) {
    ctx.status = 400
    ctx.body = errors
    return
  }

  const user = await User.findOne({
    email: ctx.request.body.email
  })
  console.log(user)
  const password = ctx.request.body.password
  if(user) {
    let result = bcrypt.compareSync(password, user.password)
    if(result) {
      const payload = {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      }
      const token = jwt.sign(payload, keys.secretKey, {
        expiresIn: 3600
      })

      ctx.status = 200
      ctx.body = {
        success: true,
        token: 'Bearer ' + token
      }
    } else {
      ctx.status = 400
      ctx.body = {
        msg: '密码错误'
      }
    }
  } else {
    ctx.status = 404
    ctx.body = {
      msg: '用户不存在'
    }
  }
})

/**
 * @route GET api/users/current
 * @desc 用户信息接口
 * @access 私有
 */
router.get('/current', passport.authenticate('jwt', {
  session: false
}), async ctx => {
  ctx.body = {
    id: ctx.state.user.id,
    name: ctx.state.user.name,
    email: ctx.state.user.email,
    avatar: ctx.state.user.avatar
  }
})




module.exports = router.routes()