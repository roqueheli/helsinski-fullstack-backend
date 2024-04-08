const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const pass = process.argv[2]

const url =
  `mongodb+srv://admin:${pass}@cluster-helsinski.hwwnfdm.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster-Helsinski`

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  const phonebookSchema = new mongoose.Schema({
    name: String,
    number: Number,
  })

  const Person = mongoose.model('Person', phonebookSchema)

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  if (process.argv.length > 3) {    
    person.save().then(result => {
      console.log(`added ${person.name} number ${person.number} to phonebook`)
      mongoose.connection.close()
    }).catch((err) => console.log('fuck'))
    
  } else if (process.argv.length === 3) {
    Person.find({}).then(result => {
      console.log('phonebook:')
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
  }
}).catch((err) => console.log(err))
