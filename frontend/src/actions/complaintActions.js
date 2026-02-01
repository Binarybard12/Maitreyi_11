import axios from "axios";
import {
    COMPLAINT_CREATE_REQUEST,
    COMPLAINT_CREATE_SUCCESS,
    COMPLAINT_CREATE_FAIL,
    COMPLAINT_LIST_REQUEST,
    COMPLAINT_LIST_SUCCESS,
    COMPLAINT_LIST_FAIL,
    COMPLAINT_MY_REQUEST,
    COMPLAINT_MY_SUCCESS,
    COMPLAINT_MY_FAIL,
    COMPLAINT_ASSIGNED_REQUEST,
    COMPLAINT_ASSIGNED_SUCCESS,
    COMPLAINT_ASSIGNED_FAIL,
    COMPLAINT_DETAILS_REQUEST,
    COMPLAINT_DETAILS_SUCCESS,
    COMPLAINT_DETAILS_FAIL,
    COMPLAINT_UPDATE_REQUEST,
    COMPLAINT_UPDATE_SUCCESS,
    COMPLAINT_UPDATE_FAIL,
    COMPLAINT_FEEDBACK_REQUEST,
    COMPLAINT_FEEDBACK_SUCCESS,
    COMPLAINT_FEEDBACK_FAIL,
    COMPLAINT_STATS_REQUEST,
    COMPLAINT_STATS_SUCCESS,
    COMPLAINT_STATS_FAIL,
} from "../constants/complaintConstants";

// Create a new complaint
export const createComplaint = (complaintData) => async (dispatch, getState) => {
    try {
        dispatch({ type: COMPLAINT_CREATE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.post("/complaints", complaintData, config);

        dispatch({
            type: COMPLAINT_CREATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: COMPLAINT_CREATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

// Get all complaints (Admin/Warden)
export const listComplaints = (filters = {}) => async (dispatch, getState) => {
    try {
        dispatch({ type: COMPLAINT_LIST_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const queryParams = new URLSearchParams(filters).toString();
        const { data } = await axios.get(`/complaints?${queryParams}`, config);

        dispatch({
            type: COMPLAINT_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: COMPLAINT_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

// Get my complaints (Student)
export const listMyComplaints = () => async (dispatch, getState) => {
    try {
        dispatch({ type: COMPLAINT_MY_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get("/complaints/my", config);

        dispatch({
            type: COMPLAINT_MY_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: COMPLAINT_MY_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

// Get assigned complaints (Staff)
export const listAssignedComplaints = () => async (dispatch, getState) => {
    try {
        dispatch({ type: COMPLAINT_ASSIGNED_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get("/complaints/assigned", config);

        dispatch({
            type: COMPLAINT_ASSIGNED_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: COMPLAINT_ASSIGNED_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

// Get complaint details
export const getComplaintDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: COMPLAINT_DETAILS_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/complaints/${id}`, config);

        dispatch({
            type: COMPLAINT_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: COMPLAINT_DETAILS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

// Update complaint (Assign staff, update status)
export const updateComplaint = (id, updateData) => async (dispatch, getState) => {
    try {
        dispatch({ type: COMPLAINT_UPDATE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.put(`/complaints/${id}`, updateData, config);

        dispatch({
            type: COMPLAINT_UPDATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: COMPLAINT_UPDATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

// Submit feedback
export const submitComplaintFeedback = (id, feedbackData) => async (dispatch, getState) => {
    try {
        dispatch({ type: COMPLAINT_FEEDBACK_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.put(`/complaints/${id}/feedback`, feedbackData, config);

        dispatch({
            type: COMPLAINT_FEEDBACK_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: COMPLAINT_FEEDBACK_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

// Get complaint statistics
export const getComplaintStats = () => async (dispatch, getState) => {
    try {
        dispatch({ type: COMPLAINT_STATS_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get("/complaints/stats/dashboard", config);

        dispatch({
            type: COMPLAINT_STATS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: COMPLAINT_STATS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};
