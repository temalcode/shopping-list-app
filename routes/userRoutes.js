//express
const express = require('express')
const router = express.Router()
router.use(express.static( 'public'))
router.use(express.json())
router.use(express.urlencoded({ extended: true }))
const path = require('path')
//model
const userModel = require('../models/userModel')
//jwt
const jwt = require('jsonwebtoken')
//bcrypt
const bcrypt = require('bcrypt')
//passport
const passport = require('passport')
const res = require('express/lib/response')
//dompurify
const createDOMPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)
//method override
const methodOverride = require('method-override')
router.use(methodOverride('_method'))


//GET routes
router.get('/login', (req, res) => {
  try{
    if(req.isAuthenticated()){
      return res.redirect('/lists')
    } 
    res.sendFile(path.join(__dirname, '../public', 'login.html'))
  } catch(err){
    res.status(500).send(err.message)
  }
})
router.get('/signup', (req, res) => {
  try {
    if(req.isAuthenticated()){
      return res.redirect('/lists')
    } 
    res.sendFile(path.join(__dirname, '../public', 'signup.html'))
  } catch(err) {
    res.status(500).send(err.message)
  }
})

router.post('/signup', async (req, res) => {
  try {

    let usernameCheck = await userModel.findOne({ username: req.body.username })
    if (usernameCheck) {
      return res.status(400).send('username is already taken')
    }

    let hashedPassoword = await bcrypt.hash(req.body.password, 10)
    let newUser = new userModel({
      name: DOMPurify.sanitize(req.body.name),
      username: req.body.username,
      password: hashedPassoword
    })
    let savedUser = await newUser.save()
    res.status(200).redirect('/users/login')

  }catch (err) {
    res.status(500).send(err.message)
  }
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login-fail', successRedirect: '/users/login-success' }));

router.delete('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})


router.get('/login-success', (req, res) => {
    res.redirect('/lists')
})

router.get('/login-fail', (req, res) => {
    res.status(400).send('login failed')
})

router.delete('/logout', (req, res) => {
  try{
    req.logout()
    res.redirect('/')
  } catch(err){
    res.status(500).send(err.message)
  }
})



module.exports = router
