// @login $ register
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../configs/configs')
const passport = require('passport')
const User = require('../models/User')
// 测试api
router.get('/test', (req, res) => {
  res.json({msg: 'test works'})
})

// $router POST users/register
// @desc 返回的请求的json数据
// @access public
router.post('/register', (req, res) => {
  console.log(req.body)
  // 查询数据库中是否存在注册时邮箱
  User.findOne({email: req.body.email}).then( user => {
      if(user) {
        return res.status(400).json('邮箱已被注册!')
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        })
        bcrypt.genSalt(10, function(err, salt){
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err
            newUser.password = hash
            newUser.save().then(user => {
                res.json(user)
              }).catch(err => {
                console.log(err)
              })
          })
        })
      }
    })
})

// $router POST users/login
// @desc 返回token
// @access public
router.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  //查询数据库
  User.findOne({email}).then(user => {
    if(!user){
      return res.status(404).json('用户不存在！')
    }
    // 密码匹配
    bcrypt.compare(password, user.password).then(isMatch => {
      if(isMatch){
        const rule = {
          id: user.id,
          name: user.name,
        }
        jwt.sign(rule, 'secret', {expiresIn: 3600}, (err, token) => {
          if(err) throw err
          res.json({
            success: true,
            token: 'Bearer ' + token
          })
        })
      } else {
        return res.status(400).json('密码错误！')
      }
    })
  })
})

// $router GET users/current
// @desc return current user
// @access Private
router.get('/current', passport.authenticate('jwt', {session:false}), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  })
})

module.exports = router