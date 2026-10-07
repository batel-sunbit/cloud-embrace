import { createFileRoute } from "@tanstack/react-router";
import { OrderWorkflow } from "@/components/order-workflow/OrderWorkflow";

export const Route = createFileRoute("/orders-admin")({
  component: OrdersAdminPage,
});

function OrdersAdminPage() {
  return <OrderWorkflow mode="admin" />;
}
