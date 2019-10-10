let express = require('express')
let qs = require('qs')

const PORT = process.env.PORT || 3000

let app = express()

app.post('/', express.urlencoded({ extended: true }), (req, res) => {
    console.log(req.body)
    res.send(qs.stringify(req.body))
})

app.listen(PORT, () => {
    console.log('listening on port ' + PORT)
})