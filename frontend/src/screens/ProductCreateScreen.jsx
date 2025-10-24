import React, { useEffect, useState, useMemo } from "react";
import { useAddProductMutation } from "../api/productosApi";
import Swal from "sweetalert2";
import Compressor from "compressorjs";
import {
  listaMarcas,
  listaCategorias,
  listaColores,
  listaGeneros,
  listaModelos,
  listaTallas,
  listaTipos,
} from "../constants/listas";
import { useNavigate } from "react-router";
import { LucideCheck, LucideFileImage, LucideUploadCloud, LucideLoader, LucideSave } from "lucide-react";

export default function ProductCreateScreen(props) {
  const navigate = useNavigate();

  // --- Estado unificado para el formulario del producto ---
  const [productData, setProductData] = useState({
    codigo: "",
    categoria: "CALZADO",
    marca: "",
    modelo: "",
    color: "",
    genero: "",
    preciousd: "",
    tipo: "",
    tallas: {},
  });

  // --- Estados para la subida de imagen ---
  const [imageurl, setImageurl] = useState("");
  const [image, setImage] = useState("");
  const [localUri, setLocalUri] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [addProduct, { isLoading, isSuccess, isError, error: addProductError }] = useAddProductMutation();

  const keys = listaTallas.flatMap((valor) => {
    return valor.label;
  });

  // --- Memoización para ordenar las listas una sola vez ---
  const sortedMarcas = useMemo(() => [...listaMarcas].sort(), []);
  const sortedModelos = useMemo(() => [...listaModelos].sort(), []);
  const sortedTipos = useMemo(() => [...listaTipos].sort(), []);
  const sortedColores = useMemo(() => [...listaColores].sort(), []);

  // --- Cálculo de existencia total ---
  const existencia = useMemo(
    () => Object.values(productData.tallas).reduce((acc, val) => acc + (Number(val) || 0), 0),
    [productData.tallas]
  );

  useEffect(() => {
    if (isError) {
      Swal.fire({
        title: "Codigo Ya Existe",
        text: addProductError?.data?.message || "Ocurrió un error al crear el producto.",
        icon: "error",
      });
    }
    if (isSuccess) {
      Swal.fire({
        title: "Producto Creado con Exito!",
        text: "Crear Producto",
        icon: "success",
      }).then((result) => {
        navigate("/verproductos");
      });
    }
  }, [isSuccess, isError, addProductError, navigate]);

  useEffect(() => {
    if (!image) {
      return;
    }
    const cargarImagen = () => {
      setIsUploading(true);
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "ronald_preset");
      data.append("cloud_name", "ronaldimg");
      data.append("folder", "productos");
      fetch("https://api.cloudinary.com/v1_1/ronaldimg/image/upload", {
        method: "post",
        body: data,
      })
        .then((resp) => resp.json())
        .then((data) => {
          setUploadProgress(100);
          setImageurl(data.secure_url);
        })
        .catch((err) => {
          Swal.fire("Error de Carga", "No se pudo subir la imagen a Cloudinary.", "error");
          console.log(err);
        });
    };

    cargarImagen();
  }, [image]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!productData.codigo) {
      Swal.fire({
        title: "Falta el Codigo",
        text: "Crear Producto",
        icon: "warning",
      });
      return;
    }

    if (productData.codigo.length < 5) {
      Swal.fire({
        title: "Codigo Invalido..Verifique",
        text: "Crear Producto",
        icon: "warning",
      });
      return;
    }

    if (!imageurl) {
      Swal.fire({
        title: "Debe Asociar una Imagen al Producto",
        text: "Crear Producto",
        icon: "warning",
      });
      return;
    }

    try {
      await addProduct({
        ...productData,
        existencia,
        imageurl,
      }).unwrap();
    } catch (err) {
      console.error("Fallo al crear el producto:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTallaChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value === "" ? 0 : Number(value);
    setProductData((prev) => {
      const newTallas = { ...prev.tallas, [name]: numericValue };
      // Eliminar la talla si el valor es 0 para mantener el objeto limpio
      if (numericValue === 0) {
        delete newTallas[name];
      }
      return { ...prev, tallas: newTallas };
    });
  };

  return (
    <>
      <div className="flx column pad-0 jcenter">
        <h2 className="editar pad-05">NUEVO PRODUCTO</h2>{" "}
        <form className="signin-form" onSubmit={submitHandler} style={{ maxWidth: "700px", gap: "1.5rem" }}>
          {/* --- Sección de Información Principal --- */}
          <div className="form-section w100p">
            <h3>Información Principal</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Código</label>
                <input
                  type="text"
                  name="codigo"
                  required
                  placeholder="CODIGO"
                  value={productData.codigo.toUpperCase()}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Precio (USD)</label>
                <input
                  type="number"
                  name="preciousd"
                  required
                  placeholder="Ej: 25.00"
                  value={productData.preciousd}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* --- Sección de Clasificación --- */}
          <div className="form-section w100p">
            <h3>Clasificación</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Categoría</label>
                <select name="categoria" value={productData.categoria} onChange={handleInputChange} required>
                  {listaCategorias.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Género</label>
                <select name="genero" value={productData.genero} onChange={handleInputChange} required>
                  <option value="">Seleccione...</option>
                  {listaGeneros.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Marca</label>
                <select name="marca" value={productData.marca} onChange={handleInputChange} required>
                  <option value="">Seleccione...</option>
                  {sortedMarcas.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Modelo</label>
                <select name="modelo" value={productData.modelo} onChange={handleInputChange} required>
                  <option value="">Seleccione...</option>
                  {sortedModelos.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Tipo</label>
                <select name="tipo" value={productData.tipo} onChange={handleInputChange} required>
                  <option value="">Seleccione...</option>
                  {sortedTipos.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Color</label>
                <select name="color" value={productData.color} onChange={handleInputChange} required>
                  <option value="">Seleccione...</option>
                  {sortedColores.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* --- Sección de Existencia por Talla --- */}
          {productData.categoria === "CALZADO" && productData.genero && (
            <div className="form-section w100p">
              <h3>Existencia por Talla ({existencia} unidades)</h3>
              <div className="flx jcenter wrap pad-0" style={{ gap: "0.5rem" }}>
                {keys.map((talla) => {
                  if (productData.categoria === "CALZADO") {
                    if (productData.genero === "Dama" && (Number(talla) < 35 || Number(talla) > 40 || isNaN(talla)))
                      return null;
                    if (productData.genero === "Caballero" && (Number(talla) < 40 || isNaN(talla))) return null;
                    if (productData.genero === "Niño" && (Number(talla) > 35 || isNaN(talla))) return null;
                  }
                  return (
                    <div key={talla} className="edit-span-tallas">
                      <span>{talla}</span>
                      <input
                        type="number"
                        value={productData.tallas[talla] || ""}
                        className="input-talla"
                        name={talla}
                        onChange={handleTallaChange}
                        placeholder="0"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* --- Sección de Imagen --- */}
          <div className="form-section w100p">
            <h3>Imagen del Producto</h3>
            <div className="edit-image-container mb-1 mtop-1">
              <div className="input-file-container" onClick={() => document.querySelector(".input-field").click()}>
                <input
                  type="file"
                  accept="image/*"
                  className="input-field"
                  hidden
                  onChange={({ target: { files } }) => {
                    if (files && files[0]) {
                      new Compressor(files[0], {
                        quality: 0.6,
                        success: (compressedResult) => {
                          setLocalUri(URL.createObjectURL(compressedResult));
                          setImage(compressedResult);
                        },
                      });
                    }
                  }}
                />
                {localUri ? (
                  <img src={localUri} alt="Vista previa" />
                ) : (
                  <div className="upload-icon">
                    <LucideFileImage size={48} color="#888" />
                    <p>Selecciona una imagen</p>
                  </div>
                )}
              </div>
              {isUploading && (
                <div className="upload-img-info">
                  {uploadProgress < 100 ? (
                    <>
                      <LucideLoader className="animate-spin" />
                      <span>Subiendo...</span>
                    </>
                  ) : (
                    <>
                      <LucideCheck color="green" />
                      <span>Imagen Cargada</span>
                    </>
                  )}
                </div>
              )}
              <p className="font-x centrado">Click en el recuadro para seleccionar o cambiar la imagen</p>
            </div>
          </div>

          <div className="form-actions w100p">
            <button type="submit" className="signin-button" disabled={isLoading || isUploading}>
              {isLoading || isUploading ? <div className="spinner"></div> : <LucideSave />}
              <span>{isLoading ? "Guardando..." : "Guardar Producto"}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
