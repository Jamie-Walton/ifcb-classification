import React, { Component } from "react";
import { connect } from "react-redux";
import { Link,  Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
import { goto_classify, goto_notebook, goto_analysis } from "../../actions/menu";

export class Header extends Component {
    static propTypes = {
        auth: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired,
        goto_classify: PropTypes.func.isRequired,
        goto_notebook: PropTypes.func.isRequired,
        goto_analysis: PropTypes.func.isRequired,
    };

    render() {
        const { isAuthenticated, user } = this.props.auth;

        if(this.props.onClassify) {
            return <Redirect to="/classify" />
        } else if(this.props.onNotebook) {
            return <Redirect to="/notebook/" />
        } else if(this.props.onAnalysis) {
            return <Redirect to="/analysis" />
        }

        const authLinks = (
            <ul className="logoutbar">
                <span className='nav-hello'>
                    <strong className='nav-hello'>
                        { user ? `Welcome, ${user.username}` : "" }
                    </strong>
                </span>
                <div className="login-navbar">
                    <li>
                        <button 
                            onClick={this.props.goto_classify}
                            className="login-nav-link">
                                Classify
                        </button>
                    </li>
                    <li>
                        <button  
                            onClick={this.props.goto_notebook}
                            className="login-nav-link">
                                Notebook
                        </button>
                    </li>
                    <li>
                        <button  
                            onClick={this.props.goto_analysis}
                            className="login-nav-link">
                                Analysis
                        </button>
                    </li>
                    <li>
                        <a  
                            href="http://odontella.oceandatacenter.ucsc.edu:8000/admin/"
                            className="login-nav-link">
                                Admin
                        </a>
                    </li>
                </div>
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
    auth: state.auth,
});

export default connect(mapStateToProps, { logout, goto_classify, goto_notebook, goto_analysis })(Header);