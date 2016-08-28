var React = require('react');

var style  = {
	searchBar : {
		width : "60%",
		marginLeft: "10px",
    	marginRight: "10px",
    	padding: '10px'
	},
	buttons : {
		width : "10%",
		marginLeft: "10px",
    	marginRight: "10px",
    	padding: '10px'
	}
}
var DashboardHeader = React.createClass({

	syncPocket:function(){
		//var hostName = window.location.hostname;//'http://127.0.0.1:3000'
		var self = this;
		var request = new Request(window.location.protocol+'//'+window.location.host+'/sync/pocket',{
			method : 'GET',
			credentials : 'same-origin'
		});
		return fetch(request)
		.then(function(response) {
  			return response.json();
		})
		.then(function(data){
			console.log(data);
			if( !!data.articles && Array.isArray(data.articles) ){
				self.props.updateArticlelist(data.articles)
			}
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
			<div className="row r-dashboard-header top-buffer bottom-buffer">
				<div className="col-sm-12">
					<input style={style.searchBar} type="text" id="search-bar" placeholder="Tag..."/>
					<button style={style.buttons} className="btn btn-danger" onClick={this.search} > <i className="fa fa-search"></i> </button>
					<button style={style.buttons} className="btn btn-danger" onClick={this.syncPocket} > <i className="fa fa-refresh"></i> Sync </button>
				</div>
			</div>
		)
	}
});
module.exports = DashboardHeader; 
