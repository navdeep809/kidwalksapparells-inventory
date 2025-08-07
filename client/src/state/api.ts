import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Customer,
  CustomerGrowth,
  Expense,
  ExpenseSummary,
  NewExpense,
  NewOrder,
  NewProduct,
  NewPurchase,
  NewUser,
  Order,
  OrderSummary,
  PopularProduct,
  Product,
  Purchase,
  PurchaseSummary,
  SalesSummary,
  User,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: [
    "DashboardMetrics",
    "Products",
    "Users",
    "Customers",
    "Orders",
    "Expenses",
    "Purchases",
  ],
  endpoints: (build) => ({
    login: build.mutation<
      { token: string; user: User },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Sales Summary
    getSalesSummary: build.query<SalesSummary, void>({
      query: () => "/statistics/sales-summary",
      providesTags: ["DashboardMetrics"],
    }),

    // Purchase Summary
    getPurchaseSummary: build.query<PurchaseSummary, void>({
      query: () => "/statistics/purchase-summary",
      providesTags: ["DashboardMetrics"],
    }),

    // Order Summary
    getOrderSummary: build.query<OrderSummary, void>({
      query: () => "/statistics/order-summary",
      providesTags: ["DashboardMetrics"],
    }),

    // Popular Products
    getPopularProducts: build.query<PopularProduct[], void>({
      query: () => "/statistics/popular-products",
      providesTags: ["DashboardMetrics"],
    }),

    // Customer Growth
    getCustomerGrowth: build.query<CustomerGrowth, void>({
      query: () => "/statistics/customer-growth",
      providesTags: ["DashboardMetrics"],
    }),

    // Expense Summary
    getExpenseSummary: build.query<ExpenseSummary, void>({
      query: () => "/statistics/expense-summary",
      providesTags: ["DashboardMetrics"],
    }),

    // PRODUCTS
    getProducts: build.query<Product[], string | void>({
      query: (search) => ({
        url: "/products",
        params: search ? { search } : {},
      }),
      providesTags: ["Products"],
    }),
    getProduct: build.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Products", id }],
    }),
    createProduct: build.mutation<Product, FormData>({
      query: (formData) => ({
        url: "/products",
        method: "POST",
        body: formData, // FormData supports file + fields
      }),
      invalidatesTags: ["Products", "DashboardMetrics"],
    }),
    deleteProduct: build.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products", "DashboardMetrics"],
    }),
    updateProduct: build.mutation<Product, FormData>({
      query: (formData) => {
        const id = formData.get("id");
        return {
          url: `/products/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Products", "DashboardMetrics"],
    }),

    // USERS
    getUsers: build.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    getUser: build.query<User, string>({
      query: (id) => `/users/${id}`,
    }),
    createUser: build.mutation<User, NewUser>({
      query: (user) => ({
        url: "/users",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: build.mutation<User, { userId: string; data: Partial<User> }>({
      query: ({ userId, data }) => ({
        url: `/users/${userId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    // CUSTOMERS
    getCustomers: build.query<Customer[], void>({
      query: () => "/customers",
      providesTags: ["Customers"],
    }),

    getCustomer: build.query<Customer, string>({
      query: (id) => `/customers/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Customers", id }],
    }),
    deleteCustomer: build.mutation<void, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customers"],
    }),

    // PURCHASES
    getPurchases: build.query<Purchase[], void>({
      query: () => "/purchases",
      providesTags: ["Purchases"],
    }),
    createPurchase: build.mutation<Purchase, NewPurchase>({
      query: (purchase) => ({
        url: "/purchases",
        method: "POST",
        body: purchase,
      }),
      invalidatesTags: ["Purchases", "Products", "DashboardMetrics"],
    }),
    deletePurchase: build.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/purchases/${id}`, method: "DELETE" }),
      invalidatesTags: ["Purchases", "Products"],
    }),

    // EXPENSES
    getExpenses: build.query<Expense[], void>({
      query: () => "/expenses",
      providesTags: ["Expenses"],
    }),
    createExpense: build.mutation<Expense, NewExpense>({
      query: (expense) => ({
        url: "/expenses",
        method: "POST",
        body: expense,
      }),
      invalidatesTags: ["Expenses", "DashboardMetrics"],
    }),
    // Delete an expense by ID
    deleteExpense: build.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expenses", "DashboardMetrics"],
    }),

    // ORDERS
    getOrders: build.query<Order[], void>({
      query: () => "/orders",
      providesTags: ["Orders"],
    }),
    getOrder: build.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Orders", id }],
    }),
    createOrder: build.mutation<Order, NewOrder>({
      query: (order) => ({
        url: "/orders",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["Orders", "DashboardMetrics", "Products"],
    }),
    processOrder: build.mutation<Order, string>({
      query: (orderId) => ({
        url: `/orders/process/${orderId}`,
        method: "POST",
      }),
      invalidatesTags: ["Orders", "DashboardMetrics"],
    }),
  }),
});

export const {
  useGetSalesSummaryQuery,
  useGetPurchaseSummaryQuery,
  useGetOrderSummaryQuery,
  useGetPopularProductsQuery,
  useGetCustomerGrowthQuery,
  useGetExpenseSummaryQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetCustomersQuery,
  useDeleteCustomerMutation,
  useGetPurchasesQuery,
  useCreatePurchaseMutation,
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useGetOrdersQuery,
  useCreateOrderMutation,
  useProcessOrderMutation,
  useLoginMutation,
  useGetProductQuery,
  useUpdateProductMutation,
  useDeleteExpenseMutation,
  useGetOrderQuery,
  useGetCustomerQuery,
  useDeletePurchaseMutation,
} = api;
