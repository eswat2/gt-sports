const axios = require('axios')

const fetchSolution = (host, callback) => {
  axios.get(`${host}/api/solution`).then(({ data }) => {
    callback && callback(data)
  })
}

const fetchCars = (host, callback) => {
  axios.get(`${host}/api/cars`).then(({ data }) => {
    callback && callback(data)
  })
}

const fetchExotics = (host, callback) => {
  axios.get(`${host}/api/exotics`).then(({ data }) => {
    callback && callback(data)
  })
}

module.exports = {
  fetchSolution,
  fetchCars,
  fetchExotics,
}
