import { useState } from "react";
import { useAviso } from "../../contextos/AvisoContexto.jsx";
import { useLoja } from "../../contextos/LojaContexto.jsx";
import { formatarNota, resumirAvaliacoes } from "../../dados/catalogo.js";
import Estrelas from "../Estrelas.jsx";
import { JanelaAvaliacao } from "./JanelasDoProduto.jsx";

export default function Avaliacoes({ produto }) {
  const { avaliacoes, marcacoes, alternarMarcacao, excluirAvaliacao } = useLoja();
  const anunciar = useAviso();
  const [janelaAberta, setJanelaAberta] = useState(false);

  const doUsuario = avaliacoes[produto.id] ?? [];
  const { distribuicao, total, media } = resumirAvaliacoes(produto, doUsuario);

  // As escritas pelo usuário (guardadas no navegador) aparecem primeiro
  const lista = [...doUsuario.map((item) => ({ ...item, propria: true, uteis: 0 })), ...produto.comentarios.map((item) => ({ ...item, propria: false }))];

  function excluir(avaliacao) {
    excluirAvaliacao(produto.id, avaliacao.id);
    anunciar("Avaliação excluída.");
  }

  return (
    <section className="avaliacoes" aria-labelledby="avaliacoes-titulo">
      <div className="avaliacoes__cabecalho">
        <h2 className="secao__titulo" id="avaliacoes-titulo">
          Avaliações
        </h2>
        <button className="botao botao--escuro" type="button" onClick={() => setJanelaAberta(true)}>
          Escrever avaliação
        </button>
      </div>

      <div className="avaliacoes__corpo">
        <section className="resumo" aria-label="Resumo das avaliações">
          <p className="resumo__nota">{formatarNota(media)}</p>
          <Estrelas nota={media} />
          <p className="resumo__total">
            {total} {total === 1 ? "avaliação" : "avaliações"}
          </p>
          <ul className="resumo__barras">
            {[5, 4, 3, 2, 1].map((nota) => (
              <li className="resumo__linha" key={nota}>
                <span className="resumo__rotulo">{nota} ★</span>
                <progress className="barra" max={Math.max(total, 1)} value={distribuicao[nota]} aria-label={"Avaliações com " + nota + (nota === 1 ? " estrela" : " estrelas")} />
                <span className="resumo__quantidade">{distribuicao[nota]}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="avaliacoes__conteudo">
          <ul className="avaliacoes__lista">
            {lista.map((avaliacao) => {
              const marcouUtil = marcacoes.uteis.includes(avaliacao.id);
              const denunciada = marcacoes.denuncias.includes(avaliacao.id);
              return (
                <li key={avaliacao.id}>
                  <article className="avaliacao">
                    <header className="avaliacao__topo">
                      <span className="avatar" aria-hidden="true">
                        {avaliacao.autor.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <h3 className="avaliacao__autor">{avaliacao.autor}</h3>
                        <p className="avaliacao__data">{avaliacao.data}</p>
                      </div>
                      <Estrelas nota={avaliacao.nota} />
                    </header>
                    <p className="avaliacao__texto">{avaliacao.texto}</p>
                    <div className="avaliacao__acoes">
                      <button className="botao-mini" type="button" aria-pressed={marcouUtil} onClick={() => alternarMarcacao("uteis", avaliacao.id)}>
                        Útil ({avaliacao.uteis + (marcouUtil ? 1 : 0)})
                      </button>
                      {avaliacao.propria ? (
                        <button className="botao-mini" type="button" onClick={() => excluir(avaliacao)}>
                          Excluir
                        </button>
                      ) : (
                        <button className="botao-mini" type="button" disabled={denunciada} onClick={() => alternarMarcacao("denuncias", avaliacao.id)}>
                          {denunciada ? "Denúncia enviada" : "Denunciar"}
                        </button>
                      )}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
          <p className="avaliacoes__vazio" hidden={lista.length > 0}>
            <strong>Ainda não há comentários escritos</strong>
            <span>A nota ao lado reúne as avaliações do produto. Conte como foi a sua experiência.</span>
          </p>
        </div>
      </div>

      <JanelaAvaliacao aberta={janelaAberta} aoFechar={() => setJanelaAberta(false)} produto={produto} />
    </section>
  );
}
