const { gtExotics } = require('../utils/mocks')

module.exports = (req, res) => {
  const { group } = req.query

  res.json(gtExotics.exotics(group))
}
