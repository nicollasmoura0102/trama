import { Link } from "react-router-dom";
import { usePagina } from "../componentes/usePagina.js";

export default function NaoEncontrada() {
  usePagina("Página não encontrada", "A página que você procura não existe.");

  return (
    <div className="pagina-simples">
      <h1 className="secao__titulo">Página não encontrada</h1>
      <p>O endereço que você abriu não existe ou o produto saiu do catálogo.</p>
      <p>
        <Link className="botao" to="/">
          Voltar para a loja
        </Link>
      </p>
    </div>
  );
}
