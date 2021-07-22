import axios from "axios";
import { tokenConfig } from '../actions/auth';

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

export const classifyAll = (timeseries, file, className, classAbbr) => (dispatch, getState) => {
    axios
        .put('/edit/all/' + timeseries + '/' + file + '/' + className + '/' + classAbbr + '/', tokenConfig(getState))
        .catch((err) => console.log(err));
}