import { useCallback, useState } from "react";
import { guardar, lerSalvo } from "../servicos/armazenamento.js";

// Igual ao useState, mas o valor fica salvo no LocalStorage.
// A função "definir" devolve true se conseguiu salvar e false se o navegador recusou.
export function useDadoSalvo(chave, padrao) {
  const [valor, setValor] = useState(() => lerSalvo(chave, padrao));

  const definir = useCallback(
    (novoValor) => {
      const salvou = guardar(chave, novoValor);
      if (salvou) {
        setValor(novoValor);
      }
      return salvou;
    },
    [chave]
  );

  return [valor, definir];
}
