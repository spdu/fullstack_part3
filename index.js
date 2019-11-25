require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
app.use(cors())
app.use(express.static('build'))
app.use(morgan('tiny'))
app.use(bodyParser.json())

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons/', (request, response,next) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  //const id = Number(request.params.id)
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(response.status(204).end())
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => { //whenever a .then, a .catch too
  //Person.find({}).then(persons => { //accessing this in post is okay?
  const body = request.body
  //const names = persons.map(persons => persons.name)
  //const numbers = persons.map(persons => persons.number)

  if (body.name === undefined) {
    return response.status(400).json({
      error: 'name is missing'
    })//can these be middlewared?
  }
  if (body.number === undefined) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }
  /*
        if (names.includes(body.name)) {
            return response.status(400).json({
                error: 'name must be unique'
            })
        }
        if (numbers.includes(body.number)) {
            return response.status(400).json({
                error: 'number must be unique'
            })
        }
        */
  const person = new Person({
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 10000),
  })
  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson.toJSON())
    })
    .catch(error => next(error))
})


app.get('/info/', (request, response, next) => {
  Person.find({}).then(persons => {
    const total = persons.length
    response.send(
      `Phonebook has info for ${total} people 
        \r\n 
        ${Date()}
        `)

  })
    .catch(error => next(error))
}) //how does one newline here

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  // /api/persons/{malformatted_id} antaa nyt malformatted id
  next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})