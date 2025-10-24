import Axios from "axios";
import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DELETE_REQUEST,
  ORDER_DELETE_SUCCESS,
  ORDER_DELETE_FAIL,
  ORDER_SUMMARY_REQUEST,
  ORDER_SUMMARY_SUCCESS,
  ORDER_ALL_REQUEST,
  ORDER_ALL_SUCCESS,
  ORDER_ALL_FAIL,
  CUADREDIA_FAIL,
  ORDER_WEEKLY_REQUEST,
  ORDER_WEEKLY_SUCCESS,
  ORDER_WEEKLY_FAIL,
  CUADREDIA_SUCCESS,
  GROUPBYDAY_REQUEST,
  GROUPBYDAY_SUCCESS,
  GROUPBYDAY_FAIL,
  CUADREDIA_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_CONSOLIDADO_REQUEST,
  ORDER_CONSOLIDADO_SUCCESS,
  ORDER_CONSOLIDADO_FAIL,
  ARTICULO_CONSOLIDADO_REQUEST,
  ARTICULO_CONSOLIDADO_SUCCESS,
  ARTICULO_CONSOLIDADO_FAIL,
} from "../constants/orderConstants";

export const createOrder = (order) => async (dispatch, getState) => {
  dispatch({ type: ORDER_CREATE_REQUEST, payload: order });
  try {
    const {
      userSignin: { userInfo },
    } = getState();
    const { data } = await Axios.post("/api/orders", order, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });

    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data.order });
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const detailsOrder = (orderId) => async (dispatch, getState) => {
  dispatch({ type: ORDER_DETAILS_REQUEST, payload: orderId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(`/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: ORDER_DETAILS_FAIL, payload: message });
  }
};

export const deleteOrder = (orderId) => async (dispatch, getState) => {
  dispatch({ type: ORDER_DELETE_REQUEST, payload: orderId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = Axios.delete(`/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: ORDER_DELETE_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: ORDER_DELETE_FAIL, payload: message });
  }
};

export const summaryOrder = () => async (dispatch, getState) => {
  dispatch({ type: ORDER_SUMMARY_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get("/api/orders/summary", {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: ORDER_SUMMARY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const allOrders = () => async (dispatch, getState) => {
  dispatch({ type: ORDER_ALL_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get("/api/orders/cashea", {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: ORDER_ALL_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: ORDER_ALL_FAIL, payload: message });
  }
};

export const groupByDay = () => async (dispatch, getState) => {
  dispatch({ type: GROUPBYDAY_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get("/api/orders/groupedbyday", {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: GROUPBYDAY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GROUPBYDAY_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const cuadreDia = (fecha) => async (dispatch, getState) => {
  dispatch({ type: CUADREDIA_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(`/api/orders/cuadrediario?fecha=${fecha}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: CUADREDIA_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: CUADREDIA_FAIL, payload: message });
  }
};

export const weeklyOrders = (fecha1, fecha2) => async (dispatch, getState) => {
  dispatch({ type: ORDER_WEEKLY_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(`/api/orders/weeklyorders?fecha1=${fecha1}&fecha2=${fecha2}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: ORDER_WEEKLY_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: ORDER_WEEKLY_FAIL, payload: message });
  }
};

export const listOrders = () => async (dispatch, getState) => {
  dispatch({ type: ORDER_LIST_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get("/api/orders", {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: ORDER_LIST_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: ORDER_LIST_FAIL, payload: message });
  }
};

export const consolidadoOrders =
  (fecha1 = "01-01-2024", fecha2 = "31-12-2024") =>
  async (dispatch, getState) => {
    //VENTAS CONSOLIDADAS TODAS LAS SUCURSALES DISPONIBLES
    dispatch({ type: ORDER_CONSOLIDADO_REQUEST });
    const {
      userSignin: { userInfo },
    } = getState();
    try {
      const { data } = await Axios.get(`/api/orders/consolidadoventas?fecha1=${fecha1}&fecha2=${fecha2}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      dispatch({ type: ORDER_CONSOLIDADO_SUCCESS, payload: data });
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;
      dispatch({ type: ORDER_CONSOLIDADO_FAIL, payload: message });
    }
  };

export const consolidadoArticulos =
  (fecha1 = "01-01-2024", fecha2 = "31-12-2024") =>
  async (dispatch, getState) => {
    //VENTAS CONSOLIDADAS TODAS LAS SUCURSALES DISPONIBLES
    console.log("actions fechas:", fecha1, fecha2);
    dispatch({ type: ARTICULO_CONSOLIDADO_REQUEST });
    const {
      userSignin: { userInfo },
    } = getState();
    try {
      const { data } = await Axios.get(`/api/orders/ventasporarticulo?fecha1=${fecha1}&fecha2=${fecha2}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      dispatch({ type: ARTICULO_CONSOLIDADO_SUCCESS, payload: data });
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;
      dispatch({ type: ARTICULO_CONSOLIDADO_FAIL, payload: message });
    }
  };
