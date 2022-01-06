import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { register } from "../../actions/auth";

export class Register extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        password2: '',
    }

    static propTypes = {
        register: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool
    };

    onSubmit = e => {
        e.preventDefault();
        const { username, email, password, password2 } = this.state;
        if(password !== password2) {
            console.log('Passwords do not match.') // change to UI message
        } else {
            const newUser = {
                username,
                email,
                password
            }
            this.props.register(newUser);
        }
    }

    onChange = e => this.setState({ [e.target.name]: e.target.value })

    render() {
        if(this.props.isAuthenticated) {
            return <Redirect to="/classify" />;
        }
        
        const { username, email, password, password2 } = this.state;
        return (
            <div className='body'>
                <title>IFCB | Register</title>
                <main className="register-main">
                <div className="header">
                    <h3>IFCB Classification</h3>
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
                    <h2>Welcome to Manual Classification.</h2>
                    <p  className='auth-text'>Create an account to start classifying.</p>
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
                            type="text"
                            className="form-control"
                            name="email"
                            onChange={this.onChange}
                            value={email}
                        />
                        <label>Email</label>
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
                        <input
                            type="password"
                            className="form-control"
                            name="password2"
                            onChange={this.onChange}
                            value={password2}
                        />
                        <label>Confirm Password</label>
                        </div>
                        <div className="form-group">
                        <button type="submit" className="register-submit">
                            Create Account
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
    isAuthenticated: state.auth.isAuthenticated 
 });
 
 export default connect(mapStateToProps, { register })(Register);