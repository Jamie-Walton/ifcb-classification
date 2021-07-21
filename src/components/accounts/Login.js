import React, { Component } from "react";
import { Link } from "react-router-dom";
import '../../css/auth-styles.css';
import Header from '../layout/Header';

export class Login extends Component {
    state = {
        username: '',
        password: '',
    }

    onSubmit = e => {
        e.preventDefault();
        console.log('submit')
    }

    onChange = e => this.setState({ [e.target.name]: e.target.value })

    render() {
        const { username, password } = this.state;
        return (
            <body>
                <main className="login-main">
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
                    <h2>Welcome back.</h2>
                    <p>Sign in to start classifying.</p>
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
                        <button type="submit" className="login-submit">
                            Login
                        </button>
                        </div>
                        <p>
                        </p>
                    </form>
                    </div>
                </div>
            </main>
            </body>
        );
    }
}

export default Login;