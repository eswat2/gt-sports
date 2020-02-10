const { chance } = require('../utils/mocks')

module.exports = (req, res) => {
  const { count } = req.query

  res.json(count ? chance.unique(chance.hash, parseInt(count)) : chance.hash())
}
