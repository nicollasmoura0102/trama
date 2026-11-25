import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CartaoResultado } from "../componentes/CartaoProduto.jsx";
import Icone from "../componentes/Icone.jsx";
import { usePagina } from "../componentes/usePagina.js";
import { useAviso } from "../contextos/AvisoContexto.jsx";
import { useLoja } from "../contextos/LojaContexto.jsx";
import { catalogo, categorias, resumirAvaliacoes } from "../dados/catalogo.js";

const TAMANHO_PAGINA = 6;
const publicos = { feminino: "Feminino", masculino: "Masculino", infantil: "Infantil" };

function tirarAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Dentro de um grupo vale "ou"; entre grupos vale "e"
const grupos = [
  {
    chave: "categoria", titulo: "Categoria",
    opcoes: categorias.map((nome) => ({ valor: nome, rotulo: nome, chip: nome, testar: (p) => p.categoria === nome })),
  },
  {
    chave: "tamanho", titulo: "Tamanho",
    opcoes: ["PP", "P", "M", "G", "GG", "Único"].map((nome) => ({ valor: nome, rotulo: nome, chip: "Tamanho " + nome, testar: (p) => p.tamanhos.includes(nome) })),
  },
  {
    chave: "cor", titulo: "Cor",
    opcoes: ["Preto", "Branco", "Azul", "Verde", "Lima", "Roxo", "Vermelho"].map((nome) => ({ valor: nome, rotulo: nome, chip: "Cor " + nome, cor: tirarAcentos(nome), testar: (p) => p.cores.includes(nome) })),
  },
  {
    chave: "preco", titulo: "Preço",
    opcoes: [
      { valor: "ate-100", rotulo: "Até R$ 100", chip: "Até R$ 100", testar: (p) => p.preco <= 100 },
      { valor: "100-200", rotulo: "R$ 100 a R$ 200", chip: "R$ 100 a R$ 200", testar: (p) => p.preco > 100 && p.preco <= 200 },
      { valor: "acima-200", rotulo: "Acima de R$ 200", chip: "Acima de R$ 200", testar: (p) => p.preco > 200 },
    ],
  },
  {
    chave: "avaliacao", titulo: "Avaliação",
    opcoes: [
      { valor: "4", rotulo: "4 estrelas ou mais", chip: "4★ ou mais", testar: (p, nota) => nota >= 4 },
      { valor: "3", rotulo: "3 estrelas ou mais", chip: "3★ ou mais", testar: (p, nota) => nota >= 3 },
    ],
  },
];

const ordens = {
  relevancia: { rotulo: "Relevância", comparar: () => 0 },
  "menor-preco": { rotulo: "Menor preço", comparar: (a, b) => a.preco - b.preco },
  "maior-preco": { rotulo: "Maior preço", comparar: (a, b) => b.preco - a.preco },
  "mais-avaliados": { rotulo: "Mais avaliados", comparar: (a, b) => b.nota - a.nota || b.total - a.total },
  novidades: { rotulo: "Novidades", comparar: (a, b) => b.lancamento.localeCompare(a.lancamento) },
};

const semFiltros = { categoria: [], tamanho: [], cor: [], preco: [], avaliacao: [] };

export default function Busca() {
  usePagina("Resultados da busca", "Filtre por categoria, tamanho, cor, preço e avaliação e encontre as roupas ideais.");
  const { favoritos, alternarFavorito, avaliacoes } = useLoja();
  const anunciar = useAviso();
  const [parametros] = useSearchParams();
  const titulo = useRef(null);

  const [filtros, setFiltros] = useState(semFiltros);
  const [termo, setTermo] = useState("");
  const [ordem, setOrdem] = useState("relevancia");
  const [publico, setPublico] = useState("");
  const [limite, setLimite] = useState(TAMANHO_PAGINA);
  const [painelAberto, setPainelAberto] = useState(false);

  // Sempre que o endereço muda (menu ou busca do cabeçalho), a tela acompanha
  const textoDosParametros = parametros.toString();
  useEffect(() => {
    const categoriaDaUrl = tirarAcentos(parametros.get("categoria") ?? "");
    const categoria = categorias.find((nome) => tirarAcentos(nome) === categoriaDaUrl);
    const ordemDaUrl = parametros.get("ordem");
    const publicoDaUrl = parametros.get("publico");
    setFiltros({ ...semFiltros, categoria: categoria ? [categoria] : [] });
    setOrdem(ordens[ordemDaUrl] ? ordemDaUrl : "relevancia");
    setPublico(publicos[publicoDaUrl] ? publicoDaUrl : "");
    setTermo(parametros.get("q") ?? "");
    setLimite(TAMANHO_PAGINA);
  }, [textoDosParametros]);

  function notaDe(produto) {
    return resumirAvaliacoes(produto, avaliacoes[produto.id]).media;
  }

  function passaNosFiltros(produto) {
    const texto = tirarAcentos([produto.nome, produto.categoria, ...produto.cores].join(" "));
    if (!texto.includes(tirarAcentos(termo))) return false;
    if (publico !== "" && !produto.publicos.includes(publico)) return false;
    const nota = notaDe(produto);
    return grupos.every((grupo) => {
      const marcadas = grupo.opcoes.filter((opcao) => filtros[grupo.chave].includes(opcao.valor));
      return marcadas.length === 0 || marcadas.some((opcao) => opcao.testar(produto, nota));
    });
  }

  const resultados = catalogo.filter(passaNosFiltros).sort(ordens[ordem].comparar);
  const visiveis = resultados.slice(0, limite);
  const totalDeFiltros = Object.values(filtros).reduce((soma, lista) => soma + lista.length, 0);

  function alternarOpcao(chave, valor) {
    const lista = filtros[chave];
    setFiltros({ ...filtros, [chave]: lista.includes(valor) ? lista.filter((item) => item !== valor) : [...lista, valor] });
    setLimite(TAMANHO_PAGINA);
  }

  function limparTudo() {
    setFiltros(semFiltros);
    setTermo("");
    setOrdem("relevancia");
    setPublico("");
    setLimite(TAMANHO_PAGINA);
    anunciar("Filtros removidos.");
  }

  function removerChip(chip) {
    if (chip.tipo === "filtro") alternarOpcao(chip.grupo, chip.valor);
    else if (chip.tipo === "busca") setTermo("");
    else if (chip.tipo === "publico") setPublico("");
    else setOrdem("relevancia");
    titulo.current.focus(); // o chip sumiu: leva o foco para o título dos resultados
  }

  function favoritar(produto) {
    const agoraEhFavorito = alternarFavorito(produto.id);
    anunciar(produto.nome + (agoraEhFavorito ? " adicionado aos favoritos." : " removido dos favoritos."));
  }

  // Lista de "chips" com o que está aplicado
  const chips = [];
  grupos.forEach((grupo) =>
    grupo.opcoes.forEach((opcao) => {
      if (filtros[grupo.chave].includes(opcao.valor)) chips.push({ texto: opcao.chip, tipo: "filtro", grupo: grupo.chave, valor: opcao.valor });
    })
  );
  if (termo !== "") chips.push({ texto: "Busca: " + termo, tipo: "busca" });
  if (publico !== "") chips.push({ texto: publicos[publico], tipo: "publico" });
  if (ordem !== "relevancia") chips.push({ texto: ordens[ordem].rotulo, tipo: "ordem" });

  return (
    <div className="busca-pagina pagina-clara">
      <div className="busca-pagina__filtros">
        <button className="botao botao--claro filtros-toggle" type="button" aria-expanded={painelAberto} aria-controls="painel-filtros" onClick={() => setPainelAberto(!painelAberto)}>
          Filtros
          <span className="filtros-toggle__contagem" hidden={totalDeFiltros === 0}>
            {totalDeFiltros}
          </span>
        </button>

        <aside className={"filtros-painel" + (painelAberto ? " filtros-painel--aberto" : "")} id="painel-filtros" aria-labelledby="titulo-filtros">
          <p className="filtros-painel__titulo" id="titulo-filtros">
            Filtros
          </p>
          {grupos.map((grupo) => (
            <details className="filtro-grupo" key={grupo.chave} open>
              <summary className="filtro-grupo__titulo">
                <span>{grupo.titulo}</span>
                <span className="filtro-grupo__seta" aria-hidden="true">
                  <Icone nome="baixo" />
                </span>
              </summary>
              <ul className="filtro-grupo__opcoes">
                {grupo.opcoes.map((opcao) => (
                  <li key={opcao.valor}>
                    <label className="opcao">
                      <input className="opcao__entrada" type="checkbox" checked={filtros[grupo.chave].includes(opcao.valor)} onChange={() => alternarOpcao(grupo.chave, opcao.valor)} />
                      {opcao.cor && <span className={"opcao__cor cor--" + opcao.cor} aria-hidden="true" />}
                      <span className="opcao__rotulo">{opcao.rotulo}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </details>
          ))}
          <button className="link-botao" type="button" onClick={limparTudo}>
            Limpar filtros
          </button>
        </aside>
      </div>

      <section className="busca-pagina__resultados" aria-labelledby="titulo-resultados">
        <div className="busca-barra">
          <form className="busca-barra__campo" role="search" aria-label="Filtrar resultados" onSubmit={(e) => e.preventDefault()}>
            <label className="visualmente-oculto" htmlFor="campo-busca">
              Buscar produtos
            </label>
            <input className="busca-barra__entrada" id="campo-busca" type="search" placeholder="Busque produtos, marcas ou categorias" autoComplete="off" value={termo} onChange={(e) => { setTermo(e.target.value); setLimite(TAMANHO_PAGINA); }} />
            <button className="busca-barra__botao" type="submit" aria-label="Buscar">
              <Icone nome="busca" />
            </button>
          </form>

          <div className="ordenar">
            <label className="visualmente-oculto" htmlFor="ordenar">
              Ordenar por
            </label>
            <select className="ordenar__select" id="ordenar" value={ordem} onChange={(e) => setOrdem(e.target.value)}>
              <option value="relevancia">Ordenar por: relevância</option>
              <option value="menor-preco">Menor preço</option>
              <option value="maior-preco">Maior preço</option>
              <option value="mais-avaliados">Mais avaliados</option>
              <option value="novidades">Novidades</option>
            </select>
          </div>
        </div>

        <div className="resultados__cabecalho">
          <h1 className="resultados__titulo" id="titulo-resultados" tabIndex={-1} ref={titulo}>
            Resultados para você
          </h1>
          <p className="resultados__contagem" role="status">
            {resultados.length === 0 ? "Nenhum produto" : resultados.length + (resultados.length === 1 ? " produto" : " produtos") + (resultados.length > visiveis.length ? " (mostrando " + visiveis.length + ")" : "")}
          </p>
        </div>

        <div className="chips" role="group" aria-label="Filtros aplicados" hidden={chips.length === 0}>
          {chips.map((chip) => (
            <button key={chip.texto} className="chip" type="button" aria-label={"Remover filtro: " + chip.texto} onClick={() => removerChip(chip)}>
              <span>{chip.texto}</span>
              <span className="chip__x" aria-hidden="true">×</span>
            </button>
          ))}
        </div>

        <ul className="resultados__grade">
          {visiveis.map((produto) => (
            <CartaoResultado key={produto.id} produto={produto} favorito={favoritos.includes(produto.id)} aoAlternar={favoritar} />
          ))}
        </ul>

        <div className="resultados__vazio" hidden={resultados.length > 0}>
          <p>Nenhum produto encontrado com esses filtros.</p>
          <button className="botao botao--escuro" type="button" onClick={limparTudo}>
            Limpar filtros
          </button>
        </div>

        <div className="resultados__mais" hidden={resultados.length <= limite}>
          <button className="botao botao--escuro" type="button" onClick={() => setLimite(limite + TAMANHO_PAGINA)}>
            Ver mais produtos
          </button>
        </div>
      </section>
    </div>
  );
}
