import {
    COMPLAINT_CREATE_REQUEST,
    COMPLAINT_CREATE_SUCCESS,
    COMPLAINT_CREATE_FAIL,
    COMPLAINT_CREATE_RESET,
    COMPLAINT_LIST_REQUEST,
    COMPLAINT_LIST_SUCCESS,
    COMPLAINT_LIST_FAIL,
    COMPLAINT_LIST_RESET,
    COMPLAINT_MY_REQUEST,
    COMPLAINT_MY_SUCCESS,
    COMPLAINT_MY_FAIL,
    COMPLAINT_MY_RESET,
    COMPLAINT_ASSIGNED_REQUEST,
    COMPLAINT_ASSIGNED_SUCCESS,
    COMPLAINT_ASSIGNED_FAIL,
    COMPLAINT_ASSIGNED_RESET,
    COMPLAINT_DETAILS_REQUEST,
    COMPLAINT_DETAILS_SUCCESS,
    COMPLAINT_DETAILS_FAIL,
    COMPLAINT_DETAILS_RESET,
    COMPLAINT_UPDATE_REQUEST,
    COMPLAINT_UPDATE_SUCCESS,
    COMPLAINT_UPDATE_FAIL,
    COMPLAINT_UPDATE_RESET,
    COMPLAINT_FEEDBACK_REQUEST,
    COMPLAINT_FEEDBACK_SUCCESS,
    COMPLAINT_FEEDBACK_FAIL,
    COMPLAINT_FEEDBACK_RESET,
    COMPLAINT_STATS_REQUEST,
    COMPLAINT_STATS_SUCCESS,
    COMPLAINT_STATS_FAIL,
    COMPLAINT_STATS_RESET,
} from "../constants/complaintConstants";

export const complaintCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case COMPLAINT_CREATE_REQUEST:
            return { loading: true };
        case COMPLAINT_CREATE_SUCCESS:
            return { loading: false, success: true, complaint: action.payload };
        case COMPLAINT_CREATE_FAIL:
            return { loading: false, error: action.payload };
        case COMPLAINT_CREATE_RESET:
            return {};
        default:
            return state;
    }
};

export const complaintListReducer = (
    state = { complaints: [], page: 1, pages: 1, total: 0 },
    action
) => {
    switch (action.type) {
        case COMPLAINT_LIST_REQUEST:
            return { loading: true, complaints: [] };
        case COMPLAINT_LIST_SUCCESS:
            return {
                loading: false,
                complaints: action.payload.complaints,
                page: action.payload.page,
                pages: action.payload.pages,
                total: action.payload.total,
            };
        case COMPLAINT_LIST_FAIL:
            return { loading: false, error: action.payload };
        case COMPLAINT_LIST_RESET:
            return { complaints: [], page: 1, pages: 1, total: 0 };
        default:
            return state;
    }
};

export const complaintMyReducer = (state = { complaints: [] }, action) => {
    switch (action.type) {
        case COMPLAINT_MY_REQUEST:
            return { loading: true, complaints: [] };
        case COMPLAINT_MY_SUCCESS:
            return { loading: false, complaints: action.payload };
        case COMPLAINT_MY_FAIL:
            return { loading: false, error: action.payload };
        case COMPLAINT_MY_RESET:
            return { complaints: [] };
        default:
            return state;
    }
};

export const complaintAssignedReducer = (state = { complaints: [] }, action) => {
    switch (action.type) {
        case COMPLAINT_ASSIGNED_REQUEST:
            return { loading: true, complaints: [] };
        case COMPLAINT_ASSIGNED_SUCCESS:
            return { loading: false, complaints: action.payload };
        case COMPLAINT_ASSIGNED_FAIL:
            return { loading: false, error: action.payload };
        case COMPLAINT_ASSIGNED_RESET:
            return { complaints: [] };
        default:
            return state;
    }
};

export const complaintDetailsReducer = (state = { complaint: {} }, action) => {
    switch (action.type) {
        case COMPLAINT_DETAILS_REQUEST:
            return { loading: true, ...state };
        case COMPLAINT_DETAILS_SUCCESS:
            return { loading: false, complaint: action.payload };
        case COMPLAINT_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        case COMPLAINT_DETAILS_RESET:
            return { complaint: {} };
        default:
            return state;
    }
};

export const complaintUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case COMPLAINT_UPDATE_REQUEST:
            return { loading: true };
        case COMPLAINT_UPDATE_SUCCESS:
            return { loading: false, success: true, complaint: action.payload };
        case COMPLAINT_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        case COMPLAINT_UPDATE_RESET:
            return {};
        default:
            return state;
    }
};

export const complaintFeedbackReducer = (state = {}, action) => {
    switch (action.type) {
        case COMPLAINT_FEEDBACK_REQUEST:
            return { loading: true };
        case COMPLAINT_FEEDBACK_SUCCESS:
            return { loading: false, success: true, complaint: action.payload };
        case COMPLAINT_FEEDBACK_FAIL:
            return { loading: false, error: action.payload };
        case COMPLAINT_FEEDBACK_RESET:
            return {};
        default:
            return state;
    }
};

export const complaintStatsReducer = (state = { stats: {} }, action) => {
    switch (action.type) {
        case COMPLAINT_STATS_REQUEST:
            return { loading: true, stats: {} };
        case COMPLAINT_STATS_SUCCESS:
            return { loading: false, stats: action.payload };
        case COMPLAINT_STATS_FAIL:
            return { loading: false, error: action.payload };
        case COMPLAINT_STATS_RESET:
            return { stats: {} };
        default:
            return state;
    }
};
