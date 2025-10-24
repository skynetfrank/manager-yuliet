import {
  REPOSICION_CREATE_FAIL,
  REPOSICION_CREATE_REQUEST,
  REPOSICION_CREATE_RESET,
  REPOSICION_CREATE_SUCCESS,
  REPOSICION_DETAILS_FAIL,
  REPOSICION_DETAILS_REQUEST,
  REPOSICION_DETAILS_SUCCESS,
  REPOSICION_LIST_REQUEST,
  REPOSICION_LIST_SUCCESS,
  REPOSICION_LIST_FAIL,
  REPOSICION_DELETE_REQUEST,
  REPOSICION_DELETE_SUCCESS,
  REPOSICION_DELETE_FAIL,
  REPOSICION_DELETE_RESET,
  REPOSICION_UPDATE_STATUS_REQUEST,
  REPOSICION_UPDATE_STATUS_SUCCESS,
  REPOSICION_UPDATE_STATUS_FAIL,
  REPOSICION_UPDATE_STATUS_RESET,
} from "../constants/reposicionConstants";

export const reposicionCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case REPOSICION_CREATE_REQUEST:
      return { loading: true };
    case REPOSICION_CREATE_SUCCESS:
      console.log("action.payload.reposicion", action.payload.reposicion);
      return { loading: false, success: true, reposicion: action.payload };
    case REPOSICION_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case REPOSICION_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const reposicionDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case REPOSICION_DETAILS_REQUEST:
      return { loading: true };
    case REPOSICION_DETAILS_SUCCESS:
      return { loading: false, reposicion: action.payload.reposicion };
    case REPOSICION_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const reposicionListReducer = (state = { reposiciones: [] }, action) => {
  switch (action.type) {
    case REPOSICION_LIST_REQUEST:
      return { loading: true };
    case REPOSICION_LIST_SUCCESS:
      return {
        loading: false,
        reposiciones: action.payload.reposiciones,
      };
    case REPOSICION_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export const reposicionDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case REPOSICION_DELETE_REQUEST:
      return { loading: true };
    case REPOSICION_DELETE_SUCCESS:
      return { loading: false, success: true };
    case REPOSICION_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case REPOSICION_DELETE_RESET:
      return {};
    default:
      return state;
  }
};

export const reposicionUpdateStatusReducer = (state = {}, action) => {
  switch (action.type) {
    case REPOSICION_UPDATE_STATUS_REQUEST:
      return { loading: true };
    case REPOSICION_UPDATE_STATUS_SUCCESS:
      return { loading: false, success: true };
    case REPOSICION_UPDATE_STATUS_FAIL:
      return { loading: false, error: action.payload };
    case REPOSICION_UPDATE_STATUS_RESET:
      return {};
    default:
      return state;
  }
};
