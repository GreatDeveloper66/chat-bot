const express = require('express')
const app = express()
app.use(express.static(__dirname))
let messages = [
    {name: 'Tim', message: 'Hi'},
    {name: 'Jane', message: 'GoodBye'}
]
app.get('/messages', (req,res) => {
    res.send(messages)
})

app.post('/messages', (req,res) => {
    console.log(req.body)
    res.sendStatus(200)
})

let server = app.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})