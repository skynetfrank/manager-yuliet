import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
import ProtectedRoute from "./components/ProtectedRoute";
import SigninScreen from "./screens/SigninScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import HomeScreen from "./screens/HomeScreen";
import ReporteClientes from "./reportes/ReporteClientes.jsx";
import ProductEditScreen from "./screens/ProductEditScreen.jsx";
import ClienteEditScreen from "./screens/ClienteEditScreen.jsx";
import ProductListScreen from "./screens/ProductListScreen.jsx";
import Facturacion from "./screens/Facturacion.jsx";
import LinkTree from "./screens/LinkTree.jsx";
import PrintOrder from "./screens/PrintOrder.jsx";
import ProductCreateScreen from "./screens/ProductCreateScreen.jsx";
import UnderConstruction from "./components/UnderConstruction.jsx";
import OrderDetailScreen from "./screens/OrderDetailScreen.jsx";
import OrderListScreen from "./screens/OrderListScreen.jsx";
import ConteoRapido from "./screens/ConteoRapido.jsx";
import ReporteCuadres from "./screens/ReporteCuadres.jsx";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} element={<HomeScreen />}></Route>
      <Route path="/verproductos" element={<ProductListScreen />}></Route>
      <Route path="/verpedidos" element={<OrderListScreen />}></Route>
      <Route path="/signin" element={<SigninScreen />}></Route>
      <Route path="/register" element={<RegisterScreen />}></Route>
      <Route path="" element={<ProtectedRoute />}>
        <Route path="/admin-menu" element={<LinkTree />}></Route>
        <Route path="/profile" element={<ProfileScreen />}></Route>
        <Route path="/reporteclientes" element={<ReporteClientes />}></Route>
        <Route path="/ventasdiarias" element={<ReporteCuadres />}></Route>
      </Route>

      <Route path="/product/:id/edit" element={<ProductEditScreen />}></Route>
      <Route path="/cliente/:id/edit" element={<ClienteEditScreen />}></Route>
      <Route path="/facturacion" element={<Facturacion />}></Route>
      <Route path="/order/:id" element={<OrderDetailScreen />}></Route>
      <Route path="/print/order/:id" element={<PrintOrder />}></Route>
      <Route path="/crearproducto" element={<ProductCreateScreen />}></Route>
      <Route path="/enconstruccion" element={<UnderConstruction />}></Route>
      <Route path="/conteorapido/:id" element={<ConteoRapido />}></Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
