'use strict';

module.exports = (fn) => (req, res, next) => {
  const fnReturn = fn(req, res, next);

  return fnReturn instanceof Promise ? fnReturn.catch(next) : fnReturn;
};
