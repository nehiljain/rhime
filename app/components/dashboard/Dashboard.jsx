var React = require('react');

var DashboardHeader = require('./DashboardHeader.jsx');
var ArticleList = require('./ArticleList.jsx');
var ConnectPocket = require('./ConnectPocket.jsx');


var setSearchKeyFn = function(searchKey){
	return this.setState({
		searchKey : searchKey
	})	
}

var updateArticlelist =  function(articles){
	return this.setState({
		articles : articles
	})
}

var Dashboard = React.createClass({

	getInitialState: function() {
		return {
			searchKey: '',
			articles : []
		};
	},
	componentDidMount: function () {
		console.log('Dashboard');
		updateArticlelist.bind(this)(this.props.dashboardState.articles)
	},

	render: function () {
		if ( !this.props.dashboardState.pocketConnected ){
				return ( <ConnectPocket /> );
		} else {
			return (
			<div className="row">
				<DashboardHeader setSearchKeyFn={setSearchKeyFn.bind(this)} updateArticlelist={updateArticlelist.bind(this)} dashboardState={this.props.dashboardState} />
				<ArticleList searchKey={this.state.searchKey}  articles={this.state.articles} />
			</div>
			)
		}
	}
});
module.exports = Dashboard; 