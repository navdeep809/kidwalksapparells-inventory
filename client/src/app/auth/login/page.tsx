"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/state/api";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(4).required("Password is required"),
});

export const Login = () => {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const [error, setError] = useState<string | null>(null);

  return (
    <div className="w-screen min-h-screen place-items-center justify-center items-center flex ">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const res = await login(values).unwrap();

            // Save token
            localStorage.setItem("token", res.token);
            // Optional: save user to context or localStorage
            localStorage.setItem("user", JSON.stringify(res.user));

            // Redirect
            router.push("/dashboard");
          } catch (error: any) {
            setError("Invalid credentials");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-5 max-w-[32rem] w-full p-5 md:bg-zinc-900 text-white md:shadow-md md:rounded-lg">
            <div className="flex flex-col">
              <h2 className="text-3xl font-medium">Inventory System</h2>
              <div className="text-zinc-400 font-medium">
                Sign in to your account to access your inventory dashboard.
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label
                className="text-zinc-500 text-sm font-medium"
                htmlFor="email"
              >
                Email
              </label>
              <div className="flex items-center gap-2 px-4 bg-zinc-800 rounded-lg focus-within:outline outline-indigo-500">
                <Field
                  className="bg-transparent py-4 focus:outline-none w-full placeholder:text-zinc-400"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                />
              </div>
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-400 text-sm"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label
                className="text-zinc-500 text-sm font-medium"
                htmlFor="password"
              >
                Password
              </label>
              <div className="flex items-center gap-2 px-4 bg-zinc-800 rounded-lg focus-within:outline outline-indigo-500">
                <Field
                  className="bg-transparent py-4 focus:outline-none w-full placeholder:text-zinc-400"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                />
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-400 text-sm"
              />
            </div>
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="p-4 bg-indigo-500 text-white rounded-lg font-medium disabled:opacity-50"
            >
              {isSubmitting || isLoading ? "Logging in..." : "Login"}
            </button>

            <p className="text-xs text-zinc-400 text-center">
              Manage your stock, track orders, and streamline your business with
              ease. Sign in to get started!
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
