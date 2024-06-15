const express = require('express')
const { fetchContactsController,
    deleteContactController,
    searchContactController,
    exportToCSVController
} = require('../controllers/contactController')
const router = express.Router()


router.get('/get-contacts', fetchContactsController)
router.delete('/delete/:id', deleteContactController)
router.get('/search=?', searchContactController)
router.get('/export', exportToCSVController)

module.exports = router