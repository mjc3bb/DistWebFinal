const express = require('express')
var bodyParser = require('body-parser')
const pug = require('pug')
const app = express()
const mongoose = require('mongoose')
const port = 3000

let connection = mongoose.connect("mongodb://root:example@mongo:27017/copypasta?authSource=admin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
mongoose.set('useCreateIndex', true)

const Pasta = mongoose.model("Pasta", {
    name: {type: String, default: "Default Pasta Name"},
    language: {type: String, default: "Plain Text"},
    delta: Object,
    createdAt: Date,
    lastUpdated: Date,
})

app.set('views', './views')
app.set('view engine', 'pug')

app.use(express.static('public'))

app.use(bodyParser.json())

app.get('/', async (req, res) => {
    res.render('index', { message: 'Hello there!'})
})

app.get('/pasta/:pastaID', async (req, res) => {
    const p = await Pasta.findById(req.params.pastaID).lean()
    res.render('pasta', { message: 'Hello there!', delta: JSON.stringify(p.delta), pasta: JSON.stringify(p) })
})

app.get('/pasta', async (req, res) => {
    const pastas = await Pasta.find({}).sort({lastUpdated: -1}).lean()
    res.render("pasta-list", {pastas: JSON.stringify(pastas), pastasList: pastas})
})

app.post('/save', async (req, res) => {
    const delta = req.body.delta
    const name = req.body.name
    const _id = mongoose.Types.ObjectId();
    const p = new Pasta({
        _id,
        delta,
        name,
        createdAt: new Date(Date.now()),
        lastUpdated: new Date(Date.now()),
    })
    await p.save()
    res.send( {id: _id})
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})