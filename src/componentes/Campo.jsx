import { useState } from "react";
import Icone from "./Icone.jsx";

// Campo de formulário: rótulo + entrada + mensagem de erro logo abaixo
export default function Campo({ id, rotulo, erro, area = false, alternarSenha = false, type, ...resto }) {
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const Entrada = area ? "textarea" : "input";
  const ehSenha = !area && alternarSenha && type === "password";
  const classe = "campo__entrada" + (area ? " campo__entrada--area" : "") + (ehSenha ? " campo__entrada--com-acao" : "");

  return (
    <div className="campo">
      <label className="campo__rotulo" htmlFor={id}>
        {rotulo}
      </label>
      <div className="campo__controle">
        <Entrada
          className={classe}
          id={id}
          type={ehSenha && senhaVisivel ? "text" : type}
          aria-invalid={erro ? "true" : "false"}
          aria-describedby={id + "-erro"}
          {...resto}
        />
        {ehSenha && (
          <button
            className="campo__acao"
            type="button"
            aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={senhaVisivel}
            onClick={() => setSenhaVisivel(!senhaVisivel)}
          >
            <Icone nome={senhaVisivel ? "olho-fechado" : "olho"} />
          </button>
        )}
      </div>
      <p className="campo__mensagem" id={id + "-erro"} hidden={!erro}>
        {erro}
      </p>
    </div>
  );
}
