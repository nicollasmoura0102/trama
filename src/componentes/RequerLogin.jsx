import { Navigate, useLocation } from "react-router-dom";
import { useLoja } from "../contextos/LojaContexto.jsx";

// Páginas que só funcionam com a pessoa logada: se não estiver, vai para o login e depois volta
export default function RequerLogin({ children }) {
  const { usuario } = useLoja();
  const local = useLocation();

  if (!usuario) {
    const voltar = encodeURIComponent(local.pathname + local.hash);
    return <Navigate to={"/entrar?voltar=" + voltar} replace />;
  }
  return children;
}
