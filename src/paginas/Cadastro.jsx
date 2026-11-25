import { useRef, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Campo from "../componentes/Campo.jsx";
import LayoutLogin from "../componentes/LayoutLogin.jsx";
import { usePagina } from "../componentes/usePagina.js";
import { useAviso } from "../contextos/AvisoContexto.jsx";
import { useLoja } from "../contextos/LojaContexto.jsx";
import { destinoSeguro } from "./Entrar.jsx";

const padraoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Cadastro() {
  usePagina("Criar conta", "Crie sua conta na Trama para salvar favoritos, medidas e acompanhar seus pedidos.");
  const { usuario, cadastrar } = useLoja();
  const anunciar = useAviso();
  const navegar = useNavigate();
  const [parametros] = useSearchParams();
  const destino = destinoSeguro(parametros.get("voltar"));

  const [dados, setDados] = useState({ nome: "", email: "", senha: "", confirmacao: "" });
  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);
  const [status, setStatus] = useState({ texto: "", tipo: "" });
  const iniciouCadastro = useRef(false);

  if (usuario && !iniciouCadastro.current) {
    return <Navigate to={destino} replace />;
  }

  function mudar(campo) {
    return (evento) => setDados({ ...dados, [campo]: evento.target.value });
  }

  function validar() {
    const novos = {};
    if (dados.nome.trim().length < 2) novos.nome = "Digite seu nome (pelo menos 2 letras).";
    if (dados.email.trim() === "") novos.email = "Digite seu e-mail.";
    else if (!padraoEmail.test(dados.email.trim())) novos.email = "Digite um e-mail válido, como nome@exemplo.com.";
    if (dados.senha.length < 8) novos.senha = "A senha precisa ter pelo menos 8 caracteres.";
    else if (!/\d/.test(dados.senha) || !/[a-zA-Z]/.test(dados.senha)) novos.senha = "Use letras e números na senha.";
    if (dados.confirmacao !== dados.senha) novos.confirmacao = "As senhas não são iguais.";
    return novos;
  }

  async function enviar(evento) {
    evento.preventDefault();
    const novos = validar();
    setErros(novos);
    setStatus({ texto: "", tipo: "" });
    const primeiroComErro = ["nome", "email", "senha", "confirmacao"].find((campo) => novos[campo]);
    if (primeiroComErro) {
      document.getElementById(primeiroComErro).focus();
      return;
    }

    iniciouCadastro.current = true;
    setCarregando(true);
    setStatus({ texto: "Criando sua conta...", tipo: "" });
    const resultado = await cadastrar(dados);
    setCarregando(false);

    if (!resultado.ok) {
      iniciouCadastro.current = false;
      setErros({ [resultado.campo]: resultado.erro });
      setStatus({ texto: resultado.campo === "geral" ? resultado.erro : "", tipo: "erro" });
      document.getElementById(resultado.campo)?.focus();
      return;
    }
    setStatus({ texto: "Conta criada! Levando você para a loja...", tipo: "sucesso" });
    anunciar("Conta criada com sucesso.");
    setTimeout(() => navegar(destino, { replace: true }), 800);
  }

  return (
    <LayoutLogin>
      <div className="cartao">
        <header className="cartao__cabecalho">
          <img className="marca" src="/img/trama-icone.svg" alt="" width="60" height="60" />
          <h1>Criar conta</h1>
          <p className="cartao__texto-painel">Salve seus favoritos, suas medidas e acompanhe seus pedidos.</p>
        </header>

        <form className="formulario" onSubmit={enviar} noValidate>
          <Campo id="nome" rotulo="Nome" type="text" name="nome" autoComplete="name" required value={dados.nome} onChange={mudar("nome")} erro={erros.nome} />
          <Campo id="email" rotulo="E-mail" type="email" name="email" placeholder="nome@exemplo.com" autoComplete="email" required value={dados.email} onChange={mudar("email")} erro={erros.email} />
          <Campo id="senha" rotulo="Senha (mínimo 8 caracteres, com letras e números)" type="password" alternarSenha name="senha" autoComplete="new-password" minLength={8} required value={dados.senha} onChange={mudar("senha")} erro={erros.senha} />
          <Campo id="confirmacao" rotulo="Repita a senha" type="password" alternarSenha name="confirmacao" autoComplete="new-password" required value={dados.confirmacao} onChange={mudar("confirmacao")} erro={erros.confirmacao} />

          <button className="botao botao--bloco" type="submit" disabled={carregando}>
            {carregando ? "Criando conta..." : "Criar conta"}
          </button>
          <p className={"formulario__status" + (status.tipo ? " formulario__status--" + status.tipo : "")} role="status">
            {status.texto}
          </p>
        </form>

        <footer className="cartao__rodape">
          <p className="cartao__texto-painel">
            Já tem conta?{" "}
            <Link className="link" to={"/entrar" + (parametros.get("voltar") ? "?voltar=" + encodeURIComponent(destino) : "")}>
              Entrar
            </Link>
          </p>
          <p className="cartao__texto-painel">Sua senha fica protegida: guardamos só uma versão criptografada dela.</p>
        </footer>
      </div>
    </LayoutLogin>
  );
}
