import Link from "next/link";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";
export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div>
          <p><b>B&amp;M Pest Control</b></p>
          <p>Sault Ste. Marie, Ontario</p>
          <p><a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a></p>
          <p>bmpestcontrol.ca</p>
        </div>
        <div>
          <p><Link href="/insects">Insects</Link> · <Link href="/rodents">Rodents</Link> · <Link href="/structural">Structural plan</Link></p>
          <p><Link href="/calculator">Estimate</Link> · <Link href="/check-area">Check my area</Link> · <Link href="/areas">Service areas</Link></p>
          <p><Link href="/about">About</Link> · <Link href="/faq">FAQ</Link> · <Link href="/contact">Contact</Link> · <Link href="/pay">Pay invoice</Link></p>
          <p>&copy; {new Date().getFullYear()} B&amp;M Pest Control</p>
        </div>
      </div>
    </footer>
  );
}
