import {
    CLASSIFY_PAGE,
    NOTEBOOK_PAGE
} from '../actions/types';


const initialState = {
    onClassify: true,
    onNotebook: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case CLASSIFY_PAGE:
            return {
                ...state,
                onClassify: true,
                onNotebook: false
            }
        case NOTEBOOK_PAGE:
            return {
                ...state,
                onClassify: false,
                onNotebook: true
            }
            
        default:
            return state;
    }
}

