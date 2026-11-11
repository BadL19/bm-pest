import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import CheckForm from "./CheckForm";

export const metadata: Metadata = {
  title: "Check My Area | B&M Pest Control",
  description: "Not sure if we serve your address? Enter it and find out if you are in our service area.",
};

export default function Page() {
  return (
    <>
      <PageHead title="Not sure if we treat your area?" lead="Type in your address and we will tell you straight whether you are in our territory." crumbs={[]} />
      <section>
        <div className="wrap"><CheckForm /></div>
      </section>
    </>
  );
}
