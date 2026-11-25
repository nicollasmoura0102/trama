import { createContext, useCallback, useContext, useState } from "react";

const AvisoContexto = createContext(null);

// Região "ao vivo": leitores de tela leem o texto toda vez que ele muda
export function AvisoProvider({ children }) {
  const [texto, setTexto] = useState("");
  const anunciar = useCallback((mensagem) => setTexto(mensagem), []);

  return (
    <AvisoContexto.Provider value={anunciar}>
      {children}
      <p className="visualmente-oculto" role="status">
        {texto}
      </p>
    </AvisoContexto.Provider>
  );
}

export function useAviso() {
  return useContext(AvisoContexto);
}
