require('dotenv').config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const {CONNECTION_STRING, SESSION_SECRET} = process.env
const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')
const auth = require('./controllers/middleware/authMiddleware')

const app = express();
const PORT = 4000;

// TOP-LEVEL MIDDLEWARE
app.use(express.json())


app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
}))

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log('db connected')
})
app.listen(PORT, () => console.log(`I am fluent in over ${PORT} forms of communication.`))