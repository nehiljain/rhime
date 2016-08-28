var React = require('react');


var Stats = React.createClass({

	render : function(){
		return (
			<div className="col-sm-12 top-buffer">
				<div className="col-sm-6">
					<p className="lead"> <i className="fa fa-hourglass-end"></i> : {this.props.duration} mins</p>
				</div>
				<div className="col-sm-6">
					<p className="lead"> <i className="fa fa-newspaper-o"></i> : {this.props.count}</p>
				</div>
			</div>	
		);
	}
})

module.exports = Stats;