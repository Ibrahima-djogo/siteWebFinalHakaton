import { useState, useRef, useEffect } from "react";
import "./pages.css";
import "./pages-content.css";
import { ENREGISTREMENTS, AGENTS } from "./data";
import type { Enregistrement } from "./data";

export default function PageVerification() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Enregistrement | null | "notfound">(null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeMethod, setActiveMethod] = useState<"qr" | "niu" | "nom">("niu");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    const q = query.trim().toUpperCase();
    const found = ENREGISTREMENTS.find(
      (e) =>
        e.niu.toUpperCase().includes(q) ||
        e.nom.toUpperCase().includes(q) ||
        e.prenom.toUpperCase().includes(q)
    );
    setResult(found ?? "notfound");
  };

  const startCamera = async () => {
    setResult(null);
    setUploadedImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setScanning(true);
      setScanProgress(0);

      // Simulate detection after 3 seconds of real video feed
      let p = 0;
      const interval = setInterval(() => {
        p += 2;
        setScanProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          stopCamera();
          setScanning(false);
          setResult(ENREGISTREMENTS[0]);
        }
      }, 60);
    } catch (err) {
      alert("Impossible d'accéder à la caméra. Veuillez vérifier les permissions.");
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedImage(ev.target?.result as string);
      // For file upload, we just simulate the scan without camera
      setScanning(true);
      setScanProgress(0);
      let p = 0;
      const iv = setInterval(() => {
        p += 5;
        setScanProgress(p);
        if (p >= 100) {
          clearInterval(iv);
          setScanning(false);
          setResult(ENREGISTREMENTS[1]);
        }
      }, 40);
    };
    reader.readAsDataURL(file);
  };

  const agent = result && result !== "notfound"
    ? AGENTS.find((a) => a.id === result.agentId)
    : null;

  return (
    <div className="page-container full-width">
      <div className="page-header-premium">
        <div className="page-header-inner">
          <div className="page-title-group">
            <div className="page-icon-circle-premium green">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <h2 className="page-title-xl">Vérification d'Identité</h2>
              <p className="page-sub-lg">Outil de contrôle et d'authentification des actes de naissance numériques</p>
            </div>
          </div>
        </div>
      </div>

      {/* METHOD TABS */}
      <div className="method-tabs">
        <button
          className={`method-tab ${activeMethod === "qr" ? "active" : ""}`}
          onClick={() => { setActiveMethod("qr"); setResult(null); }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/>
            <rect x="19" y="14" width="2" height="2"/><rect x="14" y="19" width="2" height="2"/>
            <rect x="18" y="18" width="3" height="3"/>
          </svg>
          Scanner QR Code
        </button>
        <button
          className={`method-tab ${activeMethod === "niu" ? "active" : ""}`}
          onClick={() => { setActiveMethod("niu"); setResult(null); setQuery(""); }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Recherche par NIU
        </button>
        <button
          className={`method-tab ${activeMethod === "nom" ? "active" : ""}`}
          onClick={() => { setActiveMethod("nom"); setResult(null); setQuery(""); }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          Recherche par Nom
        </button>
      </div>

      <div className="verif-layout">
        {/* LEFT: INPUT */}
        <div className="verif-input-panel">
          {activeMethod === "qr" && (
            <div className="qr-panel">
              <div className={`qr-scanner-box ${scanning ? "scanning" : ""}`}>
                <div className="qr-corner tl"/><div className="qr-corner tr"/>
                <div className="qr-corner bl"/><div className="qr-corner br"/>
                {scanning && !uploadedImage && (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="qr-video-feed"
                  />
                )}
                {uploadedImage && (
                  <img src={uploadedImage} className="qr-uploaded-preview" alt="QR Upload" />
                )}
                {scanning && <div className="qr-scan-line" style={{ top: `${scanProgress}%` }}/>}
                {!scanning && !uploadedImage && (
                  <div className="qr-placeholder">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/>
                      <rect x="5" y="5" width="3" height="3" fill="#ccc" stroke="none"/>
                      <rect x="16" y="5" width="3" height="3" fill="#ccc" stroke="none"/>
                      <rect x="5" y="16" width="3" height="3" fill="#ccc" stroke="none"/>
                    </svg>
                    <p className="qr-placeholder-text">Pointez le QR code de l'acte vers la caméra</p>
                  </div>
                )}
                {scanning && (
                  <div className="qr-scanning-text">
                    <div className="qr-spin"/>
                    Lecture en cours... {scanProgress}%
                  </div>
                )}
              </div>
              <div className="verif-actions-row">
                <button className="btn-scan" onClick={startCamera} disabled={scanning}>
                  {scanning ? "Scan en cours..." : "📷 Lancer la Caméra"}
                </button>
                <div className="btn-upload-wrapper">
                  <input 
                    type="file" 
                    id="qr-upload" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    style={{ display: 'none' }} 
                  />
                  <label htmlFor="qr-upload" className="btn-upload-label">
                    📁 Charger Image QR
                  </label>
                </div>
              </div>
              <p className="qr-hint">
                Vous pouvez scanner avec votre caméra ou importer une photo/capture d'écran d'un QR code NaissanceChain.
              </p>
            </div>
          )}

          {(activeMethod === "niu" || activeMethod === "nom") && (
            <div className="search-panel">
              <div className="search-input-group">
                <svg className="search-icon-inner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  className="search-input"
                  placeholder={activeMethod === "niu" ? "Ex: 59153-GU-2026" : "Ex: Mamadou Diallo"}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button className="btn-search" onClick={handleSearch}>Vérifier</button>
              </div>



              <div className="verif-info-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>
                  {activeMethod === "niu"
                    ? "Le NIU (Numéro d'Identification Unique) est imprimé sur l'acte de naissance officiel."
                    : "La recherche par nom retourne toutes les correspondances dans le registre national."}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: RESULT */}
        <div className="verif-result-panel">
          {result === null && (
            <div className="verif-empty">
              <div className="verif-empty-icon">🔍</div>
              <p className="verif-empty-title">Aucune recherche effectuée</p>
              <p className="verif-empty-sub">Entrez un NIU, un nom ou scannez un QR code pour vérifier un enregistrement.</p>
            </div>
          )}

          {result === "notfound" && (
            <div className="verif-notfound">
              <div className="verif-notfound-icon">✗</div>
              <p className="verif-notfound-title">Aucun enregistrement trouvé</p>
              <p className="verif-notfound-sub">Ce NIU ou nom n'existe pas dans le registre national. Vérifiez l'orthographe ou contactez l'administration.</p>
            </div>
          )}

          {result && result !== "notfound" && (
            <div className="verif-card-result">
              {/* STATUS BANNER */}
              <div className={`verif-status-banner ${result.statut === "VALIDÉ" ? "green" : result.statut === "REJETÉ" ? "red" : "yellow"}`}>
                <div className="verif-status-icon">
                  {result.statut === "VALIDÉ" ? "✓" : result.statut === "REJETÉ" ? "✗" : "⏳"}
                </div>
                <div>
                  <div className="verif-status-label">STATUT BLOCKCHAIN</div>
                  <div className="verif-status-value">{result.statut}</div>
                </div>
                <div className="verif-hash-badge">
                  <span className="verif-hash-label">HASH</span>
                  <span className="verif-hash-value">{result.hashBlock.slice(0, 18)}...</span>
                </div>
              </div>

              {/* CHILD INFO */}
              <div className="verif-section">
                <div className="verif-section-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  Identité de l'Enfant
                </div>
                <div className="verif-info-grid">
                  <InfoItem label="Nom complet" value={`${result.prenom} ${result.nom}`} highlight />
                  <InfoItem label="NIU" value={result.niu} mono />
                  <InfoItem label="Sexe" value={result.sexe === "M" ? "Masculin" : "Féminin"} />
                  <InfoItem label="Date de naissance" value={result.date} />
                  <InfoItem label="Préfecture" value={result.prefecture} />
                  <InfoItem label="Commune" value={result.commune} />
                  <InfoItem label="Père" value={result.nomPere} />
                  <InfoItem label="Mère" value={result.nomMere} />
                </div>
              </div>

              {/* AGENT INFO */}
              {agent && (
                <div className="verif-section">
                  <div className="verif-section-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Agent Validateur de l'État Civil
                  </div>
                  <div className="agent-card-mini">
                    <div className="agent-avatar-lg">{agent.avatar}</div>
                    <div className="agent-info-block">
                      <div className="agent-name-lg">{agent.prenom} {agent.nom}</div>
                      <div className="agent-grade-lg">{agent.grade} — {agent.prefecture}</div>
                      <div className="agent-id-lg">ID: {agent.id}</div>
                      <div className="agent-contacts">
                        <span>📞 {agent.tel}</span>
                        <span>✉ {agent.email}</span>
                      </div>
                    </div>
                    <div className={`agent-statut-badge ${agent.statut === "ACTIF" ? "actif" : "inactif"}`}>
                      {agent.statut}
                    </div>
                  </div>
                </div>
              )}

              {/* BLOCKCHAIN INFO */}
              <div className="verif-section blockchain-section">
                <div className="verif-section-title" style={{ color: "#E8C547" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8C547" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  Données Blockchain
                </div>
                <div className="blockchain-info-row">
                  <span className="bc-label">Hash de bloc</span>
                  <span className="bc-value mono">{result.hashBlock}</span>
                </div>
                <div className="blockchain-info-row">
                  <span className="bc-label">Date d'enregistrement</span>
                  <span className="bc-value">{result.dateCreation}</span>
                </div>
                <div className="blockchain-info-row">
                  <span className="bc-label">Réseau</span>
                  <span className="bc-value">NaissanceChain Sovereign Ledger v2.4</span>
                </div>
                <div className="bc-verified-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
                  Enregistrement vérifié sur la blockchain guinéenne
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, highlight = false, mono = false }: { label: string; value: string; highlight?: boolean; mono?: boolean }) {
  return (
    <div className="info-item">
      <span className="info-label">{label}</span>
      <span className={`info-value ${highlight ? "highlight" : ""} ${mono ? "mono" : ""}`}>{value}</span>
    </div>
  );
}
