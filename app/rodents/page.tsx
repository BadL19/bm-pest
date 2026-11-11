import Link from "next/link";
import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import CtaBand from "../components/CtaBand";
import { rodents, pestHref } from "@/lib/pests";

export const metadata: Metadata = { title: "Rodent control | B&M Pest Control", description: "Persistent, resourceful and always looking for a way in. Here is how to give them nothing to work with." };

export default function Page() {
  return (
    <>
      <PageHead title="Rodent control" lead="Persistent, resourceful and always looking for a way in. Here is how to give them nothing to work with." crumbs={[]} />
      <section>
        <div className="wrap">
          {rodents.map((p) => (<Link key={p.slug} className="cardlink" href={pestHref(p)}><b>{p.name}</b><span>{p.summary}</span></Link>))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
