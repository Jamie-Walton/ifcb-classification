import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import loader from "./loader.GIF";

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
    <Route 
        {...rest}
        render={props => {
            if(auth.isLoading) {
                return <img src={loader} alt="Loading targets..." width="80" loop="infinite"></img>
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