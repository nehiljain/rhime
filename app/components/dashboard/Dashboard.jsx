var React = require('react');

var DashboardHeader = require('./DashboardHeader.jsx');
var ArticleList = require('./ArticleList.jsx');

var Dashboard = React.createClass({

	componentDidMount: function () {
		console.log('Dashboard');
		console.log(this.props)
	},

	render: function () {
		return (
		<div className="row">
			<DashboardHeader dashboardState={this.props.dashboardState} />
			<ArticleList articles={this.props.dashboardState.articles} />
		</div>
		)
	}
});
module.exports = Dashboard; 