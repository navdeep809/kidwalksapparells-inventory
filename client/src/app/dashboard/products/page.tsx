"use client";

import { useGetProductsQuery, useCreateProductMutation } from "@/state/api";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const productSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  sku: Yup.string().required("SKU is required"),
  category: Yup.string(),
  description: Yup.string(),
  price: Yup.number().required("Price is required"),
  stockQuantity: Yup.number().required("Stock is required"),
  imageFile: Yup.mixed().required("Product image is required"),
});

const Product = () => {
  const { data: products = [], isLoading } = useGetProductsQuery();
  const [createProduct] = useCreateProductMutation();

  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">Products</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-500"
        >
          + New Product
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-zinc-900 text-white border border-zinc-800">
          <thead className="bg-zinc-800 text-zinc-400 text-sm">
            <tr>
              <th className="p-3 text-left"></th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">SKU</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-5 text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  onClick={() =>
                    router.push(`/dashboard/products/${product.id}`)
                  }
                  className="border-t border-zinc-800 text-sm hover:bg-zinc-800 cursor-pointer"
                >
                  <td className="p-3">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 aspect-square object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-10 aspect-square bg-zinc-700 rounded-md flex items-center justify-center text-xs text-zinc-400">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-medium">{product.name}</td>
                  <td className="p-3">{product.sku}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">
                    {product.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td className="p-3">{product.stockQuantity}</td>
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
        <div className="fixed inset-0 flex items-center justify-center p-4 ">
          <Dialog.Panel className="w-full max-w-xl rounded-lg bg-zinc-900 p-6 text-white shadow-xl max-h-screen overflow-y-scroll">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold">
                Add New Product
              </Dialog.Title>
              <button onClick={() => setIsOpen(false)}>
                <X className="text-white w-5 h-5" />
              </button>
            </div>

            <Formik
              initialValues={{
                name: "",
                sku: "",
                category: "",
                description: "",
                price: 0,
                stockQuantity: 0,
                imageFile: null,
              }}
              validationSchema={productSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                const formData = new FormData();
                formData.append("name", values.name);
                formData.append("sku", values.sku);
                formData.append("price", values.price.toString());
                formData.append(
                  "stockQuantity",
                  values.stockQuantity.toString()
                );
                formData.append("category", values.category);
                formData.append("description", values.description);
                if (values.imageFile) {
                  formData.append("image", values.imageFile); // "image" must match multer field name
                }

                try {
                  await createProduct(formData).unwrap();
                  resetForm();
                  toast.success("Product Created");
                  setIsOpen(false);
                } catch (err) {
                  toast.success("Product creation error");
                  console.error("Create error", err);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label
                      className="text-zinc-500 text-sm font-medium"
                      htmlFor="imageFile"
                    >
                      Product Image
                    </label>
                    <input
                      name="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        setFieldValue(
                          "imageFile",
                          event.currentTarget.files?.[0]
                        );
                      }}
                      className="bg-zinc-800 text-white file:bg-indigo-600 file:text-white file:px-4 file:py-2 file:rounded-lg file:border-0 px-4 py-2 rounded-lg"
                    />
                    <ErrorMessage
                      name="imageFile"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                    {values.imageFile && (
                      <img
                        src={URL.createObjectURL(values.imageFile)}
                        alt="Preview"
                        className="w-20 h-20 mt-2 rounded object-cover"
                      />
                    )}
                  </div>
                  {/* Name */}
                  <div>
                    <label className="text-sm text-zinc-400">Name</label>
                    <div className="bg-zinc-800 rounded-lg px-4 py-3 mt-1 focus-within:outline outline-indigo-500">
                      <Field
                        name="name"
                        placeholder="Product name"
                        className="bg-transparent w-full outline-none text-white"
                      />
                    </div>
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-400 text-sm"
                    />
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="text-sm text-zinc-400">SKU</label>
                    <div className="bg-zinc-800 rounded-lg px-4 py-3 mt-1 focus-within:outline outline-indigo-500">
                      <Field
                        name="sku"
                        placeholder="Unique SKU"
                        className="bg-transparent w-full outline-none text-white"
                      />
                    </div>
                    <ErrorMessage
                      name="sku"
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
                        placeholder="e.g. Shoes"
                        className="bg-transparent w-full outline-none text-white"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-sm text-zinc-400">Description</label>
                    <div className="bg-zinc-800 rounded-lg px-4 py-3 mt-1">
                      <Field
                        as="textarea"
                        name="description"
                        rows={2}
                        placeholder="Product description..."
                        className="bg-transparent w-full outline-none text-white"
                      />
                    </div>
                  </div>

                  {/* Price and Stock */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-zinc-400">Price</label>
                      <div className="bg-zinc-800 rounded-lg px-4 py-3 mt-1">
                        <Field
                          type="number"
                          name="price"
                          className="bg-transparent w-full outline-none text-white"
                        />
                      </div>
                      <ErrorMessage
                        name="price"
                        component="div"
                        className="text-red-400 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-zinc-400">Stock</label>
                      <div className="bg-zinc-800 rounded-lg px-4 py-3 mt-1">
                        <Field
                          type="number"
                          name="stockQuantity"
                          className="bg-transparent w-full outline-none text-white"
                        />
                      </div>
                      <ErrorMessage
                        name="stockQuantity"
                        component="div"
                        className="text-red-400 text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-medium text-white disabled:opacity-50"
                  >
                    {isSubmitting ? "Adding..." : "Add Product"}
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

export default Product;
