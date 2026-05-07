import { useState, createContext, useContext } from "react";
import NaissanceChain from "./NaissanceChain";
import PortailNational from "./PortailNational";
import FormulaireEnregistrement from "./FormulaireEnregistrement";
export type AppView = "home" | "portail" | "enregistrement" | "verification-portail";

import PortailVerification from "./PortailVerification";

interface AppContextType {
  view: AppView;
  setView: (v: AppView) => void;
}

export const AppContext = createContext<AppContextType>({
  view: "home",
  setView: () => { },
});

export const useApp = () => useContext(AppContext);

export default function App() {
  const [view, setView] = useState<AppView>("home");

  return (
    <AppContext.Provider value={{ view, setView }}>
      {view === "home" && <NaissanceChain />}
      {view === "portail" && <PortailNational />}
      {view === "enregistrement" && <FormulaireEnregistrement />}
      {view === "verification-portail" && <PortailVerification />}
    </AppContext.Provider>
  );
}