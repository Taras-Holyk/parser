function processErrors(res, next, errors) {
  if (errors.length) {
    return res.status(400)
      .json({ errors });
  }

  return next();
}

module.exports = {
  processErrors
};
