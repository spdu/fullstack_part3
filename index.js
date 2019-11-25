const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
app.use(express.static('build'))
app.use(cors())

app.use(morgan('tiny'))
app.use(bodyParser.json())

let persons = [
    {
      name: "Arto Hellasy",
      number: "040-123456",
      id: 1
    },
    {
      
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: 2
    },
    {
        name: "Dan Abramov",
        number: "39-23-6423122",
        id: 3
      },
      {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
      },
  ]


  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

  app.get('/api/persons/', (request, response) => {
    response.json(persons)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find(person => person.id === id )
    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
  }})

  app.delete('/api/persons/:id', (request, response) => {
      
    const id = Number(request.params.id)
    console.log("deleting " + id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
    })

    app.post('/api/persons', (request, response) => {
        const body = request.body
        const names = persons.map(persons => persons.name)
        const numbers = persons.map(persons => persons.number)
  
        if (!body.name) {
        return response.status(400).json({ 
            error: 'name is missing' 
        })
        }
        if (!body.number) {
            return response.status(400).json({ 
                error: 'number is missing' 
            })
            }
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
    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 10000),
      }
    
      persons = persons.concat(person)
    
      response.json(person)
    })

  app.get('/info/', (request, response) => {
      const total = persons.length
    response.send(
        `Phonebook has info for ${total} people 
        \r\n 
        ${Date()}
        `)
  }) //how does one newline here

  app.use(unknownEndpoint)

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })