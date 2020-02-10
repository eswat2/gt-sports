const { slug } = require('../utils/mocks')

module.exports = (req, res) => {
  const { count } = req.query

  res.json(slug(count))
}
