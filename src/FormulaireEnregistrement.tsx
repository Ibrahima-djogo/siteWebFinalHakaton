import { useState } from "react";
import "./pages.css";
import "./FormulaireEnregistrement.css";
import { useApp } from "./App";
import { saveRecord, initStorage } from "./storage";
import type { Enregistrement } from "./data";
type Step = 1 | 2 | 3 | 4;

export default function FormulaireEnregistrement() {
  const { setView } = useApp();
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);

  const [generatedNiu, setGeneratedNiu] = useState("");


  const [form, setForm] = useState({
    // Enfant
    nomEnfant: "",
    prenomEnfant: "",
    sexe: "",
    dateNaissance: "",
    heureNaissance: "",
    lieuNaissance: "",
    prefecture: "",
    // Père
    nomPere: "",
    prenomPere: "",
    professionPere: "",
    // Mère
    nomMere: "",
    prenomMere: "",
    professionMere: "",
    // Déclarant
    nomDeclarant: "",
    prenomDeclarant: "",
    lienDeclarant: "",
    telDeclarant: "",
    // Témoins
    nomTemoin1: "",
    prenomTemoin1: "",
    nomTemoin2: "",
    prenomTemoin2: "",
  });

  const update = (field: string, val: string) => setForm((f) => ({ ...f, [field]: val }));

  const steps = [
    { n: 1, label: "Enfant" },
    { n: 2, label: "Parents" },
    { n: 3, label: "Déclarant" },
    { n: 4, label: "Confirmation" },
  ];

  const handleSubmit = () => {
    initStorage();
    const niu = `${Math.floor(50000 + Math.random() * 9999)}-GU-2026`;
    setGeneratedNiu(niu);

    const record: Enregistrement = {
      niu,
      nom: form.nomEnfant || "Inconnu",
      prenom: form.prenomEnfant || "Inconnu",
      sexe: form.sexe as "M" | "F",
      date: form.dateNaissance || new Date().toISOString().split("T")[0],
      prefecture: form.prefecture || "Inconnu",
      commune: form.lieuNaissance || "Inconnu",
      statut: "EN ATTENTE",
      nomPere: `${form.prenomPere} ${form.nomPere}`.trim() || "Inconnu",
      nomMere: `${form.prenomMere} ${form.nomMere}`.trim() || "Inconnu",
      agent: "Agent Local",
      agentId: "AG-TEST-01",
      dateCreation: new Date().toLocaleDateString("fr-FR"),
      hashBlock: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
    };
    saveRecord(record);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="form-root">
        <Sidebar setView={setView} />
        <main className="form-main">
          <div className="success-screen">
            <div className="success-icon">✓</div>
            <h2 className="success-title">Enregistrement Soumis !</h2>
            <p className="success-desc">
              L'acte de naissance de <strong>{form.prenomEnfant} {form.nomEnfant}</strong> a été soumis avec succès.
              Il sera traité dans les 48h ouvrables.
            </p>
            <div className="success-niu">
              <span className="success-niu-label">NIU PROVISOIRE</span>
              <span className="success-niu-value">
                {Math.floor(50000 + Math.random() * 9999)}-GU-2026
                {generatedNiu}
              </span>
            </div>
            <div className="success-btns">
              <button className="btn-form-primary" onClick={() => { setSubmitted(false); setStep(1); setForm(f => ({ ...f, nomEnfant: "", prenomEnfant: "" })); }}>
                Nouvel Enregistrement
              </button>
              <button className="btn-form-secondary" onClick={() => setView("portail")}>
                Retour au Portail
              </button>
              <button className="btn-form-secondary" onClick={() => setView("verification-portail")}>
                Vérifier l'acte
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="form-root">
      <Sidebar setView={setView} />

      <main className="form-main">
        {/* HEADER */}
        <header className="form-header">
          <div>
            <h1 className="form-page-title">Enregistrement d'une Naissance</h1>
            <p className="form-page-sub">Remplissez toutes les informations pour créer l'acte de naissance</p>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn-form-ghost" onClick={() => setView("portail")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5" /><polyline points="12,19 5,12 12,5" /></svg>
              Retour au Portail
            </button>
            <button className="btn-form-ghost" onClick={() => setView("home")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5" /><polyline points="12,19 5,12 12,5" /></svg>
              Retour au site
            </button>
          </div>

        </header>

        <div className="form-body">
          {/* STEPPER */}
          <div className="stepper">
            {steps.map((s, i) => (
              <div key={s.n} className="stepper-item">
                <div className={`stepper-circle ${step === s.n ? "active" : step > s.n ? "done" : ""}`}>
                  {step > s.n ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20,6 9,17 4,12" /></svg>
                  ) : s.n}
                </div>
                <span className={`stepper-label ${step === s.n ? "active" : ""}`}>{s.label}</span>
                {i < steps.length - 1 && <div className={`stepper-line ${step > s.n ? "done" : ""}`}></div>}
              </div>
            ))}
          </div>

          {/* STEP 1: ENFANT */}
          {step === 1 && (
            <div className="form-card">
              <div className="form-card-header">
                <div className="form-card-icon green">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
                </div>
                <h2 className="form-card-title">Informations de l'Enfant</h2>
              </div>

              <div className="form-grid-2">
                <FormField label="NOM DE L'ENFANT" value={form.nomEnfant} onChange={v => update("nomEnfant", v)} placeholder="Diallo" />
                <FormField label="PRÉNOM DE L'ENFANT" value={form.prenomEnfant} onChange={v => update("prenomEnfant", v)} placeholder="Mamadou" />
              </div>

              <div className="form-grid-3">
                <div className="form-field">
                  <label className="form-label">SEXE</label>
                  <select className="form-select" value={form.sexe} onChange={e => update("sexe", e.target.value)}>
                    <option value="">Sélectionner</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
                <FormField label="DATE DE NAISSANCE" value={form.dateNaissance} onChange={v => update("dateNaissance", v)} type="date" />
                <FormField label="HEURE DE NAISSANCE" value={form.heureNaissance} onChange={v => update("heureNaissance", v)} type="time" />
              </div>

              <div className="form-grid-2">
                <FormField label="LIEU DE NAISSANCE" value={form.lieuNaissance} onChange={v => update("lieuNaissance", v)} placeholder="Hôpital National Donka" />
                <div className="form-field">
                  <label className="form-label">PRÉFECTURE</label>
                  <select className="form-select" value={form.prefecture} onChange={e => update("prefecture", e.target.value)}>
                    <option value="">Sélectionner</option>
                    <option>Conakry</option>
                    <option>Kindia</option>
                    <option>Boké</option>
                    <option>Labé</option>
                    <option>Mamou</option>
                    <option>Faranah</option>
                    <option>Kankan</option>
                    <option>Nzérékoré</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <div />
                <button className="btn-form-primary" onClick={() => setStep(2)}>
                  Suivant → Parents
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PARENTS */}
          {step === 2 && (
            <div className="form-card">
              <div className="form-card-header">
                <div className="form-card-icon blue">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                </div>
                <h2 className="form-card-title">Informations des Parents</h2>
              </div>

              <div className="parent-section">
                <div className="parent-section-label">
                  <span className="parent-badge pere">PÈRE</span>
                </div>
                <div className="form-grid-2">
                  <FormField label="NOM DU PÈRE" value={form.nomPere} onChange={v => update("nomPere", v)} placeholder="Diallo" />
                  <FormField label="PRÉNOM DU PÈRE" value={form.prenomPere} onChange={v => update("prenomPere", v)} placeholder="Ibrahima" />
                </div>
                <FormField label="PROFESSION DU PÈRE" value={form.professionPere} onChange={v => update("professionPere", v)} placeholder="Commerçant" full />
              </div>

              <div className="parent-divider"></div>

              <div className="parent-section">
                <div className="parent-section-label">
                  <span className="parent-badge mere">MÈRE</span>
                </div>
                <div className="form-grid-2">
                  <FormField label="NOM DE LA MÈRE" value={form.nomMere} onChange={v => update("nomMere", v)} placeholder="Camara" />
                  <FormField label="PRÉNOM DE LA MÈRE" value={form.prenomMere} onChange={v => update("prenomMere", v)} placeholder="Aïssatou" />
                </div>
                <FormField label="PROFESSION DE LA MÈRE" value={form.professionMere} onChange={v => update("professionMere", v)} placeholder="Enseignante" full />
              </div>

              <div className="form-actions">
                <button className="btn-form-secondary" onClick={() => setStep(1)}>← Retour</button>
                <button className="btn-form-primary" onClick={() => setStep(3)}>Suivant → Déclarant</button>
              </div>
            </div>
          )}

          {/* STEP 3: DECLARANT + TEMOINS */}
          {step === 3 && (
            <div className="form-card">
              <div className="form-card-header">
                <div className="form-card-icon yellow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B3D2E" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                </div>
                <h2 className="form-card-title">Déclarant & Témoins</h2>
              </div>

              <div className="parent-section-label" style={{ marginBottom: 16 }}>
                <span className="parent-badge declarant">DÉCLARANT</span>
              </div>

              <div className="form-grid-2">
                <FormField label="NOM DU DÉCLARANT" value={form.nomDeclarant} onChange={v => update("nomDeclarant", v)} placeholder="Diallo" />
                <FormField label="PRÉNOM DU DÉCLARANT" value={form.prenomDeclarant} onChange={v => update("prenomDeclarant", v)} placeholder="Moussa" />
              </div>
              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label">LIEN AVEC L'ENFANT</label>
                  <select className="form-select" value={form.lienDeclarant} onChange={e => update("lienDeclarant", e.target.value)}>
                    <option value="">Sélectionner</option>
                    <option>Père</option>
                    <option>Mère</option>
                    <option>Tuteur légal</option>
                    <option>Agent de santé</option>
                    <option>Autre</option>
                  </select>
                </div>
                <FormField label="TÉLÉPHONE" value={form.telDeclarant} onChange={v => update("telDeclarant", v)} placeholder="+224 628 000 000" type="tel" />
              </div>

              <div className="parent-divider"></div>

              <div className="parent-section-label" style={{ marginBottom: 16 }}>
                <span className="parent-badge temoin">TÉMOINS</span>
              </div>

              <div className="form-grid-2">
                <FormField label="NOM TÉMOIN 1" value={form.nomTemoin1} onChange={v => update("nomTemoin1", v)} placeholder="Bah" />
                <FormField label="PRÉNOM TÉMOIN 1" value={form.prenomTemoin1} onChange={v => update("prenomTemoin1", v)} placeholder="Amadou" />
              </div>
              <div className="form-grid-2">
                <FormField label="NOM TÉMOIN 2" value={form.nomTemoin2} onChange={v => update("nomTemoin2", v)} placeholder="Kouyaté" />
                <FormField label="PRÉNOM TÉMOIN 2" value={form.prenomTemoin2} onChange={v => update("prenomTemoin2", v)} placeholder="Mariama" />
              </div>

              <div className="form-actions">
                <button className="btn-form-secondary" onClick={() => setStep(2)}>← Retour</button>
                <button className="btn-form-primary" onClick={() => setStep(4)}>Suivant → Confirmation</button>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMATION */}
          {step === 4 && (
            <div className="form-card">
              <div className="form-card-header">
                <div className="form-card-icon green">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                </div>
                <h2 className="form-card-title">Confirmation de l'Enregistrement</h2>
              </div>

              <p className="confirm-intro">Veuillez vérifier les informations avant de soumettre l'acte de naissance.</p>

              <div className="confirm-grid">
                <div className="confirm-section">
                  <div className="confirm-section-title">Enfant</div>
                  <ConfirmRow label="Nom complet" value={`${form.prenomEnfant} ${form.nomEnfant}` || "—"} />
                  <ConfirmRow label="Sexe" value={form.sexe === "M" ? "Masculin" : form.sexe === "F" ? "Féminin" : "—"} />
                  <ConfirmRow label="Date de naissance" value={form.dateNaissance || "—"} />
                  <ConfirmRow label="Lieu" value={form.lieuNaissance || "—"} />
                  <ConfirmRow label="Préfecture" value={form.prefecture || "—"} />
                </div>
                <div className="confirm-section">
                  <div className="confirm-section-title">Parents</div>
                  <ConfirmRow label="Père" value={`${form.prenomPere} ${form.nomPere}` || "—"} />
                  <ConfirmRow label="Profession père" value={form.professionPere || "—"} />
                  <ConfirmRow label="Mère" value={`${form.prenomMere} ${form.nomMere}` || "—"} />
                  <ConfirmRow label="Profession mère" value={form.professionMere || "—"} />
                </div>
                <div className="confirm-section">
                  <div className="confirm-section-title">Déclarant</div>
                  <ConfirmRow label="Nom" value={`${form.prenomDeclarant} ${form.nomDeclarant}` || "—"} />
                  <ConfirmRow label="Lien" value={form.lienDeclarant || "—"} />
                  <ConfirmRow label="Téléphone" value={form.telDeclarant || "—"} />
                </div>
              </div>

              <div className="confirm-notice">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                En soumettant ce formulaire, vous certifiez que toutes les informations sont exactes et complètes conformément à la loi guinéenne sur l'état civil.
              </div>

              <div className="form-actions">
                <button className="btn-form-secondary" onClick={() => setStep(3)}>← Retour</button>
                <button className="btn-form-submit" onClick={handleSubmit}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20,6 9,17 4,12" /></svg>
                  Soumettre l'Acte de Naissance
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Sub-components
function FormField({ label, value, onChange, placeholder = "", type = "text", full = false }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; full?: boolean;
}) {
  return (
    <div className={`form-field ${full ? "full" : ""}`}>
      <label className="form-label">{label}</label>
      <input
        className="form-input"
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="confirm-row">
      <span className="confirm-label">{label}</span>
      <span className="confirm-value">{value}</span>
    </div>
  );
}

function Sidebar({ setView }: { setView: (v: any) => void }) {
  return (
    <aside className="form-sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">◆</div>
        <div>
          <div className="sidebar-logo-title">Souveraineté</div>
          <div className="sidebar-logo-sub">Numérique</div>
        </div>
      </div>

      <div className="form-sidebar-info">
        <div className="form-sidebar-step-label">ÉTAPES</div>
        <ul className="form-sidebar-steps">
          <li>① Informations de l'enfant</li>
          <li>② Informations des parents</li>
          <li>③ Déclarant & témoins</li>
          <li>④ Confirmation & soumission</li>
        </ul>

        <div className="form-sidebar-tip">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          <span>Les données sont sécurisées par la blockchain NaissanceChain.</span>
        </div>
      </div>

      <div className="sidebar-back">
        <button className="sidebar-back-btn" onClick={() => setView("home")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5" /><polyline points="12,19 5,12 12,5" /></svg>
          Retour au site
        </button>

        <button className="sidebar-back-btn" style={{ marginTop: 8 }} onClick={() => setView("portail")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
          Portail National
        </button>
        <button className="sidebar-back-btn" style={{ marginTop: 8 }} onClick={() => setView("verification-portail")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
          Portail de Vérification
        </button>
      </div>
    </aside>
  );
}
