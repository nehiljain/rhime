var React = require( 'react');
var ReactDOM  = require('react-dom');
var App = require('./components/dashboard/Dashboard.jsx');

var state = document.getElementById('initial-state').innerHTML.trim() || "{}";
var initialState = JSON.parse(state);

if( document.getElementById('dashboard') ){
	console.log("testings");
	ReactDOM.render(<App dashboardState={initialState}/>, document.getElementById('dashboard') );	
}
