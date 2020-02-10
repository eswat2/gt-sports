const { gts } = require('../utils/gt-sports')

module.exports = (req, res) => {
  res.json(gts.allGroups())
}
