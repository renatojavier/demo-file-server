const express = require('express')
const router = express.Router()

const { create, update, remove, fetchFileCurrentContent } = require('../services/presentation-metadata')

const mockUpdate = {
    "id": "vd-p4x9BXC520BgZS3V",
    "name": "GL3 - Update Occupation List",
    "timelines": [
        {
            "label": "Updated - Long label name to test the overflow appearance",
            "seek": "33:15",
            "id": "tm-OfcWZLPqdFRSdW47"
        }
    ]
}

const mockRemove = {
    videoId: 'vd-p4x9BXC520BgZS3V',
    timelineId: 'tm-Ujh9d3QMkgC25irE'
}

// update(mockUpdate)
// remove(true, mockRemove)
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

router.post('/test', (req, res, next) => {
    console.log(req.body)
    res.send(req.body)
})

module.exports = router