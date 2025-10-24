import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const clientesApi = createApi({
  reducerPath: "clienteApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().userSignin.userInfo.token;

      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Cliente"],
  endpoints: (build) => ({
    getClientes: build.query({
      query: () => "/clientes",
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: "Cliente", id: _id })), { type: "Cliente", id: "LIST" }]
          : [{ type: "Cliente", id: "LIST" }],
    }),
    getCliente: build.query({
      query: (id) => `/clientes/${id}`,
      providesTags: (result, error, id) => [{ type: "Cliente", id }],
    }),
    registerCliente: build.mutation({
      query: (newClient) => ({
        url: "/clientes/register",
        method: "POST",
        body: newClient,
      }),
      invalidatesTags: [{ type: "Cliente", id: "LIST" }],
    }),
    updateCliente: build.mutation({
      query: ({ id, ...data }) => ({
        url: `/clientes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Cliente", id },
        { type: "Cliente", id: "LIST" },
      ],
    }),
    getClienteByRif: build.query({
      // Asumo que la ruta en el backend será /api/clientes/rif/:rif
      query: (rif) => `/clientes/rif/${rif}`,
    }),
    deleteCliente: build.mutation({
      query: (id) => ({
        url: `/clientes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Cliente", id }],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetClientesQuery,
  useGetClienteQuery,
  useRegisterClienteMutation,
  useLazyGetClienteQuery,
  useDeleteClienteMutation,
  useUpdateClienteMutation,
  useLazyGetClienteByRifQuery,
} = clientesApi;
