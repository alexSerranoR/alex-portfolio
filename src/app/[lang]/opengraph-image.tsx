import { notFound } from "next/navigation";
import { createSocialImage } from "@/components/social-image";
import { isLocale } from "@/i18n/routes";
export const alt = "Alex Serrano";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return createSocialImage(lang);
}
