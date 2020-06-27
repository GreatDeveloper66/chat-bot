let fs = require('fs')
let faker = require('faker')
let data = require('./data/data.json')

const names = new Array(5).fill('').map(elem => faker.name.findName())
const namesobj = {
    names: names
}
fs.writeFile('./data/data.json', JSON.stringify(namesobj), (err)=> {
    console.log('write finished', err ? err : '')
})

fs.readFile('./data/data.json', 'utf-8', (err, data) => {
    console.log(data)
})
