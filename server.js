import express, { static } from 'express'
import { json, urlencoded } from 'body-parser'
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
import mongoose from 'mongoose'
app.use(static(__dirname))
app.use(json())
app.use(urlencoded({extended: false}))
let messages = [
    {name: 'Tim', message: 'Hi'},
    {name: 'Jane', message: 'GoodBye'}
]
app.get('/messages', (req,res) => {
    res.send(messages)
})

app.post('/messages', (req,res) => {
    messages.push(req.body)
    io.emit('message', req.body)
    res.sendStatus(200)
})

io.on('connection', socket => {
    console.log('user connected')
})

let server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})