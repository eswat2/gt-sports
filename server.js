// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
const express = require('express') // call express
const { ApolloServer, gql } = require('apollo-server-express')
const app = express() // define our app using express
const bodyParser = require('body-parser')
const axios = require('axios')

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// app.use(express.static('public'))

// configure app to use CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

const port = process.env.PORT || 8080 // set our port

const API_HOST = process.env.API_HOST
const GTS_HOST = process.env.GTS_HOST

const fetchApi = (host, api, obj, callback) => {
  const keys = Object.keys(obj)
  const url = keys.reduce((glob, key, index) => {
    return `${glob}${index > 0 ? '&' : '?'}${key}=${obj[key]}`
  }, `${host}/api/${api}`)
  axios.get(url).then(({ data }) => {
    callback && callback(data)
  })
}

// GRAPHQL -------------------------------------------
// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    solution(id: String = "42"): Solution
    stats: Stats
    cars: [GTSport]
    exotics: [GTSport]
    groups: [String]
    makes: [String]
    colors(count: Int = 4): [String]
    hash(count: Int = 4): [String]
    lorem(count: Int = 4): [String]
    slug(count: Int = 4): String
    uuid(count: Int = 4): [String]
  }

  type Solution {
    id: String
    data: DealerGroup
    summary: GroupSummary
  }

  type Stats {
    exotics: Int
    groups: Int
    makes: Int
    normal: Int
    total: Int
  }

  type DealerGroup {
    dealers: [Dealer]
  }

  type Dealer {
    dealerId: String
    name: String
    vehicles: [Vehicle]
  }

  type GTSport {
    year: Int
    make: String
    model: String
    group: String
  }

  type Vehicle {
    vin: String
    year: Int
    make: String
    model: String
    group: String
    color: String
    exotic: Boolean
  }

  type GroupSummary {
    groups: [String]
    makes: [String]
    vins: [String]
    counts: GroupCounts
  }

  type GroupCounts {
    dealers: Int
    groups: Int
    makes: Int
    vehicles: Int
  }
`

const promiseApi = (host, api, obj) => {
  return new Promise((resolve, reject) => {
    fetchApi(host, api, obj, (data) => {
      resolve(data)
    })
  })
}

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    solution: (obj, { id }) => {
      return promiseApi(GTS_HOST, 'solution', { id })
    },
    stats: () => {
      return promiseApi(GTS_HOST, 'stats')
    },
    cars: () => {
      return promiseApi(GTS_HOST, 'cars')
    },
    exotics: () => {
      return promiseApi(GTS_HOST, 'exotics')
    },
    groups: () => {
      return promiseApi(GTS_HOST, 'groups')
    },
    makes: () => {
      return promiseApi(GTS_HOST, 'makes')
    },
    colors: (obj, { count }) => {
      return promiseApi(GTS_HOST, 'colors', { count })
    },
    hash: (obj, { count }) => {
      return promiseApi(API_HOST, 'hash', { count })
    },
    lorem: (obj, { count }) => {
      return promiseApi(API_HOST, 'lorem', { count })
    },
    slug: (obj, { count }) => {
      return promiseApi(API_HOST, 'slug', { count })
    },
    uuid: (obj, { count }) => {
      return promiseApi(API_HOST, 'uuid', { count })
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
})
server.applyMiddleware({ app })

// REGISTER OUR ERROR HANDLERS -----------------------
const logErrors = (err, req, res, next) => {
  console.log('-- ERROR')
  console.error(err.stack)
  next(err)
}

const errorHandler = (err, req, res, next) => {
  res.status(500).send({ error: 'Something failed!...' })
}

app.use(logErrors)
app.use(errorHandler)

// START THE SERVER
// =============================================================================
app.listen(port)
console.log('Magic happens on port ' + port)
console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
