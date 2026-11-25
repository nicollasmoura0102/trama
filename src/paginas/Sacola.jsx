import { Link } from "react-router-dom";
import { usePagina } from "../componentes/usePagina.js";
import { useAviso } from "../contextos/AvisoContexto.jsx";
import { useLoja } from "../contextos/LojaContexto.jsx";
import { formatarPreco } from "../dados/catalogo.js";
import { FRETE_GRATIS_A_PARTIR_DE } from "../servicos/frete.js";

export default function Sacola() {
  usePagina("Minha sacola", "Confira os itens da sua sacola, altere as quantidades e finalize a compra.");
  const { itensDaSacola, totalDeItens, subtotal, mudarQuantidade, removerDaSacola } = useLoja();
  const anunciar = useAviso();

  function remover(item) {
    removerDaSacola(item.chave);
    anunciar(item.produto.nome + " removido da sacola.");
  }

  return (
    <div className="pagina-simples">
      <h1 className="secao__titulo">Minha sacola</h1>

      {itensDaSacola.length === 0 ? (
        <div className="estado-vazio">
          <p>Sua sacola está vazia.</p>
          <Link className="botao" to="/busca">
            Ver produtos
          </Link>
        </div>
      ) : (
        <div className="sacola__corpo">
          <ul className="sacola__lista">
            {itensDaSacola.map((item) => (
              <li className="item-sacola" key={item.chave}>
                <div className="item-sacola__imagem" aria-hidden="true">
                  {item.produto.emoji}
                </div>
                <div className="item-sacola__info">
                  <h2 className="item-sacola__nome">
                    <Link className="relacionado__link" to={"/produto/" + item.produto.id}>
                      {item.produto.nome}
                    </Link>
                  </h2>
                  <p className="item-sacola__detalhe">Tamanho {item.tamanho} · {formatarPreco(item.produto.preco)} cada</p>
                  <div className="item-sacola__acoes">
                    <div className="quantidade" role="group" aria-label={"Quantidade de " + item.produto.nome}>
                      <button className="quantidade__botao" type="button" aria-label="Diminuir quantidade" disabled={item.quantidade === 1} onClick={() => mudarQuantidade(item.chave, -1)}>
                        −
                      </button>
                      <output className="quantidade__valor">{item.quantidade}</output>
                      <button className="quantidade__botao" type="button" aria-label="Aumentar quantidade" disabled={item.quantidade === 10} onClick={() => mudarQuantidade(item.chave, 1)}>
                        +
                      </button>
                    </div>
                    <button className="botao-mini" type="button" onClick={() => remover(item)}>
                      Remover
                    </button>
                    <p className="item-sacola__total">{formatarPreco(item.quantidade * item.produto.preco)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="resumo-pedido" aria-label="Resumo do pedido">
            <h2 className="resumo-pedido__titulo">Resumo</h2>
            <p className="resumo-pedido__linha">
              <span>{totalDeItens} {totalDeItens === 1 ? "item" : "itens"}</span>
              <strong>{formatarPreco(subtotal)}</strong>
            </p>
            <p className="resumo-pedido__nota">
              {subtotal >= FRETE_GRATIS_A_PARTIR_DE ? "Você ganhou frete grátis!" : "Faltam " + formatarPreco(FRETE_GRATIS_A_PARTIR_DE - subtotal) + " para o frete grátis. O frete é calculado na finalização."}
            </p>
            <Link className="botao botao--grande botao--bloco" to="/finalizar">
              Finalizar compra
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
