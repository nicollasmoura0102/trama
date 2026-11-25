import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Cabecalho from "./Cabecalho.jsx";
import Icone from "./Icone.jsx";
import MenuMobile from "./MenuMobile.jsx";

// Estrutura das páginas da loja: cabeçalho + conteúdo + botão "voltar ao topo"
export default function Layout() {
  const { pathname, hash } = useLocation();
  const principal = useRef(null);
  const primeiraVez = useRef(true);

  // Ao trocar de página: volta ao topo (ou vai até o #trecho) e leva o foco para o conteúdo
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
      return;
    }
    window.scrollTo(0, 0);
    if (primeiraVez.current) {
      primeiraVez.current = false;
    } else {
      principal.current.focus({ preventScroll: true });
    }
  }, [pathname, hash]);

  return (
    <>
      <a className="pular-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <Cabecalho />

      <main id="conteudo" ref={principal} tabIndex={-1}>
        <Outlet />
      </main>

      <MenuMobile />

      <nav aria-label="Atalho para o topo">
        <a className="voltar-topo" href="#topo" aria-label="Voltar ao topo da página">
          <Icone nome="cima" />
        </a>
      </nav>
    </>
  );
}
