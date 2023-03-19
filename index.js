const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

morgan.token("content", (request, response)=>{
  if (request.method === "POST") {
    return JSON.stringify(request.body)
  }
})

app.use(cors());
app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :content"));

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
];

app.get("/info", (request, response)=>{
  const personsLength = persons.length
  const currentTime = new Date()

  response.send(`<p>Phonebook has info for ${personsLength} people</p><p>${currentTime}</p>`)
})

app.get("/api/persons", (request, response)=>{
  response.json(persons);
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

  const id = (Math.random()*1000).toFixed(0)

  if (persons.filter(p=>p.name === body.name).length===0){
    const person = {id:Number(id), ...body}
    persons = [...persons, person]
    response.json(person)
    return response.status(201).end()
  } else {
    response.json({error:`person with name ${body.name} alredy exist`})
    return response.status(201).end()
  }
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});