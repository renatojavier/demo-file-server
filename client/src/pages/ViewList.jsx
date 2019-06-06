import React, { Component } from 'react'
import Promise from 'es6-promise'
import '../stylesheet/normalize.css'

Promise.polyfill()

class ViewList extends Component {
    DOMAIN_REST_ENDPOINT = 'http://localhost:4542'

    state = {
        view: {
            videos: []
        },
        update: {
            id: '',
            name: '',
            filename: '',
            timelines: []
        },
        activateUpdatePanel: false
    }

    constructor(props) {
        super(props)

        this.devCheckState = this.devCheckState.bind(this)
        this.onOpenUpdate = this.onOpenUpdate.bind(this)
        this.onCancelUpdate = this.onCancelUpdate.bind(this)
        this.onFinishUpdate = this.onFinishUpdate.bind(this)
        this.onChangeVideoLevel = this.onChangeVideoLevel.bind(this)
        this.onChangeTimelineLevel = this.onChangeTimelineLevel.bind(this)
        this.onRemoveVideo = this.onRemoveVideo.bind(this)
        this.onRemoveTimeline = this.onRemoveTimeline.bind(this)
    }

    componentDidMount() {
        this._fetchVideoList()
    }

    devCheckState(event) {
        event.preventDefault()

        debugger
    }

    /** Update app */
    onOpenUpdate(event) {
        event.preventDefault()

        this._fetchSpecificVideo(event.target.dataset.target)

        this.setState({
            activateUpdatePanel: true
        })
    }

    _fetchSpecificVideo(paramVideoId) {
        this.state.view.videos.map(video => {
            if (video.id === paramVideoId) {

                this.setState({
                    ...this.state,
                    update: video
                })
            }

            return 0
        })
    }

    onChangeVideoLevel = key => event => {
        event.preventDefault()

        let updatedVideoProp = { ...this.state }

        updatedVideoProp.update[key] = event.target.value

        this.setState(updatedVideoProp)

        return
    }

    onChangeTimelineLevel = (key, paramId) => event => {
        event.preventDefault()

        let state = { ...this.state }

        state.update.timelines.map(timeline => {
            if (timeline.id === paramId)
                timeline[key] = event.target.value

            return 0
        })

        this.setState(state)

        return
    }

    onCancelUpdate(event) {
        event.preventDefault()

        this._fetchVideoList({
            activateUpdatePanel: false,
            update: {
                id: '',
                name: '',
                filename: '',
                timelines: []
            }
        })
    }

    onFinishUpdate(event) {
        event.preventDefault()

        const REST_UPDATE_URI = `${this.DOMAIN_REST_ENDPOINT}/rest/update`
        const requestBody = this.state.update
        const options = {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: { 'Content-Type': 'application/json' }
        }
        const onUpdateCommonCallback = (statusText) => {
            this._fetchVideoList({
                activateUpdatePanel: false,
                update: {
                    id: '',
                    name: '',
                    filename: '',
                    timelines: []
                }
            })

            alert(statusText)
        }

        fetch(REST_UPDATE_URI, options)
            .then(response => response.json())
            .then(json => {
                onUpdateCommonCallback('Update successful')
            })
            .catch(error => {
                onUpdateCommonCallback(error)
            })

        return
    }
    /** end update app */

    /** Remove-specific app */
    onRemoveVideo(event) {
        event.preventDefault()

        this._fetchRemove({
            body: {
                doesEntireVideo: Boolean(event.target.dataset.removeEntire),
                params: {
                    videoId: event.target.dataset.target
                }
            }
        })
    }

    onRemoveTimeline(event) {
        event.preventDefault()

        this._fetchRemove({
            body: {
                doesEntireVideo: false,
                params: {
                    timelineId: event.target.dataset.target
                }
            }
        })
    }

    _fetchRemove(optionRequestBody) {
        const self = this
        const REST_REMOVE_URI = `${this.DOMAIN_REST_ENDPOINT}/rest/remove`
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }

        Object.assign(options, optionRequestBody)

        options.body = JSON.stringify(options.body)

        fetch(REST_REMOVE_URI, options)
            .then(response => response.json())
            .then(json => {
                self._fetchVideoList(false, () => {
                    console.log('Remove successful')
                })
            })
            .catch(error => {
                alert(error)
            })

        return
    }
    /** end remove */

    _fetchVideoList(otherProps = false, callback = false) {
        const REST_VIEW_URI = `${this.DOMAIN_REST_ENDPOINT}/rest/view`
        const option = {
            encoding: 'utf8'
        }

        fetch(REST_VIEW_URI, option)
            .then(response => response.json())
            .then(responseJson => {
                let videosProp = { ...this.state }
                
                videosProp.view.videos = [] // neutralise

                responseJson.videos.map((video, index) => {
                    videosProp.view.videos.push(video)

                    return 0
                })

                if (otherProps) {
                    Object.assign(videosProp, otherProps)
                }

                if (callback) {
                    callback.call([])
                }

                this.setState(videosProp)
            })

        return
    }

    render() {
        return (
            <div>
                <div className='panel-container'>
                    <section style={{ display: this.state.activateUpdatePanel ? 'none' : 'block' }} id='panel-view'>
                        <h3>Video list page</h3>
                        <button style={{ display: 'none' }} onClick={this.devCheckState}>Check state</button>
                        <p style={{ display: !this.state.view.videos.length ? 'block' : 'none' }}>No saved entry for any videos yet</p>
                        <div className='video-container' style={{ display: this.state.view.videos.length ? 'block' : 'none' }}>
                            {
                                this.state.view.videos.map((video, index, thisArray) =>
                                    <div id={`video-item-${index + 1}`} className='video-container-inner' key={index}>
                                        <p className="video-name">
                                            <small>[{index + 1}]</small>&emsp;
                                            <span>{video.name}</span>&emsp;
                                            <small><code>{video.filename}.mp4</code></small>&emsp;
                                            <span style={{ float: 'right' }}>
                                                <button data-target={video.id} onClick={this.onOpenUpdate}>Update</button>&nbsp;
                                                <button data-target={video.id} data-remove-entire={true} onClick={this.onRemoveVideo}>Remove video</button>
                                            </span>
                                        </p>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Label</th>
                                                    <th>Seek</th>
                                                    <th style={{ borderColor: 'white' }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    video.timelines.map((timeline, index) =>
                                                        <tr key={index}>
                                                            <td>{timeline.label}</td>
                                                            <td align='center'>{timeline.seek}</td>
                                                            <td style={{ borderColor: 'white', display: video.timelines.length < 2 ? 'none' : 'block' }}>
                                                                <button data-target={timeline.id} data-remove-entire={false} onClick={this.onRemoveTimeline}>X</button>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                        </table>

                                    </div>
                                )
                            }
                        </div>
                    </section>

                    <section className='panels' style={{ display: this.state.activateUpdatePanel ? 'block' : 'none' }} id='panel-update'>
                        <h3>Update video</h3>
                        <form onSubmit={this.onSubmit} autoComplete='false' noValidate>
                            <p>
                                <label htmlFor='video-name'>Video label</label>&nbsp;
						        <input onChange={this.onChangeVideoLevel('name')} value={this.state.update.name} id='video-name' autoFocus={true} />
                            </p>
                            <p>
                                <label htmlFor='video-name'>File name (excluding <small><code>.mp4</code></small>)</label>&nbsp;
						        <input onChange={this.onChangeVideoLevel('filename')} value={this.state.update.filename} id='video-name' />
                            </p>

                            <p>Timelines:</p>
                            <ul>
                                {
                                    this.state.update.timelines.map((timeline, index) =>
                                        <li key={index}>
                                            <label htmlFor='timeline-label'>Label</label>&nbsp;
                                            <input onChange={this.onChangeTimelineLevel('label', timeline.id)} value={timeline.label} id='timeline-label' type='text' />&nbsp;

                                            <label htmlFor='timeline-seek'>Seek</label>&nbsp;
                                            <input onChange={this.onChangeTimelineLevel('seek', timeline.id)} value={timeline.seek} id='timeline-seek' type='text' />
                                        </li>
                                    )
                                }
                            </ul>

                            <button type='button' onClick={this.onCancelUpdate}>Cancel</button>&nbsp;
                            <button type='submit' onClick={this.onFinishUpdate}>Update</button>
                        </form>
                    </section>
                </div>
            </div>
        )
    }
}

export default ViewList