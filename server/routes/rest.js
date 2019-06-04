const express = require('express')
const router = express.Router()

const { create, update, remove } = require('../services/presentation-metadata')

const mockCreate = {
    name: 'SB-6025 Fixing wordings for some migration form referencing',
    filename: '6025',
    timelines: [
        {
            "label": "Long label name to test the overflow appearance",
            "seek": "12:45"
        }
    ]
}

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

// create(mockCreate)
// update(mockUpdate)
// remove(true, mockRemove)

router.post('/create', (req, res, next) => {
    create(req.body)
    res.send(req.body)
})

router.post('/test', (req, res, next) => {
    console.log(req.body)
    res.send(req.body)
})

module.exports = router