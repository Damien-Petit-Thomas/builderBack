module.exports = (schema, dataSource) => async (req, res, next) => {
  try {
    await schema.validateAsync(req[dataSource]);
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
