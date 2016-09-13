var React = require('react');
var moment = require('moment');
var ReactBSTable = require('react-bootstrap-table');  
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

var Tags = require('./Tags.jsx');
var Stats = require('./Stats.jsx');

var tagFormatter = function(tags){
	return <Tags tags={tags}/>;
}

var titleFormatter = function(title,row){
	return <a href={"http://getpocket.com/a/read/"+row.item_id} target="_blank">{title}</a>;
}

var articlelist = React.createClass({

	componentDidMount: function () {
		//console.log(this.props.articles)
		//document.querySelector('#search-bar').onKeyPress(this.props.setSearchKeyFn);
	},	
	render: function () {
		var articles = this.props.articles || [];
		var total_time = 0;
		var total_count = 0;
		var _searchKey = this.props.searchKey;
		var filteredArticles = [].concat(articles)
		
		filteredArticles = filteredArticles.filter(function(item){
			if ( _searchKey == ""){
				return true;
			}
			if( item.tags.length != 0 && Object.keys( item.tags[0] ).indexOf(_searchKey) != -1){
				return true;
			} else {
				return false;
			}
		})
		
		filteredArticles.forEach(function(item){
			item.time_added = moment(item.time_added).fromNow();
			item.time = Math.round( item.word_count/250 );
			if( !!item.item_id){
				total_time+=item.time;
				total_count++;
			}
		})

		return (

		<div className="row">
				<Stats count={total_count} duration={total_time} />
			<div className="col-sm-10 col-sm-offset-1">
				<BootstrapTable data={filteredArticles} >
					<TableHeaderColumn dataField="item_id" hidden={true} isKey={true}>id</TableHeaderColumn>
					<TableHeaderColumn dataField="time_added" >Added On</TableHeaderColumn>
					<TableHeaderColumn dataField="resolved_title" dataFormat={titleFormatter}>Name</TableHeaderColumn>
					<TableHeaderColumn dataField="resolved_title" hidden={true}>Title</TableHeaderColumn>
					<TableHeaderColumn dataField="tags" dataFormat={tagFormatter}>Tags</TableHeaderColumn>
					<TableHeaderColumn dataField="time" dataSort={true}>Time</TableHeaderColumn>
				</BootstrapTable>
			</div>
		</div>
		)
	}
});

module.exports = articlelist;
