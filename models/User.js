const mongoose = require('mongoose')
const Schema = mongoose.Schema


// 实例化数据模板
const UserSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  avatar: {
    type: String
  },
  date: {
    type: String,
    default: Date.now
  }
})

module.exports = User = mongoose.model('users', UserSchema)