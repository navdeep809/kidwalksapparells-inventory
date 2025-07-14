"use client";

import React, { useState } from "react";
import {
  useGetPurchasesQuery,
  useCreatePurchaseMutation,
  useDeletePurchaseMutation,
  useGetProductsQuery,
} from "@/state/api";
import { Dialog } from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { X, Trash2 } from "lucide-react";
import { toast } from "sonner";

const schema = Yup.object().shape({
  productId: Yup.string().required("Product is required"),
  quantity: Yup.number().required("Quantity is required"),
  unitCost: Yup.number().required("Unit cost is required"),
  note: Yup.string(),
  timestamp: Yup.date().required("Date is required"),
});

const Purchases = () => {
  const { data: purchases = [], isLoading } = useGetPurchasesQuery();
  const { data: products = [] } = useGetProductsQuery();
  const [createPurchase] = useCreatePurchaseMutation();
  const [deletePurchase] = useDeletePurchaseMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div className="p-6 text-white flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Purchases</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-lg text-white"
        >
          + New Purchase
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-zinc-900 border border-zinc-800 text-sm">
          <thead className="bg-zinc-800 text-zinc-400">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Unit Cost</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Note</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : purchases.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-zinc-400">
                  No purchases found.
                </td>
              </tr>
            ) : (
              purchases.map((p) => (
                <tr key={p.id} className="border-t border-zinc-800">
                  <td className="p-3">{p.product?.name || "—"}</td>
                  <td className="p-3">{p.quantity}</td>
                  <td className="p-3">
                    {p.unitCost.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td className="p-3">
                    {p.totalCost.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td className="p-3">{p.note || "—"}</td>
                  <td className="p-3">
                    {new Date(p.timestamp).toLocaleDateString("en-US")}
                  </td>
                  <td className="p-3">
                    <button onClick={() => setDeleteId(p.id)}>
                      <Trash2 className="w-4 h-4 text-red-500 hover:text-red-400" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-zinc-900 p-6 text-white shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold">
                New Purchase
              </Dialog.Title>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <Formik
              initialValues={{
                productId: "",
                quantity: 1,
                unitCost: 0,
                note: "",
                timestamp: new Date().toISOString().slice(0, 10),
              }}
              validationSchema={schema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  await createPurchase(values).unwrap();
                  toast.success("Purchase added");
                  resetForm();
                  setIsOpen(false);
                } catch (err) {
                  toast.error("Error adding purchase");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  {/* Product Dropdown */}
                  <div>
                    <label className="text-sm text-zinc-400">Product</label>
                    <Field
                      as="select"
                      name="productId"
                      className="w-full px-3 py-2 bg-zinc-800 rounded mt-1"
                    >
                      <option value="">Select a product</option>
                      {products.map((prod) => (
                        <option key={prod.id} value={prod.id}>
                          {prod.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="productId"
                      component="div"
                      className="text-sm text-red-400"
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="text-sm text-zinc-400">Quantity</label>
                    <Field
                      name="quantity"
                      type="number"
                      className="w-full px-3 py-2 bg-zinc-800 rounded mt-1"
                    />
                    <ErrorMessage
                      name="quantity"
                      component="div"
                      className="text-sm text-red-400"
                    />
                  </div>

                  {/* Unit Cost */}
                  <div>
                    <label className="text-sm text-zinc-400">Unit Cost</label>
                    <Field
                      name="unitCost"
                      type="number"
                      className="w-full px-3 py-2 bg-zinc-800 rounded mt-1"
                    />
                    <ErrorMessage
                      name="unitCost"
                      component="div"
                      className="text-sm text-red-400"
                    />
                  </div>

                  {/* Note */}
                  <div>
                    <label className="text-sm text-zinc-400">Note</label>
                    <Field
                      name="note"
                      className="w-full px-3 py-2 bg-zinc-800 rounded mt-1"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="text-sm text-zinc-400">Date</label>
                    <Field
                      type="date"
                      name="timestamp"
                      className="w-full px-3 py-2 bg-zinc-800 rounded mt-1"
                    />
                    <ErrorMessage
                      name="timestamp"
                      component="div"
                      className="text-sm text-red-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg text-white"
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </Form>
              )}
            </Formik>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-xl max-w-md w-full space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Confirm Deletion
            </h2>
            <p className="text-sm text-zinc-400">
              Are you sure you want to delete this purchase? Stock will be
              reduced.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-zinc-700 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await deletePurchase(deleteId).unwrap();
                    toast.success("Purchase deleted");
                  } catch {
                    toast.error("Failed to delete purchase");
                  } finally {
                    setDeleteId(null);
                  }
                }}
                className="px-4 py-2 bg-red-200 text-red-600 rounded"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchases;
