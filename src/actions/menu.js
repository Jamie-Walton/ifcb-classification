import {
    CLASSIFY_PAGE,
    NOTEBOOK_PAGE,
    ANALYSIS_PAGE,
    CLASSDOWNLOAD_PAGE,
    SEARCH_PAGE,
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

export const goto_analysis = () => (dispatch) => {
    dispatch({
        type: ANALYSIS_PAGE
    });
};

export const goto_classdownload = () => (dispatch) => {
    console.log('Going to Download');
    dispatch({
        type: CLASSDOWNLOAD_PAGE
    });
};

export const goto_search = () => (dispatch) => {
    console.log('Going to Download');
    dispatch({
        type: SEARCH_PAGE
    });
};