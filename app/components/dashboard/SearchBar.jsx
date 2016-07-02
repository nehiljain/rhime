var React = require('react');

var SearchBar = React.createClass({

	render : function(){
		return (
			<div className="col-sm12">
				<input className="sd" type="text" placeholder="Article..."/>
				<input className="sd" type="text" placeholder="Tags..."/>
				<button className="button"> Go </button>
			</div>
		);
	}
})

module.exports = SearchBar;