"use client";

/**
 * Client-side draft store. Edits and uploaded images live only in the
 * browser's IndexedDB until the user publishes, so nothing unpublished
 * ever touches the public repository or a public URL.
 */

import { Overlay, emptyOverlay } from "./types";

const DB_NAME = "mh-dashboard";
const STORE = "draft";
const KEY = "overlay";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function loadOverlay(): Promise<Overlay> {
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(KEY);
      req.onsuccess = () => {
        const value = req.result as Overlay | undefined;
        resolve(value && value.projects ? value : emptyOverlay());
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return emptyOverlay();
  }
}

export async function saveOverlay(overlay: Overlay): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(
      { ...overlay, updatedAt: new Date().toISOString() },
      KEY
    );
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function clearOverlay(): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
