import axios from "axios";
import { tokenConfig } from './auth';
import { 
    SAVE_PROGRESS,
    SAVE_SUCCESS,
    SYNC_PROGRESS,
    SYNC_SUCCESS,
    NOTES_CHANGED,
    NOTES_RECORDED,
    REPLY_OPEN,
    REPLY_RESOLVED,
    NOTEBOOK_FILTERED,
    TARGETS_BASIC_SEARCHED,
    BINS_BASIC_SEARCHED
} from "./types";

export const sendNotesChange = () => (dispatch, getState) => {
    dispatch({
        type: NOTES_CHANGED
    });
}

export const receiveNotesChange = () => (dispatch, getState) => {
    dispatch({
        type: NOTES_RECORDED
    });
}

export const sendReplyOpen = () => (dispatch, getState) => {
    dispatch({
        type: REPLY_OPEN
    });
}

export const receiveReplyOpen = () => (dispatch, getState) => {
    dispatch({
        type: REPLY_RESOLVED
    });
}

export const addBinNote = (author, entry, parent, replies, timeseries, ifcb, file, image) => (dispatch, getState) => {
    const note = JSON.stringify({ author, entry, parent, replies, timeseries, ifcb, file, image});
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    axios
        .post('/add/note/', note, config, tokenConfig(getState))
        .catch((err) => console.log(err));
}

export const deleteBinNote = (id) => (dispatch, getState) => {
    axios
        .delete('/delete/note/' + id + '/', tokenConfig(getState))
        .catch((err) => console.log(err));
}

export const flagBinNote = (id) => (dispatch, getState) => {
    axios
        .put('/flag/note/' + id + '/', tokenConfig(getState))
        .catch((err) => console.log(err));
}

export const filterNotebook = (appliedFilters, search) => (dispatch, getState) => {
    const filters = JSON.stringify(appliedFilters, search)
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    axios
        .post('/notebook/applyfilters/', filters, config, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: NOTEBOOK_FILTERED,
                payload: res.data
            });
        })
        .catch((err) => console.log(err));
}

export const searchTargets = (search) => (dispatch, getState) => {
    const searchTerms = JSON.stringify(search)
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    axios
        .post('/searchtargets/', searchTerms, config, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: TARGETS_BASIC_SEARCHED,
                payload: res.data
            });
        })
        .catch((err) => console.log(err));
}

export const getBins = (bins) => (dispatch, getState) => {
    const binIDs = JSON.stringify(bins);
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    axios
        .post('/bins/', binIDs, config, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: BINS_BASIC_SEARCHED,
                payload: res.data
            });
        })
        .catch((err) => console.log(err));
}

export const classifyTarget = (target, timeseries, file, number) => (dispatch, getState) => {
    axios
        .put('/edit/target/' + timeseries + '/' + file + 
            '/' + number + '/', target, tokenConfig(getState))
        .catch((err) => console.log(err));
}

export const classifyRow = (targets, timeseries, file, sort, startInd, endInd) => (dispatch, getState) => {
    axios
        .put('/edit/targetrow/' + timeseries + '/' + file + 
            '/' + sort + '/' + startInd + '/' + endInd + '/', 
            targets, tokenConfig(getState))
        .catch((err) => console.log(err));
}

export const classifyAll = (timeseries, file, set, sort, className, classAbbr) => (dispatch, getState) => {
    axios
        .put('/edit/all/' + timeseries + '/' + file + 
            '/' + set + '/' + sort + '/' + className + 
            '/' + classAbbr + '/', tokenConfig(getState))
        .catch((err) => console.log(err));
}

export const save = (targets, timeseries, file, set, sort) => (dispatch, getState) => {
    dispatch({
        type: SAVE_PROGRESS,
    });
    axios
        .put('/save/' + timeseries + '/' + file + 
            '/' + set + '/' + sort + '/', targets, 
            tokenConfig(getState))
        .then(res => {
            dispatch({
                type: SAVE_SUCCESS,
            });
        })
        .catch((err) => console.log(err));
    return 
}

export const sync = (timeseries, year, day, file) => (dispatch, getState) => {
    dispatch({
        type: SYNC_PROGRESS,
    });
    axios
        .get('sync/' + timeseries + '/' + year + '/' + day + '/' + file + '/')
        .then(res => {
            dispatch({
                type: SYNC_SUCCESS,
            });
        })
        .catch((err) => console.log(err));
    return 
}