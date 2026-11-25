import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CartaoInicio } from "../componentes/CartaoProduto.jsx";
import Icone from "../componentes/Icone.jsx";
import { usePagina } from "../componentes/usePagina.js";
import { useAviso } from "../contextos/AvisoContexto.jsx";
import { useLoja } from "../contextos/LojaContexto.jsx";
import { catalogo, categorias } from "../dados/catalogo.js";

const banners = [
  { titulo: "Nova coleção chegou", texto: "Peças atemporais com até 30% de desconto.", emojis: ["👕", "🧥"], tema: 1 },
  { titulo: "Jaquetas para o frio", texto: "Camadas que combinam com tudo.", emojis: ["🧥", "🧣"], tema: 2 },
  { titulo: "Vestidos de verão", texto: "Leves, soltos e prontos para o sol.", emojis: ["👗", "👒"], tema: 3 },
  { titulo: "Jeans em destaque", texto: "Modelagens novas e caimento perfeito.", emojis: ["👖", "👟"], tema: 1 },
  { titulo: "Acessórios", texto: "Bonés, bolsas e cintos para fechar o look.", emojis: ["🧢", "👜"], tema: 2 },
];

export default function Inicio() {
  usePagina("Moda para todos os estilos", "Trama: loja online de roupas com camisetas, calças, vestidos, jaquetas e acessórios.");
  const { favoritos, alternarFavorito } = useLoja();
  const anunciar = useAviso();
  const [bannerAtual, setBannerAtual] = useState(0);
  const [categoria, setCategoria] = useState("Todos");
  const lista = useRef(null);

  const banner = banners[bannerAtual];
  const maisVendidos = catalogo
    .filter((produto) => categoria === "Todos" || produto.categoria === categoria)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  function mudarBanner(passo) {
    setBannerAtual((bannerAtual + passo + banners.length) % banners.length);
  }

  function rolarLista(direcao) {
    const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    lista.current.scrollBy({ left: direcao * lista.current.clientWidth * 0.8, behavior: reduzirMovimento ? "auto" : "smooth" });
  }

  function favoritar(produto) {
    const agoraEhFavorito = alternarFavorito(produto.id);
    anunciar(produto.nome + (agoraEhFavorito ? " adicionado aos favoritos." : " removido dos favoritos."));
  }

  return (
    <>
      <section className={"hero hero--tema-" + banner.tema} aria-label="Destaques da semana">
        <div className="hero__painel hero__painel--texto">
          <h1>{banner.titulo}</h1>
          <p className="hero__texto">{banner.texto}</p>
          <Link className="botao" to="/#ofertas">
            Ver ofertas
          </Link>
        </div>
        <div className="hero__painel hero__painel--meio" aria-hidden="true">
          {banner.emojis[0]}
        </div>
        <div className="hero__painel hero__painel--direita" aria-hidden="true">
          {banner.emojis[1]}
        </div>

        <button className="botao-icone seta seta--anterior" type="button" aria-label="Banner anterior" onClick={() => mudarBanner(-1)}>
          <Icone nome="esquerda" />
        </button>
        <button className="botao-icone seta seta--proxima" type="button" aria-label="Próximo banner" onClick={() => mudarBanner(1)}>
          <Icone nome="direita" />
        </button>

        <div className="hero__bolinhas">
          {banners.map((_, indice) => (
            <button key={indice} className="bolinha" type="button" aria-label={"Ir para o banner " + (indice + 1)} aria-current={indice === bannerAtual ? "true" : undefined} onClick={() => setBannerAtual(indice)} />
          ))}
        </div>
      </section>

      <section className="vitrine" id="ofertas">
        <div className="vitrine__cabecalho">
          <h2>Mais vendidos</h2>
          <p className="cartao__texto-suave">As peças preferidas de quem já comprou na Trama.</p>
          <Link className="botao botao--claro" to="/busca">
            Ver todos os produtos
          </Link>
        </div>

        <div className="filtros" role="group" aria-label="Filtrar por categoria">
          {["Todos", ...categorias].map((nome) => (
            <button key={nome} className="filtro" type="button" aria-pressed={categoria === nome} onClick={() => setCategoria(nome)}>
              {nome}
            </button>
          ))}
        </div>

        <div className="vitrine__corpo">
          <button className="botao-icone seta seta--anterior" type="button" aria-label="Produtos anteriores" onClick={() => rolarLista(-1)}>
            <Icone nome="esquerda" />
          </button>
          <ul className="vitrine__lista" ref={lista}>
            {maisVendidos.map((produto) => (
              <CartaoInicio key={produto.id} produto={produto} favorito={favoritos.includes(produto.id)} aoAlternar={favoritar} />
            ))}
          </ul>
          <button className="botao-icone seta seta--proxima" type="button" aria-label="Próximos produtos" onClick={() => rolarLista(1)}>
            <Icone nome="direita" />
          </button>
        </div>
      </section>
    </>
  );
}
