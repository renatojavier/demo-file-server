import React, { Component } from 'react'
import Promise from 'es6-promise'
import 'isomorphic-fetch'
import '../stylesheet/normalize.css'

import FormTimelineList from '../components/FormTimelineList.jsx'

Promise.polyfill()

class CreateEntry extends Component {
	state = {
		videoName: '',
		videoFileName: '',
		timelines: []
	}

	formSubmissionReady = false

	constructor(props) {
		super(props)

		this.onSubmit = this.onSubmit.bind(this)
		this.onChange = this.onChange.bind(this)
		this.onTimelineClick = this.onTimelineClick.bind(this)
		this.onTimelinePropsChange = this.onTimelinePropsChange.bind(this)
		this.devCheckState = this.devCheckState.bind(this)
	}

	componentDidMount() { }
	componentDidUpdate() { }

	devCheckState() {
		
		debugger
	}

	resetState() {
		this.setState({
			videoName: '',
			videoFileName: '',
			timelines: []
		})
	}

	onChange = key => event => {
		event.preventDefault();

		this.setState({
			[key]: event.target.value
		})
	}

	onTimelineClick(event) {
		event.preventDefault()

		let timelineTempProp = { ...this.state }

		timelineTempProp.timelines.push({
			key: this.state.timelines.length + 1,
			label: '',
			seek: ''
		})

		// create timeline object with initial values for each timeline key
		this.setState(timelineTempProp)
	}

	/** Timeline child props event handler */
	onTimelinePropsChange = type => (key, event) => {
		let timelinesProp = { ...this.state }

		timelinesProp.timelines.map(timeline => {
			if (timeline.key === key) {
				timeline[type] = event.target.value
			}

			return 0
		})

		this.setState(timelinesProp)
	}
	/** end props event */

	onSubmit(event) {
		event.preventDefault()

		this._checkFormSubmissionReady()

		if (this.formSubmissionReady) {
			this._sendFormToServer(this.state)
		} else {
			alert('All fields are required and at least one timeline should be created.')
		}

		return
	}

	_checkFormSubmissionReady() {
		for (let key in this.state) {
			if (key !== 'page') { // exclude form page meta
				if (this.state[key] !== '') {
					this.formSubmissionReady = true
				} else {
					this.formSubmissionReady = false
				}
			}

			if (key === 'timelines') {
				if (!this.state[key].length) {
					this.formSubmissionReady = false
				} else {
					this.state[key].map(timeline => {
						if (timeline.label === '' || timeline.label === '') {
							this.formSubmissionReady = false
						} else {
							this.formSubmissionReady = true
						}

						return 0
					})
				}
			}
		}

		return
	}

	_sendFormToServer(data) {
		const REST_ENDPOINT_CREATE = 'http://localhost:4542/rest/create'
		const requestBody = {
			name: data.videoName,
			filename: data.videoFileName,
			timelines: data.timelines
		}
		const options = {
			method: 'POST',
			body: JSON.stringify(requestBody),
			headers: { 'Content-Type': 'application/json' }
		}

		fetch(REST_ENDPOINT_CREATE, options)
			.then(response => response.json())
			.then(json => {
				alert('Video entry saved to demo.json')
				this.resetState()
			})
			.catch(error => {
				alert('Something went wrong upon saving. Please try again')
			})

		return
	}

	render() {
		return (
			<div>
				<h3>Create video entry</h3>
				<form onSubmit={this.onSubmit} autoComplete='false' noValidate>
					<p>
						<label htmlFor='video-name'>Video label</label>&nbsp;
						<input id='video-name' onChange={this.onChange('videoName')} value={this.state.videoName} autoFocus={true} />
					</p>
					<p>
						<label htmlFor='video-name'>File name</label>&nbsp;
						<input id='video-name' onChange={this.onChange('videoFileName')} value={this.state.videoFileName} />
					</p>
					<button id='button-add-timeline' onClick={this.onTimelineClick}>Add timeline</button>

					<div id='timeline-container'>
						<FormTimelineList
							timelines={this.state.timelines}
							onTimelineLabelChange={this.onTimelinePropsChange('label')}
							onTimelineSeekChange={this.onTimelinePropsChange('seek')}
						/>
					</div>

					<button style={{ display: 'none' }} onClick={this.devCheckState}>Check state</button>
					<hr />
					<button id='button-submit-form' className={this.formSubmissionReady ? 'submission-ready' : 'submission-not-ready'} type='submit'>Create entry</button>
				</form>
			</div>
		)
	}
}

export default CreateEntry