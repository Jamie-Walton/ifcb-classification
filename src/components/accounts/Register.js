import React, { Component } from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { register } from "../../actions/auth";
import { goto_home } from "../../actions/menu";

export class Register extends Component {
    state = {
        groups: '',
        username: '',
        email: '',
        password: '',
        password2: '',
        labcode: '',
        correctLabCode: '',
        attempted: false,
        errorMessage: '',
    }

    static propTypes = {
        register: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        goto_home: PropTypes.func,
        registerFailed: PropTypes.bool,
        onRegister: PropTypes.bool,
    };

    componentDidMount() {
        axios
            .get('/labcode/')
            .then((res) => this.setState({ correctLabCode: res.data.code }))
    }

    onSubmit = e => {
        e.preventDefault();
        this.setState({ attempted: true });
        const { groups, username, email, password, password2, labcode } = this.state;
        if(password !== password2) {
            this.setState({ errorMessage: 'Passwords do not match.' });
        } else if(this.state.groups === '') {
            this.setState({ errorMessage: 'No role selected.' });
        } else if(this.state.groups === 'Lab User' && labcode!==this.state.correctLabCode) {
            this.setState({ errorMessage: 'Incorrect lab code.' });
        } else {
            const newUser = {
                groups,
                username,
                email,
                password
            }
            this.props.register(newUser);
        }
    }

    onChange = e => this.setState({ [e.target.name]: e.target.value, attempted: false })

    handleCommunityRole() {
        if (this.state.groups === 'Lab User') {
            const otherButton = document.getElementById('role-scientist-button');
            otherButton.classList.remove('role-button-clicked');
            const otherIcon = document.getElementById('scientist');
            otherIcon.classList.remove('role-scientist-icon-hover');
        }

        this.setState({ groups: 'Public User' });
        const icon = document.getElementById('community');
        const button = document.getElementById('role-community-button');
        const form = document.getElementById('form');
        const text = document.getElementById('role-text');
        const labcode = document.getElementById('labcode');
        
        icon.classList.add('role-community-icon-hover');
        button.classList.toggle('role-button-clicked');
        form.classList.add('show-form');
        text.classList.add('hide');
        labcode.classList.add('hide');
        if(labcode.classList.contains('show-form')) {
            labcode.classList.remove('show-form');
        }
    }

    handleLabRole() {
        if (this.state.groups === 'Public User') {
            const otherButton = document.getElementById('role-community-button');
            otherButton.classList.remove('role-button-clicked');
            const otherIcon = document.getElementById('community');
            otherIcon.classList.remove('role-community-icon-hover');
        }
        this.setState({ groups: 'Lab User' });
        const icon = document.getElementById('scientist');
        const button = document.getElementById('role-scientist-button');
        const form = document.getElementById('form');
        const text = document.getElementById('role-text');
        const labcode = document.getElementById('labcode');
        
        icon.classList.add('role-scientist-icon-hover');
        button.classList.toggle('role-button-clicked');
        form.classList.add('show-form');
        text.classList.add('hide');
        labcode.classList.add('show-form');
    }

    handleRoleHover(user) {
        if (this.state.groups !== 'Public User' && user==='community') {
            const icon = document.getElementById(user);
            icon.classList.toggle('role-' + user + '-icon-hover');
        } else if (this.state.groups !== 'Lab User' && user==='scientist') {
            const icon = document.getElementById(user);
            icon.classList.toggle('role-' + user + '-icon-hover');
        }
    }
    
    render() {

        if(this.props.onHome && !this.props.onRegister) {
            return <Redirect to="/" />
        }

        if(document.getElementById('error')) {
            const error = document.getElementById('error').classList;
            if(this.props.isAuthenticated) {
                return <Redirect to="/classify" />;
            } else if(this.props.registerFailed && this.state.attempted) {
                if (!error.contains('show')) {
                    error.add('show');
                }
            } else {
                if (error.contains('show')) {
                    error.remove('show');
                }
            }
        }
        
        const { username, email, password, password2, labcode } = this.state;
        return (
            <div className='body'>
                <title>IFCB | Register</title>
                <main className="register-main">
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
                    <h2>Welcome.</h2>
                    <p  className='auth-text'>Create an account to start classifying.</p>
                    <p  className='role-text' id='role-text'>Select your role.</p>
                    <div style={{display:'flex'}}>
                        <div className="role-button" id='role-community-button' onMouseEnter={() => this.handleRoleHover('community')} onMouseLeave={() => this.handleRoleHover('community')} onClick={() => this.handleCommunityRole()}>
                            <div className="role-community-icon" id='community'></div>
                            Community Member
                        </div>
                        <div className="role-button extra-margin" id='role-scientist-button' onMouseEnter={() => this.handleRoleHover('scientist')} onMouseLeave={() => this.handleRoleHover('scientist')} onClick={() => this.handleLabRole()}>
                            <div className="role-scientist-icon" id='scientist'></div>
                            Lab Member
                        </div>
                    </div>
                    <form onSubmit={this.onSubmit} className='hide' id='form'>
                        <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            name="username"
                            onChange={this.onChange}
                            value={username}
                            placeholder="Username"
                        />
                        
                        </div>
                        <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            name="email"
                            onChange={this.onChange}
                            value={email}
                            placeholder="Email"
                        />
                        </div>
                        <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            onChange={this.onChange}
                            value={password}
                            placeholder="Password"
                        />
                        </div>
                        <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            name="password2"
                            onChange={this.onChange}
                            value={password2}
                            placeholder="Confirm Password"
                        />
                        </div>
                        <div className="form-group">
                        <input
                            type="text"
                            id="labcode"
                            className="form-control"
                            name="labcode"
                            onChange={this.onChange}
                            value={labcode}
                            placeholder="Lab Code"
                        />
                        </div>
                        <div className="form-group">
                        <p className="error-message" id="error">{this.state.errorMessage}</p>
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
    isAuthenticated: state.auth.isAuthenticated,
    onHome: state.menu.onHome,
    onRegister: state.menu.onRegister,
    registerFailed: state.auth.registerFailed,
 });
 
 export default connect(mapStateToProps, { register, goto_home })(Register);