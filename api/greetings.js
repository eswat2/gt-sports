module.exports = (req, res) => {
  res.json({
    message: 'hooray! welcome to our api server!...',
    apis: [
      'cars',
      'exotics',
      'groups',
      'hash',
      'makes',
      'slug',
      'solution',
      'uuid',
    ],
  })
}
