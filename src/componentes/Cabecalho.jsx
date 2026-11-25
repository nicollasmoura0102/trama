import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLoja } from "../contextos/LojaContexto.jsx";
import BotaoTema from "./BotaoTema.jsx";
import Icone from "./Icone.jsx";

const menu = [
  { texto: "Novidades", destino: "/busca?ordem=novidades" },
  { texto: "Feminino", destino: "/busca?publico=feminino" },
  { texto: "Masculino", destino: "/busca?publico=masculino" },
  { texto: "Infantil", destino: "/busca?publico=infantil" },
  { texto: "Camisetas", destino: "/busca?categoria=camisetas" },
  { texto: "Calças", destino: "/busca?categoria=calcas" },
  { texto: "Jaquetas", destino: "/busca?categoria=jaquetas" },
  { texto: "Acessórios", destino: "/busca?categoria=acessorios" },
  { texto: "Promoções", destino: "/busca?ordem=menor-preco" },
];

export default function Cabecalho() {
  const { usuario, totalDeItens } = useLoja();
  const navegar = useNavigate();
  const { pathname, search, hash } = useLocation();

  const favoritosAtivo = pathname === "/conta" && hash === "#favoritos";
  const contaAtiva = (pathname === "/conta" && hash !== "#favoritos") || pathname === "/entrar";
  const sacolaAtiva = pathname === "/sacola" || pathname === "/finalizar";

  function itemEstaAtivo(destino) {
    const [caminho, consulta] = destino.split("?");
    return pathname === caminho && search === (consulta ? "?" + consulta : "");
  }

  function buscar(evento) {
    evento.preventDefault();
    const texto = new FormData(evento.target).get("q").trim();
    navegar(texto === "" ? "/busca" : "/busca?q=" + encodeURIComponent(texto));
  }

  return (
    <header id="topo">
      <div className="topo__barra">
        <Link className="logo" to="/">
          <img className="logo__imagem" src="/img/trama-logotipo.svg" alt="Trama, página inicial" width="166" height="40" />
        </Link>

        <form className="busca" role="search" aria-label="Busca no site" onSubmit={buscar}>
          <label className="visualmente-oculto" htmlFor="busca-topo">
            Buscar produtos
          </label>
          <input className="busca__entrada" id="busca-topo" type="search" name="q" placeholder="Buscar roupas" autoComplete="off" />
          <button className="busca__botao" type="submit" aria-label="Buscar">
            <Icone nome="busca" />
          </button>
        </form>

        <div className="topo__tema">
          <BotaoTema />
        </div>

        <div className="topo__acoes">
          <Link className={"botao-icone" + (favoritosAtivo ? " botao-icone--ativo" : "")} to="/conta#favoritos" aria-label="Meus favoritos" aria-current={favoritosAtivo ? "page" : undefined}>
            <Icone nome="coracao" />
          </Link>
          <Link className={"botao-icone" + (contaAtiva ? " botao-icone--ativo" : "")} to={usuario ? "/conta" : "/entrar"} aria-label={usuario ? "Minha conta: " + usuario.nome : "Entrar na minha conta"} aria-current={contaAtiva ? "page" : undefined}>
            <Icone nome="usuario" />
          </Link>
          <Link className={"botao-icone" + (sacolaAtiva ? " botao-icone--ativo" : "")} to="/sacola" aria-label={"Minha sacola, " + totalDeItens + (totalDeItens === 1 ? " item" : " itens")} aria-current={sacolaAtiva ? "page" : undefined}>
            <Icone nome="carrinho" />
            <span className="sacola__contador" hidden={totalDeItens === 0}>
              {totalDeItens}
            </span>
          </Link>
        </div>
      </div>

      <nav className="menu" aria-label="Categorias">
        <ul className="menu__lista">
          {menu.map((item) => (
            <li key={item.texto}>
              <Link
                className={"menu__link" + (item.ativo !== false && itemEstaAtivo(item.destino) ? " menu__link--ativo" : "")}
                to={item.destino}
                aria-current={item.ativo !== false && itemEstaAtivo(item.destino) ? "page" : undefined}
              >
                {item.texto}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
