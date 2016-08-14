var React = require('react');

var DashboardHeader = require('./DashboardHeader.jsx');
var ArticleList = require('./ArticleList.jsx');


var setSearchKeyFn = function(searchKey){
	return this.setState({
		searchKey : searchKey
	})	
}
var Dashboard = React.createClass({

	getInitialState: function() {
		return {
			searchKey: ''
		};
	},
	componentDidMount: function () {
		//console.log('Dashboard');
		//console.log(this.props)
	},

	render: function () {
		if ( !this.props.dashboardState.pocketConnected ){
				return ( <ConnectPocket /> );
		} else {
			return (
			<div className="row">
				<DashboardHeader setSearchKeyFn={setSearchKeyFn.bind(this)} dashboardState={this.props.dashboardState} />
				<ArticleList searchKey={this.state.searchKey}  articles={this.props.dashboardState.articles} />
			</div>
			)
		}
	}
});
module.exports = Dashboard; 