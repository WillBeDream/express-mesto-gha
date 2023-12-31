const httpConstants = require('http2').constants;
const { default: mongoose } = require('mongoose');
const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenErrror = require('../errors/ForbiddenError');

module.exports.addCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(httpConstants.HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then(((card) => {
      if (!card) {
        next(new BadRequestError(`Неккоректный id карточки ${req.params.cardId}`));
      } else {
        if (!card.owner.equals(req.user._id)) {
          throw new ForbiddenErrror('Карточка другого пользователя');
        }
        Card.deleteOne(card)
          .orFail()
          .then(() => {
            res.status(httpConstants.HTTP_STATUS_OK).send({ message: 'Карточка удалена' });
          })
          .catch((err) => {
            if (err instanceof mongoose.Error.DocumentNotFoundError) {
              next(new NotFoundError(`Карточка с таким id ${req.params.cardId} не найдена`));
            } else if (err instanceof mongoose.Error.CastError) {
              next(new BadRequestError(`Неккоректный id карточки ${req.params.cardId}`));
            } else {
              next(err);
            }
          });
      }
    }))
    .catch((err) => {
      if (err.name === 'TypeError') {
        next(new NotFoundError('Карточка не найдена'));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Неккоректный id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(
          new NotFoundError(
            `карточка с таким id ${req.params.cardId} не найдена`,
          ),
        );
      } else if (err instanceof mongoose.Error.CastError) {
        next(BadRequestError(`некорректный id ${req.params.cardId}`));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(
          new NotFoundError(
            `карточка с таким id ${req.params.cardId} не найдена`,
          ),
        );
      } else if (err instanceof mongoose.Error.CastError) {
        next(BadRequestError(`некорректный id ${req.params.cardId}`));
      } else {
        next(err);
      }
    });
};
