import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PestPage from "../../components/PestPage";
import { insects } from "@/lib/pests";

type P = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return insects.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const p = insects.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: `${p.name} | B&M Pest Control`, description: p.intro.slice(0, 155) };
}
export default async function Page({ params }: P) {
  const { slug } = await params;
  const p = insects.find((x) => x.slug === slug);
  if (!p) notFound();
  return <PestPage p={p} />;
}
