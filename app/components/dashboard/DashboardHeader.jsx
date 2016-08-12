var React = require('react');

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
	render: function () {
		return (
			<div className="row r-dashboard-header top-buffer">
				<div className="col-sm-6">
					<input type="text" placeholder="Article..."/>
					<input type="text" placeholder="Tags..."/>
					<button className="btn btn-danger"> Go </button>
				</div>
			</div>
		)
	}
});
module.exports = DashboardHeader;
