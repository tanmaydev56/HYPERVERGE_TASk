// lib/appwrite.ts
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import Constants from 'expo-constants';
import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

const extra = (Constants.expoConfig as any)?.extra ?? {};
const client = new Client()
  .setEndpoint(extra.appwriteEndpoint)
  .setProject(extra.appwriteProjectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);


export async function restoreSession() {
  try {
    // Try to restore an existing session
    const session = await account.getSession('current');
    return session;
  } catch {
    // Session does not exist
    return null;
  }
}

export async function getCurrentUser() {
  try {
    await account.getSession('current');   // throws if missing
    return await account.get();            // full user profile
  } catch {
    return null;                           // guest
  }
}


export { client, ID, Query };
