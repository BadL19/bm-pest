import type { Metadata } from "next";
import Link from "next/link";
import PageHead from "../components/PageHead";
import CtaBand from "../components/CtaBand";

export const metadata: Metadata = { title: "About | B&M Pest Control", description: "B&M Pest Control is a local, residential-first pest control business focused on prevention in Sault Ste. Marie and Algoma." };

export default function Page() {
  return (
    <>
      <PageHead title="About B&M Pest Control" lead="A local company that takes your home personally." crumbs={[]} />
      <section>
        <div className="wrap prose">
          <p>B&amp;M Pest Control is a local partnership, so you get neighbours, not a call centre. We serve homeowners in Sault Ste. Marie and the surrounding Algoma communities, and houses are our whole focus.</p>
          <h2>We would rather prevent it</h2>
          <p>Pests are opportunists: they move in where there are gaps, moisture and food. We start there, and we explain what we find in plain language, so you always know what is going on at your home.</p>
          <h2>Where you will find us</h2>
          <p>Sault Ste. Marie, Goulais River, Echo Bay, Desbarats, St. Joseph Island, Bruce Mines, Thessalon and Blind River. <Link href="/areas">See all service areas</Link> or <Link href="/check-area">check your address</Link>.</p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
