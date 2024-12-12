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

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

// Figuring out how many document in database

const uri = process.env.MONGODB_URI;

app.get('/info', (request, response) => {
    let currentTime = new Date().toString();
    response.send(`<p>Phonebook has info ? for people</p> <p>${currentTime}</p>`)
})

// ------------------------------------------

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

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

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'Malformatted ID'})
    }

    next(error)
}

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})