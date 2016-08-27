var React = require('react')


var ConnectPocket = React.createClass({
	componentDidMount :  function(){
	    console.log('Connect')  
	},
	render : function(){
		return (
			<div className="row">
				<div className="row col-md-12 col-offset-4 text-center top-buffer">
					<p className="lead" style={style.paragraph}> We need your pocket account to give you insights .</p>
					<a className="btn btn-default" href='/connect/pocket' role='button'> Connect </a>
				</div>
			</div>
		)
	}
});

var style={

	paragraph : {
	}

}

module.exports = ConnectPocket;
