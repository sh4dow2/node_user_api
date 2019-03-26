const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

const app = express()
const port = process.env.PORT || 3000

// 引入 users.js
const users = require('./routes/users')

// 数据库配置文件
const db = require('./configs/configs').mongoURI

// 使用body-parser中间件
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// 连接MongoDB数据库
mongoose.connect(db).then(() => {
  console.log('MongoDB Connected')
}).catch((err) => {
  console.log(err)
})

//passport 初始化
app.use(passport.initialize())
require('./configs/passport')(passport)

app.get('/', (req, res) => {
  res.json('hello')
})

// 使用 routes
app.use('/users', users)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

