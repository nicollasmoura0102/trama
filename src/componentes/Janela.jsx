import { useEffect, useRef } from "react";

// Janela de diálogo nativa (<dialog>): o navegador cuida do foco e da tecla Esc
export default function Janela({ aberta, aoFechar, idDoTitulo, children }) {
  const janela = useRef(null);

  useEffect(() => {
    if (aberta && !janela.current.open) {
      janela.current.showModal();
    }
    if (!aberta && janela.current.open) {
      janela.current.close();
    }
  }, [aberta]);

  function fecharAoClicarFora(evento) {
    if (evento.target === janela.current) {
      janela.current.close();
    }
  }

  return (
    <dialog className="janela" ref={janela} aria-labelledby={idDoTitulo} onClose={aoFechar} onClick={fecharAoClicarFora}>
      {aberta ? children : null}
    </dialog>
  );
}
