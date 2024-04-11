const peopleRouter = require('express').Router();
const Person = require('../models/person');

//  get all persons
peopleRouter.get('/', (rq, rs, next) => {
  Person.find({})
    .then((people) => rs.json(people))
    .catch((err) => next(err));
});

//  get one person
peopleRouter.get('/:id', (rq, rs, next) => {
  Person
    .findById(rq.params.id)
    .then((people) => rs.json(people))
    .catch((err) => next(err));
});

//  get info
peopleRouter.get('/info', (rq, rs) => {
  Person
    .count({}).then((count) => {
      const timeRq = new Date();
      rs
        .send(`<p>Phonebook has info for ${count} people</p><p>${timeRq}</p>`);
    });
});

//  deleting a person
peopleRouter.delete('/:id', (rq, rs, next) => {
  Person
    .findByIdAndDelete({ _id: rq.params.id })
    .then((person) => rs.json(person))
    .catch((err) => next(err));
});

//  updating a number
peopleRouter.put('/:id', (rq, rs, next) => {
  const { id, body } = rq;
  Person
    .findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' })
    .then((person) => rs.json(person))
    .catch((err) => next(err));
});

//  add a new person
peopleRouter.post('/', (rq, rs, next) => {
  const { body } = rq;

  if (!body.name || !body.number || body.name === undefined || body.number === undefined) {
    return rs.status(400).json({
      error: 'name or number is missing',
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  return person
    .save()
    .then((savedPerson) => rs.json(savedPerson))
    .catch((err) => next(err));
});

module.exports = peopleRouter;
