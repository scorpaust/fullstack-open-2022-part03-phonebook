const express = require('express')
const app = express()
var morgan = require('morgan')

app.use(express.json())

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time[digits] ms :body'))

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
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/api/info', (request, response) => {
    const timestamp = new Date()
    const info = `<p>Phonebook has info for ${persons.length} people</p><p>${timestamp}</p>`

    response.send(info)
    response.send(timestamp)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)  
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    } 
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
  })

  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
    const errorMsg = ''
  
    if (!body.name) {
        return response.status(400).json({ 
            error: 'name missing'
        })
    }
    else if (!body.number) {
        return response.status(400).json({ 
            error: 'number missing'
        })
    }
    else if(persons.some(p => p.name === body.name) == true) {
        return response.status(400).json({ 
            error: 'name must be unique'
        })
    }

    else {
        const person = {
            id: generateId(),
            name: body.name,
            number: body.number,
          }
        
          persons = persons.concat(person)
        
        response.json(person)
    }
  })
  
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
