import Link from "next/link";
import PageHead from "./PageHead";
import CtaBand from "./CtaBand";
import { type Pest, allPests, pestHref } from "@/lib/pests";

export default function PestPage({ p }: { p: Pest }) {
  const label = p.group === "insects" ? "Insects" : "Rodents";
  const others = allPests.filter((x) => x.group === p.group && x.slug !== p.slug).slice(0, 4);
  return (
    <>
      <PageHead title={p.name} lead={p.intro} crumbs={[[label, `/${p.group}`]]} />
      <section>
        <div className="wrap prose">
          <h2>How they give themselves away</h2>
          <ul>{p.signs.map((s) => <li key={s}>{s}</li>)}</ul>
          <h2>How they got in</h2>
          <ul>{p.causes.map((s) => <li key={s}>{s}</li>)}</ul>
          <h2>How to make your home a bad bet</h2>
          <ul>{p.prevention.map((s) => <li key={s}>{s}</li>)}</ul>
          {p.extra && <p className="msg">{p.extra}</p>}
          <h2>When it&rsquo;s time to call in backup</h2>
          <p>{p.callWhen}</p>
          <p className="small">Fine print, plainly: this is general guidance, not a promise of results. Every home is different, and an inspection is the best way to know what is going on.</p>
          <h2>Your move</h2>
          <div className="cta">
            <Link className="btn" href="/calculator">Estimate a treatment</Link>
            <Link className="btn o" href="/structural">Monthly structural plan</Link>
            <Link className="btn o" href="/check-area">Check my area</Link>
          </div>
          <h2>Other uninvited guests</h2>
          {others.map((o) => (<Link key={o.slug} className="cardlink" href={pestHref(o)}><b>{o.name}</b><span>{o.summary}</span></Link>))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
