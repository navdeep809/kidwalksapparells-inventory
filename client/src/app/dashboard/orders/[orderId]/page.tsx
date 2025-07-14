"use client";

import { useGetOrderQuery, useProcessOrderMutation } from "@/state/api";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle, Loader2, User2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const statusColors: Record<string, string> = {
  processed: "text-green-500 bg-green-500/10",
  pending: "text-yellow-400 bg-yellow-400/10",
  failed: "text-red-500 bg-red-500/10",
};

const paymentColors: Record<string, string> = {
  paid: "text-green-400 bg-green-500/10",
  unpaid: "text-red-400 bg-red-500/10",
};

const OrderProcessPage = () => {
  const { orderId } = useParams();
  const router = useRouter();
  const {
    data: order,
    isLoading,
    isError,
  } = useGetOrderQuery(orderId as string);
  const [processOrder, { isLoading: isProcessing }] = useProcessOrderMutation();

  const handleProcess = async () => {
    try {
      await processOrder(orderId as string).unwrap();
      toast.success("Order marked as processed");
      router.push("/orders");
    } catch (err) {
      console.error("Error processing order:", err);
      toast.error("Failed to process order");
    }
  };

  if (isLoading)
    return <div className="p-6 text-white">Loading order details...</div>;
  if (isError || !order)
    return (
      <div className="p-6 text-red-500">Order not found or failed to load.</div>
    );

  const totalAmount = order.total.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="p-6 text-white mx-auto">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-3xl font-bold mb-2">Order #{order.id}</h1>
      <p className="text-zinc-400 text-sm mb-6">
        Placed on:{" "}
        {new Date(order.createdAt).toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>

      {/* Order + Customer Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Order Info */}
        <div className="bg-zinc-900 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Order Info</h2>
          <div className="text-sm space-y-2">
            <div>
              <span className="text-zinc-400">Order ID:</span>{" "}
              <span className="font-medium">{order.id}</span>
            </div>
            <div>
              <span className="text-zinc-400">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                  statusColors[order.status] || "text-white bg-zinc-700"
                }`}
              >
                {order.status}
              </span>
            </div>
            <div>
              <span className="text-zinc-400">Payment:</span>{" "}
              <span
                className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                  paymentColors[order.paymentStatus] || "text-white bg-zinc-700"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
            <div>
              <span className="text-zinc-400">Total:</span>{" "}
              <span className="font-medium">{totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-zinc-900 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Customer</h2>
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2">
              <User2 className="w-4 h-4 text-zinc-400" />
              <span>{order.customer?.name || "N/A"}</span>
            </div>
            <div>{order.customer?.email || "—"}</div>
            {order.customer?.phone && <div>{order.customer.phone}</div>}
            {order.customer?.id && (
              <Link
                href={`/dashboard/customers/${order.customer.id}`}
                className="mt-2 inline-block text-indigo-400 text-sm hover:underline"
              >
                View customer profile
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Items */}
      <h2 className="text-xl font-semibold mb-2">Items</h2>
      <div className="space-y-3">
        {order.items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 bg-zinc-800 rounded p-3"
          >
            {item.product?.imageUrl ? (
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded"
              />
            ) : (
              <div className="w-16 h-16 bg-zinc-700 rounded flex items-center justify-center text-xs text-zinc-400">
                No Image
              </div>
            )}
            <div className="flex-1">
              <p className="font-medium">{item.product?.name}</p>
              <p className="text-sm text-zinc-400">
                Qty: {item.quantity} ×{" "}
                {(item.product?.price || 0).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
            </div>
            <div className="font-medium text-right">
              {((item.product?.price || 0) * item.quantity).toLocaleString(
                "en-US",
                {
                  style: "currency",
                  currency: "USD",
                }
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Process Button */}
      {order.status !== "processed" && (
        <button
          onClick={handleProcess}
          disabled={isProcessing}
          className="mt-8 bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-white font-medium rounded-lg flex items-center gap-2 disabled:opacity-60"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Processing...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Mark as Processed
            </>
          )}
        </button>
      )}

      {order.status === "processed" && (
        <div className="mt-8 text-green-500 font-medium flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Order has already been processed
        </div>
      )}
    </div>
  );
};

export default OrderProcessPage;
