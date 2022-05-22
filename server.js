//express
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.set('view engine', 'ejs')
//dotenv
const dotenv = require('dotenv')
dotenv.config()
//mongoose
const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URL, () => console.log('connected to the database'))
//session
const session = require('express-session')
//connect-mongo
const MongoStore = require('connect-mongo')
//passport
const passport = require('passport')
require('./configuration/passportConfig')

const sessionStore = MongoStore.create({ mongoUrl: process.env.DB_URL, collectionName: 'sessions' });
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}))

app.use(passport.initialize())
app.use(passport.session())


//homepage
app.get('/', (req, res) => {
    try{
        if(req.isAuthenticated()){
            return res.sendFile('index')
        }
        res.render('index')
    } catch(err){
        res.status(500).send(err.message)
    }
})

//routes
const userRoutes = require('./routes/userRoutes')
const listItemRoutes = require('./routes/listItemRoutes')
app.use('/users', userRoutes)
app.use('/lists', listItemRoutes)


//404
app.get((req, res) => {
    res.status(404).send('resource not found')
})


app.listen(process.env.PORT || 5000, () => console.log('server is running'))