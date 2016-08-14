var React = require('react');


var Stats = React.createClass({

	render : function(){
		return (
			<div className="col-sm-12">
				<div className="col-sm-6">
					<p className="lead">Time left : {this.props.duration} mins</p>
				</div>
				<div className="col-sm-6">
					<p className="lead">Articles left : {this.props.count}</p>
				</div>
			</div>	
		);
	}
})

module.exports = Stats;