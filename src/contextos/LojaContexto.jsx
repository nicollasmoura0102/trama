import { createContext, useContext, useState } from "react";
import { buscarProduto } from "../dados/catalogo.js";
import { guardarSessao, lerSessao, removerSessao } from "../servicos/armazenamento.js";
import { criarId, gerarHash, gerarSal } from "../servicos/usuarios.js";
import { useDadoSalvo } from "./useDadoSalvo.js";

const LojaContexto = createContext(null);

const ERRO_AO_SALVAR = "Não foi possível salvar os dados neste navegador.";

export function LojaProvider({ children }) {
  // Cada linha abaixo é um "banco de dados" no LocalStorage
  const [usuarios, definirUsuarios] = useDadoSalvo("usuarios", []);
  const [idDaSessao, setIdDaSessao] = useState(lerSessao);
  const [sacola, definirSacola] = useDadoSalvo("sacola", []);
  const [favoritos, definirFavoritos] = useDadoSalvo("favoritos", []);
  const [pedidos, definirPedidos] = useDadoSalvo("pedidos", []);
  const [avaliacoes, definirAvaliacoes] = useDadoSalvo("avaliacoes", {});
  const [marcacoes, definirMarcacoes] = useDadoSalvo("marcacoes", { uteis: [], denuncias: [] });
  const [medidas, definirMedidas] = useDadoSalvo("medidas", null);

  const usuario = usuarios.find((pessoa) => pessoa.id === idDaSessao) ?? null;
  const pedidosDoUsuario = usuario ? pedidos.filter((pedido) => pedido.usuarioId === usuario.id) : [];

  function definirIdDaSessao(idDoUsuario, manterConectado = true) {
    const salvou = idDoUsuario === null ? removerSessao() : guardarSessao(idDoUsuario, manterConectado);
    if (salvou) setIdDaSessao(idDoUsuario);
    return salvou;
  }

  // ---------- Conta ----------
  async function cadastrar({ nome, email, senha }) {
    const emailLimpo = email.trim().toLowerCase();
    if (usuarios.some((pessoa) => pessoa.email === emailLimpo)) {
      return { ok: false, campo: "email", erro: "Já existe uma conta com esse e-mail. Tente entrar." };
    }
    const sal = gerarSal();
    const novo = { id: criarId(), nome: nome.trim(), email: emailLimpo, sal, hash: await gerarHash(senha, sal), criadoEm: new Date().toISOString() };
    if (!definirUsuarios([...usuarios, novo]) || !definirIdDaSessao(novo.id)) {
      return { ok: false, campo: "geral", erro: ERRO_AO_SALVAR };
    }
    return { ok: true };
  }

  async function entrar(email, senha, manterConectado = false) {
    const pessoa = usuarios.find((item) => item.email === email.trim().toLowerCase());
    if (!pessoa) {
      return { ok: false, campo: "email", erro: "Não encontramos uma conta com esse e-mail." };
    }
    if ((await gerarHash(senha, pessoa.sal)) !== pessoa.hash) {
      return { ok: false, campo: "senha", erro: "Senha incorreta. Tente de novo." };
    }
    return definirIdDaSessao(pessoa.id, manterConectado)
      ? { ok: true }
      : { ok: false, campo: "geral", erro: ERRO_AO_SALVAR };
  }

  function sair() {
    definirIdDaSessao(null);
  }

  function atualizarNome(nome) {
    return definirUsuarios(usuarios.map((pessoa) => (pessoa.id === usuario.id ? { ...pessoa, nome: nome.trim() } : pessoa)));
  }

  // ---------- Favoritos ----------
  function alternarFavorito(idDoProduto) {
    const jaEra = favoritos.includes(idDoProduto);
    const novaLista = jaEra ? favoritos.filter((id) => id !== idDoProduto) : [...favoritos, idDoProduto];
    definirFavoritos(novaLista);
    return !jaEra;
  }

  // ---------- Sacola ----------
  function adicionarNaSacola(idDoProduto, tamanho) {
    const chave = idDoProduto + "-" + tamanho;
    const existe = sacola.some((item) => item.chave === chave);
    const novaSacola = existe
      ? sacola.map((item) => (item.chave === chave ? { ...item, quantidade: Math.min(item.quantidade + 1, 10) } : item))
      : [...sacola, { chave, idDoProduto, tamanho, quantidade: 1 }];
    return definirSacola(novaSacola);
  }

  function mudarQuantidade(chave, diferenca) {
    definirSacola(sacola.map((item) => (item.chave === chave ? { ...item, quantidade: Math.max(1, Math.min(10, item.quantidade + diferenca)) } : item)));
  }

  function removerDaSacola(chave) {
    definirSacola(sacola.filter((item) => item.chave !== chave));
  }

  // Junta o que está na sacola com os dados do catálogo (nome, preço...)
  const itensDaSacola = sacola
    .map((item) => ({ ...item, produto: buscarProduto(item.idDoProduto) }))
    .filter((item) => item.produto !== null);
  const totalDeItens = itensDaSacola.reduce((total, item) => total + item.quantidade, 0);
  const subtotal = itensDaSacola.reduce((total, item) => total + item.quantidade * item.produto.preco, 0);

  // ---------- Pedidos ----------
  function finalizarPedido({ endereco, pagamento, frete }) {
    const numero = pedidos.length + 1001;
    const novo = {
      id: "TR-" + numero,
      usuarioId: usuario.id,
      data: new Date().toISOString(),
      itens: itensDaSacola.map((item) => ({ nome: item.produto.nome, tamanho: item.tamanho, quantidade: item.quantidade, preco: item.produto.preco })),
      subtotal,
      frete,
      total: subtotal + frete,
      endereco,
      pagamento,
      status: "Em preparo",
    };
    if (!definirPedidos([novo, ...pedidos]) || !definirSacola([])) {
      return null;
    }
    return novo;
  }

  function cancelarPedido(idDoPedido) {
    definirPedidos(pedidos.map((pedido) => (pedido.id === idDoPedido ? { ...pedido, status: "Cancelado" } : pedido)));
  }

  function excluirPedido(idDoPedido) {
    definirPedidos(pedidos.filter((pedido) => pedido.id !== idDoPedido));
  }

  // ---------- Avaliações ----------
  function adicionarAvaliacao(idDoProduto, { autor, nota, texto }) {
    const nova = { id: criarId(), usuarioId: usuario ? usuario.id : null, autor, nota, texto, data: new Date().toLocaleDateString("pt-BR") };
    return definirAvaliacoes({ ...avaliacoes, [idDoProduto]: [nova, ...(avaliacoes[idDoProduto] ?? [])] });
  }

  function excluirAvaliacao(idDoProduto, idDaAvaliacao) {
    definirAvaliacoes({ ...avaliacoes, [idDoProduto]: (avaliacoes[idDoProduto] ?? []).filter((item) => item.id !== idDaAvaliacao) });
  }

  function alternarMarcacao(tipo, idDaAvaliacao) {
    const lista = marcacoes[tipo];
    const novaLista = lista.includes(idDaAvaliacao) ? lista.filter((id) => id !== idDaAvaliacao) : [...lista, idDaAvaliacao];
    definirMarcacoes({ ...marcacoes, [tipo]: novaLista });
  }

  const valor = {
    usuario, cadastrar, entrar, sair, atualizarNome,
    favoritos, alternarFavorito,
    itensDaSacola, totalDeItens, subtotal, adicionarNaSacola, mudarQuantidade, removerDaSacola,
    pedidos: pedidosDoUsuario, finalizarPedido, cancelarPedido, excluirPedido,
    avaliacoes, adicionarAvaliacao, excluirAvaliacao, marcacoes, alternarMarcacao,
    medidas, salvarMedidas: definirMedidas,
  };

  return <LojaContexto.Provider value={valor}>{children}</LojaContexto.Provider>;
}

export function useLoja() {
  return useContext(LojaContexto);
}
