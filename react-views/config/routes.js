import React from "react";
import {Router, Route, IndexRoute, hashHistory} from "react-router";
import Main from "../components/main";
import Home from "../components/home";
import Profile from  "../components/profile";


export default (
	<Router history={hashHistory}>
		<Route path="/" component={Main}>
			<IndexRoute component={Home}></IndexRoute>
			<Route path="profile/:username" component={Profile}></Route>
		</Route>
	</Router>
)

