const User = require('../models/user');

const {
  serverError,
  dataError,
  unfound,
  ok,
} = require('../errors');

module.exports.createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await User.create({ name, about, avatar });
    return res.status(201).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(dataError).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(serverError).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(ok).send(users);
  } catch (err) {
    res
      .status(serverError)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.getUserId = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(unfound)
        .send({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.status(ok).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res
        .status(dataError)
        .send({ message: 'Передан некорректный _id пользователя' });
    }
    return res
      .status(serverError)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.updateProfile = async (req, res) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(unfound).send(({ message: 'Пользователь по указанному _id не найден' }));
    }
    return res.status(ok).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(dataError).send({ message: 'Передан некорректный _id пользователя' });
    }
    if (err.name === 'ValidationError') {
      return res.status(dataError).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(serverError).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.updateAvatar = async (req, res) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(unfound).send(({ message: 'Пользователь по указанному _id не найден' }));
    }
    return res.status(ok).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(dataError).send({ message: 'Передан некорректный _id пользователя' });
    }
    if (err.name === 'ValidationError') {
      return res.status(dataError).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(serverError).send({ message: 'На сервере произошла ошибка' });
  }
};
