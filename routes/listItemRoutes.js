
//express
const express = require('express')
const router = express.Router()
router.use(express.json())
router.use(express.urlencoded({extended: true}))
//model
const userModel = require('../models/listItemModel')
const listItemModel = require('../models/listItemModel')
//dompurify
const createDOMPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)
//method override
const methodOverride = require('method-override')
router.use(methodOverride('_method'))


router.get('/', checkAuthenticated, async(req, res) => {
    try{
        let userLists = await userModel.find({owner: req.user.username})
        res.render('list', {name: req.user.name, list: userLists})
    } catch(err){
        res.status(500).send(err.message)
    }
})

router.post('/create', checkAuthenticated, async(req, res) => {
    try{
        let newItem = new listItemModel({
            item: DOMPurify.sanitize(req.body.item),
            quantity: DOMPurify.sanitize(req.body.quantity),
            unit: DOMPurify.sanitize(req.body.unit),
            owner: req.user.username
        })
        let savedItem = await newItem.save()
        res.redirect('/lists')
    } catch(err){
        res.status(500).send(err.message)
    }
})

router.delete('/delete/:id', async (req, res) => {
    try{
        let deletedPost = await listItemModel.findByIdAndDelete(req.params.id)
        res.redirect('/lists')
    } catch(err){
        res.status(500).send(err.message)
    }
})

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/users/login')
}


module.exports = router