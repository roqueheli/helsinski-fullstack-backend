require('dotenv').config()
const mongoose = require('mongoose')

const pass = process.env.MONGO_KEY

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("connected to MongoDB");
}).catch((err) => {
    console.log("error connecting to MongoDB! ", err.message);
});

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', phonebookSchema)
