var React = require('react');

var style = {
	stats : {
		marginTop : "20px",
		marginBottom : "20px",
		textAlign : "center"
	}
}

var Stats = React.createClass({

	render : function(){
		return (
			<div className="col-sm-10 col-sm-offset-1" style={style.stats}>
				<div className="col-sm-6" >
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