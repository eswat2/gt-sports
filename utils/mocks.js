const Chance = require('chance')
const vinGenerator = require('vin-generator')
const { filters, gts } = require('./gt-sports')
const { lorem } = require('./lorem')

const chance = new Chance()

const colors = [
  'red',
  'green',
  'blue',
  'yellow',
  'purple',
  'mint green',
  'teal',
  'white',
  'black',
  'orange',
  'pink',
  'grey',
  'maroon',
  'violet',
  'turquoise',
  'tan',
  'sky blue',
  'salmon',
  'plum',
  'orchid',
  'olive',
  'magenta',
  'lime',
  'ivory',
  'indigo',
  'gold',
  'fuchsia',
  'cyan',
  'azure',
  'lavender',
  'silver',
]

const dealerSuffix = [
  'Autos',
  'Cars',
  'Deals',
  'Group',
  'LLC',
  'Lot',
  'Motors',
  'Rides',
  'Sales',
  'Transit',
  'Venture',
]

const createId = () => {
  return Date.now()
}

const exotics = filters.exotics(gts.data)
const gtExotics = {
  cars: exotics,
  count: exotics.length,
  makes: filters.makes(exotics).sort(),
  groups: filters.groups(exotics).sort(),
  exotics: group => {
    return group ? exotics.filter(car => car.group.includes(group)) : exotics
  },
}

const nClass = filters.nonExotics(gts.data)
const gtCars = {
  cars: nClass,
  count: nClass.length,
  makes: filters.makes(nClass).sort(),
  groups: filters.groups(nClass).sort(),
  nClass: group => {
    return group ? nClass.filter(car => car.group.includes(group)) : nClass
  },
}

const generateDealers = () => {
  const numDealers = chance.integer({ min: 3, max: 7 })
  const dealerIds = chance.unique(chance.ssn, numDealers, {
    dashes: false,
  })

  const dealers = dealerIds.reduce((bucket, id) => {
    const numVins = chance.integer({ min: 3, max: 14 })
    const ids = chance.unique(vinGenerator.generateVin, numVins)
    const cars = ids.map(vin => {
      const indx = chance.integer({ min: 0, max: gtCars.count - 1 })
      const color = chance.pickone(colors)
      const { group, make, model, year } = gtCars.cars[indx]
      const obj = {
        vin,
        make,
        model,
        year,
        group,
        color,
      }
      return obj
    })

    const dealer = {
      dealerId: id,
      name: `${chance.name()} ${chance.pickone(dealerSuffix)}`,
      vehicles: cars,
    }
    return [...bucket, dealer]
  }, [])

  return dealers
}

const generateSummaryFor = dealers => {
  const cars = dealers.reduce((bucket, dealer) => {
    dealer.vehicles.forEach(car => {
      bucket.push(car)
    })
    return bucket
  }, [])

  const groups = filters.groups(cars).sort()
  const makes = filters.makes(cars).sort()
  const vins = cars.map(car => car.vin)

  const summary = {
    groups,
    makes,
    vins,
    counts: {
      dealers: dealers.length,
      groups: groups.length,
      makes: makes.length,
      vehicles: vins.length,
    },
  }

  return summary
}

const dataSet = () => {
  const id = createId()
  const dealers = generateDealers()
  const summary = generateSummaryFor(dealers)

  return {
    id,
    data: {
      dealers,
    },
    summary,
  }
}

// NOTE:  verify the data... (property order matters)
const compare = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const delay = () => {
  return chance.integer({ min: 500, max: 3500 })
}

const lipsum = () => chance.pickone(lorem)

const slug = (count = 3) => {
  return chance.unique(lipsum, count).join('-')
}

function uuid(a) {
  return a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid)
}

module.exports = {
  chance,
  dataSet,
  compare,
  delay,
  lipsum,
  slug,
  uuid,
  gtCars,
  gtExotics,
}
