const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const mongoose = require('mongoose')
app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
const dbUrl = 'mongodb+srv://chat-bot-user:OHv1RfoVJzi5DcPo@cluster0-vo8rx.mongodb.net/<dbname>?retryWrites=true&w=majority'
let messages = [
    {name: 'Tim', message: 'Hi'},
    {name: 'Jane', message: 'GoodBye'}
]

const Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.get('/messages', (req,res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

app.post('/messages', (req,res) => {
    let message = new Message(req.body)
    message.save(err => {
        if(err){
            sendStatus(500)
            console.log('error')
        }
        else {
            //Message.findOne({message: 'badwoord'}, (err, censored))
            messages.push(req.body)
            io.emit('message', req.body)
            res.sendStatus(200)
            console.log('save sucessful')
        }
    })
    
})

io.on('connection', socket => {
    console.log('user connected')
})

mongoose.connect(dbUrl, { useNewUrlParser: true}, err => {
    console.log('mongo db connection', err)
})

let server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})


/*

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://chat-bot-user:<password>@cluster0-vo8rx.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});



*/