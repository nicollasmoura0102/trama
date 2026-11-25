import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Avaliacoes from "../componentes/produto/Avaliacoes.jsx";
import { JanelaMedidas, JanelaProvador } from "../componentes/produto/JanelasDoProduto.jsx";
import { usePagina } from "../componentes/usePagina.js";
import { useAviso } from "../contextos/AvisoContexto.jsx";
import { useLoja } from "../contextos/LojaContexto.jsx";
import { buscarProduto, catalogo, formatarPreco } from "../dados/catalogo.js";
import { calcularFrete, formatarCep, validarCep } from "../servicos/frete.js";
import { sugerirTamanho } from "../servicos/tamanho.js";
import Icone from "../componentes/Icone.jsx";
import NaoEncontrada from "./NaoEncontrada.jsx";

export default function Produto() {
  const { id } = useParams();
  const produto = buscarProduto(id);
  // "key" faz a tela começar do zero ao trocar de produto
  return produto ? <DetalheDoProduto key={produto.id} produto={produto} /> : <NaoEncontrada />;
}

function DetalheDoProduto({ produto }) {
  usePagina(produto.nome, produto.descricao + " Compre na Trama.");
  const { medidas, adicionarNaSacola } = useLoja();
  const anunciar = useAviso();

  const [fotoAtual, setFotoAtual] = useState(0);
  const [tamanhoEscolhido, setTamanhoEscolhido] = useState("");
  const [erroTamanho, setErroTamanho] = useState("");
  const [statusSacola, setStatusSacola] = useState({ texto: "", tipo: "" });
  const [modo360, setModo360] = useState(false);
  const [giro, setGiro] = useState(0);
  const [janela, setJanela] = useState(null); // "medidas" | "provador" | null
  const [cep, setCep] = useState("");
  const [erroCep, setErroCep] = useState("");
  const [statusFrete, setStatusFrete] = useState({ texto: "", tipo: "" });

  const tamanhoUnico = produto.tamanhos.length === 1;
  const recomendado = medidas && !tamanhoUnico ? sugerirTamanho(medidas.altura, medidas.peso, produto) : "";
  const classeDoGiro = giro > 0 ? " giro-" + giro : "";
  const relacionados = catalogo.filter((item) => item.id !== produto.id && item.categoria !== produto.categoria).slice(0, 5);

  function escolherTamanho(nome) {
    setTamanhoEscolhido(nome);
    setErroTamanho("");
  }

  function alternar360() {
    setModo360(!modo360);
    setGiro(0);
  }

  function salvouMedidas(novasMedidas) {
    const sugerido = sugerirTamanho(novasMedidas.altura, novasMedidas.peso, produto);
    setJanela(null);
    if (sugerido) {
      setTamanhoEscolhido(sugerido);
      setErroTamanho("");
      anunciar("Tamanho recomendado: " + sugerido + ". Ele já foi selecionado.");
    }
  }

  function adicionar(evento) {
    evento.preventDefault();
    if (tamanhoEscolhido === "") {
      setErroTamanho("Escolha um tamanho antes de adicionar à sacola.");
      setStatusSacola({ texto: "", tipo: "" });
      document.querySelector('input[name="tamanho"]:not(:disabled)')?.focus();
      return;
    }
    if (adicionarNaSacola(produto.id, tamanhoEscolhido)) {
      setStatusSacola({ texto: produto.nome + " (" + tamanhoEscolhido + ") foi adicionado à sacola.", tipo: "sucesso" });
    } else {
      setStatusSacola({ texto: "Não foi possível salvar a sacola neste navegador.", tipo: "erro" });
    }
  }

  function consultarFrete(evento) {
    evento.preventDefault();
    const erro = validarCep(cep);
    setErroCep(erro);
    if (erro) {
      setStatusFrete({ texto: "", tipo: "" });
      document.getElementById("cep").focus();
      return;
    }
    const frete = calcularFrete(cep, produto.preco);
    setStatusFrete({ texto: "Entrega " + (frete.gratis ? "grátis" : formatarPreco(frete.valor)) + " em " + frete.prazo + " (simulação).", tipo: "sucesso" });
  }

  return (
    <div className="pagina-produto">
      <nav className="trilha" aria-label="Caminho de navegação">
        <ol className="trilha__lista">
          <li>
            <Link className="trilha__link" to="/">Início</Link>
          </li>
          <li>
            <Link className="trilha__link" to={"/busca?categoria=" + produto.categoria.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()}>{produto.categoria}</Link>
          </li>
          <li aria-current="page">{produto.nome}</li>
        </ol>
      </nav>

      <section className="beneficios" aria-label="Vantagens da Trama">
        <ul className="beneficios__lista">
          <li className="beneficio">
            <strong className="beneficio__titulo">Frete grátis</strong>
            <p className="beneficio__texto">Em compras acima de R$ 199,00 para todo o Brasil.</p>
          </li>
          <li className="beneficio">
            <strong className="beneficio__titulo">Troca fácil</strong>
            <p className="beneficio__texto">Não serviu? Troque em até 30 dias, sem burocracia.</p>
          </li>
          <li className="beneficio">
            <strong className="beneficio__titulo">Pague em até 3x</strong>
            <p className="beneficio__texto">Parcelas sem juros no cartão de crédito.</p>
          </li>
        </ul>
      </section>

      <section className="produto-detalhe" aria-labelledby="titulo-pagina">
        <h1 className="secao__titulo" id="titulo-pagina">Detalhes do produto</h1>

        <div className="produto-detalhe__corpo">
          <div className={"galeria" + (produto.fotos.length <= 1 ? " galeria--sem-miniaturas" : "")}>
            {produto.fotos.length > 1 && (
              <ul className="galeria__miniaturas" aria-label="Fotos do produto">
                {produto.fotos.map((foto, indice) => (
                  <li key={foto.arquivo}>
                    <button className="miniatura" type="button" aria-pressed={indice === fotoAtual} aria-label={"Ver foto " + (indice + 1) + ": " + foto.alt} onClick={() => setFotoAtual(indice)}>
                      <img className="miniatura__imagem" src={foto.arquivo} alt="" width="96" height="96" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <figure className={"galeria__principal" + (produto.fotos.length > 0 ? " galeria__principal--foto" : "")}>
              {produto.fotos.length > 0 ? (
                <img className={"galeria__foto" + classeDoGiro} fetchpriority="high" src={produto.fotos[fotoAtual].arquivo} alt={produto.fotos[fotoAtual].alt} width="600" height="600" />
              ) : (
                <div className={"galeria__emoji" + classeDoGiro} role="img" aria-label={"Imagem ilustrativa: " + produto.nome}>
                  {produto.emoji}
                </div>
              )}
            </figure>

            <div className="galeria__acoes">
              <button className="botao botao--claro" type="button" onClick={() => setJanela("provador")}>
                Provador virtual
              </button>
              <button className="botao botao--escuro" type="button" aria-pressed={modo360} onClick={alternar360}>
                Visualização 360°
              </button>
            </div>

            <div className="galeria__giro" hidden={!modo360}>
              <label className="galeria__giro-rotulo" htmlFor="campo-giro">
                Girar produto: {giro * 45}° <span className="galeria__giro-nota">(prévia simulada)</span>
              </label>
              <input className="galeria__giro-campo" id="campo-giro" type="range" min="0" max="7" step="1" value={giro} onChange={(e) => setGiro(Number(e.target.value))} />
            </div>
          </div>

          <section className="compra" aria-labelledby="compra-nome">
            <p className="compra__ref">{produto.categoria} · Ref. TR-{String(produto.id).padStart(4, "0")}</p>
            <h2 className="compra__nome" id="compra-nome">{produto.nome}</h2>
            <p className="compra__preco">{formatarPreco(produto.preco)}</p>
            <p className="compra__texto">
              {produto.descricao} Em até 3x de {formatarPreco(produto.preco / 3)} sem juros.
            </p>

            <form className="compra__formulario" onSubmit={adicionar} noValidate>
              <fieldset className="tamanhos" aria-describedby="erro-tamanho">
                <legend className="tamanhos__legenda">Escolha o tamanho</legend>
                <div className="tamanhos__lista">
                  {produto.tamanhos.map((nome) => {
                    const esgotado = produto.esgotados.includes(nome);
                    return (
                      <div className={"tamanho" + (nome === recomendado ? " tamanho--recomendado" : "")} key={nome}>
                        <input className="tamanho__entrada" type="radio" name="tamanho" value={nome} checked={tamanhoEscolhido === nome} disabled={esgotado} onChange={() => escolherTamanho(nome)} aria-label={"Tamanho " + nome + (esgotado ? " (esgotado)" : "") + (nome === recomendado ? " (recomendado)" : "")} />
                        <span className="tamanho__rotulo">{nome}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="campo__mensagem" id="erro-tamanho" hidden={!erroTamanho}>
                  {erroTamanho}
                </p>
              </fieldset>

              {!tamanhoUnico && (
                <div className="recomendacao">
                  <span className="recomendacao__icone">
                    <Icone nome="regua" />
                  </span>
                  <p className="recomendacao__texto">
                    {recomendado ? (
                      <>
                        Tamanho recomendado: <strong>{recomendado}</strong>
                      </>
                    ) : (
                      "Informe suas medidas para ver o tamanho recomendado."
                    )}
                  </p>
                  <button className="link-botao" type="button" onClick={() => setJanela("medidas")}>
                    Usar medidas
                  </button>
                </div>
              )}

              <button className="botao botao--grande botao--bloco" type="submit">
                Adicionar à sacola
              </button>
              <p className={"formulario__status" + (statusSacola.tipo ? " formulario__status--" + statusSacola.tipo : "")} role="status">
                {statusSacola.texto}
                {statusSacola.tipo === "sucesso" && (
                  <>
                    {" "}
                    <Link className="link" to="/sacola">Ver sacola</Link>
                  </>
                )}
              </p>
            </form>

            <form className="frete" onSubmit={consultarFrete} noValidate>
              <div className="campo frete__campo">
                <label className="visualmente-oculto" htmlFor="cep">CEP</label>
                <input className="campo__entrada" id="cep" type="text" inputMode="numeric" autoComplete="postal-code" placeholder="Digite seu CEP" maxLength={9} aria-invalid={erroCep ? "true" : "false"} aria-describedby="cep-erro" value={cep} onChange={(e) => setCep(formatarCep(e.target.value))} />
                <p className="campo__mensagem" id="cep-erro" hidden={!erroCep}>
                  {erroCep}
                </p>
              </div>
              <button className="botao botao--escuro" type="submit">Calcular frete</button>
              <p className={"formulario__status frete__status" + (statusFrete.tipo ? " formulario__status--" + statusFrete.tipo : "")} role="status">
                {statusFrete.texto}
              </p>
            </form>
          </section>
        </div>
      </section>

      <section className="combine" aria-labelledby="combine-titulo">
        <h2 className="visualmente-oculto" id="combine-titulo">Combine com este produto</h2>
        <ul className="combine__lista">
          {relacionados.map((item) => (
            <li key={item.id}>
              <article className="relacionado">
                <div className="relacionado__imagem" aria-hidden="true">{item.emoji}</div>
                <div className="relacionado__info">
                  <h3 className="relacionado__nome">
                    <Link className="relacionado__link" to={"/produto/" + item.id}>{item.nome}</Link>
                  </h3>
                  <p className="relacionado__preco">{formatarPreco(item.preco)}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <Avaliacoes produto={produto} />

      <JanelaMedidas aberta={janela === "medidas"} aoFechar={() => setJanela(null)} aoSalvar={salvouMedidas} />
      <JanelaProvador aberta={janela === "provador"} aoFechar={() => setJanela(null)} />
    </div>
  );
}
