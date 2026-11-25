// Tudo que o sistema guarda no navegador passa por aqui (LocalStorage com JSON).

const PREFIXO = "trama:";

export function lerSalvo(chave, padrao) {
  try {
    const texto = localStorage.getItem(PREFIXO + chave);
    return texto === null ? padrao : JSON.parse(texto);
  } catch (erro) {
    console.warn("Não foi possível ler " + chave + ":", erro);
    return padrao;
  }
}

export function guardar(chave, valor) {
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
    return true;
  } catch (erro) {
    console.warn("Não foi possível salvar " + chave + ":", erro);
    return false;
  }
}

// A sessao pode durar apenas enquanto a aba estiver aberta ou continuar
// disponivel depois que o navegador for fechado, conforme a escolha da pessoa.
export function lerSessao() {
  const permanente = lerSalvo("sessao", null);
  if (permanente !== null) return permanente;

  try {
    const texto = sessionStorage.getItem(PREFIXO + "sessao");
    return texto === null ? null : JSON.parse(texto);
  } catch (erro) {
    console.warn("Não foi possível ler a sessão temporária:", erro);
    return null;
  }
}

export function guardarSessao(idDoUsuario, manterConectado) {
  try {
    const chave = PREFIXO + "sessao";
    localStorage.removeItem(chave);
    sessionStorage.removeItem(chave);
    const destino = manterConectado ? localStorage : sessionStorage;
    destino.setItem(chave, JSON.stringify(idDoUsuario));
    return true;
  } catch (erro) {
    console.warn("Não foi possível salvar a sessão:", erro);
    return false;
  }
}

export function removerSessao() {
  try {
    const chave = PREFIXO + "sessao";
    localStorage.removeItem(chave);
    sessionStorage.removeItem(chave);
    return true;
  } catch (erro) {
    console.warn("Não foi possível encerrar a sessão:", erro);
    return false;
  }
}
