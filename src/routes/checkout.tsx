import { createFileRoute } from "@tanstack/react-router";
import { OrderWorkflow } from "@/components/order-workflow/OrderWorkflow";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  return <OrderWorkflow mode="checkout" />;
}
