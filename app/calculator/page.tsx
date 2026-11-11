import type { Metadata } from "next";
import { Suspense } from "react";
import PageHead from "../components/PageHead";
import Calculator from "./Calculator";

export const metadata: Metadata = {
  title: "Treatment Estimate Calculator | B&M Pest Control",
  description: "Get a quick estimate for a pest treatment or a monthly structural plan based on your home size and the severity of the problem.",
};

export default function Page() {
  return (
    <>
      <PageHead title="Treatment estimate" lead="Tell us about your home and the problem. A realistic estimate comes out." crumbs={[]} />
      <section>
        <div className="wrap"><Suspense><Calculator /></Suspense></div>
      </section>
    </>
  );
}
