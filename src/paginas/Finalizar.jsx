import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Campo from "../componentes/Campo.jsx";
import { usePagina } from "../componentes/usePagina.js";
import { useAviso } from "../contextos/AvisoContexto.jsx";
import { useLoja } from "../contextos/LojaContexto.jsx";
import { formatarPreco } from "../dados/catalogo.js";
import { calcularFrete, formatarCep, validarCep } from "../servicos/frete.js";

const formasDePagamento = ["Pix", "Cartão de crédito", "Boleto"];

export default function Finalizar() {
  usePagina("Finalizar compra", "Informe o endereço e a forma de pagamento para concluir o seu pedido.");
  const { usuario, itensDaSacola, totalDeItens, subtotal, finalizarPedido } = useLoja();
  const anunciar = useAviso();
  const navegar = useNavigate();
  const concluiu = useRef(false);

  const [dados, setDados] = useState({ nome: usuario.nome, cep: "", logradouro: "", numero: "", cidade: "", pagamento: "" });
  const [erros, setErros] = useState({});
  const [status, setStatus] = useState("");

  // Sem itens na sacola não há o que finalizar (exceto logo depois de concluir o pedido)
  if (itensDaSacola.length === 0 && !concluiu.current) {
    return <Navigate to="/sacola" replace />;
  }

  const frete = validarCep(dados.cep) === "" ? calcularFrete(dados.cep, subtotal) : null;
  const total = subtotal + (frete ? frete.valor : 0);

  function mudar(campo, formatar = (texto) => texto) {
    return (evento) => setDados({ ...dados, [campo]: formatar(evento.target.value) });
  }

  function validar() {
    const novos = {};
    if (dados.nome.trim().length < 2) novos.nome = "Digite o nome de quem vai receber.";
    const erroCep = validarCep(dados.cep);
    if (erroCep) novos.cep = erroCep;
    if (dados.logradouro.trim().length < 3) novos.logradouro = "Digite a rua ou avenida.";
    if (dados.numero.trim() === "") novos.numero = "Digite o número.";
    if (dados.cidade.trim().length < 2) novos.cidade = "Digite a cidade.";
    if (dados.pagamento === "") novos.pagamento = "Escolha a forma de pagamento.";
    return novos;
  }

  function enviar(evento) {
    evento.preventDefault();
    const novos = validar();
    setErros(novos);
    setStatus("");
    const primeiro = ["nome", "cep", "logradouro", "numero", "cidade", "pagamento"].find((campo) => novos[campo]);
    if (primeiro) {
      (document.getElementById(primeiro) ?? document.querySelector('input[name="pagamento"]')).focus();
      return;
    }

    concluiu.current = true;
    const pedido = finalizarPedido({
      endereco: { nome: dados.nome.trim(), cep: dados.cep, logradouro: dados.logradouro.trim(), numero: dados.numero.trim(), cidade: dados.cidade.trim() },
      pagamento: dados.pagamento,
      frete: frete.valor,
    });
    if (!pedido) {
      concluiu.current = false;
      setStatus("Não foi possível salvar o pedido neste navegador.");
      return;
    }
    anunciar("Pedido " + pedido.id + " realizado com sucesso.");
    navegar("/conta#pedidos", { replace: true });
  }

  return (
    <div className="pagina-simples">
      <h1 className="secao__titulo">Finalizar compra</h1>

      <div className="sacola__corpo">
        <form className="formulario cartao-form" onSubmit={enviar} noValidate>
          <h2 className="resumo-pedido__titulo">Entrega</h2>
          <Campo id="nome" rotulo="Nome de quem recebe" type="text" autoComplete="name" required value={dados.nome} onChange={mudar("nome")} erro={erros.nome} />
          <Campo id="cep" rotulo="CEP" type="text" inputMode="numeric" autoComplete="postal-code" placeholder="00000-000" maxLength={9} required value={dados.cep} onChange={mudar("cep", formatarCep)} erro={erros.cep} />
          <Campo id="logradouro" rotulo="Rua ou avenida" type="text" autoComplete="address-line1" required value={dados.logradouro} onChange={mudar("logradouro")} erro={erros.logradouro} />
          <Campo id="numero" rotulo="Número" type="text" autoComplete="address-line2" required value={dados.numero} onChange={mudar("numero")} erro={erros.numero} />
          <Campo id="cidade" rotulo="Cidade" type="text" autoComplete="address-level2" required value={dados.cidade} onChange={mudar("cidade")} erro={erros.cidade} />

          <fieldset className="tamanhos" aria-describedby="pagamento-erro">
            <legend className="tamanhos__legenda">Forma de pagamento</legend>
            <div className={"tamanhos__lista" + (erros.pagamento ? " tamanhos__lista--erro" : "")}>
              {formasDePagamento.map((forma, indice) => (
                <div className="tamanho" key={forma}>
                  <input className="tamanho__entrada" id={indice === 0 ? "pagamento" : undefined} type="radio" name="pagamento" value={forma} checked={dados.pagamento === forma} onChange={mudar("pagamento")} aria-label={forma} />
                  <span className="tamanho__rotulo">{forma}</span>
                </div>
              ))}
            </div>
            <p className="campo__mensagem" id="pagamento-erro" hidden={!erros.pagamento}>
              {erros.pagamento}
            </p>
          </fieldset>

          <button className="botao botao--grande botao--bloco" type="submit">
            Confirmar pedido
          </button>
          <p className="formulario__status formulario__status--erro" role="status">
            {status}
          </p>
        </form>

        <aside className="resumo-pedido" aria-label="Resumo do pedido">
          <h2 className="resumo-pedido__titulo">Resumo</h2>
          <ul className="resumo-pedido__itens">
            {itensDaSacola.map((item) => (
              <li className="resumo-pedido__linha" key={item.chave}>
                <span>{item.quantidade}× {item.produto.nome} ({item.tamanho})</span>
                <span>{formatarPreco(item.quantidade * item.produto.preco)}</span>
              </li>
            ))}
          </ul>
          <p className="resumo-pedido__linha">
            <span>Subtotal ({totalDeItens} {totalDeItens === 1 ? "item" : "itens"})</span>
            <span>{formatarPreco(subtotal)}</span>
          </p>
          <p className="resumo-pedido__linha">
            <span>Frete</span>
            <span>{frete ? (frete.gratis ? "Grátis" : formatarPreco(frete.valor)) : "Informe o CEP"}</span>
          </p>
          <p className="resumo-pedido__linha resumo-pedido__total">
            <strong>Total</strong>
            <strong>{formatarPreco(total)}</strong>
          </p>
          {frete && <p className="resumo-pedido__nota">Entrega em {frete.prazo} (simulação).</p>}
        </aside>
      </div>
    </div>
  );
}
