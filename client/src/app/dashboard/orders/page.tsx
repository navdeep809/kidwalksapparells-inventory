"use client";

import { useGetOrdersQuery } from "@/state/api";
import Link from "next/link";

const Order = () => {
  const { data: orders = [], isLoading, error } = useGetOrdersQuery();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-white mb-6">Orders</h1>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-zinc-900 text-white border border-zinc-800">
          <thead className="bg-zinc-800 text-zinc-400 text-sm">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Items</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Payment Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center p-5">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="text-center p-5 text-red-500">
                  Failed to load orders
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-zinc-800 text-sm hover:bg-zinc-800"
                >
                  <td className="p-3">{order.id.slice(-6)}</td>
                  <td className="p-3">{order.customer?.name || "Anonymous"}</td>
                  <td className="p-3">{order.items.length}</td>
                  <td className="p-3">
                    {order.total.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td className="p-3">
                    <span
                      className={`capitalize text-xs px-2 py-1 rounded-md font-semibold ${
                        order.status === "pending"
                          ? "bg-yellow-200 text-yellow-700"
                          : order.status === "processed"
                          ? "bg-green-200 text-green-700"
                          : "bg-zinc-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`capitalize text-xs px-2 py-1 rounded-md font-semibold ${
                        order.paymentStatus === "paid"
                          ? "bg-green-200 text-green-700"
                          : order.paymentStatus === "unpaid"
                          ? "bg-red-200 text-red-700"
                          : "bg-yellow-200 text-yellow-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="text-indigo-500 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;
