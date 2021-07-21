import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

export class Header extends Component {
    static propTypes = {
        auth: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired
    };

    render() {
        const { isAuthenticated, user } = this.props.auth;

        const authLinks = (
            <ul className="logoutbar">
                <span className='nav-hello'>
                    <strong className='nav-hello'>
                        { user ? `Welcome, ${user.username}` : "" }
                    </strong>
                </span>
                <li className="nav-item">
                    <button 
                        onClick={this.props.logout} 
                        to="/login" 
                        className="logout">Logout</button>
                </li>
            </ul>
        );

        const guestLinks = (
            <ul className="navbar">
                <li className="nav-item">
                    <Link to="/register" className="nav-link">Register</Link>
                </li>
                <li className="nav-item">
                    <Link to="/login" className="nav-link">Login</Link>
                </li>
            </ul>
        );
        
        return (
            <header>
                <h3>IFCB Classification</h3>
                { isAuthenticated ? authLinks : guestLinks }
            </header>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logout })(Header);