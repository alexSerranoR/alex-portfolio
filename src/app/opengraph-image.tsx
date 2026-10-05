import { createSocialImage } from "@/components/social-image";
export const alt = "Alex Serrano — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return createSocialImage("en");
}
