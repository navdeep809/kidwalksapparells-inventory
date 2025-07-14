"use client";

import {
  useDeleteProductMutation,
  useGetProductQuery,
  useUpdateProductMutation,
} from "@/state/api";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";

const productSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  price: Yup.number().required("Required"),
  sku: Yup.string().required("Required"),
  stockQuantity: Yup.number().required("Required"),
  category: Yup.string().optional(),
  description: Yup.string().optional(),
});

const ProductDetails = () => {
  const { productId } = useParams();
  const router = useRouter();

  const [newImage, setNewImage] = useState<File | null>(null);
  const [isImageUploading, setImageUploading] = useState(false);

  const {
    data: product,
    error,
    isLoading,
    refetch,
  } = useGetProductQuery(productId as string);

  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteProduct(productId as string).unwrap();
      toast.success("Product deleted successfully");
      router.push("/products");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete product");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error || !product)
    return <div className="text-red-500">Failed to load product</div>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

      <Formik
        initialValues={{
          name: product.name,
          price: product.price,
          sku: product.sku,
          stockQuantity: product.stockQuantity,
          category: product.category || "",
          description: product.description || "",
          imageFile: null,
        }}
        validationSchema={productSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const formData = new FormData();
          formData.append("id", product.id); // required by mutation
          formData.append("name", values.name);
          formData.append("price", values.price.toString());
          formData.append("sku", values.sku);
          formData.append("stockQuantity", values.stockQuantity.toString());
          formData.append("category", values.category);
          formData.append("description", values.description);
          if (values.imageFile) {
            formData.append("image", values.imageFile);
          }

          try {
            await updateProduct(formData).unwrap();
            toast.success("Product updated successfully");
            refetch();
          } catch (err) {
            console.error(err);
            toast.error("Failed to update product");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="flex flex-col gap-4 max-w-xl">
            <div className="flex flex-col gap-2">
              <label className="text-zinc-400 text-sm font-medium">
                Product Image
              </label>
              {values.imageFile ? (
                <img
                  src={URL.createObjectURL(values.imageFile)}
                  alt="Preview"
                  className="w-24 aspect-square mt-2 rounded object-cover"
                />
              ) : product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt="Existing"
                  className="w-24 h-24 mt-2 rounded object-cover"
                />
              ) : null}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setFieldValue(
                    "imageFile",
                    e.currentTarget.files?.[0] || null
                  );
                }}
                className="text-white file:bg-indigo-600 file:text-white file:px-4 file:py-2 file:rounded-lg file:border-0 py-2 rounded-lg"
              />
            </div>
            {[
              "name",
              "sku",
              "price",
              "stockQuantity",
              "category",
              "description",
            ].map((field) => (
              <div key={field} className="flex flex-col gap-2">
                <label className="capitalize text-zinc-500 text-sm font-medium">
                  {field}
                </label>
                <Field
                  name={field}
                  className="flex items-center gap-2 p-4 bg-zinc-800 rounded-lg focus-within:outline outline-indigo-500"
                />
              </div>
            ))}

            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 px-4 py-2 rounded text-white font-medium"
              >
                {isSubmitting ? "Updating..." : "Update Product"}
              </button>
              <button
                type="button"
                onClick={() => setDeleteModalOpen(true)}
                className="bg-red-200 px-4 py-2 rounded text-red-600 font-medium"
              >
                Delete Product
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-xl max-w-md w-full space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Confirm Deletion
            </h2>
            <p className="text-sm text-zinc-400">
              Are you sure you want to delete this product? This action cannot
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
                onClick={handleDelete}
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

export default ProductDetails;
