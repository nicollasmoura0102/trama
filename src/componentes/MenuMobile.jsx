import { NavLink, useLocation } from "react-router-dom";
import { useLoja } from "../contextos/LojaContexto.jsx";
import Icone from "./Icone.jsx";

export default function MenuMobile() {
  const { usuario } = useLoja();
  const { hash } = useLocation();

  return (
    <nav className="menu-mobile" aria-label="Navegação mobile">
      <NavLink to="/" end>
        <Icone nome="inicio" />
        <span>Início</span>
      </NavLink>

      <NavLink to="/busca">
        <Icone nome="busca" />
        <span>Busca</span>
      </NavLink>

      <NavLink
        to="/conta#favoritos"
        className={({ isActive }) => (isActive && hash === "#favoritos" ? "active" : "")}
      >
        <Icone nome="coracao" />
        <span>Favoritos</span>
      </NavLink>

      <NavLink
        to={usuario ? "/conta" : "/entrar"}
        className={({ isActive }) => (isActive && !hash ? "active" : "")}
      >
        <Icone nome="usuario" />
        <span>Conta</span>
      </NavLink>
    </nav>
  );
}
