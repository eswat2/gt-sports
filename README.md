# gt-sports

A prototype GraphQL & REST server which uses the cars from GT Sports (video game).  A technology demonstration leveraging the node microservices model provided by ZEIT Now.

## dev

To try this locally, run the following:

1. `yarn`
2. `now dev`

The `now dev` command allows you to test the ZEIT Now app locally.

## api

- /api/cars
- /api/exotics
- /api/groups
- /api/hash
- /api/makes
- /api/slug
- /api/solution
- /api/uuid

## graphql

- /graphql

Here's the current schema:

```
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
```

