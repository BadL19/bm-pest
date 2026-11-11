import Link from "next/link";
import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import CtaBand from "../components/CtaBand";
import { insects, rodents, pestHref } from "@/lib/pests";

export const metadata: Metadata = {
  title: "Structural Monthly Plan | B&M Pest Control",
  description: "A monthly pest protection plan for your home. We visit every month and treat for the pests you choose.",
};

export default function Page() {
  return (
    <>
      <PageHead title="Structural monthly plan" lead="Pests don't take months off, and neither do we. Every month we visit and treat for the pests you choose." crumbs={[]} />
      <section>
        <div className="wrap two">
          <div className="prose">
            <h2 style={{ marginTop: 0 }}>How the arrangement works</h2>
            <ol className="steps">
              <li><b>You write the guest list</b>Choose the insects and rodents you want kept out.</li>
              <li><b>We show up monthly</b>A visit every month to treat your home for what you chose.</li>
              <li><b>Pricing fits your home</b>Your monthly cost reflects your home size and how many pests you choose.</li>
            </ol>
            <p style={{ marginTop: 20 }}>Why monthly? Pests work in shifts: ants in spring, wasps in summer, mice in fall. A monthly rhythm keeps up with all of them and catches small problems before they become big ones.</p>
            <p className="small">The small print, plainly: plan terms, such as visit timing and how to change or cancel a plan, are confirmed when you sign up. Results depend on the property and the pest.</p>
            <div className="cta">
              <Link className="btn" href="/calculator?mode=plan">Estimate my monthly price</Link>
              <Link className="btn o" href="/check-area">Check my area</Link>
            </div>
          </div>
          <div>
            <h2>Choose your adversaries</h2>
            <p><b>Insects</b></p>
            <p>{insects.map((p, i) => (<span key={p.slug}>{i > 0 && ", "}<Link href={pestHref(p)}>{p.name}</Link></span>))}</p>
            <p><b>Rodents</b></p>
            <p>{rodents.map((p, i) => (<span key={p.slug}>{i > 0 && ", "}<Link href={pestHref(p)}>{p.name}</Link></span>))}</p>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
