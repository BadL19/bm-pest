import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHead from "../../components/PageHead";
import CtaBand from "../../components/CtaBand";
import { areaPages } from "@/lib/areas";
import { allPests, pestHref } from "@/lib/pests";

type P = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return areaPages.map((a) => ({ slug: a.slug })); }
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const a = areaPages.find((x) => x.slug === slug);
  if (!a) return {};
  return { title: `Pest Control in ${a.name} | B&M Pest Control`, description: `Residential pest prevention information for ${a.name} homeowners, from B&M Pest Control.` };
}
export default async function Page({ params }: P) {
  const { slug } = await params;
  const a = areaPages.find((x) => x.slug === slug);
  if (!a) notFound();
  const pests = a.links.map((l) => allPests.find((p) => p.slug === l)).filter(Boolean) as typeof allPests;
  return (
    <>
      <PageHead title={`Pest control in ${a.name}`} lead={a.intro} crumbs={[["Service areas", "/areas"]]} />
      <section>
        <div className="wrap prose">
          <h2>What tends to knock on the door here</h2>
          <ul>{a.concerns.map((c) => <li key={c}>{c}</li>)}</ul>
          <h2>How to make it harder for them</h2>
          <ul>{a.tips.map((c) => <li key={c}>{c}</li>)}</ul>
          <h2>Know your visitors</h2>
          {pests.map((p) => (<Link key={p.slug} className="cardlink" href={pestHref(p)}><b>{p.name}</b><span>{p.summary}</span></Link>))}
          <h2>{a.name} is on our map</h2>
          <p>{a.name} is part of the area we serve. If you want to confirm your exact address, use our checker.</p>
          <div className="cta">
            <Link className="btn" href="/check-area">Check my address</Link>
            <Link className="btn o" href="/calculator">Get an estimate</Link>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
