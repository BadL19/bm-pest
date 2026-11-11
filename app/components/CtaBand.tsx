import Link from "next/link";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";
export default function CtaBand() {
  return (
    <section className="final">
      <div className="wrap">
        <h2>Ready when you are</h2>
        <p>Tell us what you are seeing at home and we will take it from there, or price it yourself online in about a minute.</p>
        <div className="cta" style={{ justifyContent: "center" }}>
          <a className="btn" href={`tel:${PHONE_TEL}`}>Call {PHONE_DISPLAY}</a>
          <Link className="btn o" href="/calculator">Get an estimate</Link>
        </div>
      </div>
    </section>
  );
}
