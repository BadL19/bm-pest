import Link from "next/link";
export default function NotFound() {
  return (
    <section><div className="wrap"><h1>Page not found</h1><p>That page does not exist. Try the <Link href="/">homepage</Link>, or call 705-707-3016.</p></div></section>
  );
}
