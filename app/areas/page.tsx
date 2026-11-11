import Link from "next/link";
import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import CtaBand from "../components/CtaBand";
import { areaPages } from "@/lib/areas";

export const metadata: Metadata = {
  title: "Service Areas | B&M Pest Control",
  description: "B&M Pest Control serves Sault Ste. Marie, Goulais River, Echo Bay, Desbarats, St. Joseph Island, Bruce Mines, Thessalon and Blind River.",
};

export default function Page() {
  return (
    <>
      <PageHead title="Service areas" lead="From the Sault to Blind River, these are the communities we serve." crumbs={[]} />
      <section>
        <div className="wrap">
          {areaPages.map((a) => (<Link key={a.slug} className="cardlink" href={`/areas/${a.slug}`}><b>{a.name}</b><span>{a.intro}</span></Link>))}
          <p style={{ marginTop: 24 }}>Not sure if your address is covered? <Link href="/check-area">Check your address</Link>.</p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
