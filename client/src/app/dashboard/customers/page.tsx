"use client";

import React from "react";
import Link from "next/link";
import { useGetCustomersQuery } from "@/state/api";
import { ArrowRight } from "lucide-react";

const Customers = () => {
  const { data: customers = [], isLoading } = useGetCustomersQuery();

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-zinc-900 text-white border border-zinc-800">
          <thead className="bg-zinc-800 text-zinc-400 text-sm">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Orders</th>
              <th className="p-3 text-left">Joined</th>
              <th className="p-3 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-zinc-400">
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-t border-zinc-800 text-sm hover:bg-zinc-800"
                >
                  <td className="p-3 font-medium">{customer.name || "N/A"}</td>
                  <td className="p-3">{customer.email}</td>
                  <td className="p-3">{customer.phone || "—"}</td>
                  <td className="p-3">{customer?.totalOrders || 0}</td>
                  <td className="p-3">
                    {new Date(customer.createdAt).toLocaleDateString("en-US")}
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/dashboard/customers/${customer.id}`}
                      className="text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      View <ArrowRight className="w-4 h-4" />
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

export default Customers;
