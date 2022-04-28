import {
    USER_LOADED,
    USER_LOADING,
    PREFERENCES_LOADED,
    PREFERENCES_ERROR,
    LOCATION_SAVED,
    AUTH_ERROR,
    LOGIN_ATTEMPT,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
} from '../actions/types';


const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loginFailed: false,
    registerFailed: false,
    isLoading: false,
    user: null,
    preferences: {"id": 0, "user": 0, "sort": "AZ", "scale": "0.560", "load": "recent", "phytoguide": true},
    location: window.location.pathname,
    locationCount: 1,
}

export default function(state = initialState, action) {
    switch(action.type) {
        case USER_LOADING:
            return {
                ...state,
                isLoading: true
            }
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload.user,
                preferences: action.payload.preferences,
            };
        case PREFERENCES_LOADED:
            return {
                ...state,
                preferences: action.payload
            };
        case LOCATION_SAVED:
            return {
                ...state,
                location: action.payload
            }
        case LOGIN_ATTEMPT:
            return {
                ...state,
                ...action.payload,
                loginFailed: false
            }
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false
            }
        case PREFERENCES_ERROR:
            console.log('Failed to load user preferences.');
        case AUTH_ERROR:
        case LOGOUT_SUCCESS:
        case REGISTER_FAIL:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                registerFailed: true,
            }
        case REGISTER_FAIL:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false
            }
        case LOGIN_FAIL:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                loginFailed: true,
            }
            
        default:
            return state;
    }
}

