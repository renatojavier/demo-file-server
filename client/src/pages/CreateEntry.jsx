import React, { Component } from 'react'
import Promise from 'es6-promise'
import 'isomorphic-fetch'

Promise.polyfill()

class CreateEntry extends Component {
	state = {
		videoName: 'GL3 - Update Occupation List',
		videoFileName: '4227'
	}

	constructor(props) {
		super(props)

		this.onSubmit = this.onSubmit.bind(this)
		this.onChange = this.onChange.bind(this)
	}

	componentDidMount() {

	}

	onChange = key => event => {
		event.preventDefault();

		this.setState({
			[key]: event.target.value
		})
	}

	onSubmit(event) {
		event.preventDefault()

		let saveSuccessful = true
		const state = this.state

		for (let key in state) {
			if (state[key] === '') {
				saveSuccessful = false
			}
		}

		if (!saveSuccessful) return

		this._sendFormToServer(state)
	}

	_sendFormToServer(data) {
		const requestBody = {
			name: data.videoName,
			filename: data.videoFileName,
			timelines: []
		}
		const options = {}
		// debugger
		// do post call

		fetch('http://localhost:4542/rest/create', {
			method: 'POST',
			body: JSON.stringify(requestBody),
			headers: { 'Content-Type': 'application/json' },
		})
			.then(response => response.json())
			.then(json => {
				alert('Video entry saved to demo.json')
			})
			.catch(error => {
				alert('Something went wrong upon saving. Please try again')
			})

		return
	}

	render() {
		return (
			<div>
				<p>Create entry page</p>
				<form onSubmit={this.onSubmit} autoComplete='false' noValidate>
					<p>
						<label htmlFor='video-name'>Video label</label>&nbsp;
						<input id='video-name' onChange={this.onChange('videoName')} value={this.state.videoName} autoComplete='true' />
					</p>
					<p>
						<label htmlFor='video-name'>File name(excluding <small><code>.mp4</code></small>)</label>&nbsp;
						<input id='video-name' onChange={this.onChange('videoFileName')} value={this.state.videoFileName} autoComplete='true' />
					</p>
					<button type='submit'>Create entry</button>
				</form>
			</div>
		)
	}
}

export default CreateEntry