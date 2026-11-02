import bridge from "@/assets/diary/lisboa-puente-25-de-abril.jpg";
import selfie from "@/assets/diary/lisboa-puente-selfie.jpg";

// Kept apart from the entries so their text can be read outside the bundler.
export const diaryPhotos = { bridge, selfie };
export type DiaryPhoto = keyof typeof diaryPhotos;
