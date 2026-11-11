import Link from "next/link";
import { insects, rodents, pestHref } from "@/lib/pests";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

export default function Header() {
  return (
    <header>
      <div className="wrap">
        <Link className="brand" href="/">B&amp;M <b>Pest Control</b></Link>

        <div className="deskwrap">
          <nav aria-label="Main">
            <ul>
              <li className="dd">
                <Link href="/insects">Insects</Link>
                <ul className="menu">
                  {insects.map((p) => (<li key={p.slug}><Link href={pestHref(p)}>{p.name}</Link></li>))}
                </ul>
              </li>
              <li className="dd">
                <Link href="/rodents">Rodents</Link>
                <ul className="menu">
                  {rodents.map((p) => (<li key={p.slug}><Link href={pestHref(p)}>{p.name}</Link></li>))}
                </ul>
              </li>
              <li><Link href="/structural">Structural</Link></li>
              <li><Link href="/calculator">Estimate</Link></li>
              <li><Link href="/check-area">Check my area</Link></li>
              <li><Link href="/pay">Pay invoice</Link></li>
              <li><a className="tel" href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a></li>
            </ul>
          </nav>
        </div>

        <details className="mobilenav">
          <summary>Menu</summary>
          <div className="panel">
            <h4>Insects</h4>
            <div className="sub">
              <Link href="/insects">All insects</Link>
              {insects.map((p) => (<Link key={p.slug} href={pestHref(p)}>{p.name}</Link>))}
            </div>
            <h4>Rodents</h4>
            <div className="sub">
              <Link href="/rodents">All rodents</Link>
              {rodents.map((p) => (<Link key={p.slug} href={pestHref(p)}>{p.name}</Link>))}
            </div>
            <Link href="/structural"><b>Structural monthly plan</b></Link>
            <Link href="/calculator"><b>Treatment estimate</b></Link>
            <Link href="/check-area"><b>Check my area</b></Link>
            <Link href="/pay"><b>Pay an invoice</b></Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <a href={`tel:${PHONE_TEL}`}><b>Call {PHONE_DISPLAY}</b></a>
          </div>
        </details>
      </div>
    </header>
  );
}
