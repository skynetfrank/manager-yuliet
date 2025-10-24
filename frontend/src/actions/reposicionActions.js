import Axios from "axios";
import {
  REPOSICION_DETAILS_FAIL,
  REPOSICION_DETAILS_REQUEST,
  REPOSICION_DETAILS_SUCCESS,
  REPOSICION_LIST_REQUEST,
  REPOSICION_LIST_SUCCESS,
  REPOSICION_LIST_FAIL,
  REPOSICION_DELETE_REQUEST,
  REPOSICION_DELETE_SUCCESS,
  REPOSICION_DELETE_FAIL,
  REPOSICION_CREATE_SUCCESS,
  REPOSICION_CREATE_FAIL,
  REPOSICION_CREATE_REQUEST,
  REPOSICION_UPDATE_STATUS_REQUEST,
  REPOSICION_UPDATE_STATUS_SUCCESS,
  REPOSICION_UPDATE_STATUS_FAIL,
} from "../constants/reposicionConstants";

export const createReposicion = (reposicion) => async (dispatch, getState) => {
  dispatch({ type: REPOSICION_CREATE_REQUEST, payload: reposicion });
  try {
    const {
      userSignin: { userInfo },
    } = getState();
    const { data } = await Axios.post("/api/reposiciones", reposicion, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });

    dispatch({ type: REPOSICION_CREATE_SUCCESS, payload: data.reposicion });
  } catch (error) {
    dispatch({
      type: REPOSICION_CREATE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const detailsReposicion = (reposicionId) => async (dispatch, getState) => {
  console.log("actions id", reposicionId);
  dispatch({ type: REPOSICION_DETAILS_REQUEST, payload: reposicionId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(`/api/reposiciones/${reposicionId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });

    dispatch({ type: REPOSICION_DETAILS_SUCCESS, payload: data });
    console.log("actions data details", data);
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: REPOSICION_DETAILS_FAIL, payload: message });
  }
};

export const listReposiciones = () => async (dispatch, getState) => {
  dispatch({ type: REPOSICION_LIST_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get("/api/reposiciones", {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: REPOSICION_LIST_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: REPOSICION_LIST_FAIL, payload: message });
  }
};

export const deleteReposicion = (reposicionId) => async (dispatch, getState) => {
  dispatch({ type: REPOSICION_DELETE_REQUEST, payload: reposicionId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = Axios.delete(`/api/reposiciones/${reposicionId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: REPOSICION_DELETE_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: REPOSICION_DELETE_FAIL, payload: message });
  }
};

export const updateReposicionStatus = (reposicionId) => async (dispatch, getState) => {
  dispatch({ type: REPOSICION_UPDATE_STATUS_REQUEST, payload: reposicionId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = Axios.put(
      `/api/reposiciones/${reposicionId}/updatestatus`,
      {},
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    dispatch({ type: REPOSICION_UPDATE_STATUS_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: REPOSICION_UPDATE_STATUS_FAIL, payload: message });
  }
};
