require('dotenv').config();
const mongoose = require('mongoose');

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (v) => /\d{2,}-\d/.test(v),
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, 'User phone number required'],
  },
});

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const objectReturned = returnedObject;
    objectReturned.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', phonebookSchema);
