import type { MetadataRoute } from "next";
import { allPests, pestHref } from "@/lib/pests";
import { areaPages } from "@/lib/areas";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = ["", "/insects", "/rodents", "/structural", "/calculator", "/check-area", "/areas", "/about", "/contact", "/faq", "/pay"];
  const paths = [...fixed, ...allPests.map(pestHref), ...areaPages.map((a) => `/areas/${a.slug}`)];
  return paths.map((p) => ({ url: SITE_URL + p }));
}
