const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const mongoose = require('mongoose')
app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

mongoose.Promise = Promise

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
    message.save()
    .then(() => {
            console.log('saved')
            return Message.findOne({message: 'badword'})
    })
    .then(censored => {
        if(censored){
            console.log('censored words found', censored)
            return Message.remove({_id: censored.id})
        }
        io.emit('message', req.body)
        res.sendStatus(200)
        console.log('save sucessful')
    })
    .catch(err => {
        res.sendStatus(500)
        return console.error(err)
    })
})

/*
    app.post('/messages', async (req,res) => {
        try {
            let message = new Message(req.body)
            let savedMessage = await Message.save()
            if(censored){
                await Message.remove({ _id: censored.id })
            }
            else {
                io.emit('message', req.body)
            }
            res.sendStatus(200)
        } catch (error) {
            res.sendStatus(500)
            return console.error(err)
        } finally {
            console.log('finished')
        }
    })
*/
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