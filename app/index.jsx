var React = require( 'react');
var ReactDOM  = require('react-dom');
var App = require('./components/dashboard/Dashboard.jsx');

var initialState = JSON.parse(document.getElementById('initial-state').innerHTML);

if( document.getElementById('dashboard') ){
	ReactDOM.render(<App dashboardState={initialState}/>, document.getElementById('dashboard') );	
}
