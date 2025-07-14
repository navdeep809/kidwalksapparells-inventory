"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDeleteCustomerMutation, useGetCustomerQuery } from "@/state/api";
import { ArrowLeft, Mail, Phone, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  processed: "text-green-500 bg-green-500/10",
  pending: "text-yellow-400 bg-yellow-400/10",
  failed: "text-red-500 bg-red-500/10",
};

const paymentColors: Record<string, string> = {
  paid: "text-green-400 bg-green-500/10",
  unpaid: "text-red-400 bg-red-500/10",
};

const CustomerDetails = () => {
  const { customerId } = useParams();

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation();
  const router = useRouter();
  const {
    data: customer,
    isLoading,
    error,
  } = useGetCustomerQuery(customerId as string);

  if (isLoading) return <div className="p-6 text-white">Loading...</div>;
  if (error || !customer)
    return <div className="p-6 text-red-500">Failed to load customer</div>;

  return (
    <div className="p-6 text-white">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">{customer.name}</h1>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
        <div className="text-zinc-400 text-sm">
          Joined:{" "}
          {new Date(customer.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-900 p-4 rounded-lg text-sm">
          <div className="flex items-center gap-2 mb-1 text-zinc-400">
            <Mail className="w-4 h-4" />
            Email
          </div>
          <div className="font-medium">{customer.email || "—"}</div>
        </div>
        <div className="bg-zinc-900 p-4 rounded-lg text-sm">
          <div className="flex items-center gap-2 mb-1 text-zinc-400">
            <Phone className="w-4 h-4" />
            Phone
          </div>
          <div className="font-medium">{customer.phone || "—"}</div>
        </div>
        <div className="bg-zinc-900 p-4 rounded-lg text-sm">
          <div className="flex items-center gap-2 mb-1 text-zinc-400">
            <ShoppingCart className="w-4 h-4" />
            Orders
          </div>
          <div className="font-medium">{customer.orders?.length || 0}</div>
        </div>
      </div>

      {/* Orders */}
      <h2 className="text-xl font-semibold mb-4">Orders</h2>
      {customer.orders?.length === 0 ? (
        <div className="text-zinc-400 text-sm">No orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-zinc-900 text-white border border-zinc-800 text-sm">
            <thead className="bg-zinc-800 text-zinc-400">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Payment</th>
              </tr>
            </thead>
            <tbody>
              {customer?.orders?.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-zinc-800 hover:bg-zinc-800 transition"
                >
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-3">
                    {order.total.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded font-medium capitalize ${
                        statusColors[order.status] || "bg-zinc-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded font-medium capitalize ${
                        paymentColors[order.paymentStatus] || "bg-zinc-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-xl max-w-md w-full space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Confirm Deletion
            </h2>
            <p className="text-sm text-zinc-400">
              Are you sure you want to delete this customer? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-sm bg-zinc-700 text-white rounded font-medium"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteCustomer(customer.id).unwrap();
                    toast.success("Customer deleted");
                    router.push("/dashboard/customers");
                  } catch (err) {
                    console.error(err);
                    toast.error("Failed to delete customer");
                  }
                }}
                disabled={isDeleting}
                className="px-4 py-2 text-sm bg-red-200 text-red-600 rounded font-medium"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
