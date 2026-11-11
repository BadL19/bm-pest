import type { Metadata } from "next";
import Link from "next/link";
import PageHead from "../components/PageHead";
import CtaBand from "../components/CtaBand";

export const metadata: Metadata = { title: "FAQ | B&M Pest Control", description: "Answers to common questions about B&M Pest Control, estimates, the monthly plan and paying an invoice." };

const faqs: [string, React.ReactNode][] = [
  ["How do I get in touch?", "Pick up the phone and call 705-707-3016. Tell us what you are dealing with and we will take it from there."],
  ["How do I know if you serve my address?", <>Use the <Link href="/check-area">address checker</Link>, or call us.</>],
  ["How much will a treatment cost?", <>Try the <Link href="/calculator">estimate calculator</Link>. It gives a range, and we confirm the final price with you.</>],
  ["What is the structural monthly plan?", <>We visit every month and treat for the pests you choose. <Link href="/structural">Learn more</Link>.</>],
  ["How do I pay an invoice?", <>Go to <Link href="/pay">Pay an invoice</Link>, enter your invoice number and the email on the invoice, then pay securely by card.</>],
  ["Do you work with homes or businesses?", "Homes, happily. Our focus is residential properties."],
];

export default function Page() {
  return (
    <>
      <PageHead title="Frequently asked questions" crumbs={[]} />
      <section><div className="wrap">{faqs.map(([q, a]) => (<details key={q}><summary>{q}</summary><p>{a}</p></details>))}</div></section>
      <CtaBand />
    </>
  );
}
