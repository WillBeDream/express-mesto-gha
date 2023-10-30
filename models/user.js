const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/UnathorizedError');
const urlRegex = require('../utils/constants');
// const validator = require('validator');

const userChema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив-Кусто',
    minlength: [2, 'Минимальная длинна поля - 2'],
    maxlength: [30, 'Максимальная длинна поля - 30'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'Минимальная длинна поля - 2'],
    maxlength: [30, 'Максимальная длинна поля - 30'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(url) {
        return urlRegex.test(url);
      }
    }
  },
  email: {
    type: String,
    required: [true, 'Это поле должно быть заполнено'],
    unique: true,
    validate: {
      validator(email) {
        // validator.isEmail(email);
        return /^\S+@\S+\.\S+$/.test(email);
      },
      message: 'Введите верный email',
    },
  },
  password: {
    type: String,
    required: [true, 'Это поле должно быть заполнено'],
    select: false,
  },
}, { versionKey: false });

userChema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      // return Promise.reject(new Error("Неправильные почта или пароль"));
      throw new UnauthorizedError('Неправильная почта или пароль');
    }

    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        // return Promise.reject(new Error("Неправильные почта или пароль"));
        throw new UnauthorizedError('Неправильная почта или пароль');
      }

      return user;
    });
  });
};

module.exports = mongoose.model('user', userChema);
