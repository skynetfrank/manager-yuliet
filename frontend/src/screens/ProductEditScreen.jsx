import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { useGetProductByIdQuery, useUpdateProductMutation, productosApi } from "../api/productosApi";

import {
  listaMarcas,
  listaCategorias,
  listaColores,
  listaGeneros,
  listaModelos,
  listaTallas,
  listaTipos,
} from "../constants/listas";

import Compressor from "compressorjs";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { LucideCheck, LucideFileImage, LucideUploadCloud, LucideLoader, LucideSave } from "lucide-react";

export default function ProductEditScreen(props) {
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;

  const { data: productData, isLoading: isLoadingProduct, isError: isErrorProduct } = useGetProductByIdQuery(id);
  const [
    updateProduct,
    { isLoading: isUpdating, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError },
  ] = useUpdateProductMutation();

  // --- Estado local para manejar el formulario ---
  const [formData, setFormData] = useState({
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
  const dispatch = useDispatch();

  // --- Estados para la subida de imagen ---
  const [imageurl, setImageurl] = useState("");
  const [image, setImage] = useState("");
  const [localUri, setLocalUri] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
    () => (formData ? Object.values(formData.tallas || {}).reduce((acc, val) => acc + (Number(val) || 0), 0) : 0),
    [formData]
  );

  useEffect(() => {
    // Inicializa el estado del formulario cuando los datos del producto se cargan
    if (productData) {
      setFormData({
        codigo: productData.codigo || "",
        categoria: productData.categoria || "CALZADO",
        marca: productData.marca || "",
        modelo: productData.modelo || "",
        color: productData.color || "",
        genero: productData.genero || "",
        preciousd: productData.preciousd || "",
        tipo: productData.tipo || "",
        tallas: productData.tallas || {},
      });
      setImageurl(productData.imageurl || ""); // Sincroniza la URL de la imagen
      setLocalUri(productData.imageurl || null); // Muestra la imagen existente
    }
  }, [productData]);

  useEffect(() => {
    if (!image) {
      return;
    }
    const cargarImagen = () => {
      setIsUploading(true);
      setUploadProgress(0);
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

  useEffect(() => {
    if (isUpdateError) {
      Swal.fire({
        title: "Error al Actualizar",
        text: updateError?.data?.message || "Ocurrió un error.",
        icon: "error",
      });
    }
    if (isUpdateSuccess) {
      Swal.fire({
        title: "Producto Actualizado!",
        text: "La información del producto se ha guardado correctamente.",
        icon: "success",
      }).then(() => {
        navigate("/verproductos");
      });
    }
  }, [isUpdateSuccess, isUpdateError, updateError, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await updateProduct({
        _id: id,
        ...formData,
        existencia,
        imageurl,
      }).unwrap();
      // Limpiar la cache para forzar la recarga de datos en la lista de productos
      dispatch(productosApi.util.invalidateTags(["Product"]));
    } catch (err) {
      console.error("Failed to update product:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTallaChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value === "" ? 0 : Number(value);
    setFormData((prev) => ({
      ...prev,
      tallas: { ...prev.tallas, [name]: numericValue },
    }));
  };

  if (isLoadingProduct) return <div className="loading">Cargando datos del producto...</div>;
  if (isErrorProduct) return <div className="error">Error al cargar la información del producto.</div>;
  if (!formData.codigo) return null; // No renderizar nada hasta que el formulario esté inicializado

  return (
    <>
      <div className="flx column pad-0 jcenter">
        <h2 className="editar pad-05">EDITAR PRODUCTO {formData?.codigo}</h2>
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
                  value={formData.codigo.toUpperCase()}
                  onChange={handleInputChange}
                  disabled // El código no se debe editar
                />
              </div>
              <div className="form-group">
                <label>Precio (USD)</label>
                <input
                  type="number"
                  name="preciousd"
                  required
                  placeholder="Ej: 25.00"
                  value={formData.preciousd}
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
                <select name="categoria" value={formData.categoria} onChange={handleInputChange} required>
                  <option value="">Seleccione...</option>
                  {listaCategorias.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Género</label>
                <select name="genero" value={formData.genero} onChange={handleInputChange} required>
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
                <select name="marca" value={formData.marca} onChange={handleInputChange} required>
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
                <select name="modelo" value={formData.modelo} onChange={handleInputChange} required>
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
                <select name="tipo" value={formData.tipo} onChange={handleInputChange} required>
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
                <select name="color" value={formData.color} onChange={handleInputChange} required>
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
          {(formData.categoria === "CALZADO" || formData.categoria === "TEXTILES") && formData.genero && (
            <div className="form-section w100p">
              <h3>Existencia por Talla ({existencia} unidades)</h3>
              <div className="flx jcenter wrap pad-0" style={{ gap: "0.5rem" }}>
                {keys.map((talla) => {
                  if (formData.categoria === "CALZADO") {
                    if (formData.genero === "Dama" && (Number(talla) < 35 || Number(talla) > 40 || isNaN(talla)))
                      return null;
                    if (formData.genero === "Caballero" && (Number(talla) < 40 || isNaN(talla))) return null;
                    if (formData.genero === "Niño" && (Number(talla) > 35 || isNaN(talla))) return null;
                  }
                  return (
                    <div key={talla} className="edit-span-tallas">
                      <span>{talla}</span>
                      <input
                        type="number"
                        value={formData.tallas[talla] || ""}
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
            <button type="submit" className="signin-button" disabled={isUpdating || isUploading}>
              {isUpdating || isUploading ? <div className="spinner"></div> : <LucideSave />}
              <span>{isUpdating ? "Actualizando..." : "Actualizar Producto"}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
