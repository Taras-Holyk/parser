const validator = require('validator');
const helper = require('../helpers/validation.helper');
const userRepository = require('../repositories/user.repository');

async function register(req, res, next) {
  let errors = [];

  if (validator.isEmpty(req.body.email || '')) {
    errors.push({
      source: { pointer: '/data/attributes/email' },
      title: 'Invalid Attribute',
      detail: 'Email cannot be empty'
    });
  }

  if (!validator.isEmail(req.body.email || '')) {
    errors.push({
      source: { pointer: '/data/attributes/email' },
      title: 'Invalid Attribute',
      detail: 'Please provide correct email address'
    });
  }

  if (validator.isEmpty(req.body.password || '')) {
    errors.push({
      source: { pointer: '/data/attributes/password' },
      title: 'Invalid Attribute',
      detail: 'Password cannot be empty'
    });
  }

  if (!validator.equals(req.body.password || '', req.body.password_confirmation || '')) {
    errors.push({
      source: { pointer: '/data/attributes/password' },
      title: 'Invalid Attribute',
      detail: 'Passwords not match'
    });
  }

  if (!errors.length) {
    const user = await userRepository.getByEmail(req.body.email);
    if (user) {
      errors.push({
        source: { pointer: '/data/attributes/email' },
        title: 'Email exists',
        detail: 'Email already exists'
      });
    }
  }

  return helper.processErrors(res, next, errors);
}

function login(req, res, next) {
  let errors = [];

  if (validator.isEmpty(req.body.email || '')) {
    errors.push({
      title: 'Invalid Attribute',
      detail: 'Email cannot be empty'
    });
  }

  if (validator.isEmpty(req.body.password || '')) {
    errors.push({
      title: 'Invalid Attribute',
      detail: 'Password cannot be empty'
    });
  }

  return helper.processErrors(res, next, errors);
}

module.exports = {
  register,
  login
};
