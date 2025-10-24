import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const ordersApi = createApi({
  reducerPath: "orderApi",
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
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => "/orders",
      providesTags: ["Order"],
    }),
    getCambio: builder.query({
      query: () => "/orders/cambiobcv",
    }),
    getOrder: builder.query({
      query: (id) => `/orders/${id}`,
    }),
    invalidatesTags: ["Order"],
    createOrder: builder.mutation({
      query: (order) => ({
        url: "/orders",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["Order"],
    }),

    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useDeleteOrderMutation,
  useGetCambioQuery,
  useCreateOrderMutation,
} = ordersApi;
