import Link from "next/link";
export default function PageHead({ title, lead, crumbs }: { title: string; lead?: string; crumbs?: [string, string][] }) {
  return (
    <div className="pagehead">
      <div className="wrap">
        {crumbs && (
          <p className="crumbs"><Link href="/">Home</Link>{crumbs.map(([l, h]) => (<span key={h}> / <Link href={h}>{l}</Link></span>))}</p>
        )}
        <h1>{title}</h1>
        {lead && <p style={{ fontSize: "1.15rem" }}>{lead}</p>}
      </div>
    </div>
  );
}
