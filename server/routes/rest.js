const express = require('express')
const router = express.Router()
const { create, update, remove, fetchFileCurrentContent } = require('../services/presentation-metadata')

router.post('/create', (req, res, next) => {
    create(req.body)
    res.send(req.body)
})

router.get('/view', (req, res, next) => {
    fetchFileCurrentContent(false, (readStream, streamChunks) => {
        res.json(streamChunks)
    }).on('error', error => {
         console.error(error)
    })
})

router.post('/update', (req, res, next) => {
    update(req.body)
    res.send(req.body)
})

router.post('/remove', (req, res, next) => {
    const doRemoveEntireVideo = req.body.doesEntireVideo
    const params = req.body.params

    remove(doRemoveEntireVideo, params)
    res.send(req.body)
})

router.post('/test', (req, res, next) => {
    console.log(req.body)
    res.send(req.body)
})

module.exports = router