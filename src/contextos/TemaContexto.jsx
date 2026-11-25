import { createContext, useContext, useEffect, useState } from "react";
import { guardar, lerSalvo } from "../servicos/armazenamento.js";

const TemaContexto = createContext(null);

// Usa a escolha salva; se não houver, segue o tema do sistema do usuário
function descobrirTemaInicial() {
  const salvo = lerSalvo("tema", null);
  if (salvo === "claro" || salvo === "escuro") {
    return salvo;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "claro";
}

export function TemaProvider({ children }) {
  const [tema, setTema] = useState(descobrirTemaInicial);

  // As cores mudam porque o CSS lê o atributo data-tema do <html>
  useEffect(() => {
    document.documentElement.dataset.tema = tema;
  }, [tema]);

  function alternarTema() {
    const novoTema = tema === "escuro" ? "claro" : "escuro";
    guardar("tema", novoTema);
    setTema(novoTema);
  }

  return <TemaContexto.Provider value={{ tema, alternarTema }}>{children}</TemaContexto.Provider>;
}

export function useTema() {
  return useContext(TemaContexto);
}
