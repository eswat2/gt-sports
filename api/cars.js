const { gtCars } = require('../utils/mocks')

module.exports = (req, res) => {
  const { group } = req.query

  res.json(gtCars.nClass(group))
}
