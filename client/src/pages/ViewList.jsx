import React, { Component } from 'react'

class ViewList extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        console.log('Mounted...');
        
    }

    render() {
        return (
            <div>
                <p>Video list page</p>
            </div>
        )
    }
}

export default ViewList