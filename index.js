const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const authRoutes = require('./routes/auth')
const keys = require('./config/keys')
const app = express()

mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})

app.use(passport.initialize())
require('./middleware/passport')(passport)
app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json()) 
app.use(require('cors')())

app.use('/api/auth', authRoutes)


const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server has been started on ${port}`))
