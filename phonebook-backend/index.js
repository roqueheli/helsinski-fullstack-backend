const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const errorHandler = require('./src/middlewares/errorHandler')

const unknownEndpoint = (rq, rs) => {
  rs.status(404).send({ error: 'unknown endpoint' })
}

const app = express()

app.use(cors())

morgan.token('body', (rq, rs) => {
  if (rq.method === 'POST') {
    return JSON.stringify(rq.body)
  }
});

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static('dist'))

//get all persons
app.get('/api/persons/', (rq, rs, next) => {
  Person.find({})
  .then(people => rs.json(people))
  .catch(err => next(err))
})

//get one person
app.get('/api/persons/:id', (rq, rs, next) => {
  Person
  .findById(rq.params.id)
  .then((person) => {
    person ? rs.json(person) : rs.status(404).end()
  })
  .catch(err => next(err))
})

//get info
app.get('/info', (rq, rs) => {
  Person.count({}).then(count => {
    const timeRq = new Date()
    rs.send(`<p>Phonebook has info for ${count} people</p><p>${timeRq}</p>`)
  });
})

//deleting a person
app.delete('/api/persons/:id', (rq, rs, next) => {
  Person
  .findByIdAndDelete({ _id: rq.params.id })
  .then((person) => rs.json(person))
  .catch(err => next(err))
})

//updating a number
app.put('/api/persons/:id', (rq, rs, next) => {
  const { id, body } = rq
  Person
  .findByIdAndUpdate( id, body, { new: true, runValidators: true, context: 'query' })
  .then((person) => {
    rs.json(person)
  })
  .catch(err => next(err))
})

//add a new person
app.post('/api/persons', (rq, rs, next) => {
  const body = rq.body

  if (!body.name || !body.number || body.name === undefined || body.number === undefined) {
    return rs.status(400).json({ 
      error: 'name or number is missing' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
  .then(savedPerson => rs.json(savedPerson))
  .catch(err => next(err))
})

app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})