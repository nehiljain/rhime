var React = require( 'react');
var ReactDOM  = require('react-dom');
var App = require('./components/dashboard/DashboardHeader.jsx');

if( document.getElementById('dashboardHeader') ){
	ReactDOM.render(<App />, document.getElementById('dashboardHeader') );	
}
