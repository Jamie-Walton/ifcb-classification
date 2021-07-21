import axios from "axios";
import { tokenConfig } from '../actions/auth';

export const classifyTarget = (target, timeseries, file, number) => (dispatch, getState) => {
    console.log('reached function!')
    axios
        .put('/edit/target/' + timeseries + '/' + file + '/' + number + '/', target, tokenConfig(getState))
        .then(console.log('clik!'))
        .catch((err) => console.log(err));
}