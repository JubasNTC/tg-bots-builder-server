'use strict';

const asserter = {
  isEquals: (firstValue, secondValue) => firstValue === secondValue,
  isNotEquals: (firstValue, secondValue) => firstValue !== secondValue,
  isEmpty: (value) => String(value).length === 0,
  isNotEmpty: (value) => String(value).length > 0,
};

module.exports = { asserter };
