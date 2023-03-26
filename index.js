require("dotenv").config()
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const Person = require("./models/person")

morgan.token("content", (request, response)=>{
  if (request.method === "POST") {
    return JSON.stringify(request.body)
  }
})

app.use(cors());
app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :content"));
app.use(express.static("build"));


app.get("/info", (request, response)=>{
  Person.find({}).then(persons=>{
    const personsLength = persons.length
    const currentTime = new Date()
  
    response.send(`<p>Phonebook has info for ${personsLength} people</p><p>${currentTime}</p>`)
  })
})

app.get("/api/persons", (request, response)=>{
  Person.find({}).then(persons => {
    response.json(persons)
  })
});

app.post("/api/persons", (request, response)=>{
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  } else if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.get("/api/persons/:id", (request, response)=>{
  const id = Number(request.params.id);
  const person = persons.find(p=>p.id===id);

  if (person){
    return response.json(person)
  } else {
    response.status(404).end()
  }
});

app.delete("/api/persons/:id", (request, response)=>{
  const id = Number(request.params.id);
  if (persons.find(p=>p.id===id)){
    persons = persons.filter(p=>p.id !== id)
    response.status(204).end()
  } else {
    response.status(404).end()
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});