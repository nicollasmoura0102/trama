import { createContext, useCallback, useContext, useEffect, useState } from "react";

const AvisoContexto = createContext(null);

// Região "ao vivo": leitores de tela leem o texto toda vez que ele muda
export function AvisoProvider({ children }) {
  const [aviso, setAviso] = useState({ id: 0, texto: "" });
  const anunciar = useCallback((mensagem) => setAviso({ id: Date.now(), texto: mensagem }), []);

  useEffect(() => {
    if (!aviso.texto) return;
    const temporizador = setTimeout(() => setAviso({ id: 0, texto: "" }), 4000);
    return () => clearTimeout(temporizador);
  }, [aviso]);

  return (
    <AvisoContexto.Provider value={anunciar}>
      {children}
      <p className="aviso" role="status" hidden={!aviso.texto}>
        {aviso.texto}
      </p>
    </AvisoContexto.Provider>
  );
}

export function useAviso() {
  return useContext(AvisoContexto);
}
