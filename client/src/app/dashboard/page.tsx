"use client";

import {
  useGetCustomerGrowthQuery,
  useGetExpenseSummaryQuery,
  useGetOrderSummaryQuery,
  useGetPopularProductsQuery,
  useGetPurchaseSummaryQuery,
  useGetSalesSummaryQuery,
} from "@/state/api";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { data: salesSummary, isLoading: salesLoading } =
    useGetSalesSummaryQuery();
  const { data: purchaseSummary, isLoading: purchaseLoading } =
    useGetPurchaseSummaryQuery();
  const { data: orderSummary, isLoading: orderLoading } =
    useGetOrderSummaryQuery();
  const { data: customerGrowth, isLoading: customerLoading } =
    useGetCustomerGrowthQuery();
  const { data: expenseSummary, isLoading: expenseLoading } =
    useGetExpenseSummaryQuery();
  const { data: popularProducts, isLoading: productLoading } =
    useGetPopularProductsQuery();

  return (
    <div className="p-6 space-y-8 flex-1 text-white">
      <div>
        <h1 className="text-2xl font-medium">Overview</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sales Summary */}
        <div className="bg-zinc-900 p-4 rounded-lg flex flex-col gap-5">
          <div className="text-lg font-semibold">Sales Summary</div>
          {salesLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400 font-semibold">
                  Total Revenue
                </span>
                <span className="font-medium">
                  {salesSummary?.totalRevenue?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400 font-semibold">
                  Total Orders
                </span>
                <span className="font-medium">{salesSummary?.totalOrders}</span>
              </div>
              <hr className="border-zinc-700" />
              <div className="text-sm font-medium text-zinc-300">
                Recent Sales
              </div>
              <div className="flex flex-col gap-2">
                {salesSummary?.recentSales?.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex justify-between items-center"
                  >
                    <div className="font-medium">
                      {sale.total.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </div>
                    <span
                      className={`capitalize text-xs px-2 py-1 rounded-md font-semibold ${
                        sale.paymentStatus === "paid"
                          ? "bg-green-200 text-green-700"
                          : sale.paymentStatus === "unpaid"
                          ? "bg-red-200 text-red-700"
                          : "bg-yellow-200 text-yellow-700"
                      }`}
                    >
                      {sale.paymentStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Purchase Summary */}
        <div className="bg-zinc-900 p-4 rounded-lg flex flex-col gap-5">
          <div className="text-lg font-semibold">Purchase Summary</div>
          {purchaseLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400 font-semibold">
                  Total Purchase Cost
                </span>
                <span className="font-medium">
                  {purchaseSummary?.totalPurchaseCost?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400 font-semibold">
                  Total Purchases
                </span>
                <span className="font-medium">
                  {purchaseSummary?.totalPurchases}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-zinc-900 p-4 rounded-lg flex flex-col gap-5">
          <div className="text-lg font-semibold">Order Summary</div>
          {orderLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400 font-semibold">
                  Total Orders
                </span>
                <span className="font-medium">{orderSummary?.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400 font-semibold">Pending</span>
                <span className="font-medium">{orderSummary?.pending}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400 font-semibold">Processed</span>
                <span className="font-medium">{orderSummary?.processed}</span>
              </div>
            </div>
          )}
        </div>

        {/* Customer Growth */}
        <div className="bg-zinc-900 p-4 rounded-lg flex flex-col gap-5 col-span-1 lg:col-span-2">
          <div className="text-lg font-semibold">Customer Growth</div>
          {customerLoading ? (
            <div>Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={[
                  {
                    name: "Last 7 Days",
                    value: customerGrowth?.last7Days || 0,
                  },
                  {
                    name: "Last 30 Days",
                    value: customerGrowth?.last30Days || 0,
                  },
                ]}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Expense Summary */}
        <div className="bg-zinc-900 p-4 rounded-lg flex flex-col gap-5">
          <div className="text-lg font-semibold">Expense Summary</div>
          {expenseLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400 font-semibold">
                  Total Expenses
                </span>
                <span className="font-medium">
                  {expenseSummary?.total?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </span>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                {expenseSummary?.breakdown.map((item) => (
                  <div key={item.category} className="flex justify-between">
                    <span className="text-zinc-400 font-semibold">
                      {item.category}
                    </span>
                    <span className="font-medium">
                      {(item._sum.amount || 0).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Popular Products */}
        <div className="bg-zinc-900 p-4 rounded-lg flex flex-col gap-5 col-span-1 lg:col-span-2">
          <div className="text-lg font-semibold">Popular Products</div>
          {productLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-2 text-sm">
              {popularProducts?.map((item, index) => (
                <div
                  key={item.product.id}
                  className="flex justify-between items-center gap-2"
                >
                  <div className="w-10 aspect-square rounded-full overflow-hidden">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-medium">{item.product.name}</span>
                    <span className="text-zinc-400 text-xs">
                      SKU: {item.product.sku}
                    </span>
                  </div>
                  <div className="font-semibold">{item.sold} sold</div>
                  <div className="font-semibold text-zinc-500">
                    {item.product.stockQuantity} Left
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
