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
