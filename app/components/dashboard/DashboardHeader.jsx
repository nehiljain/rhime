var React = require('react');
var ReactTags = require('react-tag-autocomplete');
var Notification = require('react-notification').Notification;

var style  = {
	searchBar : {
		marginLeft: "10px",
    	marginRight: "10px",
    	padding: '10px'
	},
	buttons : {
		width:"100px",
		marginLeft: "10px",
    	marginRight: "10px",
    	padding: '10px'
	}
}


var DashboardHeader = React.createClass({

	getInitialState : function(){
		return {
			isSyncing : false,
			notification : null,
			tags: [],
			suggestions: [
			]			
		}
	},
	syncPocket:function(){
		this.setState({
			isSyncing : true,
			notification : "syncing..."
		})
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
			console.log('syncpocket successful',data);
			if( !!data.articles && Array.isArray(data.articles) ){
				self.props.updateArticlelist(data.articles)
				self.setState({
					isSyncing : false,
					notification : "sync successful"
				})
			}
		})
		.catch(function(err){
			console.log('error syncpocket',err)
			self.setState({
				isSyncing : false,
				notification : "sync failed!"
			})
		});

	},
	search : function(event){
		//console.log(event.target.value)
		//this.props.setSearchKeyFn( document.querySelector("#search-bar").value );
		this.props.setSearchKeyFn( this.state.tags )
	},
	handleDelete: function (i) {
		var tags = this.state.tags
		tags.splice(i, 1)
		this.setState({ tags: tags })
	},
	handleAddition: function (tag) {
		var tags = this.state.tags
		tags.push(tag)
		this.setState({ tags: tags })
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
			<div className="row r-dashboard-header">
				<div className="col-sm-offset-1 col-sm-7">
					<Notification
						isActive={!!this.state.notification}
						message={this.state.notification}
						dismissAfter={2000}
					/>
					<ReactTags
						tags={this.state.tags}
						suggestions={this.state.suggestions}
						handleDelete={this.handleDelete}
						handleAddition={this.handleAddition}
						allowNew={true} 
					/>
				</div>
				<div className="col-sm-4">
					<button style={style.buttons} className="btn btn-danger" onClick={this.search} > <i className="fa fa-search"></i> </button>
					<button style={style.buttons} className="btn btn-danger" onClick={this.syncPocket} > <i className="fa fa-refresh"></i> Sync </button>					
				</div>
			</div>
		)
	},
	getSyncButtonStyles : function(){
		var a = [
			style.buttons,
			( this.state.isSyncing )? { disabled : true} : {disabled : false}
		]
		console.log(a)
		return a
	}
});
module.exports = DashboardHeader; 
