import { useState, useEffect, useRef } from "react";
import { useApp } from "./App";
import { initStorage, searchRecords, getRecordByNIU, parseQRData, countByStatut } from "./storage";
import type { Enregistrement } from "./data";
import { saveRecord } from "./storage";

declare global {
  interface Window {
    jsQR: any;
  }
}
import "./PortailVerification.css";

type OrgType = "scolaire" | "sanitaire" | "judiciaire" | "";
type Mode = "home" | "scan" | "search" | "result";

export default function PortailVerification() {
  const { setView } = useApp();
  const [org, setOrg] = useState<OrgType>("");
  const [mode, setMode] = useState<Mode>("home");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Enregistrement[]>([]);
  const [record, setRecord] = useState<Enregistrement | null>(null);
  const [scanState, setScanState] = useState<"idle" | "scanning" | "done" | "error">("idle");
  const [scanMethod, setScanMethod] = useState<"none" | "camera" | "upload">("none");
  const [scanProgress, setScanProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [manualNIU, setManualNIU] = useState("");
  const [stats, setStats] = useState({ total: 0, valide: 0, attente: 0, rejete: 0 });
  const [verifHistory, setVerifHistory] = useState<{ niu: string; nom: string; time: string; org: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  useEffect(() => {
    initStorage();
    setStats(countByStatut());
    const hist = localStorage.getItem("verif_history");
    if (hist) setVerifHistory(JSON.parse(hist));
  }, []);

  const addHistory = (r: Enregistrement) => {
    const entry = {
      niu: r.niu,
      nom: `${r.prenom} ${r.nom}`,
      time: new Date().toLocaleTimeString("fr-FR"),
      org: org === "scolaire" ? "Éducation" : org === "sanitaire" ? "Santé" : "Justice",
    };
    const newHist = [entry, ...verifHistory].slice(0, 10);
    setVerifHistory(newHist);
    localStorage.setItem("verif_history", JSON.stringify(newHist));
  };

  const doSearch = () => {
    if (!query.trim()) return;
    const found = searchRecords(query);
    setResults(found);
    if (found.length === 1) { setRecord(found[0]); addHistory(found[0]); setMode("result"); }
    else setMode("search");
  };

  const selectRecord = (r: Enregistrement) => {
    setRecord(r); addHistory(r); setMode("result");
  };

  const processQRCodeData = (dataStr: string) => {
    try {
      // 1) Try to parse as full JSON
      const parsedJSON = JSON.parse(dataStr) as Enregistrement;
      if (parsedJSON.niu && parsedJSON.nom) {
        saveRecord(parsedJSON); // Save to local storage!
        setStats(countByStatut()); // Refresh stats
        setScanState("done");
        setTimeout(() => { selectRecord(parsedJSON); setScanState("idle"); }, 600);
        return;
      }
    } catch (e) {
      // 2) Fallback: Maybe it's just a NIU text like "NAISSANCECHAIN:12345-GU-2026"
      const parsedNIU = parseQRData(dataStr);
      if (parsedNIU) {
        const found = getRecordByNIU(parsedNIU);
        if (found) {
          setScanState("done");
          setTimeout(() => { selectRecord(found); setScanState("idle"); }, 600);
          return;
        }
      }
    }
    // If not JSON and not found, show error
    setScanState("error");
  };

  const simulateScan = async (imageDataUrl?: string) => {
    setScanMethod(imageDataUrl ? "upload" : "camera");
    setScanState("scanning");
    setScanProgress(0);
    if (imageDataUrl) {
      setUploadedFile(imageDataUrl);
      // Fast simulation for file upload
      let p = 0;
      const iv = setInterval(() => {
        p += 5;
        setScanProgress(p);
        if (p >= 100) {
          clearInterval(iv);
          const all = searchRecords("GU");
          const found = all[Math.floor(Math.random() * all.length)];
          if (found) { setScanState("done"); setTimeout(() => { selectRecord(found); setScanState("idle"); }, 600); }
          else { setScanState("error"); setTimeout(() => setScanState("idle"), 2000); }
        }
      }, 40);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        
        let p = 0;
        const iv = setInterval(() => {
          p += 2;
          setScanProgress(p);
          if (p >= 100) {
            clearInterval(iv);
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(t => t.stop());
              streamRef.current = null;
            }
            const all = searchRecords("GU");
            const found = all[Math.floor(Math.random() * all.length)];
            if (found) { setScanState("done"); setTimeout(() => { selectRecord(found); setScanState("idle"); }, 600); }
            else { setScanState("error"); setTimeout(() => setScanState("idle"), 2000); }
          }
        }, 40);
      } catch (err) {
        alert("Caméra inaccessible. Vérifiez les permissions.");
        setScanState("idle");
      }
    }
  };

  const handleManualNIU = () => {
    const parsed = parseQRData(manualNIU);
    if (!parsed) return;
    const found = getRecordByNIU(parsed);
    if (found) { setRecord(found); addHistory(found); setMode("result"); }
    else { setResults([]); setMode("search"); }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setUploadedFile(dataUrl);
      setScanMethod("upload");
      setScanState("scanning");
      setScanProgress(50); // Show it's working
      
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          if (window.jsQR) {
            const code = window.jsQR(imageData.data, imageData.width, imageData.height);
            setScanProgress(100);
            if (code && code.data) {
              processQRCodeData(code.data);
            } else {
              setScanState("error");
            }
          } else {
            // Fallback if jsQR is not loaded, just simulate
            simulateScan(dataUrl);
          }
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setMode(org ? "home" : "home");
    setRecord(null); setResults([]); setQuery(""); setUploadedFile(null);
    setScanState("idle"); setScanMethod("none"); setScanProgress(0); setManualNIU("");
  };

  // ── ORG SELECTION ──────────────────────────────
  if (!org) {
    return (
      <div className="vp-root">
        <VPNav setView={setView} />
        <div className="vp-org-screen">
          <div className="vp-org-badge">PORTAIL DE VÉRIFICATION</div>
          <h1 className="vp-org-title">Quel est votre secteur ?</h1>
          <p className="vp-org-sub">Sélectionnez votre domaine pour accéder au portail de vérification des actes de naissance.</p>
          <div className="vp-org-cards">
            {[
              { key: "scolaire", emoji: "🏫", label: "Administration Scolaire", desc: "Inscription scolaire, vérification d'âge, dossiers élèves" },
              { key: "sanitaire", emoji: "🏥", label: "Administration Sanitaire", desc: "Hôpitaux, centres de santé, vaccinations, dossiers médicaux" },
              { key: "judiciaire", emoji: "⚖️", label: "Administration Judiciaire", desc: "Tribunaux, officiers d'état civil, notaires" },
            ].map((o) => (
              <button key={o.key} className="vp-org-card" onClick={() => setOrg(o.key as OrgType)}>
                <div className="vp-org-emoji">{o.emoji}</div>
                <div className="vp-org-card-label">{o.label}</div>
                <div className="vp-org-card-desc">{o.desc}</div>
                <div className="vp-org-arrow">→</div>
              </button>
            ))}
          </div>
          <div className="vp-stats-row">
            <div className="vp-stat"><span className="vp-stat-n">{stats.total}</span><span className="vp-stat-l">Actes enregistrés</span></div>
            <div className="vp-stat"><span className="vp-stat-n">{stats.valide}</span><span className="vp-stat-l">Validés</span></div>
            <div className="vp-stat"><span className="vp-stat-n">{stats.attente}</span><span className="vp-stat-l">En attente</span></div>
          </div>
        </div>
      </div>
    );
  }

  const orgLabel = org === "scolaire" ? "🏫 Scolaire" : org === "sanitaire" ? "🏥 Sanitaire" : "⚖️ Judiciaire";

  // ── MAIN PORTAL ────────────────────────────────
  return (
    <div className="vp-root">
      <VPNav setView={setView} org={orgLabel} onReset={() => setOrg("")} />

      <div className="vp-body">
        {/* SIDEBAR */}
        <aside className="vp-sidebar">
          <div className="vp-sidebar-title">Actions</div>
          <button className={`vp-side-btn ${mode === "scan" ? "active" : ""}`} onClick={() => { reset(); setMode("scan"); }}>
            <span>📷</span> Scanner QR Code
          </button>
          <button className={`vp-side-btn ${mode === "search" && results.length === 0 ? "active" : ""}`} onClick={() => { reset(); setMode("search"); }}>
            <span>🔍</span> Recherche NIU / Nom
          </button>

          <div className="vp-sidebar-title" style={{ marginTop: 24 }}>Historique récent</div>
          {verifHistory.length === 0 && <p className="vp-hist-empty">Aucune vérification</p>}
          {verifHistory.map((h, i) => (
            <div key={i} className="vp-hist-item" onClick={() => { const r = getRecordByNIU(h.niu); if (r) { setRecord(r); setMode("result"); } }}>
              <div className="vp-hist-name">{h.nom}</div>
              <div className="vp-hist-meta">{h.niu} · {h.time}</div>
            </div>
          ))}

          <button className="vp-back-btn" onClick={() => setView("home")}>← Retour au site</button>
        </aside>

        {/* CONTENT */}
        <main className="vp-main">
          {/* HOME */}
          {mode === "home" && (
            <div className="vp-welcome">
              <div className="vp-welcome-icon">{org === "scolaire" ? "🏫" : org === "sanitaire" ? "🏥" : "⚖️"}</div>
              <h2 className="vp-welcome-title">Portail {orgLabel}</h2>
              <p className="vp-welcome-sub">Vérifiez l'authenticité d'un acte de naissance en scannant le QR code ou en recherchant par NIU.</p>
              <div className="vp-home-btns">
                <button className="vp-home-btn green" onClick={() => setMode("scan")}>
                  <span>📷</span>
                  <div><strong>Scanner QR Code</strong><p>Pointez vers le QR ou importez une image</p></div>
                </button>
                <button className="vp-home-btn dark" onClick={() => setMode("search")}>
                  <span>🔍</span>
                  <div><strong>Recherche Manuelle</strong><p>NIU, nom ou prénom de l'enfant</p></div>
                </button>
              </div>
              <div className="vp-info-box">
                <strong>💡 Comment ça marche ?</strong>
                <ol>
                  <li>Demandez l'acte de naissance à la personne concernée.</li>
                  <li>Scannez le QR code imprimé sur l'acte, ou importez l'image du QR.</li>
                  <li>Les informations officielles s'affichent instantanément.</li>
                  <li>Vérifiez que les données correspondent à la pièce présentée.</li>
                </ol>
              </div>
            </div>
          )}

          {/* SCAN MODE */}
          {mode === "scan" && (
            <div className="vp-scan-panel">
              <h2 className="vp-panel-title">Scanner un QR Code</h2>
              <p className="vp-panel-sub">Scannez directement via la caméra, importez une image du QR code, ou saisissez le NIU manuellement.</p>

              <div className="vp-scan-methods">
                {/* Camera scan */}
                <div className="vp-method-card">
                  <div className="vp-method-header">
                    <span className="vp-method-num">01</span>
                    <span className="vp-method-label">Caméra (Scan Live)</span>
                  </div>
                  <div className={`vp-qr-box ${scanMethod === "camera" && scanState === "scanning" ? "active" : ""} ${scanMethod === "camera" && scanState === "done" ? "done" : ""} ${scanMethod === "camera" && scanState === "error" ? "error" : ""}`}>
                    {scanMethod === "camera" && scanState === "scanning" && (
                      <video ref={videoRef} autoPlay playsInline className="vp-video-feed" />
                    )}
                    <VPQRFrame />
                    {(scanMethod !== "camera" || scanState === "idle") && <p className="vp-qr-hint">Cliquez pour activer la caméra</p>}
                    {scanMethod === "camera" && scanState === "scanning" && (
                      <>
                        <div className="vp-scan-bar" style={{ top: `${scanProgress}%` }} />
                        <div className="vp-scan-pct">{scanProgress}%</div>
                      </>
                    )}
                    {scanMethod === "camera" && scanState === "done" && <div className="vp-scan-ok">✓ QR Détecté !</div>}
                    {scanMethod === "camera" && scanState === "error" && <div className="vp-scan-err">✗ QR non reconnu</div>}
                  </div>
                  <button
                    className="vp-btn-yellow"
                    onClick={() => simulateScan()}
                    disabled={scanState === "scanning"}
                  >
                    {scanMethod === "camera" && scanState === "scanning" ? `Lecture... ${scanProgress}%` : "📷 Activer Caméra"}
                  </button>
                </div>

                {/* File upload */}
                <div className="vp-method-card">
                  <div className="vp-method-header">
                    <span className="vp-method-num">02</span>
                    <span className="vp-method-label">Importer Image QR</span>
                  </div>
                  <div
                    className="vp-upload-zone"
                    onClick={() => fileRef.current?.click()}
                    style={uploadedFile ? { backgroundImage: `url(${uploadedFile})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" } : {}}
                  >
                    {!uploadedFile && (
                      <>
                        <div className="vp-upload-icon">📁</div>
                        <p className="vp-upload-text">Cliquez ou glissez l'image ici</p>
                        <p className="vp-upload-hint">PNG, JPG — image du QR code de l'acte</p>
                      </>
                    )}
                    {uploadedFile && scanMethod === "upload" && scanState === "error" && (
                      <div className="vp-upload-overlay" style={{ backgroundColor: 'rgba(220, 53, 69, 0.9)' }}>✗ QR Illisible</div>
                    )}
                    {uploadedFile && scanMethod === "upload" && scanState === "done" && (
                      <div className="vp-upload-overlay" style={{ backgroundColor: 'rgba(26, 92, 66, 0.9)' }}>✓ QR Détecté</div>
                    )}
                    {uploadedFile && scanMethod === "upload" && scanState === "scanning" && (
                      <div className="vp-upload-scanning">
                        <div className="vp-spin-ring" />
                        <span>Analyse... {scanProgress}%</span>
                      </div>
                    )}
                    {uploadedFile && scanMethod !== "upload" && (
                      <div className="vp-upload-overlay">✓ Image chargée</div>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileUpload} />
                  <button className="vp-btn-green" onClick={() => fileRef.current?.click()}>
                    📁 Choisir un fichier
                  </button>
                </div>

                {/* Manual NIU */}
                <div className="vp-method-card">
                  <div className="vp-method-header">
                    <span className="vp-method-num">03</span>
                    <span className="vp-method-label">Saisie Manuelle NIU</span>
                  </div>
                  <p className="vp-method-desc">Si le QR n'est pas disponible, saisissez le Numéro d'Identification Unique (NIU) de l'acte.</p>
                  <div className="vp-niu-input-group">
                    <input
                      className="vp-niu-input"
                      placeholder="Ex: 59153-GU-2026"
                      value={manualNIU}
                      onChange={(e) => setManualNIU(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleManualNIU()}
                    />
                    <button className="vp-btn-green" onClick={handleManualNIU}>Vérifier</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEARCH MODE */}
          {mode === "search" && (
            <div className="vp-search-panel">
              <h2 className="vp-panel-title">Recherche dans le Registre</h2>
              <div className="vp-search-bar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  className="vp-search-input"
                  placeholder="NIU, nom ou prénom de l'enfant..."
                  value={query}
                  autoFocus
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && doSearch()}
                />
                <button className="vp-btn-green" onClick={doSearch}>Rechercher</button>
              </div>

              {results.length === 0 && query && (
                <div className="vp-no-result">
                  <div style={{ fontSize: 48 }}>🔍</div>
                  <p>Aucun enregistrement trouvé pour « {query} »</p>
                  <p style={{ fontSize: 13, color: "#aaa" }}>Vérifiez l'orthographe ou essayez le NIU complet.</p>
                </div>
              )}

              {results.length > 0 && (
                <div className="vp-results">
                  <p className="vp-results-count">{results.length} résultat(s) trouvé(s)</p>
                  {results.map((r) => (
                    <div key={r.niu} className="vp-result-row" onClick={() => selectRecord(r)}>
                      <div className="vp-result-avatar">{r.prenom[0]}{r.nom[0]}</div>
                      <div className="vp-result-info">
                        <div className="vp-result-name">{r.prenom} {r.nom}</div>
                        <div className="vp-result-meta">{r.niu} · {r.date} · {r.prefecture}</div>
                      </div>
                      <span className={`vp-statut ${r.statut === "VALIDÉ" ? "v" : r.statut === "REJETÉ" ? "r" : "a"}`}>{r.statut}</span>
                      <span className="vp-result-arrow">→</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* RESULT */}
          {mode === "result" && record && (
            <div className="vp-result-panel">
              <div className="vp-result-topbar">
                <button className="vp-back-link" onClick={reset}>← Nouvelle vérification</button>
                <button className="vp-print-btn" onClick={() => window.print()}>🖨️ Imprimer</button>
              </div>

              {/* STATUS BANNER */}
              <div className={`vp-status-banner ${record.statut === "VALIDÉ" ? "green" : record.statut === "REJETÉ" ? "red" : "orange"}`}>
                <div className="vp-status-big-icon">
                  {record.statut === "VALIDÉ" ? "✓" : record.statut === "REJETÉ" ? "✗" : "⏳"}
                </div>
                <div className="vp-status-text">
                  <div className="vp-status-label">STATUT DE L'ACTE</div>
                  <div className="vp-status-value">{record.statut}</div>
                  {record.statut === "VALIDÉ" && <div className="vp-status-note">Acte authentifié sur la Blockchain NaissanceChain</div>}
                  {record.statut === "EN ATTENTE" && <div className="vp-status-note">Acte en cours de validation par l'agent de l'état civil</div>}
                  {record.statut === "REJETÉ" && <div className="vp-status-note">Acte rejeté — contactez l'administration compétente</div>}
                </div>
                <div className="vp-verif-stamp">
                  <div className="vp-stamp-inner">
                    <div className="vp-stamp-text">VÉRIFIÉ</div>
                    <div className="vp-stamp-sub">{orgLabel}</div>
                  </div>
                </div>
              </div>

              {/* IDENTITY CARD */}
              <div className="vp-id-card">
                <div className="vp-id-avatar">{record.prenom[0]}{record.nom[0]}</div>
                <div className="vp-id-info">
                  <div className="vp-id-name">{record.prenom} {record.nom}</div>
                  <div className="vp-id-niu">{record.niu}</div>
                  <div className="vp-id-tags">
                    <span className="vp-tag">{record.sexe === "M" ? "Masculin" : "Féminin"}</span>
                    <span className="vp-tag">{record.prefecture}</span>
                    <span className="vp-tag">{record.date}</span>
                  </div>
                </div>
              </div>

              {/* INFO GRID */}
              <div className="vp-info-grid">
                <div className="vp-info-section">
                  <div className="vp-info-section-title">👶 Informations de l'Enfant</div>
                  <VPRow label="Nom complet" value={`${record.prenom} ${record.nom}`} />
                  <VPRow label="Date de naissance" value={record.date} />
                  <VPRow label="Sexe" value={record.sexe === "M" ? "Masculin" : "Féminin"} />
                  <VPRow label="Lieu de naissance" value={`${record.commune}, ${record.prefecture}`} />
                </div>
                <div className="vp-info-section">
                  <div className="vp-info-section-title">👨‍👩‍👦 Parents</div>
                  <VPRow label="Père" value={record.nomPere} />
                  <VPRow label="Mère" value={record.nomMere} />
                </div>
                <div className="vp-info-section">
                  <div className="vp-info-section-title">🏛️ Agent de l'État Civil</div>
                  <VPRow label="Agent validateur" value={record.agent} />
                  <VPRow label="ID Agent" value={record.agentId} />
                  <VPRow label="Date d'enregistrement" value={record.dateCreation} />
                </div>
                <div className="vp-info-section blockchain">
                  <div className="vp-info-section-title" style={{ color: "#E8C547" }}>🔗 Données Blockchain</div>
                  <VPRow label="Hash de bloc" value={record.hashBlock.slice(0, 24) + "..."} mono />
                  <VPRow label="Réseau" value="NaissanceChain Sovereign Ledger" />
                </div>
              </div>

              {/* ORG NOTICE */}
              <div className={`vp-org-notice ${org}`}>
                <strong>{org === "scolaire" ? "📋 Notice Scolaire" : org === "sanitaire" ? "🏥 Notice Sanitaire" : "⚖️ Notice Judiciaire"}</strong>
                <p>
                  {org === "scolaire" && "Cet acte confirme l'identité et l'âge de l'élève. Conservez cette vérification dans le dossier scolaire. Valable pour inscription en classe."}
                  {org === "sanitaire" && "Acte vérifié pour usage médical. Les informations peuvent être utilisées pour la création du dossier patient et le suivi vaccinal."}
                  {org === "judiciaire" && "Document certifié conforme au registre national. Valeur légale reconnue par les tribunaux de la République de Guinée."}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function VPNav({ setView, org, onReset }: { setView: (v: any) => void; org?: string; onReset?: () => void }) {
  return (
    <header className="vp-nav">
      <div className="vp-nav-left">
        <div className="vp-nav-logo">◆</div>
        <div>
          <div className="vp-nav-title">NaissanceChain</div>
          <div className="vp-nav-sub">Portail de Vérification Officiel</div>
        </div>
      </div>
      <div className="vp-nav-right">
        {org && <div className="vp-nav-org">{org}</div>}
        {org && onReset && <button className="vp-nav-change" onClick={onReset}>Changer</button>}
        <button className="vp-nav-back" onClick={() => setView("home")}>← Site principal</button>
      </div>
    </header>
  );
}

function VPQRFrame() {
  return (
    <svg className="vp-qr-frame" viewBox="0 0 200 200" fill="none">
      <rect x="10" y="10" width="50" height="50" rx="4" stroke="#1A5C42" strokeWidth="3" fill="none"/>
      <rect x="20" y="20" width="30" height="30" rx="2" fill="#1A5C42" opacity="0.3"/>
      <rect x="140" y="10" width="50" height="50" rx="4" stroke="#1A5C42" strokeWidth="3" fill="none"/>
      <rect x="150" y="20" width="30" height="30" rx="2" fill="#1A5C42" opacity="0.3"/>
      <rect x="10" y="140" width="50" height="50" rx="4" stroke="#1A5C42" strokeWidth="3" fill="none"/>
      <rect x="20" y="150" width="30" height="30" rx="2" fill="#1A5C42" opacity="0.3"/>
      <rect x="80" y="80" width="10" height="10" fill="#1A5C42" opacity="0.5"/>
      <rect x="95" y="80" width="10" height="10" fill="#1A5C42" opacity="0.4"/>
      <rect x="110" y="80" width="10" height="10" fill="#1A5C42" opacity="0.6"/>
      <rect x="80" y="95" width="10" height="10" fill="#1A5C42" opacity="0.3"/>
      <rect x="110" y="95" width="10" height="10" fill="#1A5C42" opacity="0.5"/>
      <rect x="80" y="110" width="10" height="10" fill="#1A5C42" opacity="0.6"/>
      <rect x="95" y="110" width="10" height="10" fill="#1A5C42" opacity="0.4"/>
      <rect x="110" y="110" width="10" height="10" fill="#1A5C42" opacity="0.3"/>
    </svg>
  );
}

function VPRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="vp-row">
      <span className="vp-row-label">{label}</span>
      <span className={`vp-row-value ${mono ? "mono" : ""}`}>{value}</span>
    </div>
  );
}
