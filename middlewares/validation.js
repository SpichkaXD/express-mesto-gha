const validator = require('validator');
const ValidateError = require('../errors/validateError');

module.exports.validateUrl = (value) => {
  const res = validator.isURL(value);
  if (res) {
    return value;
  }
  throw new ValidateError('Введите корректный URL-адрес');
};
