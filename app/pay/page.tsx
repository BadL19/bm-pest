import type { Metadata } from "next";
import PayForm from "./PayForm";

export const metadata: Metadata = {
  title: "Pay an Invoice | B&M Pest Control",
  description: "Pay your B&M Pest Control invoice securely online with your invoice number.",
};

export default function PayPage() {
  return (
    <section>
      <div className="wrap">
        <h1>Pay an invoice</h1>
        <p>Invoice number and the email on it, then pay by card. Stripe handles the payment securely, so B&amp;M never sees or stores your card details.</p>
        <PayForm />
      </div>
    </section>
  );
}
