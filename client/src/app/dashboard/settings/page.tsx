"use client";

import React, { useState } from "react";
import { useGetUsersQuery, useCreateUserMutation } from "@/state/api";
import { Dialog } from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react";
import { toast } from "sonner";

const userSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  role: Yup.string()
    .oneOf(["Admin", "Sales_Person"])
    .required("Role is required"),
  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
});

const Settings = () => {
  const { data: users = [], isLoading } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-6 text-white flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Users</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-lg text-white"
        >
          + New User
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-zinc-900 border border-zinc-800 text-sm">
          <thead className="bg-zinc-800 text-zinc-400">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">ID</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-zinc-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-t border-zinc-800">
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.role.replace("_", " ")}</td>
                  <td className="p-3 text-xs text-zinc-400">{u.id}</td>
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
                New User
              </Dialog.Title>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <Formik
              initialValues={{
                name: "",
                email: "",
                role: "sales_person",
                password: "",
              }}
              validationSchema={userSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  await createUser(values).unwrap();
                  toast.success("User created");
                  resetForm();
                  setIsOpen(false);
                } catch (err: any) {
                  toast.error(err?.data?.error || "Failed to create user");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="text-sm text-zinc-400">Name</label>
                    <Field
                      name="name"
                      placeholder="Name"
                      className="w-full px-3 py-2 bg-zinc-800 rounded outline-none mt-1"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-sm text-red-400"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-sm text-zinc-400">Email</label>
                    <Field
                      name="email"
                      type="email"
                      placeholder="Email"
                      className="w-full px-3 py-2 bg-zinc-800 rounded outline-none mt-1"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm text-red-400"
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="text-sm text-zinc-400">Role</label>
                    <Field
                      name="role"
                      as="select"
                      className="w-full px-3 py-2 bg-zinc-800 rounded outline-none mt-1 capitalize"
                    >
                      <option value="Sales_Person">Sales Person</option>
                      <option value="Admin">Admin</option>
                    </Field>
                    <ErrorMessage
                      name="role"
                      component="div"
                      className="text-sm text-red-400"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-sm text-zinc-400">Password</label>
                    <Field
                      name="password"
                      type="password"
                      placeholder="Password"
                      className="w-full px-3 py-2 bg-zinc-800 rounded outline-none mt-1"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-sm text-red-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg text-white"
                  >
                    {isSubmitting ? "Creating..." : "Create"}
                  </button>
                </Form>
              )}
            </Formik>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Settings;
