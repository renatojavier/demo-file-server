import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import CreateEntry from './pages/CreateEntry.jsx'
import ViewList from './pages/ViewList.jsx'

class App extends Component {

	render() {
		return (
			<Router>
				<div>
					<ul>
						<li>
							<Link to="/">Create video entry</Link>
						</li>
						<li>
							<Link to="/view">View presentation list</Link>
						</li>
					</ul>

					<hr />

					<Route exact path="/" component={CreateEntry} />
					<Route path="/view" component={ViewList} />
				</div>
			</Router>
		)
	}
}

export default App