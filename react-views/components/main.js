import React from 'react';
import ReactDOM from 'react-dom';

class Main extends React.Component {
	render() {
		console.log("Main ");
		return (
			<div>	
				<nav className="navbar navbar-inverse navbar-fixed-top">
      				<div className="container">
				        <div className="navbar-header">
				          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
				            <span className="sr-only">Toggle navigation</span>
				            <span className="icon-bar"></span>
				            <span className="icon-bar"></span>
				            <span className="icon-bar"></span>
				          </button>
				          <a className="navbar-brand" href="#">Project name</a>
				        </div>
      				</div>
    			</nav>
    			<div className="container">
    				<br />
    				<br />
    				<br />
		          {this.props.children}
		        </div>
		    </div>
		)
	}
}



export default Main
//ReactDOM.render(<Main />, document.getElementById('app'));