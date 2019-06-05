import React, { Component } from 'react'

class FormTimelineList extends Component {
    state = {
        timelinesTemp: []
    }

    constructor(props) {
        super(props)

        this.onTimelineLabelChange = this.onTimelineLabelChange.bind(this)
        this.onTimelineSeekChange = this.onTimelineSeekChange.bind(this)
    }

    componentDidUpdate(newProps) {

    }

    onTimelineLabelChange = key => event => {
        event.preventDefault();

        this.props.onTimelineLabelChange(key, event) // lift state to parent
    }

    onTimelineSeekChange = key => event => {
        event.preventDefault();
        this.props.onTimelineSeekChange(key, event) // lift state to parent
    }

    listItemsMarkup(timelines) {
        let listItems = timelines.map((timeline, index) =>
            <li key={index} id={`timeline-list-${index + 1}`}>
                <label htmlFor='timeline-label'>Label</label>&nbsp;
                <input onChange={this.onTimelineLabelChange(index + 1)} id='timeline-label' type='text' data-key={`tm-label-${index + 1}`} />&nbsp;

                <label htmlFor='timeline-seek'>Seek</label>&nbsp;
                <input onChange={this.onTimelineSeekChange(index + 1)} id='timeline-seek' type='text' data-key={`tm-seek-${index + 1}`} />
            </li>
        )

        return listItems
    }

    render() {
        return (
            <ul>{this.listItemsMarkup(this.props.timelines)}</ul>
        )
    }
}

export default FormTimelineList