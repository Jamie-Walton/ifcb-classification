import {
    CLASSIFY_PAGE,
    NOTEBOOK_PAGE,
    ANALYSIS_PAGE,
    CLASSDOWNLOAD_PAGE
} from '../actions/types';


const initialState = {
    onClassify: true,
    onNotebook: false,
    onAnalysis: false,
    onClassDownload: false,
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
            }
        case NOTEBOOK_PAGE:
            return {
                ...state,
                onClassify: false,
                onNotebook: true,
                onAnalysis: false,
                onClassDownload: false,
            }
        
        case ANALYSIS_PAGE:
            return {
                ...state,
                onClassify: false,
                onNotebook: false,
                onAnalysis: true,
                onClassDownload: false,
            }

        case CLASSDOWNLOAD_PAGE:
            return {
                ...state,
                onClassify: false,
                onNotebook: false,
                onAnalysis: false,
                onClassDownload: true,
            }
            
        default:
            return state;
    }
}

