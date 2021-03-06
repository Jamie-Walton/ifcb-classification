import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { saveLocation } from "../../actions/auth";
import loader from "./loader.GIF";

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
    <Route 
        {...rest}
        render={props => {
            saveLocation(window.location.pathname);
            if(auth.isLoading) {
                return <img src={loader} alt="Loading..." width="80" loop="infinite"></img>
            } else if(!auth.isAuthenticated) {
                return <Redirect to="/login" />
            } else {
                return <Component {...props} />;
            }
        }}
    />
);

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);