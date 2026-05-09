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

export const ENREGISTREMENTS: Enregistrement[] = [];

export const AGENTS: Agent[] = [];

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
