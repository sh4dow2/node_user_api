const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
  user: {
    type: String,
    ref: 'users',
    required: true
  },
  handle: {
    type: String,
    required: true,
    max: 40
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  github: {
    type: String
  },
  experience: [
    {
      current: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        required: true
      },
      location: {
        type: String,
      },
      from: {
        type: String,
        required: true
      },
      to: {
        type: String
      },
      description: {
        type: String
      }
    }
  ],
  education: [
    {
      current: {
        type: Boolean,
        default: true
      },
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        require: true
      },
      major: {
        type: String
      },
      from: {
        type: String,
        required: true
      },
      to: {
        type: String
      },
      description: {
        type: String
      }
    }
  ],
  social: {
    wechat: {
      type: String
    },
    qq: {
      type: String
    },
    weibo: {
      type: String
    },
    facebook: {
      type: String
    }
  },
  date: {
    type: String,
    default: Date.now
  }
})

module.exports = Profile = mongoose.model('profile', ProfileSchema)