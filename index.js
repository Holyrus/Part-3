const express = require('express');
const app = express();

app.use(express.json());


app.get('/api/persons', (request, response) => {
    response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    let person = persons.find(pers => pers.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
})

app.get('/info', (request, response) => {
    let currentTime = new Date().toString();
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${currentTime}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(pers => pers.id !== id);

    response.status(204).end();
})

const generateId = () => {
    const maxId = persons.length > 0 ? Math.max(...persons.map(person => Number(person.id))) : 0;
    return String(maxId + 1);
}

app.post('/api/persons', (request, response) => {
    const body = request.body;

    console.log(body)

    if (!body.name) {
        return response.status(400).json({
            error: 'Name missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'Number missing'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person);

    response.json(person);
})


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})