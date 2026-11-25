import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./componentes/Layout.jsx";
import RequerLogin from "./componentes/RequerLogin.jsx";
import { AvisoProvider } from "./contextos/AvisoContexto.jsx";
import { LojaProvider } from "./contextos/LojaContexto.jsx";
import { TemaProvider } from "./contextos/TemaContexto.jsx";
import Inicio from "./paginas/Inicio.jsx";

// As outras páginas só são baixadas quando a pessoa entra nelas (deixa a primeira tela mais leve)
const Busca = lazy(() => import("./paginas/Busca.jsx"));
const Produto = lazy(() => import("./paginas/Produto.jsx"));
const Sacola = lazy(() => import("./paginas/Sacola.jsx"));
const Finalizar = lazy(() => import("./paginas/Finalizar.jsx"));
const Conta = lazy(() => import("./paginas/Conta.jsx"));
const Entrar = lazy(() => import("./paginas/Entrar.jsx"));
const Cadastro = lazy(() => import("./paginas/Cadastro.jsx"));
const NaoEncontrada = lazy(() => import("./paginas/NaoEncontrada.jsx"));

export default function App() {
  return (
    <TemaProvider>
      <LojaProvider>
        <AvisoProvider>
          <Suspense fallback={<p className="pagina-simples" role="status">Carregando...</p>}>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Inicio />} />
                <Route path="busca" element={<Busca />} />
                <Route path="produto/:id" element={<Produto />} />
                <Route path="sacola" element={<Sacola />} />
                <Route path="finalizar" element={<RequerLogin><Finalizar /></RequerLogin>} />
                <Route path="conta" element={<RequerLogin><Conta /></RequerLogin>} />
                <Route path="*" element={<NaoEncontrada />} />
              </Route>
              <Route path="entrar" element={<Entrar />} />
              <Route path="cadastro" element={<Cadastro />} />
            </Routes>
          </Suspense>
        </AvisoProvider>
      </LojaProvider>
    </TemaProvider>
  );
}
