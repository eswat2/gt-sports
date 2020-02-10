const { dataSet } = require('../utils/mocks')

module.exports = (req, res) => {
  const data = dataSet()
  // NOTE:  we are returning the id & solution in the response...
  res.json(data)
}
