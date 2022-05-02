import {
    CLASSIFY_PAGE,
    NOTEBOOK_PAGE,
    ANALYSIS_PAGE,
    CLASSDOWNLOAD_PAGE,
    SEARCH_PAGE,
    HOME_PAGE,
    LEARN_PAGE,
    REGISTER_PAGE,
    LOGIN_PAGE,
    COMMUNITYREVIEW_PAGE
} from '../actions/types';

const initialState = {
    onHome: false,
    onLearn: false,
    onRegister: false,
    onLogin: false,
    onClassify: false,
    onNotebook: false,
    onAnalysis: false,
    onClassDownload: false,
    onSearch: false,
    onCommunityReview: false,
}

export default function(state = initialState, action) {
    switch(action.type) {
        case HOME_PAGE:
            return {
                ...state,
                onHome: true,
                onLearn: false,
                onRegister: false,
                onLogin: false,
                onClassify: false,
                onNotebook: false,
                onAnalysis: false,
                onClassDownload: false,
                onSearch: false,
                onCommunityReview: false,
            }
        case LEARN_PAGE:
            return {
                ...state,
                onHome: false,
                onLearn: true,
                onRegister: false,
                onLogin: false,
                onClassify: false,
                onNotebook: false,
                onAnalysis: false,
                onClassDownload: false,
                onSearch: false,
                onCommunityReview: false,
            }
        case REGISTER_PAGE:
            return {
                ...state,
                onHome: false,
                onLearn: false,
                onRegister: true,
                onLogin: false,
                onClassify: false,
                onNotebook: false,
                onAnalysis: false,
                onClassDownload: false,
                onSearch: false,
                onCommunityReview: false,
            }
        case LOGIN_PAGE:
            return {
                ...state,
                onHome: false,
                onLearn: false,
                onRegister: false,
                onLogin: true,
                onClassify: false,
                onNotebook: false,
                onAnalysis: false,
                onClassDownload: false,
                onSearch: false,
                onCommunityReview: false,
            }
        case CLASSIFY_PAGE:
            return {
                ...state,
                onHome: false,
                onLearn: false,
                onRegister: false,
                onLogin: false,
                onClassify: true,
                onNotebook: false,
                onAnalysis: false,
                onClassDownload: false,
                onSearch: false,
                onCommunityReview: false,
            }
        case NOTEBOOK_PAGE:
            return {
                ...state,
                onHome: false,
                onLearn: false,
                onRegister: false,
                onLogin: false,
                onClassify: false,
                onNotebook: true,
                onAnalysis: false,
                onClassDownload: false,
                onSearch: false,
                onCommunityReview: false,
            }
        
        case ANALYSIS_PAGE:
            return {
                ...state,
                onHome: false,
                onLearn: false,
                onRegister: false,
                onLogin: false,
                onClassify: false,
                onNotebook: false,
                onAnalysis: true,
                onClassDownload: false,
                onSearch: false,
                onCommunityReview: false,
            }

        case CLASSDOWNLOAD_PAGE:
            return {
                ...state,
                onHome: false,
                onLearn: false,
                onRegister: false,
                onLogin: false,
                onClassify: false,
                onNotebook: false,
                onAnalysis: false,
                onClassDownload: true,
                onSearch: false,
                onCommunityReview: false,
            }

        case SEARCH_PAGE:
            return {
                ...state,
                onHome: false,
                onLearn: false,
                onRegister: false,
                onLogin: false,
                onClassify: false,
                onNotebook: false,
                onAnalysis: false,
                onClassDownload: false,
                onSearch: true,
                onCommunityReview: false,
            }

        case COMMUNITYREVIEW_PAGE:
            return {
                ...state,
                onHome: false,
                onLearn: false,
                onRegister: false,
                onLogin: false,
                onClassify: false,
                onNotebook: false,
                onAnalysis: false,
                onClassDownload: false,
                onSearch: false,
                onCommunityReview: true,
            }
            
        default:
            return state;
    }
}

