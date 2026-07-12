import { openDB, type DBSchema } from "idb";

export interface CachedMedia {
  key: string;
  blob: Blob;
  mimeType: string;
  size: number;
  cachedAt: number;
  lastAccessed: number;
}

interface ChatCacheDB extends DBSchema {
  media: {
    key: string;
    value: CachedMedia;
  };
}

export const dbPromise = openDB<ChatCacheDB>("chat-cache", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("media")) {
      db.createObjectStore("media", {
        keyPath: "key",
      });
    }
  },
});