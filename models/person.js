const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("Connecting to", url);

mongoose.connect(url)
  .then(result => {
    console.log("connected to MongoDB")
  })
  .catch(error => {
    console.log("error connecting to MongoDB ", error.message)
  });
  
const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength:3,
      required: true
    },
    number: {
      type: String,
      validate: {
        validator: (v) => /^(\d{8,})|(\d{2}-\d{6,})|(\d{2}-\d{5,})+$/.test(v),
        message: props => `${props.value} is not a valid phone number! (valid numbers must have min length of 8 digits or match masks XX-XXXXXX(or more) or XXX-XXXXX(or more))`,
        required: true
        }
      }
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("Person", personSchema);