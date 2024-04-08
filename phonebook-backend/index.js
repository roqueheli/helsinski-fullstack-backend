const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

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

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
  return Math.random().toString(36)
}

//get all persons
app.get('/api/persons/', (rq, rs) => {
    rs.json(persons)
})

//get one person
app.get('/api/persons/:id', (rq, rs) => {
  const person = persons.find(person => person.id === Number(rq.params.id))
  if (person) {
      rs.json(person)
  } else {
      rs.status(404).end().send('resource not found')
  }
})

//get info
app.get('/info', (rq, rs) => {
  const qtyPeople = persons.length
  const timeRq = new Date()
  rs.send(`<p>Phonebook has info for ${qtyPeople} people</p><p>${timeRq}</p>`)
})

//deleting a person
app.delete('/api/persons/:id', (rq, rs) => {
  const id = Number(rq.params.id)

  const findPerson = persons.find((person) => person.id === id || person.id === rq.params.id)
  
  if (!findPerson) {
    return rs.status(204)
  } else {
    id
    ?
      persons = persons.filter((person) => person.id !== id)
    :
      persons = persons.filter((person) => person.id !== rq.params.id)
  }
  
  rs.json(findPerson)
})

//add a new person
app.post('/api/persons', (rq, rs) => {
  const body = rq.body

  const findPerson = persons.find((person) => person.name === body.name)
  if (findPerson) {
    return rs.status(400).json({
      error: 'name must be unique'
    })
  }

  if (!body.name || !body.number) {
    return rs.status(400).json({ 
      error: 'name or number is missing' 
    })
  }

  const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
  }

  persons = persons.concat(person)

  rs.json(person)
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})