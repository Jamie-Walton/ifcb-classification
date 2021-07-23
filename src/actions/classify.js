import axios from "axios";
import { tokenConfig } from './auth';
import { SAVE_SUCCESS, SAVE_PROGRESS } from "./types";

export const classifyTarget = (target, timeseries, file, number) => (dispatch, getState) => {
    axios
        .put('/edit/target/' + timeseries + '/' + file + '/' + number + '/', target, tokenConfig(getState))
        .catch((err) => console.log(err));
}

export const classifyRow = (targets, timeseries, file, sort, startInd, endInd) => (dispatch, getState) => {
    axios
        .put('/edit/targetrow/' + timeseries + '/' + file + '/' + sort + '/' + startInd + '/' + endInd + '/', targets, tokenConfig(getState))
        .catch((err) => console.log(err));
}

export const classifyAll = (timeseries, file, set, sort, className, classAbbr) => (dispatch, getState) => {
    axios
        .put('/edit/all/' + timeseries + '/' + file + '/' + set + '/' + sort + '/' + className + '/' + classAbbr + '/', tokenConfig(getState))
        .catch((err) => console.log(err));
}

export const save = (targets, timeseries, file, set, sort) => (dispatch, getState) => {
    dispatch({
        type: SAVE_PROGRESS,
    });
    axios
        .put('/save/' + timeseries + '/' + file + '/' + set + '/' + sort + '/', targets, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: SAVE_SUCCESS,
            });
        })
        .catch((err) => console.log(err));
    return 
}