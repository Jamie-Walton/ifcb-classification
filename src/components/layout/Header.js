import React, { Component } from "react";
import { connect } from "react-redux";
import { Link,  Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
import { goto_home, goto_learn, goto_classify, goto_notebook, goto_analysis } from "../../actions/menu";

export class Header extends Component {
    static propTypes = {
        auth: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        goto_home: PropTypes.func.isRequired,
        goto_learn: PropTypes.func.isRequired,
        goto_classify: PropTypes.func.isRequired,
        goto_notebook: PropTypes.func.isRequired,
        goto_analysis: PropTypes.func.isRequired,
    };

    render() {
        const { isAuthenticated, user } = this.props.auth;
        var pathname;
        {this.props.location ? pathname = this.props.location.pathname : pathname = null}

        if(this.props.onClassify) {
            return <Redirect to="/classify" />
        } else if(this.props.onNotebook) {
            return <Redirect to="/notebook/" />
        } else if(this.props.onAnalysis) {
            return <Redirect to="/analysis" />
        } else if(this.props.onLearn) {
            return <Redirect to="/learn" />
        }
        var authLinks = (
            <ul className="logoutbar">
                <span className='nav-hello'>
                    <strong className='nav-hello'>
                        { user ? `Welcome, ${user.username}` : "" }
                    </strong>
                </span>
                <div className="login-navbar">
                    <li>
                        <button  
                            onClick={this.props.goto_home}
                            className="login-nav-link">
                                Home
                        </button>
                    </li>
                    <li>
                        <button  
                            onClick={this.props.goto_learn}
                            className="login-nav-link">
                                Learn
                        </button>
                    </li>
                    <li>
                        <button  
                            onClick={this.props.goto_classify}
                            className="login-nav-link">
                                Classify
                        </button>
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

        if(this.props.user !== null) {
            if(this.props.user.groups[0] === 1) {
                authLinks = (
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
            } 
        }

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
            <header className={pathname === '/' ? 'home-header' : 'general-header'}>
                <button  
                    onClick={this.props.goto_home}
                    className="h3">
                        IFCB Classification
                </button>
                { isAuthenticated ? authLinks : guestLinks }
            </header>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.auth.user,
    onHome: state.menu.onHome,
});

export default connect(mapStateToProps, { logout, goto_home, goto_learn, goto_classify, goto_notebook, goto_analysis })(Header);