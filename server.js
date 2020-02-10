// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
const express = require('express') // call express
const { ApolloServer, gql } = require('apollo-server-express')
const app = express() // define our app using express
const bodyParser = require('body-parser')
const { fetchCars, fetchExotics, fetchSolution } = require('./utils/api-module')

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

const API_HOST = process.env.API_HOST || `http://localhost:${port}`

// GRAPHQL -------------------------------------------
// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    solution: Solution
    cars: [GTSport]
    exotics: [GTSport]
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

const promiseData = () => {
  return new Promise((resolve, reject) => {
    fetchSolution(API_HOST, data => {
      console.log('-- id: ', data.id)
      resolve(data)
    })
  })
}

const promiseCars = () => {
  return new Promise((resolve, reject) => {
    fetchCars(API_HOST, data => {
      resolve(data)
    })
  })
}

const promiseExotics = () => {
  return new Promise((resolve, reject) => {
    fetchExotics(API_HOST, data => {
      resolve(data)
    })
  })
}

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    solution: () => {
      return promiseData()
    },
    cars: () => {
      return promiseCars()
    },
    exotics: () => {
      return promiseExotics()
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
