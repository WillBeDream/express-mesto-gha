const User = require('../models/user');

const ERR400 = 400;
const ERR500 = 500;
const ERR404 = 404;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERR500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERR404).send({ message: 'Пользователь с таким id не найден.' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR400).send({ message: 'Неккоректный _id' });
        return;
      }
      res.status(ERR500).send({ message: 'Пользователь с таким id не найден.' });
    });
};

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERR500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.editUserData = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res
          .status(ERR404)
          .send({ message: 'Пользователь по указанному id не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERR500).send({ message: 'Пользователь по указанному id не найден' });
      }
    });
};

module.exports.editUserAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(ERR404)
          .send({ message: 'Пользователь по указанному id не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR400).send({ message: 'Переданы некорректные данные' });
      } else {
        res
          .status(ERR500)
          .send({ message: 'Пользователь по указанному id не найден' });
      }
    });
};
