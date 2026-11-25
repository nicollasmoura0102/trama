import { useRef, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Campo from "../componentes/Campo.jsx";
import LayoutLogin from "../componentes/LayoutLogin.jsx";
import { usePagina } from "../componentes/usePagina.js";
import { useAviso } from "../contextos/AvisoContexto.jsx";
import { useLoja } from "../contextos/LojaContexto.jsx";

const padraoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Só aceita voltar para páginas do próprio site
export function destinoSeguro(texto) {
  return texto && texto.startsWith("/") && !texto.startsWith("//") ? texto : "/";
}

export default function Entrar() {
  usePagina("Entrar", "Entre na sua conta Trama para ver pedidos, medidas e favoritos.");
  const { usuario, entrar } = useLoja();
  const anunciar = useAviso();
  const navegar = useNavigate();
  const [parametros] = useSearchParams();
  const destino = destinoSeguro(parametros.get("voltar"));

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [manterConectado, setManterConectado] = useState(false);
  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);
  const [status, setStatus] = useState({ texto: "", tipo: "" });
  const iniciouEntrada = useRef(false);

  // Quem já está logado não precisa ver esta tela
  if (usuario && !iniciouEntrada.current) {
    return <Navigate to={destino} replace />;
  }

  function validar() {
    const novos = {};
    if (email.trim() === "") novos.email = "Digite seu e-mail.";
    else if (!padraoEmail.test(email.trim())) novos.email = "Digite um e-mail válido, como nome@exemplo.com.";
    if (senha === "") novos.senha = "Digite sua senha.";
    else if (senha.length < 8) novos.senha = "A senha precisa ter pelo menos 8 caracteres.";
    return novos;
  }

  async function enviar(evento) {
    evento.preventDefault();
    const novos = validar();
    setErros(novos);
    setStatus({ texto: "", tipo: "" });
    if (novos.email || novos.senha) {
      document.getElementById(novos.email ? "email" : "senha").focus();
      return;
    }

    iniciouEntrada.current = true;
    setCarregando(true);
    setStatus({ texto: "Verificando seus dados...", tipo: "" });
    const resultado = await entrar(email, senha, manterConectado);
    setCarregando(false);

    if (!resultado.ok) {
      iniciouEntrada.current = false;
      setErros({ [resultado.campo]: resultado.erro });
      setStatus({ texto: "", tipo: "" });
      document.getElementById(resultado.campo === "email" ? "email" : "senha")?.focus();
      return;
    }
    setStatus({ texto: "Tudo certo! Levando você para a loja...", tipo: "sucesso" });
    anunciar("Login feito com sucesso.");
    setTimeout(() => navegar(destino, { replace: true }), 700);
  }

  function aindaNaoDisponivel(nome) {
    setStatus({ texto: "O login com " + nome + " ainda não está disponível. Entre com e-mail e senha.", tipo: "erro" });
  }

  return (
    <LayoutLogin>
      <div className="cartao">
        <header className="cartao__cabecalho">
          <img className="marca" src="/img/trama-icone.svg" alt="" width="60" height="60" />
          <h1>Entrar na Trama</h1>
          <p className="cartao__texto-painel">Acesse sua conta para ver pedidos, medidas e favoritos.</p>
        </header>

        <form className="formulario" onSubmit={enviar} noValidate>
          <Campo id="email" rotulo="E-mail" type="email" name="email" placeholder="nome@exemplo.com" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} erro={erros.email} />
          <Campo id="senha" rotulo="Senha" type="password" alternarSenha name="senha" autoComplete="current-password" minLength={8} required value={senha} onChange={(e) => setSenha(e.target.value)} erro={erros.senha} />

          <label className="opcao login__lembrar">
            <input className="opcao__entrada" type="checkbox" checked={manterConectado} onChange={(e) => setManterConectado(e.target.checked)} />
            <span>Manter minha conta conectada</span>
          </label>

          <button className="botao botao--bloco" type="submit" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>
          <p className={"formulario__status" + (status.tipo ? " formulario__status--" + status.tipo : "")} role="status">
            {status.texto}
          </p>
        </form>

        <p className="divisor">ou</p>

        <div className="opcoes-sociais">
          <button className="botao botao--contorno botao--bloco" type="button" onClick={() => aindaNaoDisponivel("Google")}>
            Continuar com Google
          </button>
          <button className="botao botao--contorno botao--bloco" type="button" onClick={() => aindaNaoDisponivel("Facebook")}>
            Continuar com Facebook
          </button>
        </div>

        <footer className="cartao__rodape">
          <p className="cartao__texto-painel">
            Ainda não tem conta?{" "}
            <Link className="link" to={"/cadastro" + (parametros.get("voltar") ? "?voltar=" + encodeURIComponent(destino) : "")}>
              Criar conta
            </Link>
          </p>
          <p className="cartao__texto-painel">
            <Link className="link" to="/">
              Continuar sem entrar
            </Link>
          </p>
        </footer>
      </div>
    </LayoutLogin>
  );
}
