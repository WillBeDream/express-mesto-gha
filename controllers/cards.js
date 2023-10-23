const Card = require('../models/card');

const ERR400 = 400;
const ERR500 = 500;
const ERR404 = 404;

module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERR500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => {
      res.status(ERR500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERR404).send({ message: 'Карточка с таким id не найдена.' });
        return;
      }
      res.send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR400).send({ message: 'Неккоректный _id' });
        return;
      }
      res.status(ERR500).send({ message: 'Карточка с таким id не найдена.' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        res.status(ERR404).send({ message: 'Карточка с таким id не найдена.' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR400).send({ message: 'Неккоректный _id' });
        return;
      }
      res.status(ERR500).send({ message: 'Карточка с таким id не найдена.' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERR404).send({ message: 'Карточка с таким id не найдена.' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR400).send({ message: 'Неккоректный _id' });
        return;
      }
      res.status(ERR500).send({ message: 'Карточка с таким id не найдена.' });
    });
};
