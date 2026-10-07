import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getStoredOrders,
  updateOrderStatus,
  type OrderRecord,
  type PaymentStatus,
  type FulfillmentStatus,
} from "@/lib/order-storage";

const paymentStatusOptions: PaymentStatus[] = ["pending", "paid"];
const fulfillmentStatusOptions: FulfillmentStatus[] = ["processing", "shipped"];

export function OrderManagementDashboard() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  const refreshOrders = () => {
    setOrders(getStoredOrders());
  };

  useEffect(() => {
    refreshOrders();
  }, []);

  const updatePayment = (orderId: string, status: PaymentStatus) => {
    updateOrderStatus(orderId, { paymentStatus: status });
    refreshOrders();
  };

  const updateFulfillment = (orderId: string, status: FulfillmentStatus) => {
    updateOrderStatus(orderId, { fulfillmentStatus: status });
    refreshOrders();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 md:px-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Management</p>
          <h1 className="font-serif text-4xl text-primary">Incoming Orders</h1>
        </div>
        <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
          {orders.length} total orders
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
          No orders have been placed yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Order #{order.orderNumber}</p>
                  <h2 className="mt-1 text-2xl font-semibold text-primary">{order.customerName}</h2>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-medium">
                  <span className="rounded-full bg-secondary px-3 py-1 text-muted-foreground">
                    {order.paymentMethod.toUpperCase()}
                  </span>
                  <span className="rounded-full bg-secondary px-3 py-1 text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-GB")}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-3 text-sm">
                  <p>
                    <span className="font-medium text-foreground">Phone:</span> {order.phone}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Address:</span> {order.address}
                  </p>
                  {order.notes ? (
                    <p>
                      <span className="font-medium text-foreground">Notes:</span> {order.notes}
                    </p>
                  ) : null}

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={`${order.id}-${item.slug}`} className="rounded-xl bg-secondary/60 p-3">
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-muted-foreground">Qty: {item.qty}</span>
                        </div>
                        {item.greeting ? (
                          <p className="mt-2 text-xs text-muted-foreground">Greeting: {item.greeting}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-border bg-muted/40 p-4">
                  <div>
                    <p className="mb-2 text-sm font-medium text-foreground">Payment Status</p>
                    <div className="flex flex-wrap gap-2">
                      {paymentStatusOptions.map((status) => (
                        <Button
                          key={status}
                          type="button"
                          size="sm"
                          variant={order.paymentStatus === status ? "default" : "outline"}
                          onClick={() => updatePayment(order.id, status)}
                        >
                          {status === "paid" ? "Paid" : "Pending"}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-foreground">Fulfillment Status</p>
                    <div className="flex flex-wrap gap-2">
                      {fulfillmentStatusOptions.map((status) => (
                        <Button
                          key={status}
                          type="button"
                          size="sm"
                          variant={order.fulfillmentStatus === status ? "default" : "outline"}
                          onClick={() => updateFulfillment(order.id, status)}
                        >
                          {status === "shipped" ? "Shipped" : "Processing"}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-background p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Total</span>
                      <span className="font-semibold">{order.total} NIS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
