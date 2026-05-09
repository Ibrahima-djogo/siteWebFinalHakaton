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

export const PREFECTURES: Prefecture[] = [];
