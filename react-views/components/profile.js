import React from 'react';
import {Router} from 'react-router';



class Profile extends React.Component {
    render() {
    	console.log(this.props)
        return (
        	<div className="row">
        		<div className="col-md-4">
        			User Profile Component
        		</div>
        		<div className="col-md-8">
        			User Dashboard component 
        		</div>
        	</div>



        )	
    }
}

export default Profile;
