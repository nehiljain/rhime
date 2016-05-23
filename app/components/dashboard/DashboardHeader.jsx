var React = require('react');

var DashboardHeader = React.createClass({

	componentDidMount: function () {
		console.log('DashboardHeader');

	},

	syncPocket:function(){
		console.log('syncPocket button clicked')
	},
	render: function () {
		var pocketControls = (
			<div>
			<p style="padding-top:10px"> We need your pocket account to give you insights </p>
			<a className="btn btn-default" href='/connect/pocket' role='button'> Connect </a>
			</div>
		);

		if ( this.props.pocketConnected ){
			pocketControls = ( 
			<div>
				<button className="btn btn-default" role='button' onClick={this.syncPocket}> Sync Pocket </button>
				<p>{this.props.accessToken} </p>
			</div>
		);
		} 

		return (
		<div className="row">
			<div className="col-sm-6">
				<h2>{this.props.title }</h2>
			</div>
			<div className="col-sm-6">
				{ pocketControls }
			</div>
		</div>
		)
	}
});

module.exports = DashboardHeader;