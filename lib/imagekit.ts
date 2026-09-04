import ImageKit from "imagekit";
import { ENV } from "@/config/env";

const imagekit = new ImageKit({
  publicKey: ENV.imagekit.publicKey,
  privateKey: ENV.imagekit.privateKey,
  urlEndpoint: ENV.imagekit.urlEndpoint,
});

export default imagekit;

/**
 * Generate client-side authentication parameters for uploading
 */
export function getUploadAuthParams() {
  return imagekit.getAuthenticationParameters();
}

/**
 * Permanently delete a file from ImageKit storage
 */
export async function deleteImageKitFile(fileId: string) {
  try {
    return await imagekit.deleteFile(fileId);
  } catch (error) {
    console.warn(`Failed to delete ImageKit file with ID ${fileId}:`, error);
    return null;
  }
}

/**
 * Bulk permanently delete files from ImageKit storage
 */
export async function bulkDeleteImageKitFiles(fileIds: string[]) {
  if (!fileIds || fileIds.length === 0) return null;
  try {
    return await imagekit.bulkDeleteFiles(fileIds);
  } catch (error) {
    console.warn("Failed to bulk delete ImageKit files:", error);
    return null;
  }
}
