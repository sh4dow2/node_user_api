const Validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validateProfileInput(data) {
  let errors = {}

  data.handle = !isEmpty(data.handle) ? data.handle : ''
  data.status = !isEmpty(data.status) ? data.status : ''
  data.skills = !isEmpty(data.skills) ? data.skills : ''
  data.website = !isEmpty(data.website) ? data.website : ''

  if(Validator.isEmpty(data.handle)) {
    errors.handle = 'handle不能为空'
  }
  if(!Validator.isLength(data.handle, {min: 2, max: 40})) {
    errors.handle = 'handle长度不能小于2且不能大于40'
  }

  if(Validator.isEmpty(data.status)) {
    errors.status = 'status不能为空'
  }

  if(Validator.isEmpty(data.skills)) {
    errors.skills = 'skills 不能为空'
  }

  if(!Validator.isEmpty(data.website)) {
    if(!Validator.isURL(data.website)) {
      errors.website = 'url不合法'
    }
  }


  return {
    errors,
    isValid: isEmpty(errors)
  }
}