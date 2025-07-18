const express = require('express')
// const cors = require('cors')
const app = express()

app.use(express.json())
// app.use(cors())
// to use the frontend, we need to use the dist build directory with the static middleware
app.use(express.static('dist'))

let notes = [{ id: "1", content: "HTML is easy", important: true }, { id: "2", content: "Browser can execute only JavaScript", important: false }, { id: "3", content: "GET and POST are the most important methods of HTTP protocol", important: true }]

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1> ')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }

})

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id
    notes = notes.filter(note => note.id !== id)
    res.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => Number(n.id)))
        : 0
    return String(maxId + 1)
}

// data comes with the request body
app.post('/api/notes', (req, res) => {
    const body = req.body
    // check if content is provided
    if (!body.content) {
        return res.status(400).json({
            error: 'content missing'
        })
    }
    // obj for sending response
    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId()
    }

    notes = notes.concat(note)
    console.log(note)
    res.json(note)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
