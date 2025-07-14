"use client";

import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X, Trash2 } from "lucide-react";
import * as Yup from "yup";
import {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
} from "@/state/api";
import { toast } from "sonner";

const expenseSchema = Yup.object().shape({
  note: Yup.string().required("Title is required"),
  amount: Yup.number().required("Amount is required"),
  category: Yup.string(),
  timestamp: Yup.date().required("Date is required"),
});

const Expenses = () => {
  const { data: expenses = [], isLoading } = useGetExpensesQuery();
  const [createExpense] = useCreateExpenseMutation();
  const [deleteExpense] = useDeleteExpenseMutation();

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      await deleteExpense(id).unwrap();
      toast.success("Expense deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete expense");
    }
  };

  return (
    <div className="p-6 text-white flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Expenses</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-lg text-white"
        >
          + New Expense
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-zinc-900 text-white border border-zinc-800">
          <thead className="bg-zinc-800 text-zinc-400 text-sm">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : expenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-zinc-400">
                  No expenses found.
                </td>
              </tr>
            ) : (
              expenses.map((exp) => (
                <tr
                  key={exp.id}
                  className="border-t border-zinc-800 text-sm hover:bg-zinc-800/60"
                >
                  <td className="p-3 font-medium">{exp.note}</td>
                  <td className="p-3">
                    {exp.amount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td className="p-3">{exp.category || "—"}</td>
                  <td className="p-3">
                    {new Date(exp.timestamp).toLocaleDateString("en-US")}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => {
                        setExpenseToDelete(exp.id);
                        setDeleteModalOpen(true);
                      }}
                      className="text-red-500 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 inline-block" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
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
                Add New Expense
              </Dialog.Title>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <Formik
              initialValues={{
                note: "",
                amount: 0,
                category: "",
                timestamp: new Date().toISOString().slice(0, 10),
              }}
              validationSchema={expenseSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  await createExpense(values).unwrap();
                  toast.success("Expense added");
                  resetForm();
                  setIsOpen(false);
                } catch (err) {
                  console.error("Error creating expense:", err);
                  toast.error("Failed to add expense");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="flex flex-col gap-4">
                  {/* Title */}
                  <div>
                    <label className="text-sm text-zinc-400">Title</label>
                    <div className="bg-zinc-800 rounded-lg px-4 py-3 mt-1">
                      <Field
                        name="note"
                        placeholder="e.g. Internet Bill"
                        className="bg-transparent w-full outline-none text-white"
                      />
                    </div>
                    <ErrorMessage
                      name="note"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="text-sm text-zinc-400">Amount</label>
                    <div className="bg-zinc-800 rounded-lg px-4 py-3 mt-1">
                      <Field
                        type="number"
                        name="amount"
                        className="bg-transparent w-full outline-none text-white"
                      />
                    </div>
                    <ErrorMessage
                      name="amount"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-sm text-zinc-400">Category</label>
                    <div className="bg-zinc-800 rounded-lg px-4 py-3 mt-1">
                      <Field
                        name="category"
                        placeholder="e.g. Utilities"
                        className="bg-transparent w-full outline-none text-white"
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="text-sm text-zinc-400">Date</label>
                    <div className="bg-zinc-800 rounded-lg px-4 py-3 mt-1">
                      <Field
                        type="date"
                        name="timestamp"
                        className="bg-transparent w-full outline-none text-white"
                      />
                    </div>
                    <ErrorMessage
                      name="timestamp"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-medium text-white disabled:opacity-50"
                  >
                    {isSubmitting ? "Adding..." : "Add Expense"}
                  </button>
                </Form>
              )}
            </Formik>
          </Dialog.Panel>
        </div>
      </Dialog>
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-xl max-w-md w-full space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Confirm Deletion
            </h2>
            <p className="text-sm text-zinc-400">
              Are you sure you want to delete this expense? This action cannot
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
                  if (!expenseToDelete) return;
                  try {
                    await deleteExpense(expenseToDelete).unwrap();
                    toast.success("Expense deleted");
                  } catch (err) {
                    console.error("Delete failed:", err);
                    toast.error("Failed to delete expense");
                  } finally {
                    setDeleteModalOpen(false);
                    setExpenseToDelete(null);
                  }
                }}
                className="px-4 py-2 text-sm bg-red-200 text-red-600 rounded font-medium"
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

export default Expenses;
