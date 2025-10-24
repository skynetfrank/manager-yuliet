import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { productosApi } from "./api/productosApi";
import { clientesApi } from "./api/clientesApi";
import splashReducer from "./slices/splashSlice";

import {
  productDetailsReducer,
  productListReducer,
  productAllReducer,
  productCargaStockReducer,
  productCreateReducer,
} from "./reducers/productReducers";

import {
  userDetailsReducer,
  userListReducer,
  userRegisterReducer,
  userSigninReducer,
  userUpdateProfileReducer,
  userUpdateReducer,
} from "./reducers/userReducers";
import {
  consolidadoArticulosReducer,
  consolidadoOrdersReducer,
  cuadreDiaReducer,
  orderAllReducer,
  orderCreateReducer,
  orderDeleteReducer,
  orderDetailsReducer,
  orderGroupByDayReducer,
  orderListReducer,
  orderSummaryReducer,
  weeklyOrdersReducer,
} from "./reducers/orderReducers";

import {
  clienteDetailsReducer,
  clienteListReducer,
  clienteRegisterReducer,
  clienteUpdateProfileReducer,
} from "./reducers/clienteReducers";


import {
  reposicionCreateReducer,
  reposicionDeleteReducer,
  reposicionDetailsReducer,
  reposicionListReducer,
  reposicionUpdateStatusReducer,
} from "./reducers/reposicionReducers";
import { usersApi } from "./api/usersApi";
import { ordersApi } from "./api/ordersApi";

const preloadedState = {
  userSignin: {
    userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null,
  },


};

// Automatically adds the thunk middleware and the Redux DevTools extension
const store = configureStore({
  // Automatically calls `combineReducers`
  reducer: {
    splash: splashReducer,
    userSignin: userSigninReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userUpdate: userUpdateReducer,
    userList: userListReducer,

    productCreate: productCreateReducer,
    productList: productListReducer,
    productDetails: productDetailsReducer,
    productAll: productAllReducer,
    productCargaStock: productCargaStockReducer,

    orderList: orderListReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderDelete: orderDeleteReducer,
    orderSummary: orderSummaryReducer,
    orderAll: orderAllReducer,
    cuadreDia: cuadreDiaReducer,
    orderGroupDay: orderGroupByDayReducer,
    weeklyOrdersReport: weeklyOrdersReducer,

    clienteDetails: clienteDetailsReducer,
    clienteUpdateProfile: clienteUpdateProfileReducer,
    clienteList: clienteListReducer,
    clienteRegister: clienteRegisterReducer,

    reposicionCreate: reposicionCreateReducer,
    detailsReposicion: reposicionDetailsReducer,
    reposicionList: reposicionListReducer,
    reposicionDelete: reposicionDeleteReducer,
    reposicionUpdateStatus: reposicionUpdateStatusReducer,
    consolidadoOrdersReport: consolidadoOrdersReducer,
    consolidadoArticulosReport: consolidadoArticulosReducer,

    [productosApi.reducerPath]: productosApi.reducer,
    [clientesApi.reducerPath]: clientesApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productosApi.middleware, clientesApi.middleware, usersApi.middleware, ordersApi.middleware),
  preloadedState,
});
setupListeners(store.dispatch);
export default store;
