import { useState } from "react";
import "./pages.css";
import "./PortailNational.css";
import { useApp } from "./App";
import PageEnregistrements from "./PageEnregistrements";
import PageVerification from "./PageVerification";
import PagePrefectures from "./PagePrefectures";
import PageAgents from "./PageAgents";
import PageParametres from "./PageParametres";

const recentRecords = [
  { niu: "59153-GU-2026", nom: "Mamadou Diallo", date: "15 janv. 2026", prefecture: "Kindia", statut: "EN ATTENTE" },
  { niu: "59154-GU-2026", nom: "Fatoumata Camara", date: "16 janv. 2026", prefecture: "Conakry", statut: "VALIDÉ" },
  { niu: "59155-GU-2026", nom: "Ibrahim Bah", date: "17 janv. 2026", prefecture: "Labé", statut: "VALIDÉ" },
  { niu: "59156-GU-2026", nom: "Mariama Kouyaté", date: "18 janv. 2026", prefecture: "Kankan", statut: "EN ATTENTE" },
  { niu: "59157-GU-2026", nom: "Oumar Sylla", date: "19 janv. 2026", prefecture: "Boké", statut: "VALIDÉ" },
];

export default function PortailNational() {
  const { setView } = useApp();
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="portail-root">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">◆</div>
          <div>
            <div className="sidebar-logo-title">Souveraineté</div>
            <div className="sidebar-logo-sub">Numérique</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">PRINCIPAL</div>
          <button
            className={`sidebar-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Tableau de Bord
          </button>
          <button
            className={`sidebar-item ${activeTab === "enregistrements" ? "active" : ""}`}
            onClick={() => setActiveTab("enregistrements")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
            Enregistrements
          </button>
          <button
            className={`sidebar-item ${activeTab === "verification" ? "active" : ""}`}
            onClick={() => setActiveTab("verification")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Vérification
          </button>
          <button
            className={`sidebar-item ${activeTab === "prefectures" ? "active" : ""}`}
            onClick={() => setActiveTab("prefectures")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            Préfectures
          </button>

          <div className="sidebar-section-label" style={{ marginTop: 24 }}>ADMINISTRATION</div>
          <button
            className={`sidebar-item ${activeTab === "agents" ? "active" : ""}`}
            onClick={() => setActiveTab("agents")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            Agents
          </button>
          <button
            className={`sidebar-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 0 0 5 5l-1.5 1.5"/><path d="M2 12h3m14 0h3M12 2v3m0 14v3"/></svg>
            Paramètres
          </button>
        </nav>

        <div className="sidebar-back">
          <button className="sidebar-back-btn" onClick={() => setView("home")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><polyline points="12,19 5,12 12,5"/></svg>
            Retour au site
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="portail-main">
        {/* TOPBAR - ONLY FOR DASHBOARD */}
        {activeTab === "dashboard" && (
          <header className="portail-header">
            <div>
              <h1 className="portail-page-title">Registre National de l'État Civil</h1>
              <p className="portail-page-sub">Portail d'administration — République de Guinée</p>
            </div>
            <div className="portail-header-actions">
              <button className="btn-new-record" onClick={() => setView("enregistrement")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Nouvel Enregistrement
              </button>
              <div className="portail-avatar">AD</div>
            </div>
          </header>
        )}

        {activeTab === "dashboard" && (
          <div className="portail-content">
            {/* KPI CARDS */}
            <div className="kpi-grid">
              <div className="kpi-card white">
                <div className="kpi-label">NAISSANCES ENREGISTRÉES</div>
                <div className="kpi-value">1 200 001</div>
                <div className="kpi-trend up">▲ +12.4% ce mois</div>
              </div>
              <div className="kpi-card green">
                <div className="kpi-label">CE MOIS-CI</div>
                <div className="kpi-value">14 851</div>
                <div className="kpi-badge-row">
                  <span className="blockchain-dot"></span>
                  <span className="kpi-badge-text">Blockchain Active</span>
                </div>
              </div>
              <div className="kpi-card yellow">
                <div className="kpi-label">COUVERTURE NATIONALE</div>
                <div className="kpi-value">58%</div>
                <div className="kpi-progress-bar">
                  <div className="kpi-progress-fill" style={{ width: "58%" }}></div>
                </div>
                <div className="kpi-progress-label">Objectif: 95% en 2028</div>
              </div>
            </div>

            {/* RECENT RECORDS */}
            <div className="table-section">
              <div className="table-header">
                <h2 className="table-title">Enregistrements Récents</h2>
                <button className="voir-tout" onClick={() => setActiveTab("enregistrements")}>Voir tout →</button>
              </div>
              <div className="table-wrapper">
                <table className="records-table">
                  <thead>
                    <tr>
                      <th>NIU</th>
                      <th>NOM COMPLET</th>
                      <th>DATE NAISSANCE</th>
                      <th>PRÉFECTURE</th>
                      <th>STATUT</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRecords.map((r) => (
                      <tr key={r.niu}>
                        <td className="niu-cell">{r.niu}</td>
                        <td className="nom-cell">{r.nom}</td>
                        <td>{r.date}</td>
                        <td>{r.prefecture}</td>
                        <td>
                          <span className={`statut-badge ${r.statut === "VALIDÉ" ? "valide" : "attente"}`}>
                            {r.statut}
                          </span>
                        </td>
                        <td>
                          <button className="voir-acte">Voir l'acte →</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* BOTTOM CARDS */}
            <div className="bottom-grid">
              <div className="mission-card">
                <h3 className="mission-title">Notre Mission</h3>
                <p className="mission-desc">
                  Donner une identité juridique à chaque enfant guinéen grâce à la blockchain.
                </p>
                <p className="mission-highlight">
                  1,8 million d'enfants sans acte de naissance<br />
                  = 1,8 million d'enfants invisibles au système.
                </p>
                <button className="btn-savoir-plus" onClick={() => setView("home")}>En savoir plus</button>
              </div>

              <div className="blockchain-card">
                <h3 className="blockchain-title">Pourquoi la Blockchain?</h3>
                <ul className="blockchain-list">
                  <li><span className="check">✓</span><span><strong>Indestructible</strong> — Les archives papier brûlent, la blockchain reste</span></li>
                  <li><span className="check">✓</span><span><strong>Infalsifiable</strong> — Aucune modification rétroactive possible</span></li>
                  <li><span className="check">✓</span><span><strong>Accessible</strong> — Vérifiable depuis n'importe quel appareil</span></li>
                  <li><span className="check">✓</span><span><strong>Souverain</strong> — 100% contrôlée par l'État guinéen</span></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "enregistrements" && <PageEnregistrements />}
        {activeTab === "verification" && <PageVerification />}
        {activeTab === "prefectures" && <PagePrefectures />}
        {activeTab === "agents" && <PageAgents />}
        {activeTab === "settings" && <PageParametres />}
      </main>
    </div>
  );
}
