import { Link } from "react-router-dom";
import { formatarNota, formatarPreco, resumirAvaliacoes } from "../dados/catalogo.js";
import { useLoja } from "../contextos/LojaContexto.jsx";
import Icone from "./Icone.jsx";

function BotaoFavorito({ produto, favorito, aoAlternar }) {
  const rotulo = (favorito ? "Remover dos favoritos: " : "Favoritar: ") + produto.nome;
  return (
    <button className="botao-icone produto__favorito" type="button" aria-pressed={favorito} aria-label={rotulo} onClick={() => aoAlternar(produto)}>
      <Icone nome="coracao" />
    </button>
  );
}

function textoDaNota(produto, avaliacoes) {
  const { media, total } = resumirAvaliacoes(produto, avaliacoes[produto.id]);
  return "★ " + formatarNota(media) + " (" + total + " avaliações)";
}

// Cartão pequeno usado na vitrine da página inicial
export function CartaoInicio({ produto, favorito, aoAlternar }) {
  const { avaliacoes } = useLoja();
  return (
    <li>
      <article className="produto">
        <div className="produto__imagem" aria-hidden="true">
          {produto.emoji}
        </div>
        <BotaoFavorito produto={produto} favorito={favorito} aoAlternar={aoAlternar} />
        <div className="produto__info">
          <h3 className="produto__nome">
            <Link className="produto__link" to={"/produto/" + produto.id}>
              {produto.nome}
            </Link>
          </h3>
          <p className="produto__descricao">Tamanhos: {produto.tamanhos.join(" · ")}</p>
          <p className="produto__avaliacao">{textoDaNota(produto, avaliacoes)}</p>
          <p className="produto__preco">{formatarPreco(produto.preco)}</p>
        </div>
      </article>
    </li>
  );
}

// Cartão maior usado na busca e nos favoritos da conta
export function CartaoResultado({ produto, favorito, aoAlternar }) {
  const { avaliacoes } = useLoja();
  return (
    <li>
      <article className="resultado">
        <div className="resultado__imagem" aria-hidden="true">
          {produto.emoji}
        </div>
        <BotaoFavorito produto={produto} favorito={favorito} aoAlternar={aoAlternar} />
        <div className="resultado__info">
          <h2 className="resultado__nome">{produto.nome}</h2>
          <p className="resultado__detalhe">{textoDaNota(produto, avaliacoes)}</p>
          <div className="resultado__rodape">
            <p className="resultado__preco">{formatarPreco(produto.preco)}</p>
            <Link className="botao botao--claro botao--pequeno" to={"/produto/" + produto.id} aria-label={"Ver produto: " + produto.nome}>
              Ver produto
            </Link>
          </div>
        </div>
      </article>
    </li>
  );
}
