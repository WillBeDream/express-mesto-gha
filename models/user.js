const mongoose = require('mongoose');

const userChema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlength: [2, 'Минимальная длинна поля - 2'],
    maxlength: [30, 'Максимальная длинна поля - 30'],
  },
  about: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlength: [2, 'Минимальная длинна поля - 2'],
    maxlength: [30, 'Максимальная длинна поля - 30'],
  },
  avatar: {
    type: String,
    reqired: [true, 'Поле должно быть заполнено'],
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userChema);
