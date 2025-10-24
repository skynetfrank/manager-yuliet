import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const productosApi = createApi({
  reducerPath: "productosApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().userSignin.userInfo.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/productos",
      providesTags: ["Product"],
    }),
    getProductById: builder.query({
      query: (id) => `/productos/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    getProductByCode: builder.query({
      query: (codigo) => `/productos/buscarporcodigo/${codigo}`,
    }),
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/productos",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: (producto) => ({
        url: `/productos/${producto._id}`,
        method: "PUT",
        body: producto,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/productos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductByCodeQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useLazyGetProductByCodeQuery,
} = productosApi;
