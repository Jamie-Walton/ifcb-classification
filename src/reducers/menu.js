import {
    CLASSIFY_PAGE,
    NOTEBOOK_PAGE,
    ANALYSIS_PAGE,
} from '../actions/types';


const initialState = {
    onClassify: true,
    onNotebook: false,
    onAnalysis: false,
}

export default function(state = initialState, action) {
    switch(action.type) {
        case CLASSIFY_PAGE:
            return {
                ...state,
                onClassify: true,
                onNotebook: false,
                onAnalysis: false,
            }
        case NOTEBOOK_PAGE:
            return {
                ...state,
                onClassify: false,
                onNotebook: true,
                onAnalysis: false,
            }
        
        case ANALYSIS_PAGE:
            return {
                ...state,
                onClassify: false,
                onNotebook: false,
                onAnalysis: true,
            }
            
        default:
            return state;
    }
}

