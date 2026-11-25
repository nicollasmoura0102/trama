import { useTema } from "../contextos/TemaContexto.jsx";
import Icone from "./Icone.jsx";

// Botão que alterna entre modo claro e escuro (a escolha fica salva no LocalStorage)
export default function BotaoTema() {
  const { tema, alternarTema } = useTema();
  const escuro = tema === "escuro";

  return (
    <button className="botao-icone" type="button" onClick={alternarTema} aria-pressed={escuro} aria-label="Modo escuro">
      <Icone nome={escuro ? "lua" : "sol"} />
    </button>
  );
}
