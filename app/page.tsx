import Link from "next/link";
import { areaPages } from "@/lib/areas";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";
import CtaBand from "./components/CtaBand";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <h1>Pests have a plan. We have a better one.</h1>
            <p>Every infestation starts with an unlocked door. B&amp;M finds yours, across Sault Ste. Marie and Algoma, and closes it.</p>
            <a className="phone" href={`tel:${PHONE_TEL}`} aria-label={`Call B&M Pest Control at ${PHONE_DISPLAY}`}>{PHONE_DISPLAY}</a>
            <div className="cta">
              <Link className="btn" href="/calculator">Get an Estimate</Link>
              <Link className="btn o" href="/check-area">Check My Area</Link>
            </div>
          </div>
          <div className="logo">
            <picture>
              <source media="(prefers-color-scheme: dark)" srcSet="/logo-dark.png" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" width={534} height={447} alt="B&M Pest Control logo: a house inside a shield, with the tagline Protecting your home. Ensuring your peace of mind." />
            </picture>
          </div>
        </div>
      </section>

      <section className="alt">
        <div className="wrap">
          <h2>What we keep out</h2>
          <div className="tiles">
            <Link className="tile" href="/insects"><b>Insects</b><span>Six legs or more, zero invitations. Ants, spiders, wasps, cockroaches and the rest.</span></Link>
            <Link className="tile" href="/rodents"><b>Rodents</b><span>Small, clever and convinced your pantry is a buffet. We disagree.</span></Link>
            <Link className="tile" href="/structural"><b>Structural monthly plan</b><span>A standing monthly appointment that pests would rather you cancel.</span></Link>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2>Answers before you pick up the phone</h2>
          <div className="tiles">
            <Link className="tile" href="/check-area"><b>Do you serve my area?</b><span>Type in your address and find out.</span></Link>
            <Link className="tile" href="/calculator"><b>Treatment estimate</b><span>Square footage, pest and severity in. Price range out.</span></Link>
            <Link className="tile" href="/pay"><b>Pay an invoice</b><span>Invoice number in, receipt out.</span></Link>
          </div>
        </div>
      </section>

      <section className="alt">
        <div className="wrap">
          <h2>Close to home, from the Sault to Blind River</h2>
          <ul className="areas">{areaPages.map((a) => (<li key={a.slug}><Link href={`/areas/${a.slug}`} style={{ textDecoration: "none", color: "inherit" }}>{a.name}</Link></li>))}</ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
