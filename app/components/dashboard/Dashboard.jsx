var React = require('react');

var ConnectPocket = require('./ConnectPocket.jsx');
var DashboardHeader = require('./DashboardHeader.jsx');
var ArticleList = require('./ArticleList.jsx');

var Dashboard = React.createClass({

	componentDidMount: function () {
		console.log('Dashboard');
		console.log(this.props)
	},

	render: function () {

		if ( !this.props.dashboardState.pocketConnected ){
				return ( <ConnectPocket /> );
		} else {
			return (
			<div className="row">
				<DashboardHeader dashboardState={this.props.dashboardState} />
				<ArticleList articles={this.props.dashboardState.articles} />
			</div>
			)
		}
	}
});
module.exports = Dashboard;
