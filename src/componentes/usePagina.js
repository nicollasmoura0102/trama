import { useEffect } from "react";

// Define o título da aba e a descrição da página (importante para acessibilidade e SEO)
export function usePagina(titulo, descricao) {
  useEffect(() => {
    document.title = titulo + " | Trama";
    const meta = document.querySelector('meta[name="description"]');
    if (meta && descricao) {
      meta.setAttribute("content", descricao);
    }
  }, [titulo, descricao]);
}
