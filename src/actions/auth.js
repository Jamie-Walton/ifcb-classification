import axios from 'axios';
import {
    USER_LOADED,
    USER_LOADING,
    PREFERENCES_ERROR,
    LOCATION_SAVED,
    AUTH_ERROR,
    LOGIN_ATTEMPT,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL
} from '../actions/types';

// CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
    // User Loading
    dispatch({ type: USER_LOADING });

    axios
        .get('/api/auth/user', tokenConfig(getState))
        .then(userRes => {
            axios
                .get('/preferences/' + userRes.data.username + '/')
                .then(prefRes => {
                    dispatch({
                        type: USER_LOADED,
                        payload: {user: userRes.data, preferences: prefRes.data}
                    });
                })
                .catch(err => {
                    dispatch({
                        type: PREFERENCES_ERROR
                    });
                });
        })
        .catch(err => {
            dispatch({
                type: AUTH_ERROR
            });
        })
}

// SAVE LOCATION
export const saveLocation = (location) => (dispatch) => {
    dispatch({ 
        type: LOCATION_SAVED,
        payload: location
    });
}

// LOGIN USER
export const login = (username, password) => dispatch => {
    
    dispatch({
        type: LOGIN_ATTEMPT
    });
    
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // Request Body
    const body = JSON.stringify({ username, password });

    axios
        .post('/api/auth/login', body, config)
        .then(res => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                type: LOGIN_FAIL
            });
        })
};

// REGISTER USER
export const register = ({ username, password, email }) => dispatch => {
    
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // Request Body
    const body = JSON.stringify({ username, email, password });

    axios
        .post('/api/auth/register', body, config)
        .then(res => {
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch({
                type: REGISTER_FAIL
            });
        })
};

// LOGOUT USER
export const logout = () => (dispatch, getState) => {
    axios
        .post('/api/auth/logout/', null, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: LOGOUT_SUCCESS
            });
        });
};

// Setup config with token (helper function)
export const tokenConfig = getState => {
    
    // Get token from state
    const token = getState().auth.token
    
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // if token, add to headers config
    if(token) {
        config.headers['Authorization'] = `Token ${token}`;
    }

    return config;
}