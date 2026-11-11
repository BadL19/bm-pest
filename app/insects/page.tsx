import Link from "next/link";
import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import CtaBand from "../components/CtaBand";
import { insects, pestHref } from "@/lib/pests";

export const metadata: Metadata = { title: "Insect control | B&M Pest Control", description: "Small, many-legged and uninvited. Here is what to look for, and how to discourage each one." };

export default function Page() {
  return (
    <>
      <PageHead title="Insect control" lead="Small, many-legged and uninvited. Here is what to look for, and how to discourage each one." crumbs={[]} />
      <section>
        <div className="wrap">
          {insects.map((p) => (<Link key={p.slug} className="cardlink" href={pestHref(p)}><b>{p.name}</b><span>{p.summary}</span></Link>))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
