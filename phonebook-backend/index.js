const express = require('express')
const app = express()

app.use(express.json())

const persons = [
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


const PORT = 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})