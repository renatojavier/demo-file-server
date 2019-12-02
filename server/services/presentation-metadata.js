const generateId = require('./generateId')
const fs = require('fs')
const path = require('path')

const URI_DEMO_METADATA = `./public/demo.json`
const STREAM_OPTION = { encoding: 'utf8' }

class PresentationMetadata {

    static fetchFileCurrentContent(exitWhenEmpty = false, callback = () => { }) {
        const readStream = fs.createReadStream(URI_DEMO_METADATA, STREAM_OPTION)

        readStream.on('data', streamChunks => {
            streamChunks = JSON.parse(streamChunks)

            if (!streamChunks.videos.length) {
                console.log('[!] No current video saved')
                if (exitWhenEmpty) return
            }

            callback(readStream, streamChunks)
        })

        return readStream
    }

    /**
     * @method create
     * @param {Object} data 
     */
    static create(data) {
        const id = generateId('video')
        const name = data.name
        const filename = data.filename
        let timelines = data.timelines

        PresentationMetadata
            .fetchFileCurrentContent(false, (readStream, streamChunks) => {
                let currentVideos = streamChunks.videos

                // sign an ID on each timeline
                timelines.map(timeline => {
                    Object.assign(timeline, {
                        id: generateId('timeline')
                    })
                })

                /** build-up */
                currentVideos.push({
                    id: id,
                    name: name,
                    filename: filename,
                    timelines: timelines,
                    completed: false
                })

                const writeStream = fs.createWriteStream(URI_DEMO_METADATA, STREAM_OPTION)

                writeStream.on('finish', () => {
                    console.log('[!] File demo.json saved')
                })

                writeStream.on('error', error => {
                    console.error(error);
                })

                writeStream.write(JSON.stringify(streamChunks))
                writeStream.end()

            }).on('error', error => {
                console.error(error)
            })

        return
    }

    /**
     * @method update
     * @param {*} id 
     */
    static update(updatedData) {
        PresentationMetadata
            .fetchFileCurrentContent(false, (readStream, streamChunks) => {
                let videos = streamChunks.videos

                videos.map(video => {
                    if (video.id === updatedData.id) { /** video props level update */

                        video.name = (updatedData.name) ? updatedData.name : video.name
                        video.filename = (updatedData.filename) ? updatedData.filename : video.filename
                        video.completed = (updatedData.completed) ? updatedData.completed : video.completed

                        if (updatedData.timelines) {
                            if (updatedData.timelines.length) {
                                video.timelines.map(timeline => { // loop timeline from file
                                    updatedData.timelines.map(updatedTimeline => { // loop timeline from param

                                        if (timeline.id === updatedTimeline.id) { /** timeline props level update */
                                            Object.assign(timeline, updatedTimeline)
                                        }

                                    }) // END loop timeline from param
                                }) // END  loop timeline from file
                            }
                        }

                    }
                })

                const writeStream = fs.createWriteStream(URI_DEMO_METADATA, STREAM_OPTION)

                writeStream.on('finish', () => {
                    console.log(`[!] File demo.json updated: (1) video id = ${updatedData.id} (2) video name = ${updatedData.name}`)
                })

                writeStream.on('error', error => {
                    console.error(error);
                })

                writeStream.write(JSON.stringify(streamChunks))
                writeStream.end()
            })

        return
    }

    /**
     * @method remove
     * @param {*} id 
     */
    static remove(doesEntireVideo = false, param = {}) {
        PresentationMetadata
            .fetchFileCurrentContent(true, (readStream, streamChunks) => {
                let videos = streamChunks.videos

                if (doesEntireVideo) {
                    videos = videos.filter((video, index, self) => video.id !== param.videoId)
                    console.log(videos)
                } else {
                    videos.map(video => {
                        video.timelines = video.timelines.filter((timeline, index, self) => timeline.id !== param.timelineId)
                    })
                }

                streamChunks.videos = videos

                const writeStream = fs.createWriteStream(URI_DEMO_METADATA, STREAM_OPTION)

                writeStream.on('finish', () => {
                    console.log(`[!] File demo.json updated`)
                })

                writeStream.on('error', error => {
                    console.error(error);
                })

                writeStream.write(JSON.stringify(streamChunks))
                writeStream.end()
            })

        return
    }
}

module.exports = PresentationMetadata