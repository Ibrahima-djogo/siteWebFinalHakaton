// Shared data used across all portail pages

export type StatutType = "VALIDÉ" | "EN ATTENTE" | "REJETÉ";

export interface Enregistrement {
  niu: string;
  nom: string;
  prenom: string;
  sexe: "M" | "F";
  date: string;
  prefecture: string;
  commune: string;
  statut: StatutType;
  agent: string;
  agentId: string;
  hashBlock: string;
  nomPere: string;
  nomMere: string;
  dateCreation: string;
}

export interface Agent {
  id: string;
  nom: string;
  prenom: string;
  prefecture: string;
  grade: string;
  statut: "ACTIF" | "INACTIF";
  enregistrements: number;
  dateEntree: string;
  tel: string;
  email: string;
  avatar: string;
}

export interface Prefecture {
  nom: string;
  region: string;
  enregistrements: number;
  couverture: number;
  population: number;
  agents: number;
  tendance: number;
  couleur: string;
}

export const ENREGISTREMENTS: Enregistrement[] = [
  { niu: "59153-GU-2026", nom: "Diallo", prenom: "Mamadou", sexe: "M", date: "15 janv. 2026", prefecture: "Kindia", commune: "Kindia Centre", statut: "EN ATTENTE", agent: "Kouyaté Alpha", agentId: "AGT-004", hashBlock: "0x4f3a8b2c1d9e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a", nomPere: "Ibrahim Diallo", nomMere: "Aïssatou Barry", dateCreation: "2026-01-15" },
  { niu: "59154-GU-2026", nom: "Camara", prenom: "Fatoumata", sexe: "F", date: "16 janv. 2026", prefecture: "Conakry", commune: "Kaloum", statut: "VALIDÉ", agent: "Bah Moussa", agentId: "AGT-001", hashBlock: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b", nomPere: "Sékou Camara", nomMere: "Kadiatou Sylla", dateCreation: "2026-01-16" },
  { niu: "59155-GU-2026", nom: "Bah", prenom: "Ibrahim", sexe: "M", date: "17 janv. 2026", prefecture: "Labé", commune: "Labé Centre", statut: "VALIDÉ", agent: "Diallo Thierno", agentId: "AGT-006", hashBlock: "0x9f8e7d6c5b4a3928170605040302010ffeeddccbbaa998877665544332211009f8", nomPere: "Mamadou Bah", nomMere: "Mariama Diallo", dateCreation: "2026-01-17" },
  { niu: "59156-GU-2026", nom: "Kouyaté", prenom: "Mariama", sexe: "F", date: "18 janv. 2026", prefecture: "Kankan", commune: "Kankan Nord", statut: "EN ATTENTE", agent: "Soumah Ibou", agentId: "AGT-009", hashBlock: "0x2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d", nomPere: "Oumar Kouyaté", nomMere: "Hawa Traoré", dateCreation: "2026-01-18" },
  { niu: "59157-GU-2026", nom: "Sylla", prenom: "Oumar", sexe: "M", date: "19 janv. 2026", prefecture: "Boké", commune: "Boké Centre", statut: "VALIDÉ", agent: "Baldé Fatoumata", agentId: "AGT-003", hashBlock: "0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f", nomPere: "Cellou Sylla", nomMere: "Aminata Konaté", dateCreation: "2026-01-19" },
  { niu: "59158-GU-2026", nom: "Traoré", prenom: "Aïssatou", sexe: "F", date: "20 janv. 2026", prefecture: "Faranah", commune: "Faranah Centre", statut: "REJETÉ", agent: "Condé Sékou", agentId: "AGT-007", hashBlock: "0x3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c", nomPere: "Lamine Traoré", nomMere: "Coumba Camara", dateCreation: "2026-01-20" },
  { niu: "59159-GU-2026", nom: "Barry", prenom: "Amadou", sexe: "M", date: "21 janv. 2026", prefecture: "Mamou", commune: "Mamou Centre", statut: "VALIDÉ", agent: "Bah Moussa", agentId: "AGT-001", hashBlock: "0x5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e", nomPere: "Elhadj Barry", nomMere: "Djenab Diallo", dateCreation: "2026-01-21" },
  { niu: "59160-GU-2026", nom: "Condé", prenom: "Nènè", sexe: "F", date: "22 janv. 2026", prefecture: "Nzérékoré", commune: "Nzérékoré Ville", statut: "VALIDÉ", agent: "Koivogui Pierre", agentId: "AGT-010", hashBlock: "0x8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a", nomPere: "Alpha Condé", nomMere: "Fanta Keïta", dateCreation: "2026-01-22" },
  { niu: "59161-GU-2026", nom: "Keïta", prenom: "Sékou", sexe: "M", date: "23 janv. 2026", prefecture: "Conakry", commune: "Ratoma", statut: "EN ATTENTE", agent: "Bah Moussa", agentId: "AGT-001", hashBlock: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab", nomPere: "Moussa Keïta", nomMere: "Saran Touré", dateCreation: "2026-01-23" },
  { niu: "59162-GU-2026", nom: "Touré", prenom: "Kadiatou", sexe: "F", date: "24 janv. 2026", prefecture: "Kindia", commune: "Coyah", statut: "VALIDÉ", agent: "Kouyaté Alpha", agentId: "AGT-004", hashBlock: "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321fe", nomPere: "Ibrahima Touré", nomMere: "Mariam Konaté", dateCreation: "2026-01-24" },
  { niu: "59163-GU-2026", nom: "Baldé", prenom: "Mamadou Cellou", sexe: "M", date: "25 janv. 2026", prefecture: "Labé", commune: "Pita", statut: "VALIDÉ", agent: "Diallo Thierno", agentId: "AGT-006", hashBlock: "0x1234abcd5678efgh9012ijkl3456mnop7890qrst1234uvwx5678yzAB9012CDEF34", nomPere: "Oumar Baldé", nomMere: "Djénabou Sow", dateCreation: "2026-01-25" },
  { niu: "59164-GU-2026", nom: "Sow", prenom: "Hawa", sexe: "F", date: "26 janv. 2026", prefecture: "Mamou", commune: "Dalaba", statut: "EN ATTENTE", agent: "Bah Moussa", agentId: "AGT-001", hashBlock: "0x0987654321fedcba0987654321fedcba0987654321fedcba0987654321fedcba09", nomPere: "Cellou Sow", nomMere: "Fatoumata Barry", dateCreation: "2026-01-26" },
];

export const AGENTS: Agent[] = [
  { id: "AGT-001", nom: "Bah", prenom: "Moussa", prefecture: "Conakry", grade: "Agent Principal", statut: "ACTIF", enregistrements: 342, dateEntree: "2023-03-15", tel: "+224 628 123 456", email: "m.bah@etatcivil.gov.gn", avatar: "MB" },
  { id: "AGT-002", nom: "Camara", prenom: "Ibrahima", prefecture: "Conakry", grade: "Agent", statut: "ACTIF", enregistrements: 218, dateEntree: "2024-01-10", tel: "+224 622 234 567", email: "i.camara@etatcivil.gov.gn", avatar: "IC" },
  { id: "AGT-003", nom: "Baldé", prenom: "Fatoumata", prefecture: "Boké", grade: "Agent Senior", statut: "ACTIF", enregistrements: 289, dateEntree: "2022-09-01", tel: "+224 657 345 678", email: "f.balde@etatcivil.gov.gn", avatar: "FB" },
  { id: "AGT-004", nom: "Kouyaté", prenom: "Alpha", prefecture: "Kindia", grade: "Agent Principal", statut: "ACTIF", enregistrements: 401, dateEntree: "2021-06-20", tel: "+224 664 456 789", email: "a.kouyate@etatcivil.gov.gn", avatar: "AK" },
  { id: "AGT-005", nom: "Diallo", prenom: "Mariama", prefecture: "Kindia", grade: "Agent", statut: "INACTIF", enregistrements: 156, dateEntree: "2024-08-05", tel: "+224 621 567 890", email: "m.diallo@etatcivil.gov.gn", avatar: "MD" },
  { id: "AGT-006", nom: "Diallo", prenom: "Thierno", prefecture: "Labé", grade: "Agent Senior", statut: "ACTIF", enregistrements: 378, dateEntree: "2022-02-28", tel: "+224 628 678 901", email: "t.diallo@etatcivil.gov.gn", avatar: "TD" },
  { id: "AGT-007", nom: "Condé", prenom: "Sékou", prefecture: "Faranah", grade: "Agent", statut: "ACTIF", enregistrements: 134, dateEntree: "2025-01-15", tel: "+224 623 789 012", email: "s.conde@etatcivil.gov.gn", avatar: "SC" },
  { id: "AGT-008", nom: "Konaté", prenom: "Aminata", prefecture: "Kankan", grade: "Agent Senior", statut: "ACTIF", enregistrements: 267, dateEntree: "2023-07-11", tel: "+224 655 890 123", email: "a.konate@etatcivil.gov.gn", avatar: "AK" },
  { id: "AGT-009", nom: "Soumah", prenom: "Ibou", prefecture: "Kankan", grade: "Agent", statut: "ACTIF", enregistrements: 189, dateEntree: "2024-04-22", tel: "+224 629 901 234", email: "i.soumah@etatcivil.gov.gn", avatar: "IS" },
  { id: "AGT-010", nom: "Koivogui", prenom: "Pierre", prefecture: "Nzérékoré", grade: "Agent Principal", statut: "ACTIF", enregistrements: 312, dateEntree: "2022-11-30", tel: "+224 620 012 345", email: "p.koivogui@etatcivil.gov.gn", avatar: "PK" },
];

export const PREFECTURES: Prefecture[] = [
  { nom: "Conakry", region: "Conakry", enregistrements: 38420, couverture: 82, population: 2_550_000, agents: 24, tendance: 14.2, couleur: "#1A5C42" },
  { nom: "Kindia", region: "Kindia", enregistrements: 18750, couverture: 65, population: 980_000, agents: 11, tendance: 8.7, couleur: "#2A7A58" },
  { nom: "Boké", region: "Boké", enregistrements: 14320, couverture: 58, population: 780_000, agents: 8, tendance: 12.1, couleur: "#3DAA78" },
  { nom: "Labé", region: "Labé", enregistrements: 12680, couverture: 54, population: 720_000, agents: 9, tendance: 6.3, couleur: "#0B3D2E" },
  { nom: "Mamou", region: "Mamou", enregistrements: 9870, couverture: 48, population: 580_000, agents: 7, tendance: 9.8, couleur: "#4F7942" },
  { nom: "Kankan", region: "Kankan", enregistrements: 22150, couverture: 61, population: 1_200_000, agents: 13, tendance: 11.4, couleur: "#1A5C42" },
  { nom: "Faranah", region: "Faranah", enregistrements: 8940, couverture: 39, population: 540_000, agents: 5, tendance: 4.2, couleur: "#6B8F71" },
  { nom: "Nzérékoré", region: "Nzérékoré", enregistrements: 19630, couverture: 56, population: 1_100_000, agents: 12, tendance: 15.6, couleur: "#2A7A58" },
];
