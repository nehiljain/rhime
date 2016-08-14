var React = require('react');

var style  = {
	searchBar : {
		width : "80%"
	},
	buttons : {
		width : "20%"
	}
}
var DashboardHeader = React.createClass({

	syncPocket:function(){
		//var hostName = window.location.hostname;//'http://127.0.0.1:3000'
		var request = new Request(window.location.protocol+'//'+window.location.host+'/sync/pocket',{
			method : 'GET',
			credentials : 'same-origin'
		});
		return fetch(request).then(function(data){
			console.log(data);
		});
	},
	search : function(event){
		//console.log(event.target.value)
		this.props.setSearchKeyFn( document.querySelector("#search-bar").value );
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
				<div className="col-sm-12">
					<input style={style.searchBar} type="text" id="search-bar" placeholder="Tag..."/>
					<button style={style.buttons} className="btn btn-danger" onClick={this.search} > Search </button>
				</div>
			</div>
		)
	}
});
module.exports = DashboardHeader; 
