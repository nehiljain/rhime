var React = require('react');

var DashboardHeader = React.createClass({

	syncPocket:function(){
		//var hostName = window.location.hostname;//'http://127.0.0.1:3000'
		var request = new Request(window.location.protocol+'//'+window.location.hostname+'/sync/pocket',{
			method : 'GET',
			credentials : 'same-origin'
		});
		return fetch(request).then(function(data){
			console.log(data);
		});
	},
	render: function () {
		//console.log(this.props);
	
		var pocketControls = (
			<div>
			<p> We need your pocket account to give you insights </p>
			<a className="btn btn-default" href='/connect/pocket' role='button'> Connect </a>
			</div>
		);

		if ( this.props.dashboardState.pocketConnected ){
			pocketControls = ( 
			<div>
				<button className="btn btn-default" role='button' onClick={this.syncPocket}> Sync Pocket </button>
			</div>
		);
		} 

		return (
		<div className="row r-dashboard-header top-buffer">
			<div className="col-sm-6">
				<input type="text" placeholder="Article..."/>
				<input type="text" placeholder="Tags..."/>
				<button className="btn btn-danger"> Go </button>
			</div>
			<div className="col-sm-6">
				{ pocketControls }
			</div>
		</div>
		)
	}
});
module.exports = DashboardHeader; 
