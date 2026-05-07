// localStorage helpers for NaissanceChain verification portal
import type { Enregistrement } from "./data";
import { ENREGISTREMENTS } from "./data";

const STORAGE_KEY = "naissancechain_records";

// Seed localStorage with default records on first load
export function initStorage(): void {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ENREGISTREMENTS));
  }
}

export function getAllRecords(): Enregistrement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : ENREGISTREMENTS;
  } catch {
    return ENREGISTREMENTS;
  }
}

export function getRecordByNIU(niu: string): Enregistrement | null {
  const records = getAllRecords();
  return records.find((r) => r.niu.toLowerCase() === niu.toLowerCase()) ?? null;
}

export function searchRecords(query: string): Enregistrement[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return getAllRecords().filter(
    (r) =>
      r.niu.toLowerCase().includes(q) ||
      r.nom.toLowerCase().includes(q) ||
      r.prenom.toLowerCase().includes(q)
  );
}

export function saveRecord(record: Enregistrement): void {
  const records = getAllRecords();
  const idx = records.findIndex((r) => r.niu === record.niu);
  if (idx >= 0) records[idx] = record;
  else records.push(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function countByStatut() {
  const all = getAllRecords();
  return {
    total: all.length,
    valide: all.filter((r) => r.statut === "VALIDÉ").length,
    attente: all.filter((r) => r.statut === "EN ATTENTE").length,
    rejete: all.filter((r) => r.statut === "REJETÉ").length,
  };
}

// Encode a NIU as a simple QR-compatible data string
export function encodeQRData(niu: string): string {
  return `NAISSANCECHAIN:${niu}`;
}

// Parse data from QR scan or text
export function parseQRData(raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed.startsWith("NAISSANCECHAIN:")) {
    return trimmed.replace("NAISSANCECHAIN:", "");
  }
  // Could also be a plain NIU
  if (/^\d{5}-GU-\d{4}$/.test(trimmed)) return trimmed;
  return trimmed || null;
}
