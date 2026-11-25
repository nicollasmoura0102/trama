import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartaoResultado } from "../componentes/CartaoProduto.jsx";
import Campo from "../componentes/Campo.jsx";
import { usePagina } from "../componentes/usePagina.js";
import { useAviso } from "../contextos/AvisoContexto.jsx";
import { useLoja } from "../contextos/LojaContexto.jsx";
import { buscarProduto, formatarPreco } from "../dados/catalogo.js";

export default function Conta() {
  usePagina("Minha conta", "Veja seus dados, medidas, pedidos e favoritos na Trama.");
  const { usuario, sair, atualizarNome, medidas, salvarMedidas, pedidos, cancelarPedido, excluirPedido, favoritos, alternarFavorito } = useLoja();
  const anunciar = useAviso();
  const navegar = useNavigate();

  const [nome, setNome] = useState(usuario.nome);
  const [erroNome, setErroNome] = useState("");
  const [statusNome, setStatusNome] = useState("");
  const [altura, setAltura] = useState(medidas ? String(medidas.altura) : "");
  const [peso, setPeso] = useState(medidas ? String(medidas.peso) : "");
  const [erroMedidas, setErroMedidas] = useState("");
  const [statusMedidas, setStatusMedidas] = useState("");
  const [confirmando, setConfirmando] = useState(""); // número do pedido esperando confirmação de cancelamento

  const produtosFavoritos = favoritos.map(buscarProduto).filter((produto) => produto !== null);

  function salvarNome(evento) {
    evento.preventDefault();
    setStatusNome("");
    if (nome.trim().length < 2) {
      setErroNome("Digite seu nome (pelo menos 2 letras).");
      document.getElementById("conta-nome").focus();
      return;
    }
    setErroNome("");
    setStatusNome(atualizarNome(nome) ? "Nome atualizado." : "Não foi possível salvar neste navegador.");
  }

  function enviarMedidas(evento) {
    evento.preventDefault();
    setStatusMedidas("");
    const a = Number(altura);
    const p = Number(peso);
    if (altura === "" || peso === "") {
      setErroMedidas("Preencha a altura e o peso.");
    } else if (a < 120 || a > 220 || p < 30 || p > 200) {
      setErroMedidas("Altura entre 120 e 220 cm e peso entre 30 e 200 kg.");
    } else {
      setErroMedidas("");
      setStatusMedidas(salvarMedidas({ altura: a, peso: p }) ? "Medidas salvas." : "Não foi possível salvar neste navegador.");
    }
  }

  function removerMedidas() {
    salvarMedidas(null);
    setAltura("");
    setPeso("");
    setStatusMedidas("Medidas removidas.");
  }

  function cancelar(pedido) {
    cancelarPedido(pedido.id);
    setConfirmando("");
    anunciar("Pedido " + pedido.id + " cancelado.");
  }

  function sairDaConta() {
    sair();
    navegar("/");
  }

  function favoritar(produto) {
    const agoraEhFavorito = alternarFavorito(produto.id);
    anunciar(produto.nome + (agoraEhFavorito ? " adicionado aos favoritos." : " removido dos favoritos."));
  }

  return (
    <div className="pagina-simples">
      <h1 className="secao__titulo">Minha conta</h1>

      <section className="conta__secao" aria-labelledby="titulo-dados">
        <h2 className="conta__titulo" id="titulo-dados">Meus dados</h2>
        <p>Você entrou como <strong>{usuario.email}</strong>.</p>
        <form className="conta__formulario" onSubmit={salvarNome} noValidate>
          <Campo id="conta-nome" rotulo="Nome" type="text" autoComplete="name" value={nome} onChange={(e) => setNome(e.target.value)} erro={erroNome} />
          <div className="conta__acoes">
            <button className="botao botao--escuro" type="submit">Salvar nome</button>
            <button className="botao botao--claro" type="button" onClick={sairDaConta}>Sair da conta</button>
          </div>
          <p className="formulario__status formulario__status--sucesso" role="status">{statusNome}</p>
        </form>
      </section>

      <section className="conta__secao" aria-labelledby="titulo-medidas-conta">
        <h2 className="conta__titulo" id="titulo-medidas-conta">Minhas medidas</h2>
        <p>Usamos suas medidas para recomendar o tamanho nas páginas de produto.</p>
        <form className="conta__formulario" onSubmit={enviarMedidas} noValidate>
          <Campo id="conta-altura" rotulo="Altura (cm)" type="number" min="120" max="220" inputMode="numeric" value={altura} onChange={(e) => setAltura(e.target.value)} />
          <Campo id="conta-peso" rotulo="Peso (kg)" type="number" min="30" max="200" inputMode="numeric" value={peso} onChange={(e) => setPeso(e.target.value)} erro={erroMedidas} />
          <div className="conta__acoes">
            <button className="botao botao--escuro" type="submit">Salvar medidas</button>
            <button className="botao botao--claro" type="button" onClick={removerMedidas} disabled={!medidas}>Remover medidas</button>
          </div>
          <p className="formulario__status formulario__status--sucesso" role="status">{statusMedidas}</p>
        </form>
      </section>

      <section className="conta__secao" id="pedidos" aria-labelledby="titulo-pedidos">
        <h2 className="conta__titulo" id="titulo-pedidos">Meus pedidos</h2>
        {pedidos.length === 0 ? (
          <div className="estado-vazio">
            <p>Você ainda não fez nenhum pedido.</p>
            <Link className="botao" to="/busca">Ver produtos</Link>
          </div>
        ) : (
          <ul className="pedidos__lista">
            {pedidos.map((pedido) => (
              <li className="pedido" key={pedido.id}>
                <header className="pedido__topo">
                  <h3 className="pedido__numero">Pedido {pedido.id}</h3>
                  <span className={"selo" + (pedido.status === "Cancelado" ? " selo--cancelado" : "")}>{pedido.status}</span>
                </header>
                <p className="pedido__data">
                  {new Date(pedido.data).toLocaleDateString("pt-BR")} · {pedido.pagamento} · Entrega em {pedido.endereco.logradouro}, {pedido.endereco.numero} ({pedido.endereco.cidade})
                </p>
                <ul className="pedido__itens">
                  {pedido.itens.map((item) => (
                    <li key={item.nome + item.tamanho}>
                      {item.quantidade}× {item.nome} ({item.tamanho}) — {formatarPreco(item.quantidade * item.preco)}
                    </li>
                  ))}
                </ul>
                <p className="pedido__total">
                  Total: <strong>{formatarPreco(pedido.total)}</strong>
                </p>
                <div className="pedido__acoes">
                  {pedido.status === "Em preparo" && confirmando !== pedido.id && (
                    <button className="botao-mini" type="button" onClick={() => setConfirmando(pedido.id)}>Cancelar pedido</button>
                  )}
                  {confirmando === pedido.id && (
                    <>
                      <button className="botao-mini" type="button" onClick={() => cancelar(pedido)}>Sim, cancelar</button>
                      <button className="botao-mini" type="button" onClick={() => setConfirmando("")}>Manter pedido</button>
                    </>
                  )}
                  {pedido.status === "Cancelado" && (
                    <button className="botao-mini" type="button" onClick={() => excluirPedido(pedido.id)}>Remover do histórico</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="conta__secao" id="favoritos" aria-labelledby="titulo-favoritos">
        <h2 className="conta__titulo" id="titulo-favoritos">Meus favoritos</h2>
        {produtosFavoritos.length === 0 ? (
          <div className="estado-vazio">
            <p>Você ainda não favoritou nenhum produto.</p>
            <Link className="botao" to="/busca">Explorar produtos</Link>
          </div>
        ) : (
          <ul className="resultados__grade">
            {produtosFavoritos.map((produto) => (
              <CartaoResultado key={produto.id} produto={produto} favorito aoAlternar={favoritar} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
