import { useState, useMemo } from "react";
import "./pages.css";
import "./pages-content.css";
import { ENREGISTREMENTS } from "./data";
import { useApp } from "./App";

type Filtre = "TOUS" | "VALIDÉ" | "EN ATTENTE" | "REJETÉ";

export default function PageEnregistrements() {
  const { setView } = useApp();
  const [filtre, setFiltre] = useState<Filtre>("TOUS");
  const [search, setSearch] = useState("");
  const [prefectureFilter, setPrefectureFilter] = useState("TOUTES");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const PER_PAGE = 8;

  const prefectures = ["TOUTES", ...Array.from(new Set(ENREGISTREMENTS.map((e) => e.prefecture)))];

  const filtered = useMemo(() => {
    return ENREGISTREMENTS.filter((e) => {
      const matchFiltre = filtre === "TOUS" || e.statut === filtre;
      const matchSearch =
        search === "" ||
        e.niu.toLowerCase().includes(search.toLowerCase()) ||
        e.nom.toLowerCase().includes(search.toLowerCase()) ||
        e.prenom.toLowerCase().includes(search.toLowerCase());
      const matchPref = prefectureFilter === "TOUTES" || e.prefecture === prefectureFilter;
      return matchFiltre && matchSearch && matchPref;
    });
  }, [filtre, search, prefectureFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const selectedRecord = selected ? ENREGISTREMENTS.find((e) => e.niu === selected) : null;

  const counts = {
    TOUS: ENREGISTREMENTS.length,
    VALIDÉ: ENREGISTREMENTS.filter((e) => e.statut === "VALIDÉ").length,
    "EN ATTENTE": ENREGISTREMENTS.filter((e) => e.statut === "EN ATTENTE").length,
    REJETÉ: ENREGISTREMENTS.filter((e) => e.statut === "REJETÉ").length,
  };

  return (
    <div className="page-container full-width">
      <div className="page-header-premium">
        <div className="page-header-inner">
          <div className="page-title-group">
            <div className="page-icon-circle-premium">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
            </div>
            <div>
              <h2 className="page-title-xl">Registre National</h2>
              <p className="page-sub-lg">{ENREGISTREMENTS.length} actes de naissance sécurisés par la blockchain</p>
            </div>
          </div>
          <button className="btn-add-agent" onClick={() => setView("enregistrement")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nouvel Acte
          </button>
        </div>
      </div>

      <div className="filter-tabs-row">
        <div className="filter-tabs">
          {(["TOUS", "VALIDÉ", "EN ATTENTE", "REJETÉ"] as Filtre[]).map((f) => (
            <button
              key={f}
              className={`filter-tab ${filtre === f ? "active" : ""} ${f === "VALIDÉ" ? "green" : f === "EN ATTENTE" ? "yellow" : f === "REJETÉ" ? "red" : ""}`}
              onClick={() => { setFiltre(f); setPage(1); }}
            >
              {f} <span className="filter-count">{counts[f]}</span>
            </button>
          ))}
        </div>
        <div className="filter-controls">
          <div className="search-box-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input placeholder="Rechercher NIU, nom..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select className="pref-select" value={prefectureFilter} onChange={(e) => { setPrefectureFilter(e.target.value); setPage(1); }}>
            {prefectures.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="enreg-layout">
        <div className={`table-panel ${selected ? "shrunk" : ""}`}>
          <div className="table-wrapper">
            <table className="records-table">
              <thead>
                <tr>
                  <th>NIU</th><th>NOM COMPLET</th><th>SEXE</th><th>DATE</th>
                  <th>PRÉFECTURE</th><th>STATUT</th><th>AGENT</th><th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((r) => (
                  <tr key={r.niu} className={selected === r.niu ? "row-selected" : ""} onClick={() => setSelected(selected === r.niu ? null : r.niu)}>
                    <td className="niu-cell">{r.niu}</td>
                    <td className="nom-cell">{r.prenom} {r.nom}</td>
                    <td><span className={`sexe-badge ${r.sexe}`}>{r.sexe === "M" ? "♂" : "♀"}</span></td>
                    <td>{r.date}</td>
                    <td>{r.prefecture}</td>
                    <td>
                      <span className={`statut-badge ${r.statut === "VALIDÉ" ? "valide" : r.statut === "REJETÉ" ? "rejete" : "attente"}`}>
                        {r.statut}
                      </span>
                    </td>
                    <td className="agent-cell">{r.agent}</td>
                    <td>
                      <button className="voir-acte" onClick={(e) => { e.stopPropagation(); setSelected(r.niu); }}>Détails →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-row">
            <span className="pagination-info">{filtered.length} résultats — Page {page}/{Math.max(totalPages,1)}</span>
            <div className="pagination-btns">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>←</button>
              {Array.from({ length: Math.max(totalPages, 1) }, (_, i) => i + 1).map((n) => (
                <button key={n} className={n === page ? "active" : ""} onClick={() => setPage(n)}>{n}</button>
              ))}
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>→</button>
            </div>
          </div>
        </div>

        {/* MODAL DETAIL */}
        {selectedRecord && (
          <div className="modal-overlay" onClick={() => setSelected(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="detail-panel-header">
                <span className="detail-panel-title">Détail de l'Acte</span>
                <button className="detail-close" onClick={() => setSelected(null)}>✕</button>
              </div>
              <div className={`detail-status ${selectedRecord.statut === "VALIDÉ" ? "green" : selectedRecord.statut === "REJETÉ" ? "red" : "yellow"}`}>
                {selectedRecord.statut === "VALIDÉ" ? "✓" : selectedRecord.statut === "REJETÉ" ? "✗" : "⏳"} {selectedRecord.statut}
              </div>
              <div className="detail-niu">{selectedRecord.niu}</div>
              <div className="detail-name">{selectedRecord.prenom} {selectedRecord.nom}</div>
              <div className="detail-rows">
                {[
                  ["Sexe", selectedRecord.sexe === "M" ? "Masculin" : "Féminin"],
                  ["Date de naissance", selectedRecord.date],
                  ["Préfecture", selectedRecord.prefecture],
                  ["Commune", selectedRecord.commune],
                  ["Père", selectedRecord.nomPere],
                  ["Mère", selectedRecord.nomMere],
                  ["Agent", selectedRecord.agent],
                  ["Date création", selectedRecord.dateCreation],
                ].map(([l, v]) => (
                  <div key={l} className="detail-row">
                    <span className="detail-row-label">{l}</span>
                    <span className="detail-row-value">{v}</span>
                  </div>
                ))}
              </div>
              <div className="detail-hash">
                <span className="detail-hash-label">HASH BLOCKCHAIN</span>
                <span className="detail-hash-value">{selectedRecord.hashBlock}</span>
              </div>
              <div className="detail-actions">
                <button className="btn-detail-primary">Imprimer l'Acte de Naissance</button>
                <button className="btn-detail-secondary">Télécharger le certificat numérique</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
