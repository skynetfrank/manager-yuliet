import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_RESET,
  ORDER_CREATE_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DELETE_REQUEST,
  ORDER_DELETE_SUCCESS,
  ORDER_DELETE_FAIL,
  ORDER_DELETE_RESET,
  ORDER_SUMMARY_REQUEST,
  ORDER_SUMMARY_SUCCESS,
  ORDER_SUMMARY_FAIL,
  ORDER_ALL_REQUEST,
  ORDER_ALL_SUCCESS,
  ORDER_ALL_FAIL,
  ORDER_WEEKLY_FAIL,
  ORDER_WEEKLY_SUCCESS,
  ORDER_WEEKLY_REQUEST,
  CUADREDIA_FAIL,
  CUADREDIA_SUCCESS,
  CUADREDIA_REQUEST,
  GROUPBYDAY_REQUEST,
  GROUPBYDAY_SUCCESS,
  GROUPBYDAY_FAIL,
  ORDER_LIST_FAIL,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_REQUEST,
  ORDER_CONSOLIDADO_REQUEST,
  ORDER_CONSOLIDADO_SUCCESS,
  ORDER_CONSOLIDADO_FAIL,
  ARTICULO_CONSOLIDADO_REQUEST,
  ARTICULO_CONSOLIDADO_SUCCESS,
  ARTICULO_CONSOLIDADO_FAIL,
} from "../constants/orderConstants";

export const orderCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
      return { loading: true };
    case ORDER_CREATE_SUCCESS:
      return { loading: false, success: true, order: action.payload };
    case ORDER_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case ORDER_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const orderDetailsReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
      return { loading: true };
    case ORDER_DETAILS_SUCCESS:
      return { loading: false, order: action.payload };
    case ORDER_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const orderDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_DELETE_REQUEST:
      return { loading: true };
    case ORDER_DELETE_SUCCESS:
      return { loading: false, success: true };
    case ORDER_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case ORDER_DELETE_RESET:
      return {};
    default:
      return state;
  }
};

export const orderSummaryReducer = (state = { loading: true, summary: {} }, action) => {
  switch (action.type) {
    case ORDER_SUMMARY_REQUEST:
      return { loading: true };
    case ORDER_SUMMARY_SUCCESS:
      return { loading: false, summary: action.payload };
    case ORDER_SUMMARY_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const orderAllReducer = (state = { cashea: [] }, action) => {
  switch (action.type) {
    case ORDER_ALL_REQUEST:
      return { loading: true };
    case ORDER_ALL_SUCCESS:
      return {
        loading: false,
        orders: action.payload.cashea,
        resumen: action.payload.resumenCashea[0],
      };
    case ORDER_ALL_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const orderGroupByDayReducer = (state = { loading: true, dailyOrders: {} }, action) => {
  switch (action.type) {
    case GROUPBYDAY_REQUEST:
      return { loading: true };
    case GROUPBYDAY_SUCCESS:
      return { loading: false, dailyOrders: action.payload };
    case GROUPBYDAY_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const cuadreDiaReducer = (
  state = {
    orders: [],
    cash: {},
    puntoPlaza: [],
    puntoVenezuela: [],
    puntoBanesco: [],
  },

  action
) => {
  switch (action.type) {
    case CUADREDIA_REQUEST:
      return { loading: true };
    case CUADREDIA_SUCCESS:
      return {
        loading: false,
        orders: action.payload.orders,
        cash: action.payload.cash[0],
        puntoPlaza: action.payload.puntoPlaza,
        puntoVenezuela: action.payload.puntoVenezuela,
        puntoBanesco: action.payload.puntoBanesco,
      };
    case CUADREDIA_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const weeklyOrdersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ORDER_WEEKLY_REQUEST:
      return { loading: true };
    case ORDER_WEEKLY_SUCCESS:
      return {
        loading: false,
        orders: action.payload.orders,
      };
    case ORDER_WEEKLY_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const orderListReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ORDER_LIST_REQUEST:
      return { loading: true };
    case ORDER_LIST_SUCCESS:
      return {
        loading: false,
        orders: action.payload.orders,
      };
    case ORDER_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const consolidadoOrdersReducer = (state = { ventasGlobales: [] }, action) => {
  switch (action.type) {
    case ORDER_CONSOLIDADO_REQUEST:
      return { loading: true };
    case ORDER_CONSOLIDADO_SUCCESS:
      return {
        loading: false,
        ventasGlobales: action.payload.ventasGlobales,
      };
    case ORDER_CONSOLIDADO_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const consolidadoArticulosReducer = (state = { ventasGlobales: [] }, action) => {
  switch (action.type) {
    case ARTICULO_CONSOLIDADO_REQUEST:
      return { loading: true };
    case ARTICULO_CONSOLIDADO_SUCCESS:
      return {
        loading: false,
        ventasGlobales: action.payload.ventasGlobales,
      };
    case ARTICULO_CONSOLIDADO_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
