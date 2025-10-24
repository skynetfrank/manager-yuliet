import {
  CLIENTE_DELETE_FAIL,
  CLIENTE_DELETE_REQUEST,
  CLIENTE_DELETE_RESET,
  CLIENTE_DELETE_SUCCESS,
  CLIENTE_DETAILS_FAIL,
  CLIENTE_DETAILS_REQUEST,
  CLIENTE_DETAILS_RESET,
  CLIENTE_DETAILS_SUCCESS,
  CLIENTE_LIST_FAIL,
  CLIENTE_LIST_REQUEST,
  CLIENTE_LIST_SUCCESS,
  CLIENTE_REGISTER_FAIL,
  CLIENTE_REGISTER_REQUEST,
  CLIENTE_REGISTER_SUCCESS,
  CLIENTE_UPDATE_PROFILE_FAIL,
  CLIENTE_UPDATE_PROFILE_REQUEST,
  CLIENTE_UPDATE_PROFILE_RESET,
  CLIENTE_UPDATE_PROFILE_SUCCESS,
  CLIENTE_REGISTER_RESET,
  CLIENTE_GETBYRIF_REQUEST,
  CLIENTE_GETBYRIF_SUCCESS,
  CLIENTE_GETBYRIF_FAIL,
  CLIENTE_GETBYRIF_RESET,
  CLIENTE_LIST_RESET,
} from "../constants/clienteConstants";

export const clienteRegisterReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case CLIENTE_REGISTER_REQUEST:
      return { loading: true };
    case CLIENTE_REGISTER_SUCCESS:
      return { loading: false, cliente: action.payload };
    case CLIENTE_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    case CLIENTE_REGISTER_RESET:
      return {};
    default:
      return state;
  }
};

export const clienteDetailsReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case CLIENTE_DETAILS_REQUEST:
      return { loading: true };
    case CLIENTE_DETAILS_SUCCESS:
      return { loading: false, cliente: action.payload };
    case CLIENTE_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case CLIENTE_DETAILS_RESET:
      return {};
    default:
      return state;
  }
};

export const clienteUpdateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case CLIENTE_UPDATE_PROFILE_REQUEST:
      return { loading: true };
    case CLIENTE_UPDATE_PROFILE_SUCCESS:
      return { loading: false, success: true };
    case CLIENTE_UPDATE_PROFILE_FAIL:
      return { loading: false, error: action.payload };
    case CLIENTE_UPDATE_PROFILE_RESET:
      return {};
    default:
      return state;
  }
};

export const clienteListReducer = (state = { clientes: [] }, action) => {
  switch (action.type) {
    case CLIENTE_LIST_REQUEST:
      return { loading: true };
    case CLIENTE_LIST_SUCCESS:
      return {
        loading: false,
        clientes: action.payload.clientes,
      };
    case CLIENTE_LIST_FAIL:
      return { loading: false, error: action.payload };
    case CLIENTE_LIST_RESET:
      return {};
    default:
      return state;
  }
};
export const clienteDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case CLIENTE_DELETE_REQUEST:
      return { loading: true };
    case CLIENTE_DELETE_SUCCESS:
      return { loading: false, success: true };
    case CLIENTE_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case CLIENTE_DELETE_RESET:
      return {};
    default:
      return state;
  }
};

export const clienteGetByRifReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case CLIENTE_GETBYRIF_REQUEST:
      return { loading: true };
    case CLIENTE_GETBYRIF_SUCCESS:
      return { loading: false, success: true, cliente: action.payload };
    case CLIENTE_GETBYRIF_FAIL:
      return { loading: false, error: action.payload };
    case CLIENTE_GETBYRIF_RESET:
      return { error: false, product: {} };
    default:
      return state;
  }
};
