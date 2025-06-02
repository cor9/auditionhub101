import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getCurrentUser } from "@/lib/auth";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  auditionMaterial: f({ image: { maxFileSize: "4MB" }, pdf: { maxFileSize: "8MB" }, video: { maxFileSize: "512MB" } })
    .middleware(async () => {
      const user = await getCurrentUser();
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;