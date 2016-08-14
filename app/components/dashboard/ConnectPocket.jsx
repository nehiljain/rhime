var React = require('react')


var ConnectPocket = React.createClass({
	componentDidMount :  function(){
	    console.log('Connect')  
	},
	render : function(){
		return (
			<div className="row">
				<div className="row col-md-12 col-offset-4">
					<p style={style.paragraph}> We need your pocket account to give you insights . <a className="btn btn-default" href='/connect/pocket' role='button'> Connect </a></p>
				</div>
			</div>
		)
	}
});

var style={

	paragraph : {
		margin : "50px"
	}

}

module.exports = ConnectPocket;
