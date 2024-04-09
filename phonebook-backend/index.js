const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

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
app.get('/api/persons/', (rq, rs) => {
  Person.find({}).then(people => {
    rs.json(people)
  })
})

//get one person
app.get('/api/persons/:id', (rq, rs) => {
  Person
  .findById(rq.params.id)
  .then(person => rs.json(person))
  .catch(err => rs.status(404).end().send('resource not found'))
})

//get info
app.get('/info', (rq, rs) => {
  const qtyPeople = persons.length
  const timeRq = new Date()
  rs.send(`<p>Phonebook has info for ${qtyPeople} people</p><p>${timeRq}</p>`)
})

//deleting a person
app.delete('/api/persons/:id', (rq, rs) => {
  Person.findOneAndRemove({ _id: rq.params.id }).then((person) => rs.json(person))
})

//updating a number
app.put('/api/persons/:id', (rq, rs) => {
  Person
  .findOneAndUpdate( { _id: rq.params.id }, { number: rq.body.number }, { returnOriginal: false })
  .then((person) => {
    rs.json(person)
  })
  .catch(err => console.log(err))
})

//add a new person
app.post('/api/persons', (rq, rs) => {
  const body = rq.body

  if (!body.name || !body.number) {
    return rs.status(400).json({ 
      error: 'name or number is missing' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    rs.json(savedPerson)
  })
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})