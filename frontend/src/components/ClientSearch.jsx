import Swal from "sweetalert2";
import { useLazyGetClienteByRifQuery } from "../api/clientesApi";
import { forwardRef, useImperativeHandle } from "react";

const ClientSearch = forwardRef(({ onClientFound, onNewClient, onCancel }, ref) => {
  const [triggerClientSearch] = useLazyGetClienteByRifQuery();

  const handleBuscarCliente = async () => {
    try {
      const { value: identificacion } = await Swal.fire({
        title: "RIF o Cedula",
        input: "text",
        inputPlaceholder: "Ejemplo: V999999999 - J999999999",
        showCancelButton: true,
        confirmButtonText: "Buscar",
        cancelButtonText: "Cancelar",
        inputValidator: (value) => {
          if (!value) {
            return "Debe ingresar Cedula o RIF";
          }
          const id = value.trim().toUpperCase();
          const firstLetter = id.charAt(0);
          const isRif = firstLetter === "J" || firstLetter === "G";
          const isCedula = firstLetter === "V" || firstLetter === "E";

          if (isRif) {
            if (!/^[JG][0-9]{9}$/.test(id)) {
              return "Formato de RIF incorrecto. Debe ser J o G seguido de 9 dígitos.";
            }
          } else if (isCedula) {
            if (!/^[VE][0-9]{6,8}$/.test(id)) {
              return "Formato de Cédula incorrecto. Debe ser V o E seguido de 6 a 8 dígitos.";
            }
          } else {
            return "El identificador debe comenzar con V, E, J o G.";
          }
        },
      });

      if (identificacion) {
        const { data, error } = await triggerClientSearch(identificacion.toUpperCase());

        if (data) {
          // Cliente encontrado
          Swal.fire({
            title: `${data.nombre + " - " + data.rif}`,
            icon: "success",
            confirmButtonText: "OK",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
          }).then((result) => {
            if (result.isConfirmed) {
              onClientFound(data);
            } else {
              onCancel();
            }
          });
        }
        if (error) {
          // Captura 404 y otros errores de la API
          Swal.fire({
            title: "Cliente No Encontrado",
            icon: "error",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Agregar",
          }).then((result) => {
            if (result.isConfirmed) {
              onNewClient(identificacion.toUpperCase());
            } else {
              onCancel();
            }
          });
        } else if (!data) {
          // Estado inesperado si no hay datos ni error
          console.error("Respuesta inesperada de la API: ni datos ni error.");
          Swal.fire("Error Inesperado", "No se recibió respuesta del servidor.", "error");
          onCancel();
        }
      } else {
        // Usuario canceló la operación
        onCancel();
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error durante la búsqueda " + error,
        icon: "error",
        confirmButtonText: "OK",
      });
      onCancel();
    }
  };

  // Exponer la función `handleBuscarCliente` al componente padre a través de la ref
  useImperativeHandle(ref, () => ({
    show: handleBuscarCliente,
  }));
  // Este componente no renderiza nada visible por sí mismo
  return null;
});

export default ClientSearch;
