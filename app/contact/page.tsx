import type { Metadata } from "next";
import Link from "next/link";
import PageHead from "../components/PageHead";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

export const metadata: Metadata = { title: "Contact | B&M Pest Control", description: "Call B&M Pest Control at 705-707-3016." };

export default function Page() {
  return (
    <>
      <PageHead title="Contact B&M Pest Control" crumbs={[]} />
      <section>
        <div className="wrap prose">
          <p><a className="phone" href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a></p>
          <p>One number, a real conversation: call and tell us what you are seeing. We cover Sault Ste. Marie and the surrounding Algoma communities.</p>
          <div className="cta">
            <Link className="btn" href="/calculator">Get an estimate</Link>
            <Link className="btn o" href="/check-area">Check my area</Link>
            <Link className="btn o" href="/pay">Pay an invoice</Link>
          </div>
        </div>
      </section>
    </>
  );
}
