import { StrictMode, startTransition } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource-variable/inter";
import "./estilos/base.css";
import "./estilos/layout.css";
import "./estilos/components.css";
import App from "./App.jsx";

// A fonte dos títulos (Adobe Fonts) é carregada depois da página, para não atrasar a primeira tela
function carregarFonteDosTitulos() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://use.typekit.net/wtf4sxg.css";
  document.head.appendChild(link);
}

// startTransition deixa o React desenhar a primeira tela em pedaços pequenos,
// sem travar o navegador (melhora o "tempo de bloqueio" medido pelo Lighthouse)
const raiz = createRoot(document.getElementById("raiz"));
startTransition(() => {
  raiz.render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
});

// (VITE_SEM_FONTE_EXTERNA serve só para medir o Lighthouse sem internet)
if (!import.meta.env.VITE_SEM_FONTE_EXTERNA) {
  window.addEventListener("load", carregarFonteDosTitulos);
}
