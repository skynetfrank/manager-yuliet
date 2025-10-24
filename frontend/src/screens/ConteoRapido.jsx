import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detailsProduct } from "../actions/productActions";
import { Link, useParams } from "react-router";
import dayjs from "dayjs";

import { LucidePrinter } from "lucide-react";

export default function ConteoRapido(props) {
  const params = useParams();
  const { id: productId } = params;

  const ref = useRef("");

  const [total, setTotal] = useState(0);

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const productDetails = useSelector((state) => state.productDetails);
  const { product } = productDetails;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!product || product._id !== productId) {
      dispatch(detailsProduct(productId));
    }
  }, [dispatch, product, productId]);

  const imprimir = () => {
    window.print();
  };

  const sum = () => {
    var elems = document.getElementById("inputs").children;
    let arr1 = [];
    Array.from(elems).forEach(function (element) {
      arr1.push(element.children[0].value);
    });
    setTotal(arr1.reduce((accum, item) => accum + Number(item), 0));
  };

  return (
    <div>
      <div className="flx sb">
        <Link to="/" className="back-link">
          volver
        </Link>
      </div>

      {product ? (
        <div className="flx column">
          <h2>Inversiones Paul 2428, C.A.</h2>
          <h2>Conteo Rapido</h2>
          <p>Realizado por: {userInfo?.nombre + " " + userInfo?.apellido}</p>
          <p>Fecha: {dayjs(new Date()).format("DD/MM/YYYY  hh:mm a")}</p>

          <button className="btn-icon-container" onClick={imprimir}>
            <LucidePrinter />
          </button>

          <div className=" flx column astart mtop-2 mb">
            <h1>Codigo: {product?.codigo}</h1>
            <h1>Marca: {product?.marca}</h1>
            <h1>Modelo: {product?.modelo} </h1>
            <h1>Color: {product?.color} </h1>
          </div>
          <div>
            <h1 className="mb centrado">Contados: {total} pares</h1>
            <table>
              <thead>
                <tr>
                  {Object.keys(product.tallas).map((key, inx) => (
                    <th key={inx}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr id="inputs">
                  {Object.keys(product.tallas).map((key, inx) => {
                    return (
                      <td key={inx}>
                        <input type="number" className="w-40 txt-align-r" onChange={() => sum()} />
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mtop-3">
            <p className="">Observaciones:</p>
            <hr className="minw-400 pad-2"></hr>
            <hr className="minw-400 pad-2"></hr>
            <hr className="minw-400 pad-2"></hr>
            <hr className="minw-400 pad-2"></hr>
            <hr className="minw-400 pad-2"></hr>
            <hr className="minw-400 pad-2"></hr>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
