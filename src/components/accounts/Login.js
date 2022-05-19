import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { login } from "../../actions/auth";
import { goto_home } from "../../actions/menu";

import '../../css/auth-styles.css';


export class Login extends Component {
    state = {
        username: '',
        password: '',
        attempted: false,
    }

    static propTypes = {
        login: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        loginFailed: PropTypes.bool,
        location: PropTypes.string,
        goto_home: PropTypes.func,
        onLogin: PropTypes.bool,
    };

    onSubmit = e => {
        e.preventDefault();
        this.props.login(this.state.username, this.state.password);
        this.setState({ attempted: true });
    }

    onChange = e => this.setState({ 
        [e.target.name]: e.target.value,
        attempted: false
    })

    render() {
        if(document.getElementById('error')) {
            const error = document.getElementById('error').classList;
            if(this.props.isAuthenticated) {
                if(this.props.onLogin) {
                    return <Redirect push to={'/classify'} />
                }
                return <Redirect push to={this.props.location} />
            } else if(this.props.loginFailed && this.state.attempted) {
                if (!error.contains('show')) {
                    error.add('show');
                }
            } else {
                if (error.contains('show')) {
                    error.remove('show');
                }
            }
        }

        if(this.props.onHome) {
            return <Redirect to="/" />
        }
        
        const { username, password } = this.state;
        return (
            <div className='body'>
                <title>IFCB | Login</title>
                <main className="login-main">
                <div className="header">
                    <button  
                        onClick={this.props.goto_home}
                        className="h3">
                            IFCB Classification
                    </button>
                    <ul className="navbar">
                        <li className="nav-item">
                            <Link to="/register" className="nav-link">Register</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/login" className="nav-link">Login</Link>
                        </li>
                    </ul>
                </div>
                <div className="main-container">
                    <div className="sub-container">
                    <h2>Welcome back.</h2>
                    <p className='auth-text'>Sign in to start classifying.</p>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            name="username"
                            onChange={this.onChange}
                            value={username}
                        />
                        <label>Username</label>
                        </div>
                        <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            onChange={this.onChange}
                            value={password}
                        />
                        <label>Password</label>
                        </div>
                        <div className="form-group">
                        <p className="error-message" id="error">Incorrect username or password.</p>
                        <button type="submit" className="login-submit">
                            Login
                        </button>
                        </div>
                    </form>
                    </div>
                </div>
            </main>
            </div>
        );
    }
}

const mapStateToProps = state => ({
   isAuthenticated: state.auth.isAuthenticated,
   loginFailed: state.auth.loginFailed,
   location: state.auth.location,
   onHome: state.menu.onHome,
   onLogin: state.menu.onLogin,
});

export default connect(mapStateToProps, { login, goto_home })(Login);