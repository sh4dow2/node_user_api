const Router = require('koa-router')
const router = new Router()
const passport = require('koa-passport')

const Profile = require('../../models/Profile')

const validateProfileInput = require('../../validation/profile')
const { createIndexes } = require('../../models/Profile')

/**
 * @route GET api/profile/test
 * @desc 测试接口
 * @access 公共
 */
 router.get('/test', async ctx => {
  ctx.status = 200;
  ctx.body = {
    msg: 'profile works...'
  }
})


/**
 * @route GET api/profile
 * @desc 个人信息接口
 * @access 私有
 */
 router.get('/', passport.authenticate('jwt', {
  session: false
}), async ctx => {
  const profile = await Profile.findOne({ user: ctx.state.user.id }).populate('user', ['name', 'avatar'])
  if(profile) {
    ctx.status = 200
    ctx.body = profile
  } else {
    ctx.status = 404
    ctx.body = {
      msg: '该用户没有任何相关个人信息'
    }
    return
  }
})

/**
 * @route POST api.profile
 * @desc 添加和编辑个人信息
 * @access 私有
 */
router.post('/', passport.authenticate('jwt', {
  session: false
}), async ctx => {
  const {errors, isValid} = validateProfileInput(ctx.request.body)
  if(!isValid) {
    ctx.status = 400
    ctx.body = errors
    return
  }

  const profileFields = {}
  profileFields.user = ctx.state.user.id
  if(ctx.request.body.handle) {
    profileFields.handle = ctx.request.body.handle
  }
  if(ctx.request.body.company) {
    profileFields.company = ctx.request.body.company
  }
  if(ctx.request.body.location) {
    profileFields.location = ctx.request.body.location
  }
  if(ctx.request.body.website) {
    profileFields.website = ctx.request.body.website
  }
  if(ctx.request.body.status) {
    profileFields.status = ctx.request.body.status
  }

  // skills
  if(typeof ctx.request.body.skills !== 'undefined') {
    profileFields.skills = ctx.request.body.skills.split(',')
  }
  if(ctx.request.body.bio) {
    profileFields.bio = ctx.request.body.bio
  }
  if(ctx.request.body.github) {
    profileFields.github = ctx.request.body.github
  }
  profileFields.social = {}
  if(ctx.request.body.wechat) profileFields.social.wechat = ctx.request.body.wechat
  if(ctx.request.body.qq) profileFields.social.qq = ctx.request.body.qq
  if(ctx.request.body.weibo) profileFields.social.weibo = ctx.request.body.weibo
  if(ctx.request.body.facebook) profileFields.social.facebook = ctx.request.body.facebook
  
  // 查询数据库
  const profile = await Profile.find({user: ctx.state.user.id})
  if(profile.length > 0) {
    const profileUpdate = await Profile.findOneAndUpdate(
      {user: ctx.state.user.id},
      {$set: profileFields},
      {new: true}
    )
    ctx.body = profileUpdate
  } else {
    await new Profile(profileFields).save().then(profile => {
      ctx.status = 200
      ctx.body = profile
    })
  }
  
})

/**
 * @route GET api/profile/handle?handle=test
 * @desc 通过handle获取个人信息
 * @access 公开
 */
router.get('/handle', async ctx => {
  const errors = {}
  const handle = ctx.query.handle
  const profile = await Profile.find({handle: handle}).populate('user', ['name', 'avatar'])
  if(profile.length < 1) {
    errors.noprofile = '未找到用户信息'
    ctx.status = 404
    ctx.body = errors
  } else {
    ctx.status = 200
    ctx.body = profile[0]
  }
})

/**
 * @route GET api/profile/user?user_id=test
 * @desc 通过user_id获取个人信息
 * @access 公开
 */
 router.get('/user', async ctx => {
  const errors = {}
  const user_id = ctx.query.user_id
  const profile = await Profile.find({user: user_id}).populate('user', ['name', 'avatar'])
  if(profile.length < 1) {
    errors.noprofile = '未找到用户信息'
    ctx.status = 404
    ctx.body = errors
  } else {
    ctx.status = 200
    ctx.body = profile[0]
  }
})

/**
 * @route GET api/profile/all
 * @desc 获取所有人信息
 * @access 公开
 */
 router.get('/all', async ctx => {
  const errors = {}
  const profiles = await Profile.find({}).populate('user', ['name', 'avatar'])
  if(profiles.length < 1) {
    errors.noprofile = '未找到任何用户信息'
    ctx.status = 404
    ctx.body = errors
  } else {
    ctx.status = 200
    ctx.body = profiles
  }
})


module.exports = router.routes()