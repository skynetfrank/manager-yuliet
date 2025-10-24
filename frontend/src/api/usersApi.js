import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().userSignin.userInfo.token;
      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  endpoints: (build) => ({
    getUsers: build.query({
      query: () => "/users",
    }),
    getVendedores: build.query({
      query: () => "/users/vendedores",
    }),
    getUser: build.query({
      query: (id) => `/user/${id}`,
    }),
    registerUser: build.mutation({
      query: (nombre, rif, email, celular, direccion, canal, timestamp) => ({
        url: "/users/register",
        method: "POST",
        body: {
          nombre,
          rif,
          email,
          celular,
          direccion,
          canal,
          timestamp,
        },
      }),
      invalidatesTags: ["Users"], // Invalidate the 'Users' tag to refetch the list after registration
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetUsersQuery, useGetUserQuery, useRegisterUserMutation,useGetVendedoresQuery } = usersApi;
