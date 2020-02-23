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

const fetchApi = (host, api, count, callback) => {
  const url = count ? `${host}/api/${api}?count=${count}` : `${host}/api/${api}`
  axios.get(url).then(({ data }) => {
    callback && callback(data)
  })
}

// GRAPHQL -------------------------------------------
// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    solution: Solution
    cars: [GTSport]
    exotics: [GTSport]
    groups: [String]
    makes: [String]
    colors(count: Int!): [String]
    hash(count: Int!): [String]
    slug(count: Int!): String
    uuid(count: Int!): [String]
  }

  type Solution {
    id: String
    data: DealerGroup
    summary: GroupSummary
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

const promiseApi = (host, api, count) => {
  return new Promise((resolve, reject) => {
    fetchApi(host, api, count, data => {
      resolve(data)
    })
  })
}

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    solution: () => {
      return promiseApi(GTS_HOST, 'solution')
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
      return promiseApi(API_HOST, 'colors', count)
    },
    hash: (obj, { count }) => {
      return promiseApi(API_HOST, 'hash', count)
    },
    slug: (obj, { count }) => {
      return promiseApi(API_HOST, 'slug', count)
    },
    uuid: (obj, { count }) => {
      return promiseApi(API_HOST, 'uuid', count)
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
