require('dotenv').config();

const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(express.json());

morgan.token('body', (request) => {
    return JSON.stringify(request.body);
})

app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

const cors = require('cors')

const corsOptions = {
    origin: ["http://localhost:5173"],
}

app.use(cors(corsOptions));

app.use(express.static('dist'));

const Person = require('./models/person.js');

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person);
    })
})

// app.get('/info', (request, response) => {
//     let currentTime = new Date().toString();
//     response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${currentTime}</p>`)
// })

// app.delete('/api/persons/:id', (request, response) => {
//     const id = request.params.id;
//     persons = persons.filter(pers => pers.id !== id);

//     response.status(204).end();
// })

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (body.name === undefined) {
        return response.status(400).json({
            error: 'Name missing'
        })
    } else if (body.number === undefined) {
        return response.status(400).json({
            error: 'Number missing'
        })
    }

    const person = new Person ({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})