import {
    CLASSIFY_PAGE,
    NOTEBOOK_PAGE
} from '../actions/types';

export const goto_classify = () => (dispatch) => {
    dispatch({
        type: CLASSIFY_PAGE
    });
};

export const goto_notebook = () => (dispatch) => {
    dispatch({
        type: NOTEBOOK_PAGE
    });
};