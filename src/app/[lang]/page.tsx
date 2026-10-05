import {
  About,
  Background,
  Contact,
  Hero,
  Toolkit,
  Work,
} from "@/components/sections";

import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/routes";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <main id="main">
      <Hero locale={lang} />
      <Work locale={lang} />
      <Toolkit locale={lang} />
      <Background locale={lang} />
      <About locale={lang} />
      <Contact locale={lang} />
    </main>
  );
}
