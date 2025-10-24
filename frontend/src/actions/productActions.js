import Axios from "axios";
import {
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_ALL_REQUEST,
  PRODUCT_ALL_SUCCESS,
  PRODUCT_ALL_FAIL,
  PRODUCT_CONTEO_RAPIDO_REQUEST,
  PRODUCT_CONTEO_RAPIDO_SUCCESS,
  PRODUCT_CONTEO_RAPIDO_FAIL,
  PRODUCT_CARGARSTOCK_REQUEST,
  PRODUCT_CARGARSTOCK_SUCCESS,
  PRODUCT_CARGARSTOCK_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_SEARCH_REQUEST,
  PRODUCT_SEARCH_SUCCESS,
  PRODUCT_SEARCH_FAIL,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CARGARSTOCKCHACAO_FAIL,
  PRODUCT_CARGARSTOCKCHACAO_SUCCESS,
  PRODUCT_CARGARSTOCKCHACAO_REQUEST,
} from "../constants/productConstants";

export const createProduct =
  (
    codigo,
    categoria,
    ubicacion,
    marca,
    modelo,
    color,
    genero,
    descripcion,
    existencia,
    tallas,
    costousd,
    preciousd,
    cambiodia,
    tipo,
    isPromocion,
    isInstagram,
    textopromocion,
    imageurl
  ) =>
    async (dispatch, getState) => {
      dispatch({ type: PRODUCT_CREATE_REQUEST });
      const {
        userSignin: { userInfo },
      } = getState();
      try {
        const { data } = await Axios.post(
          "/api/productos/create",
          {
            codigo,
            categoria,
            ubicacion,
            marca,
            modelo,
            color,
            genero,
            descripcion,
            existencia,
            tallas,
            costousd,
            preciousd,
            cambiodia,
            tipo,
            isPromocion,
            isInstagram,
            textopromocion,
            imageurl,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );

        dispatch({
          type: PRODUCT_CREATE_SUCCESS,
          payload: data,
        });
      } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        dispatch({ type: PRODUCT_CREATE_FAIL, payload: message });
      }
    };

export const listProducts = () => async (dispatch) => {
  dispatch({
    type: PRODUCT_LIST_REQUEST,
  });
  try {
    const { data } = await Axios.get("/api/productos");

    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
    localStorage.setItem("productos", JSON.stringify(data.productos));
  } catch (error) {
    dispatch({ type: PRODUCT_LIST_FAIL, payload: error.message });
  }
};

export const detailsProduct = (productId) => async (dispatch) => {
  dispatch({ type: PRODUCT_DETAILS_REQUEST, payload: productId });
  try {
    const { data } = await Axios.get(`/api/productos/${productId}`);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const allProducts = () => async (dispatch, getState) => {
  dispatch({ type: PRODUCT_ALL_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get("/api/productos/all", {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PRODUCT_ALL_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: PRODUCT_ALL_FAIL, payload: message });
  }
};

export const conteoRapido = (item) => async (dispatch, getState) => {
  dispatch({ type: PRODUCT_CONTEO_RAPIDO_REQUEST, payload: item });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.put(`/api/productos/conteorapido/${item._id}`, item, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PRODUCT_CONTEO_RAPIDO_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: PRODUCT_CONTEO_RAPIDO_FAIL, error: message });
  }
};

export const cargarStock = () => async (dispatch, getState) => {
  dispatch({ type: PRODUCT_CARGARSTOCK_REQUEST, payload: "algo" });
  const {
    userSignin: { userInfo },
  } = getState();

  try {
    const { data } = await Axios.get("/api/productos/cargarinventario", {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PRODUCT_CARGARSTOCK_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: PRODUCT_CARGARSTOCK_FAIL, error: message });
  }
};

export const updateProduct = (product) => async (dispatch, getState) => {
  dispatch({ type: PRODUCT_UPDATE_REQUEST, payload: product });

  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.put(`/api/productos/${product._id}`, product, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: PRODUCT_UPDATE_FAIL, error: message });
  }
};

export const searchProduct = (productId) => async (dispatch) => {
  dispatch({ type: PRODUCT_SEARCH_REQUEST, payload: productId });
  try {
    const { data } = await Axios.get(`/api/productos/buscardemoda/${productId}`);
    console.log("data", data);
    dispatch({ type: PRODUCT_SEARCH_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_SEARCH_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const cargarStockChacao = (orderItems) => async (dispatch, getState) => {
  dispatch({ type: PRODUCT_CARGARSTOCKCHACAO_REQUEST, payload: orderItems });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.put("/api/productos/cargarstockchacao", orderItems, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PRODUCT_CARGARSTOCKCHACAO_SUCCESS, payload: data });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    dispatch({ type: PRODUCT_CARGARSTOCKCHACAO_FAIL, error: message });
  }
};
