import {
    SAVE_PROGRESS,
    SAVE_SUCCESS,
    SYNC_PROGRESS,
    SYNC_SUCCESS,
    NOTES_CHANGED,
    NOTES_RECORDED,
    NOTEBOOK_FILTERED
} from '../actions/types';

const initialState = {
    isSaving: false,
    isSyncing: false,
    noteChangeFlag: true,
    notes: []
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
        case SYNC_PROGRESS:
            return {
                ...state,
                isSyncing: true
            }
        case SYNC_SUCCESS:
            return {
                ...state,
                isSyncing: false
            }
        case NOTES_CHANGED:
            return {
                ...state,
                noteChangeFlag: true
            }
        case NOTES_RECORDED:
            return {
                ...state,
                noteChangeFlag: false
            }
        case NOTEBOOK_FILTERED:
            return {
                ...state,
                notes: action.payload
            }
        default:
            return state;
    }
}