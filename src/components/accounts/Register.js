import React, { Component } from "react";
import { Link } from "react-router-dom";

export class Register extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        password2: '',
    }

    onSubmit = e => {
        e.preventDefault();
        console.log('submit')
    }

    onChange = e => this.setState({ [e.target.name]: e.target.value })

    render() {
        const { username, email, password, password2 } = this.state;
        return (
            <body>
                <main className="register-main">
                <div className="header">
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
                    <p>Create an account to start classifying.</p>
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

export default Register;