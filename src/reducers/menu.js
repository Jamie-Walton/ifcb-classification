import {
    CLASSIFY_PAGE,
    NOTEBOOK_PAGE,
    ANALYSIS_PAGE,
    CLASSDOWNLOAD_PAGE,
    SEARCH_PAGE,
} from '../actions/types';

const initialState = {
    onClassify: false,
    onNotebook: false,
    onAnalysis: false,
    onClassDownload: false,
    onSearch: false,
}

export default function(state = initialState, action) {
    switch(action.type) {
        case CLASSIFY_PAGE:
            return {
                ...state,
                onClassify: true,
                onNotebook: false,
                onAnalysis: false,
                onClassDownload: false,
                onSearch: false,
            }
        case NOTEBOOK_PAGE:
            return {
                ...state,
                onClassify: false,
                onNotebook: true,
                onAnalysis: false,
                onClassDownload: false,
                onSearch: false,
            }
        
        case ANALYSIS_PAGE:
            return {
                ...state,
                onClassify: false,
                onNotebook: false,
                onAnalysis: true,
                onClassDownload: false,
                onSearch: false,
            }

        case CLASSDOWNLOAD_PAGE:
            return {
                ...state,
                onClassify: false,
                onNotebook: false,
                onAnalysis: false,
                onClassDownload: true,
                onSearch: false,
            }

        case SEARCH_PAGE:
            return {
                ...state,
                onClassify: false,
                onNotebook: false,
                onAnalysis: false,
                onClassDownload: false,
                onSearch: true,
            }
            
        default:
            return state;
    }
}

