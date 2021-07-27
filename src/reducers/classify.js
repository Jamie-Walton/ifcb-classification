import {
    SAVE_PROGRESS,
    SAVE_SUCCESS,
    BIN_NOTES_LOADED,
} from '../actions/types';

const initialState = {
    isSaving: false,
    notes: [],
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
        case BIN_NOTES_LOADED:
            return {
                ...state,
                notes: action.payload
            }
        default:
            return state;
    }
}