// lib/upload.ts
import { ID } from "react-native-appwrite";
import { storage, databases } from "./appwrite";
import { COL_KYC, BUCKET_KYC, DATABASE_ID } from "./constants";

export async function uploadKycBundle(
  userId: string,
  method: string,
  number: string,
  docUri: string,
  selfieUri: string
) {
  // 1. upload files
  const docFile = await storage.createFile(
    BUCKET_KYC,
    ID.unique(),
    { type: "image/jpeg", uri: docUri }
  );
  const selfieFile = await storage.createFile(
    BUCKET_KYC,
    ID.unique(),
    { type: "image/jpeg", uri: selfieUri }
  );

  // 2. record
  return await databases.createDocument(
    DATABASE_ID,
    COL_KYC,
    ID.unique(),
    {
      userId,
      method,
      number,
      status: "pending",
      reason: "",
      docFileId: docFile.$id,
      selfieFileId: selfieFile.$id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );
}