let express = require('express')
let { token } = require('./src/http/token')
require('dotenv').config()

const PORT = process.env.PORT || 3000

let app = express()

app.use('*', express.json())
app.use('*', express.urlencoded({ extended: true }))

app.all('/token', (req, res) => token(req, res))

app.listen(PORT, () => console.log('listening on port ' + PORT))