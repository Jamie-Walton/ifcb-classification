import {
    SAVE_PROGRESS,
    SAVE_SUCCESS
} from '../actions/types';

const initialState = {
    isSaving: false,
}

export default function(state = initialState, action) {
    switch(action.type) {
        case SAVE_PROGRESS:
            return {
                ...state,
                isSaving: true
            }
        case SAVE_SUCCESS:
            return {
                ...state,
                isSaving: false
            }
        default:
            return state;
    }
}