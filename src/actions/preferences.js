import axios from "axios";
import { tokenConfig } from './auth';
import { 
    PREFERENCES_LOADED,
    PREFERENCES_ERROR,
    SCALE_CHANGED,
} from "./types";


export const loadPreferences = (username) => (dispatch) => {
    axios
        .get('/preferences/' + username + '/')
        .then(prefRes => {
            dispatch({
                type: PREFERENCES_LOADED,
                payload: prefRes.data
            });
        })
        .catch(err => {
            dispatch({
                type: PREFERENCES_ERROR
            });
        });
}

export const setLoadPreference = (loadPref, username) => (dispatch, getState) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    axios
        .post('/preferences/setload/' + username + '/', JSON.stringify(loadPref), config, tokenConfig(getState))
        .catch((err) => console.log(err));
}

export const setScalePreference = (scale, username) => (dispatch, getState) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    axios
        .post('/preferences/setscale/' + username + '/', JSON.stringify(scale), config, tokenConfig(getState))
        .catch((err) => console.log(err));
}

export const setSortPreference = (sortPref, username) => (dispatch, getState) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    var sort;
    if (sortPref.AZ) {
        sort = 'AZ';
    } else if (sortPref.ZA) {
        sort = 'ZA';
    } else if (sortPref.LS) {
        sort = 'LS';
    } else if (sortPref.SL) {
        sort = 'SL';
    }

    axios
        .post('/preferences/setsort/' + username + '/', JSON.stringify(sort), config, tokenConfig(getState))
        .catch((err) => console.log(err));
}

export const setPhytoGuidePreference = (phytoGuidePref, username) => (dispatch, getState) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    axios
        .post('/preferences/setphytoguide/' + username + '/', JSON.stringify(phytoGuidePref), config, tokenConfig(getState))
        .catch((err) => console.log(err));
}

export const changeScale = (newScale) => (dispatch) => {
    dispatch({
        type: SCALE_CHANGED,
        payload: newScale
    });
}