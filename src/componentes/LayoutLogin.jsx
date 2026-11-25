import BotaoTema from "./BotaoTema.jsx";

// Estrutura das telas de entrar e criar conta: formulário de um lado, frase da marca do outro
export default function LayoutLogin({ children }) {
  return (
    <main className="login" id="conteudo">
      <section className="login__formulario">
        <div className="login__tema">
          <BotaoTema />
        </div>
        {children}
      </section>

      <aside className="login__painel">
        <p className="login__frase">Vista o seu estilo.</p>
      </aside>
    </main>
  );
}
