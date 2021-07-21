import React, { Component } from "react";
import { Link } from "react-router-dom";

export class Register extends Component {

    render() {
        return (
            <header>
                <h3>IFCB Classification</h3>
                <ul className="navbar">
                    <li className="nav-item">
                        <Link to="/register" className="nav-link">Register</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/login" className="nav-link">Login</Link>
                    </li>
                </ul>
            </header>
        );
    }
}

export default Register;