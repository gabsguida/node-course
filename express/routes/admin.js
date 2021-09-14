const express = require('express')
const path = require('path')
const router = express.Router()
const rootDir = require('../util/path')

router.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
})

// este middleware só será disparado quando houver requisições com o método "POST"
router.post('/add-product', (req, res) => {
    console.log(req.body)
    res.redirect('/')
})

module.exports = router