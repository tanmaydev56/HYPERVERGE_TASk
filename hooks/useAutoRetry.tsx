// hooks/useAutoRetry.ts
import NetInfo from "@react-native-community/netinfo";
import { getQueue, removeFromQueue } from "@/lib/offlineQueues";
import { uploadKycBundle } from "@/lib/upload";
import { account } from "@/lib/appwrite";

export function useAutoRetry() {
  NetInfo.addEventListener(async (state) => {
    if (!state.isConnected) return;
    const pending = await getQueue();
    for (const item of pending) {
      try {
        const payload = JSON.parse(item.payload);
        const user = await account.get();
        await uploadKycBundle(
          user.$id,
          item.method,
          payload.number,
          item.photo_uri,
          payload.selfieUri
        );
        await removeFromQueue(item.id);
      } catch {
        /* keep in queue */
      }
    }
  });
}