const Card = require('../models/card');

const {
  serverError,
  dataError,
  unfound,
  ok,
} = require('../errors');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(ok).send(cards);
  } catch (err) {
    res.status(serverError).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.createCard = async (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const card = await Card.create({ name, link, owner });
    return res.status(201).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(dataError).send({
        message: 'Переданы некорректные данные при создании карточки',
      });
    }
    return res
      .status(serverError)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.id);
    if (!card) {
      return res
        .status(unfound)
        .send({ message: 'Карточка по указанному _id не найдена' });
    }
    return res.status(ok).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res
        .status(dataError)
        .send({ message: 'Передан некорректный _id карточки' });
    }
    return res
      .status(serverError)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res
        .status(unfound)
        .send({ message: 'Карточка по указанному _id не найдена' });
    }
    return res.status(ok).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res
        .status(dataError)
        .send({ message: 'Передан некорректный _id карточки' });
    }
    return res
      .status(serverError)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res
        .status(unfound)
        .send({ message: 'Карточка по указанному _id не найдена' });
    }
    return res.status(ok).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res
        .status(dataError)
        .send({ message: 'Передан некорректный _id карточки' });
    }
    return res
      .status(serverError)
      .send({ message: 'На сервере произошла ошибка' });
  }
};
