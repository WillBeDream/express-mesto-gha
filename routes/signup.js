const router = require('express').Router();
const { addUser } = require('../controllers/users');
const {celebrate, Joi} = require('celebrate');
const urlRegex = require('../utils/constants');

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegex),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }).unknown(true),
}), addUser);

module.exports = router;
