import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_ALL_REQUEST,
  PRODUCT_ALL_SUCCESS,
  PRODUCT_ALL_FAIL,
  PRODUCT_LIST_RESET,
  PRODUCT_CONTEO_RAPIDO_REQUEST,
  PRODUCT_CONTEO_RAPIDO_SUCCESS,
  PRODUCT_CONTEO_RAPIDO_FAIL,
  PRODUCT_CONTEO_RAPIDO_RESET,
  PRODUCT_CARGARSTOCK_REQUEST,
  PRODUCT_CARGARSTOCK_SUCCESS,
  PRODUCT_CARGARSTOCK_FAIL,
  PRODUCT_CARGARSTOCK_RESET,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_RESET,
  PRODUCT_SEARCH_REQUEST,
  PRODUCT_SEARCH_SUCCESS,
  PRODUCT_SEARCH_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_RESET,
  PRODUCT_CARGARSTOCKCHACAO_REQUEST,
  PRODUCT_CARGARSTOCKCHACAO_SUCCESS,
  PRODUCT_CARGARSTOCKCHACAO_FAIL,
  PRODUCT_CARGARSTOCKCHACAO_RESET,
} from "../constants/productConstants";

export const productCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REQUEST:
      return { loading: true };
    case PRODUCT_CREATE_SUCCESS:
      return { loading: false, success: true, product: action.payload };
    case PRODUCT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const productListReducer = (state = { loading: true, productos: [] }, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { loading: true };
    case PRODUCT_LIST_SUCCESS:
      return {
        loading: false,
        productos: action.payload.productos,
      };
    case PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_LIST_RESET:
      return {};
    default:
      return state;
  }
};

export const productDetailsReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { loading: true };
    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload };
    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productAllReducer = (state = { productos: [] }, action) => {
  switch (action.type) {
    case PRODUCT_ALL_REQUEST:
      return { loading: true };
    case PRODUCT_ALL_SUCCESS:
      return {
        loading: false,
        productos: action.payload.productos,
        unidades: action.payload.unidades,
        valor: action.payload.valor,
        categorias: action.payload.categorias,
        stockAG: action.payload.myStockAG[0].totalStockAG,
        stockAG3: action.payload.myStockAG3[0].totalStockAG3,
        stockDM2: action.payload.myStockDM2[0].totalStockDM2,
        stockDM3: action.payload.myStockDM3[0].totalStockDM3,
        stockDM: action.payload.myStockDM[0].totalStockDM,
        stockA: action.payload.myStockA[0].totalStockA,
        stockXZ: action.payload.myStockXZ[0].totalStockXZ,
        stockXZ3: action.payload.myStockXZ3[0].totalStockXZ3,
        textil: action.payload.textiles[0].totalTextil,
      };
    case PRODUCT_ALL_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productConteoRapidoReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CONTEO_RAPIDO_REQUEST:
      return { loading: true };
    case PRODUCT_CONTEO_RAPIDO_SUCCESS:
      return { loading: false, success: true };
    case PRODUCT_CONTEO_RAPIDO_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_CONTEO_RAPIDO_RESET:
      return {};
    default:
      return state;
  }
};

export const productCargaStockReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CARGARSTOCK_REQUEST:
      return { loading: true };
    case PRODUCT_CARGARSTOCK_SUCCESS:
      return {
        loading: false,
        success: true,
        procesados: action.payload.procesados,
      };
    case PRODUCT_CARGARSTOCK_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_CARGARSTOCK_RESET:
      return {};
    default:
      return state;
  }
};

export const productUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_UPDATE_REQUEST:
      return { loading: true };
    case PRODUCT_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case PRODUCT_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

export const productSearchReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_SEARCH_REQUEST:
      return { loading: true };
    case PRODUCT_SEARCH_SUCCESS:
      console.log("payload:", action.payload);
      return {
        loading: false,
        frailes: action.payload.frailesStock,
        chacao: action.payload.chacaoStock,
        merpo: action.payload.merpoStock,
      };
    case PRODUCT_SEARCH_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productCargaStockChacaoReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CARGARSTOCKCHACAO_REQUEST:
      return { loading: true };
    case PRODUCT_CARGARSTOCKCHACAO_SUCCESS:
      return { loading: false, success: true };
    case PRODUCT_CARGARSTOCKCHACAO_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_CARGARSTOCKCHACAO_RESET:
      return {};
    default:
      return state;
  }
};
