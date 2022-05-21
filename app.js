const PORT = 8000
const express = require("express")
const cors = require("cors")
const fs = require("fs")

const words = JSON.parse(fs.readFileSync('words.json', 'utf8'))

const app = express()

app.use(cors())

app.get('/word', (req, res) => {
    var index = Math.floor(Math.random() * words.length) + 1;
    res.json({ "word": words[index].toUpperCase() })
})

app.get('/check', (req, res, next) => {
    if (!req.query.word) {
        const err = new Error("Missing parameter 'word'")
        err.status = 400;
        err.message = "Missing parameter"
        next(err)
        res.send(err)
    } else {
        let wordCheck = req.query.word.toLowerCase();
        if (words.includes(wordCheck)) {
            res.status = 302
            res.send({ "found": true })
        } else {
            res.status = 404
            res.send({ "found": false })
        }
    }
})

app.listen(PORT)